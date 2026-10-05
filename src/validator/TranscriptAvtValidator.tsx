import { useEffect, useMemo, useState } from "react";
import { extractClaims } from "./claimExtraction/extractClaims";
import ClaimReview from "./components/ClaimReview";
import OmissionReview from "./components/OmissionReview";
import TranscriptAvtInput from "./components/TranscriptAvtInput";
import { compareTranscriptAndAvt, type TranscriptComparison } from "./matching/evidenceMatcher";
import { createEvidenceChunks, isLikelyClinicalChunk } from "./transcript/createEvidenceChunks";
import { parseTranscript } from "./transcript/parseTranscript";
import { NLI_MODEL_ID } from "./matching/nli";
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
type Stage = "input" | "claims" | "omissions";

const emptySections = Object.fromEntries(TRANSCRIPT_AVT_SECTIONS.map((section) => [section, ""])) as Record<TranscriptAvtSection, string>;

export default function TranscriptAvtValidator({ onBack }: Props) {
  const [stage, setStage] = useState<Stage>("input");
  const [transcript, setTranscript] = useState("");
  const [avtSections, setAvtSections] = useState(emptySections);
  const [chunks, setChunks] = useState<TranscriptEvidenceChunk[]>([]);
  const [claims, setClaims] = useState<ReturnType<typeof extractClaims>>([]);
  const [comparison, setComparison] = useState<TranscriptComparison>({ matches: {}, omissionCandidates: [] });
  const [claimDecisions, setClaimDecisions] = useState<Record<string, ValidationDecision>>({});
  const [omissionDecisions, setOmissionDecisions] = useState<Record<string, OmissionDecision>>({});
  const [claimIndex, setClaimIndex] = useState(0);
  const [omissionIndex, setOmissionIndex] = useState(0);
  const [showLikelyCovered, setShowLikelyCovered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [progressPercent, setProgressPercent] = useState<number>();
  const [error, setError] = useState("");

  const hasAvtText = TRANSCRIPT_AVT_SECTIONS.some((section) => avtSections[section].trim());

  const allOmissionCandidates = useMemo(() => comparison.omissionCandidates.filter((candidate) => {
    const chunk = chunks.find((item) => item.id === candidate.transcriptChunkId);
    return chunk ? isLikelyClinicalChunk(chunk) : false;
  }), [chunks, comparison.omissionCandidates]);
  const visibleOmissionCandidates = useMemo(
    () => showLikelyCovered ? allOmissionCandidates : allOmissionCandidates.filter((candidate) => !candidate.likelyCovered),
    [allOmissionCandidates, showLikelyCovered]
  );
  const omission = visibleOmissionCandidates[omissionIndex];

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
      setChunks(nextChunks);
      setClaims(nextClaims);
      setComparison(nextComparison);
      setClaimDecisions({});
      setOmissionDecisions({});
      setClaimIndex(0);
      setOmissionIndex(0);
      setStage("claims");
    } catch (comparisonError) {
      setError(comparisonError instanceof Error ? comparisonError.message : "Local comparison failed.");
    } finally {
      setBusy(false);
    }
  };

  const exportReview = () => {
    const payload = {
      schemaVersion: "transcript-avt-validation-1.0",
      exportedAt: new Date().toISOString(),
      embeddingModel: "Xenova/all-MiniLM-L6-v2",
      nliModel: NLI_MODEL_ID,
      findings: claims.flatMap((claim) => {
        const decision = claimDecisions[claim.id];
        if (!decision?.reviewed) return [];
        const evidence = chunks.find((chunk) => chunk.id === decision.transcriptChunkId)?.text ?? "";
        return [{
          category: claim.section,
          categories: decision.categories,
          findingType: decision.correctSupported ? "supported" : "finding",
          avtClaim: claim.text,
          transcriptEvidence: evidence,
          correctSupported: decision.correctSupported,
          reviewerComment: decision.comment,
          retrievalDetails: comparison.matches[claim.id]?.find((match) => match.transcriptChunkId === decision.transcriptChunkId) ?? null
        }];
      }),
      omissionReview: visibleOmissionCandidates.flatMap((candidate) => {
        const decision = omissionDecisions[candidate.itemId];
        if (!decision?.reviewed) return [];
        const selectedClaimId = decision.avtClaimId ?? candidate.bestAvtClaimId;
        const selectedClaim = claims.find((claim) => claim.id === selectedClaimId);
        const selectedMatch = candidate.matches.find((match) => match.avtClaimId === selectedClaimId);
        return [{
          category: decision.categories,
          findingType: decision.correctSupported ? "supported" : "finding",
          avtClaim: selectedClaim?.text ?? "",
          transcriptUnit: candidate.transcriptText,
          correctSupported: decision.correctSupported,
          reviewerComment: decision.comment,
          sourceTranscriptPosition: { startLine: candidate.startLine, endLine: candidate.endLine },
          retrievalDetails: selectedMatch ? {
            semanticSimilarity: selectedMatch.semanticSimilarity,
            matchingTerms: selectedMatch.matchingTerms,
            matchingNumbers: selectedMatch.matchingNumbers,
            conflictingNumbers: selectedMatch.conflictingNumbers,
            negationWarning: selectedMatch.negationWarning,
            entailment: selectedMatch.entailment,
            contradiction: selectedMatch.contradiction,
            neutral: selectedMatch.neutral,
            statementType: selectedMatch.statementType
          } : null
        }];
      })
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `transcript-avt-review-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateClaimDecision = (claimId: string, update: Partial<ValidationDecision>) => {
    setClaimDecisions((current) => {
      const existing = current[claimId] ?? { claimId, reviewed: false, correctSupported: false, categories: [], comment: "" };
      const next = { ...existing, ...update };
      if (next.categories.length > 0) next.correctSupported = false;
      if (update.correctSupported) next.categories = [];
      return { ...current, [claimId]: next };
    });
  };

  const updateOmissionDecision = (itemId: string, update: Partial<OmissionDecision>) => {
    setOmissionDecisions((current) => {
      const existing = current[itemId] ?? { itemId, reviewed: false, correctSupported: false, categories: [], comment: "" };
      const next = { ...existing, ...update };
      if (next.categories.length > 0) next.correctSupported = false;
      if (update.correctSupported) next.categories = [];
      return { ...current, [itemId]: next };
    });
  };

  const toggleOmissionCategory = (itemId: string, category: ValidationCategory) => {
    const categories = omissionDecisions[itemId]?.categories ?? [];
    const nextCategories = categories.includes(category) ? categories.filter((item) => item !== category) : [...categories, category];
    updateOmissionDecision(itemId, {
      categories: nextCategories,
      correctSupported: false,
      reviewed: nextCategories.length > 0
    });
  };

  const toggleClaimCategory = (claimId: string, category: ValidationCategory) => {
    const categories = claimDecisions[claimId]?.categories ?? [];
    const nextCategories = categories.includes(category) ? categories.filter((item) => item !== category) : [...categories, category];
    updateClaimDecision(claimId, {
      categories: nextCategories,
      correctSupported: false,
      reviewed: nextCategories.length > 0
    });
  };

  const claim = claims[claimIndex];

  useEffect(() => {
    if (stage !== "claims" && stage !== "omissions") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;
      if (/^[1-9]$/.test(event.key)) {
        const category = VALIDATION_CATEGORIES[Number(event.key) - 1];
        if (!category) return;
        if (stage === "claims" && claim) toggleClaimCategory(claim.id, category);
        if (stage === "omissions" && omission) toggleOmissionCategory(omission.itemId, category);
      } else if (stage === "claims" && event.key === "ArrowLeft") setClaimIndex((index) => Math.max(0, index - 1));
      else if (stage === "claims" && event.key === "ArrowRight") setClaimIndex((index) => Math.min(claims.length - 1, index + 1));
      else if (stage === "omissions" && event.key === "ArrowLeft") setOmissionIndex((index) => Math.max(0, index - 1));
      else if (stage === "omissions" && event.key === "ArrowRight") setOmissionIndex((index) => Math.min(visibleOmissionCandidates.length - 1, index + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage, claim, omission, claims.length, visibleOmissionCandidates.length, claimDecisions, omissionDecisions]);

  const reviewedClaims = Object.values(claimDecisions).filter((decision) => decision.reviewed).length;
  const reviewedOmissions = Object.values(omissionDecisions).filter((decision) => decision.reviewed).length;

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
        <button className={stage === "omissions" ? "active" : ""} onClick={() => setStage("omissions")} disabled={!claims.length}><span>3</span>Possible omissions</button>
      </nav>

      {stage === "input" && <TranscriptAvtInput
        transcript={transcript}
        onTranscriptChange={setTranscript}
        avtSections={avtSections}
        onSectionChange={(section, value) => setAvtSections((current) => ({ ...current, [section]: value }))}
        onStart={startComparison}
        disabled={busy || !transcript.trim() || !hasAvtText}
      />}

      {stage === "claims" && claim && <>
        <ClaimReview
          claim={claim}
          candidates={comparison.matches[claim.id] ?? []}
          chunks={chunks}
          decision={claimDecisions[claim.id]}
          position={claimIndex + 1}
          total={claims.length}
          reviewed={reviewedClaims}
          onDecision={(decision) => updateClaimDecision(claim.id, decision)}
          onToggleCategory={(category) => toggleClaimCategory(claim.id, category)}
          onToggleSupported={() => updateClaimDecision(claim.id, { correctSupported: !claimDecisions[claim.id]?.correctSupported, categories: [], reviewed: !claimDecisions[claim.id]?.correctSupported })}
          onPrevious={() => setClaimIndex((current) => Math.max(0, current - 1))}
          onNext={() => setClaimIndex((current) => Math.min(claims.length - 1, current + 1))}
        />
        <div className="review-stage-actions"><button className="primary-button" onClick={() => setStage("omissions")}>Review possible omissions →</button></div>
      </>}

      {stage === "omissions" && <>
        <label className="show-covered-toggle standalone"><input type="checkbox" checked={showLikelyCovered} onChange={(event) => { setShowLikelyCovered(event.target.checked); setOmissionIndex(0); }} /> Show likely covered transcript units</label>
        {omission ? <>
        <OmissionReview
          candidate={omission}
          claims={claims}
          decision={omissionDecisions[omission.itemId]}
          position={omissionIndex + 1}
          total={visibleOmissionCandidates.length}
          reviewed={reviewedOmissions}
          onDecision={(decision) => setOmissionDecisions((current) => ({ ...current, [omission.itemId]: decision }))}
          onPrevious={() => setOmissionIndex((current) => Math.max(0, current - 1))}
          onNext={() => setOmissionIndex((current) => Math.min(visibleOmissionCandidates.length - 1, current + 1))}
        />
        <div className="review-stage-actions"><button className="primary-button" onClick={exportReview}>Export reviewed findings</button></div>
      </> : <section className="panel empty-state"><h2>No possible omissions in this view</h2><p>Show likely covered transcript units to inspect the units with stronger coverage evidence.</p><button className="primary-button" onClick={exportReview}>Export reviewed findings</button></section>}
      </>}

      {busy && <div className="panel analysis-progress sticky-progress"><strong>{progress}</strong>{typeof progressPercent === "number" && <div className="progress-track"><div style={{ width: `${Math.min(100, progressPercent)}%` }} /></div>}<span>First use downloads and caches local MiniLM and NLI models. Your text remains in this browser.</span></div>}
      {error && <div className="validator-error workflow-error">{error}</div>}
    </main>
  );
}
