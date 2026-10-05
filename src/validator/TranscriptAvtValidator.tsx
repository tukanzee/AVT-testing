import { coverageMap, residualUnits } from "./coverage";
import { duplicateClaims } from "./matching/warnings";
import { exportExceptionPdf } from "./exceptionReport";
import { useEffect, useMemo, useRef, useState } from "react";
import { extractClaims } from "./claimExtraction/extractClaims";
import ClaimReview from "./components/ClaimReview";
import OmissionReview from "./components/OmissionReview";
import FindingsReview from "./components/FindingsReview";
import TranscriptAvtInput from "./components/TranscriptAvtInput";
import { compareTranscriptAndAvt, type TranscriptComparison } from "./matching/evidenceMatcher";
import { createEvidenceChunks } from "./transcript/createEvidenceChunks";
import { parseTranscript } from "./transcript/parseTranscript";
import { NLI_MODEL_ID } from "./matching/nli";
import { loadReviewAutosave, saveReviewAutosave } from "./reviewAutosave";
import { VALIDATION_CATEGORIES, type ValidationCategory } from "./types";
import {
  TRANSCRIPT_AVT_SECTIONS,
  type OmissionDecision,
  type TranscriptAvtSection,
  type TranscriptEvidenceChunk,
  type ValidationDecision
} from "./workflowTypes";
import "./threeWay.css";

type Props = { onBack: () => void };
type Stage = "input" | "claims" | "omissions" | "findings";
type QueueMode = "active" | "reviewed" | "skipped";

const emptySections = Object.fromEntries(TRANSCRIPT_AVT_SECTIONS.map((section) => [section, ""])) as Record<TranscriptAvtSection, string>;
const AUTOSAVE_KEY = "transcript-avt-validator-autosave-v2";

type ReviewSnapshot = {
  claimDecisions: Record<string, ValidationDecision>;
  omissionDecisions: Record<string, OmissionDecision>;
};

export default function TranscriptAvtValidator({ onBack }: Props) {
  const [stage, setStage] = useState<Stage>("input");
  const [transcript, setTranscript] = useState("");
  const [avtSections, setAvtSections] = useState(emptySections);
  const [reviewInput, setReviewInput] = useState({ transcript: "", avtSections: emptySections });
  const [chunks, setChunks] = useState<TranscriptEvidenceChunk[]>([]);
  const [claims, setClaims] = useState<ReturnType<typeof extractClaims>>([]);
  const [comparison, setComparison] = useState<TranscriptComparison>({ matches: {}, omissionCandidates: [] });
  const [claimDecisions, setClaimDecisions] = useState<Record<string, ValidationDecision>>({});
  const [omissionDecisions, setOmissionDecisions] = useState<Record<string, OmissionDecision>>({});
  const [claimIndex, setClaimIndex] = useState(0);
  const [omissionIndex, setOmissionIndex] = useState(0);
  const [claimQueueMode, setClaimQueueMode] = useState<QueueMode>("active");
  const [residualQueueMode, setResidualQueueMode] = useState<QueueMode>("active");
  const [showResolved, setShowResolved] = useState(false);
  const [sessionReference, setSessionReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [progressPercent, setProgressPercent] = useState<number>();
  const [error, setError] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState("");
  const [exportWarning, setExportWarning] = useState<number>();
  const undoRef = useRef<ReviewSnapshot | null>(null);

  const hasAvtText = TRANSCRIPT_AVT_SECTIONS.some((section) => avtSections[section].trim());

  const coverage = useMemo(() => coverageMap(chunks, claimDecisions, omissionDecisions), [chunks, claimDecisions, omissionDecisions]);
  const residualIds = useMemo(() => new Set(residualUnits(chunks, coverage, omissionDecisions).map(u => u.id)), [chunks, coverage, omissionDecisions]);

  const allResidualCandidates = comparison.omissionCandidates.filter((candidate) => residualIds.has(candidate.transcriptChunkId));
  const skippedResidualCandidates = allResidualCandidates.filter((candidate) => omissionDecisions[candidate.itemId]?.skipped);
  const activeResidualCandidates = allResidualCandidates.filter((candidate) => !omissionDecisions[candidate.itemId]?.skipped);
  const reviewedResidualCandidates = comparison.omissionCandidates.filter((candidate) => omissionDecisions[candidate.itemId]?.reviewed);
  const visibleOmissionCandidates = residualQueueMode === "reviewed"
    ? reviewedResidualCandidates
    : residualQueueMode === "skipped"
      ? skippedResidualCandidates
      : activeResidualCandidates;
  const safeOmissionIndex = Math.min(omissionIndex, Math.max(0, visibleOmissionCandidates.length - 1));
  const omission = visibleOmissionCandidates[safeOmissionIndex];

  const skippedClaims = claims.filter((item) => claimDecisions[item.id]?.skipped && !claimDecisions[item.id]?.reviewed);
  const reviewedClaims = claims.filter((item) => claimDecisions[item.id]?.reviewed);
  const activeClaims = claims.filter((item) => !claimDecisions[item.id]?.reviewed && !claimDecisions[item.id]?.skipped);
  const visibleClaims = claimQueueMode === "reviewed"
    ? reviewedClaims
    : claimQueueMode === "skipped"
      ? skippedClaims
      : activeClaims;
  const safeClaimIndex = Math.min(claimIndex, Math.max(0, visibleClaims.length - 1));
  const claim = visibleClaims[safeClaimIndex];

  useEffect(() => {
    try {
      const saved = loadReviewAutosave<Record<string, any>>(localStorage, AUTOSAVE_KEY);
      if (saved) {
        setStage(saved.stage ?? "input");
        setTranscript(saved.transcript ?? "");
        setAvtSections(saved.avtSections ?? emptySections);
        setReviewInput(saved.reviewInput ?? { transcript: saved.transcript ?? "", avtSections: saved.avtSections ?? emptySections });
        setChunks(saved.chunks ?? []);
        setClaims(saved.claims ?? []);
        setComparison(saved.comparison ?? { matches: {}, omissionCandidates: [] });
        setClaimDecisions(saved.claimDecisions ?? {});
        setOmissionDecisions(saved.omissionDecisions ?? {});
        setClaimIndex(saved.claimIndex ?? 0);
        setOmissionIndex(saved.omissionIndex ?? 0);
        setClaimQueueMode(saved.claimQueueMode ?? (saved.showSkippedClaims ? "skipped" : "active"));
        setResidualQueueMode(saved.residualQueueMode ?? (saved.showSkippedResidual ? "skipped" : "active"));
        setSessionReference(saved.sessionReference ?? "");
        setAutosaveStatus("Restored local in-progress review");
      }
    } catch {
      setAutosaveStatus("Local autosave could not be restored");
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady || !claims.length) return;
    const saved = {
      schemaVersion: 2,
      savedAt: new Date().toISOString(),
      stage, transcript, avtSections, reviewInput, chunks, claims, comparison,
      claimDecisions, omissionDecisions, coverage, claimIndex, omissionIndex,
      claimQueueMode, residualQueueMode, sessionReference
    };
    try {
      saveReviewAutosave(localStorage, AUTOSAVE_KEY, saved);
      setAutosaveStatus("Saved locally");
    } catch {
      setAutosaveStatus("Local autosave storage is unavailable or full");
    }
  }, [storageReady, stage, transcript, avtSections, reviewInput, chunks, claims, comparison, claimDecisions, omissionDecisions, coverage, claimIndex, omissionIndex, claimQueueMode, residualQueueMode, sessionReference]);

  const startComparison = async () => {
    const parsed = parseTranscript(transcript);
    if (!parsed.length) return setError("Add a speaker-attributed transcript using C:, P:, or P/C: labels.");
    const nextChunks = createEvidenceChunks(parsed);
    const sections = TRANSCRIPT_AVT_SECTIONS.map((title, index) => ({ id: `section-${index + 1}`, title, text: avtSections[title] }));
    const nextClaims = extractClaims(sections);
    if (!nextClaims.length) return setError("Add AVT output before starting the comparison.");

    setError("");
    setBusy(true);
    setProgress("Creating contextual transcript evidence");
    setProgressPercent(undefined);
    try {
      const nextComparison = await compareTranscriptAndAvt(nextClaims, nextChunks, (message, percent) => {
        setProgress(message);
        setProgressPercent(percent);
      });
      setReviewInput({ transcript, avtSections });
      setChunks(nextChunks);
      setClaims(nextClaims);
      setComparison(nextComparison);
      setClaimDecisions({});
      setOmissionDecisions({});
      setClaimIndex(0);
      setOmissionIndex(0);
      setClaimQueueMode("active");
      setResidualQueueMode("active");
      setStage("claims");
    } catch (comparisonError) {
      setError(comparisonError instanceof Error ? comparisonError.message : "Local comparison failed.");
    } finally {
      setBusy(false);
    }
  };

  const exportReview = () => {
    const payload = {
      schemaVersion: "transcript-avt-validation-2.0", exportedAt: new Date().toISOString(),
      sessionReference, ...reviewInput, claims, chunks, claimDecisions, omissionDecisions,
      coverage, comparison, nliModel: NLI_MODEL_ID
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `transcript-avt-review-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const rememberUndo = () => {
    undoRef.current = { claimDecisions, omissionDecisions };
  };

  const undoLastAction = () => {
    const previous = undoRef.current;
    if (!previous) return;
    setClaimDecisions(previous.claimDecisions);
    setOmissionDecisions(previous.omissionDecisions);
    undoRef.current = null;
  };

  const updateClaimDecision = (claimId: string, update: Partial<ValidationDecision>) => {
    rememberUndo();
    setClaimDecisions((current) => {
      const existing = current[claimId] ?? { claimId, reviewed: false, correctSupported: false, categories: [], comment: "" };
      const next = { ...existing, ...update };
      if (update.correctSupported) next.categories = [];
      else if (next.categories.length > 0) next.correctSupported = false;
      if (next.reviewed) next.skipped = false;
      return { ...current, [claimId]: next };
    });
  };

  const updateOmissionDecision = (itemId: string, update: Partial<OmissionDecision>) => {
    rememberUndo();
    setOmissionDecisions((current) => {
      const existing = current[itemId] ?? { itemId, reviewed: false, correctSupported: false, categories: [], comment: "" };
      const next = { ...existing, ...update };
      if (update.correctSupported) next.categories = [];
      else if (next.categories.length > 0) next.correctSupported = false;
      if (next.reviewed) next.skipped = false;
      return { ...current, [itemId]: next };
    });
  };

  const replaceOmissionDecision = (itemId: string, decision: OmissionDecision) => {
    rememberUndo();
    setOmissionDecisions((current) => ({ ...current, [itemId]: decision.reviewed ? { ...decision, skipped: false } : decision }));
  };

  const toggleOmissionCategory = (itemId: string, category: ValidationCategory) => {
    const categories = omissionDecisions[itemId]?.categories ?? [];
    const nextCategories = categories.includes(category) ? categories.filter((item) => item !== category) : [...categories, category];
    updateOmissionDecision(itemId, {
      categories: nextCategories,
      correctSupported: false,
      reviewed: Boolean(omissionDecisions[itemId]?.reviewed && nextCategories.length > 0), irrelevant: false
    });
  };

  const toggleClaimCategory = (claimId: string, category: ValidationCategory) => {
    const categories = claimDecisions[claimId]?.categories ?? [];
    const nextCategories = categories.includes(category) ? categories.filter((item) => item !== category) : [...categories, category];
    updateClaimDecision(claimId, {
      categories: nextCategories,
      correctSupported: false,
      reviewed: Boolean(claimDecisions[claimId]?.reviewed && nextCategories.length > 0)
    });
  };

  useEffect(() => {
    if (stage !== "claims" && stage !== "omissions") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable=true]")) return;
      if (/^[1-9]$/.test(event.key) || event.key === "ArrowLeft" || event.key === "ArrowRight") event.preventDefault();
      if (/^[1-9]$/.test(event.key)) {
        const category = VALIDATION_CATEGORIES[Number(event.key) - 1];
        if (!category) return;
        if (stage === "claims" && claim) toggleClaimCategory(claim.id, category);
        if (stage === "omissions" && omission) toggleOmissionCategory(omission.itemId, category);
      } else if (stage === "claims" && event.key === "ArrowLeft") setClaimIndex(Math.max(0, safeClaimIndex - 1));
      else if (stage === "claims" && event.key === "ArrowRight") setClaimIndex(Math.min(visibleClaims.length - 1, safeClaimIndex + 1));
      else if (stage === "omissions" && event.key === "ArrowLeft") setOmissionIndex(Math.max(0, safeOmissionIndex - 1));
      else if (stage === "omissions" && event.key === "ArrowRight") setOmissionIndex(Math.min(visibleOmissionCandidates.length - 1, safeOmissionIndex + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage, claim, omission, visibleClaims.length, visibleOmissionCandidates.length, safeClaimIndex, safeOmissionIndex, claimDecisions, omissionDecisions]);

  const reviewedClaimCount = Object.values(claimDecisions).filter((decision) => decision.reviewed).length;
  const reviewedOmissionCount = Object.values(omissionDecisions).filter((decision) => decision.reviewed).length;
  const findingCount = Object.values(claimDecisions).filter((decision) => decision.reviewed && decision.categories.length).length
    + Object.values(omissionDecisions).filter((decision) => decision.reviewed && decision.categories.length && !decision.irrelevant).length;
  const irrelevantCount = Object.values(omissionDecisions).filter((decision) => decision.reviewed && decision.irrelevant).length;
  const skippedCount = skippedClaims.length + skippedResidualCandidates.length;
  const unreviewedClaimCount = claims.filter((item) => !claimDecisions[item.id]?.reviewed).length;
  const unresolvedCount = unreviewedClaimCount + allResidualCandidates.length;

  const openClaimForEdit = (claimId: string) => {
    const list = claims.filter((item) => claimDecisions[item.id]?.reviewed);
    const index = list.findIndex((item) => item.id === claimId);
    setClaimQueueMode("reviewed");
    setClaimIndex(index >= 0 ? index : 0);
    setStage("claims");
  };

  const openResidualForEdit = (itemId: string) => {
    const list = comparison.omissionCandidates.filter((candidate) => omissionDecisions[candidate.itemId]?.reviewed);
    const index = list.findIndex((candidate) => candidate.itemId === itemId);
    setResidualQueueMode("reviewed");
    setOmissionIndex(index >= 0 ? index : 0);
    setStage("omissions");
  };

  const requestPdfExport = () => {
    if (unresolvedCount > 0) {
      setExportWarning(unresolvedCount);
      return;
    }
    exportExceptionPdf({ sessionReference, claims, chunks, claimDecisions, omissionDecisions, coverage, remaining: 0 });
  };

  const exportPdfAnyway = () => {
    exportExceptionPdf({ sessionReference, claims, chunks, claimDecisions, omissionDecisions, coverage, remaining: allResidualCandidates.length });
    setExportWarning(undefined);
  };

  return (
    <main className="shell validator-shell transcript-avt-validator">
      <header className="topbar">
        <div><button className="link-button" onClick={onBack}>← Back to home</button><div className="topbar-title">Transcript vs AVT Validator</div></div>
        <div className="local-processing">● Local comparison — transcript and AVT content are not uploaded</div>
      </header>

      <section className="panel validator-intro">
        <div className="eyebrow">Human-reviewed evidence comparison</div>
        <h1>Compare a finished transcript with an AVT note</h1>
        <p className="lead">Local matching retrieves likely evidence and highlights numbers or negation for attention. It never assigns a clinical verdict.</p>
      </section>

      <nav className="workflow-steps" aria-label="Transcript validation stages">
        <button className={stage === "input" ? "active" : ""} onClick={() => setStage("input")}><span>1</span>Inputs</button>
        <button className={stage === "claims" ? "active" : ""} onClick={() => setStage("claims")} disabled={!claims.length}><span>2</span>AVT claims</button>
        <button className={stage === "omissions" ? "active" : ""} onClick={() => setStage("omissions")} disabled={!claims.length}><span>3</span>Residual transcript</button>
        <button className={stage === "findings" ? "active" : ""} onClick={() => setStage("findings")} disabled={!claims.length}><span>4</span>Findings review</button>
      </nav>

      {claims.length > 0 && <aside className="compact-review-summary" aria-label="Review progress summary">
        <span><strong>{reviewedClaimCount}/{claims.length}</strong> AVT claims reviewed</span>
        <span><strong>{allResidualCandidates.length}</strong> residual remaining</span>
        <span><strong>{findingCount}</strong> findings</span>
        <span><strong>{irrelevantCount}</strong> irrelevant</span>
        <span><strong>{skippedCount}</strong> skipped / unresolved</span>
        <button className="compact-button" disabled={!undoRef.current} onClick={undoLastAction}>Undo last action</button>
        <small>{autosaveStatus}</small>
      </aside>}

      {stage === "input" && <TranscriptAvtInput
        transcript={transcript}
        onTranscriptChange={setTranscript}
        avtSections={avtSections}
        onSectionChange={(section, value) => setAvtSections((current) => ({ ...current, [section]: value }))}
        onStart={startComparison}
        disabled={busy || !transcript.trim() || !hasAvtText}
      />}

      {stage === "claims" && <>
        <div className="queue-toolbar">
          <button className={claimQueueMode === "active" ? "active" : ""} onClick={() => { setClaimQueueMode("active"); setClaimIndex(0); }}>Active claims ({activeClaims.length})</button>
          <button className={claimQueueMode === "reviewed" ? "active" : ""} disabled={!reviewedClaims.length} onClick={() => { setClaimQueueMode("reviewed"); setClaimIndex(0); }}>Reviewed claims ({reviewedClaims.length})</button>
          <button className={claimQueueMode === "skipped" ? "active" : ""} disabled={!skippedClaims.length} onClick={() => { setClaimQueueMode("skipped"); setClaimIndex(0); }}>Skipped claims ({skippedClaims.length})</button>
        </div>
        {claim ? <>
        {duplicateClaims(claim, claims).length > 0 && <p className="evidence-warning">Possible duplicate content: {duplicateClaims(claim, claims).map(c => `${c.section}: ${c.text}`).join("; ")}</p>}
        <ClaimReview
          key={claim.id}
          claim={claim}
          candidates={comparison.matches[claim.id] ?? []}
          chunks={chunks}
          decision={claimDecisions[claim.id]}
          position={safeClaimIndex + 1}
          total={visibleClaims.length}
          reviewTotal={claims.length}
          reviewed={reviewedClaimCount}
          onDecision={(decision) => updateClaimDecision(claim.id, decision)}
          onToggleCategory={(category) => toggleClaimCategory(claim.id, category)}
          onToggleSupported={() => updateClaimDecision(claim.id, { correctSupported: !claimDecisions[claim.id]?.correctSupported, categories: [], reviewed: !claimDecisions[claim.id]?.correctSupported })}
          onSkip={() => updateClaimDecision(claim.id, { skipped: true, reviewed: false })}
          onPrevious={() => setClaimIndex(Math.max(0, safeClaimIndex - 1))}
          onNext={() => setClaimIndex(Math.min(visibleClaims.length - 1, safeClaimIndex + 1))}
        />
        </> : <section className="panel empty-state"><h2>{claimQueueMode === "reviewed" ? "No reviewed AVT claims" : claimQueueMode === "skipped" ? "No skipped AVT claims" : "No active AVT claims"}</h2><p>{claimQueueMode === "active" ? "All AVT claims have a reviewer decision or are skipped." : "Nothing is currently in this queue."}</p></section>}
        <div className="review-stage-actions"><button className="primary-button" onClick={() => { setResidualQueueMode("active"); setOmissionIndex(0); setStage("omissions"); }}>Review residual transcript →</button></div>
      </>}

      {stage === "omissions" && <>
        <div className="queue-toolbar">
          <button className={residualQueueMode === "active" ? "active" : ""} onClick={() => { setResidualQueueMode("active"); setOmissionIndex(0); }}>Active residual ({activeResidualCandidates.length})</button>
          <button className={residualQueueMode === "reviewed" ? "active" : ""} disabled={!reviewedResidualCandidates.length} onClick={() => { setResidualQueueMode("reviewed"); setOmissionIndex(0); }}>Reviewed residual ({reviewedResidualCandidates.length})</button>
          <button className={residualQueueMode === "skipped" ? "active" : ""} disabled={!skippedResidualCandidates.length} onClick={() => { setResidualQueueMode("skipped"); setOmissionIndex(0); }}>Skipped residual ({skippedResidualCandidates.length})</button>
        </div>
        {omission ? <>
        <OmissionReview
          key={omission.itemId}
          candidate={omission}
          claims={claims}
          chunks={chunks}
          decision={omissionDecisions[omission.itemId]}
          position={safeOmissionIndex + 1}
          total={visibleOmissionCandidates.length}
          remainingTotal={allResidualCandidates.length}
          reviewed={reviewedOmissionCount}
          onDecision={(decision) => replaceOmissionDecision(omission.itemId, decision)}
          onSkip={() => updateOmissionDecision(omission.itemId, { skipped: true, reviewed: false })}
          onPrevious={() => setOmissionIndex(Math.max(0, safeOmissionIndex - 1))}
          onNext={() => setOmissionIndex(Math.min(visibleOmissionCandidates.length - 1, safeOmissionIndex + 1))}
        />
      </> : <section className="panel empty-state"><h2>{residualQueueMode === "reviewed" ? "No reviewed residual items" : residualQueueMode === "skipped" ? "No skipped residual items" : "No active residual transcript items"}</h2><p>{residualQueueMode === "active" ? "All transcript propositions are covered, resolved, or skipped." : "Nothing is currently in this queue."}</p></section>}
        <div className="review-stage-actions"><button className="primary-button" onClick={() => setStage("findings")}>Review findings →</button></div>
      </>}

      {stage === "findings" && claims.length > 0 && <>
        <FindingsReview
          claims={claims}
          chunks={chunks}
          claimDecisions={claimDecisions}
          omissionDecisions={omissionDecisions}
          unresolvedCount={unresolvedCount}
          onEditClaim={openClaimForEdit}
          onEditResidual={openResidualForEdit}
        />

        <section className="panel findings-export-panel">
          <label>Session / case reference (optional)<input value={sessionReference} onChange={e => setSessionReference(e.target.value)} /></label>

          {typeof exportWarning === "number" && <div className="export-warning" role="alert">
            <span>{exportWarning} items remain unresolved, including skipped items. Export anyway?</span>
            <button className="primary-button" onClick={exportPdfAnyway}>Export anyway</button>
            <button className="compact-button" onClick={() => setExportWarning(undefined)}>Continue reviewing</button>
          </div>}

          <div className="review-stage-actions">
            <button className="primary-button" onClick={requestPdfExport}>Export PDF exception report</button>
            <button className="secondary-button" onClick={exportReview}>Export full review JSON</button>
          </div>

          <button className="compact-button" onClick={() => setShowResolved(v => !v)}>
            Coverage map / resolved transcript items ({chunks.length - allResidualCandidates.length})
          </button>

          {showResolved && chunks.filter(u => !residualIds.has(u.id)).map(u => <div className="evidence-card" key={u.id}>
            <strong>{u.id}</strong>
            <p>{u.text}</p>
            <p>{coverage.filter(l => l.unitId === u.id).map(l => `${l.claimId}${l.equivalentTo ? ` (repeat of ${l.equivalentTo})` : ""}`).join(", ") || (omissionDecisions[`omission-${u.id}`]?.irrelevant ? "Irrelevant / does not need documenting" : omissionDecisions[`omission-${u.id}`]?.categories.join(", ") || "Equivalent repeated proposition")}</p>
            <p>{omissionDecisions[`omission-${u.id}`]?.comment}</p>
            {omissionDecisions[`omission-${u.id}`]?.reviewed && <button className="compact-button" onClick={() => updateOmissionDecision(`omission-${u.id}`, { reviewed: false, correctSupported: false, irrelevant: false, skipped: false })}>Reopen residual review</button>}
          </div>)}
        </section>
      </>}

      {busy && <div className="panel analysis-progress sticky-progress"><strong>{progress}</strong>{typeof progressPercent === "number" && <div className="progress-track"><div style={{ width: `${Math.min(100, progressPercent)}%` }} /></div>}<span>First use downloads and caches local MiniLM and NLI models. Your text remains in this browser.</span></div>}
      {error && <div className="validator-error workflow-error">{error}</div>}
    </main>
  );
}
