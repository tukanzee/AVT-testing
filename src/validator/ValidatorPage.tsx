import { useEffect, useMemo, useState } from "react";
import type { GroundTruthExport } from "../utils/json";
import { analyseLevel1, type Level1Analysis, type ReviewCandidate } from "./level1Engine";
import {
  FIRSTNET_COMPONENTS,
  VALIDATION_CATEGORIES,
  type AvtComponentContent,
  type FirstNetComponent,
  type ValidationCategory,
  type ValidationFinding
} from "./types";
import "./validator.css";
import "./level1.css";
import TranscriptAvtValidator from "./TranscriptAvtValidator";

const emptyAvtOutput = Object.fromEntries(
  FIRSTNET_COMPONENTS.map((component) => [component, ""])
) as AvtComponentContent;

type Props = {
  onBack: () => void;
};

type ReviewDecision = {
  status: "pending" | "no-issue" | "approved";
  category?: ValidationCategory;
};

type ReviewFilter = "unreviewed" | "approved" | "no-issue" | "all";
type ReviewView = "focus" | "all";
type ReviewTab = "review" | "findings";

const CATEGORY_DEFINITIONS: Record<ValidationCategory, string> = {
  "Omission": "Clinical content present in the script but absent from the exported record.",
  "Duplication": "The same content reproduced in more than one component or more than once in the same component.",
  "Over-simplification": "Content retained but with detail, qualifier or specificity lost, or reworded in a way that reduces precision.",
  "Misattribution": "Content attributed to the wrong person, wrong demographic, wrong speaker, or wrong actor.",
  "Misclassification": "Content placed under the wrong heading, component or system category.",
  "Addition (not in script)": "Content that appears in the exported record with no basis in the source script.",
  "Clinical Decision Support / Inference": "The app has interpreted, diagnosed, labelled or drawn a clinical conclusion not stated by the clinician.",
  "Extraneous Content": "Text present in a clinical component that is not clinical documentation (system metadata, meta-commentary, narration).",
  "Observation (not an app defect)": "Noted for completeness; traced to a limitation of the source script or workflow, not to the app."
};

export default function ValidatorPage({ onBack }: Props) {
  const [mode, setMode] = useState<"transcript" | "level-1">("transcript");
  return (
    <>
      <div className="validator-mode-switch" aria-label="Validator workflow">
        <button className={mode === "transcript" ? "active" : ""} onClick={() => setMode("transcript")}>Transcript vs AVT validator</button>
        <button className={mode === "level-1" ? "active" : ""} onClick={() => setMode("level-1")}>Existing Level 1 validator</button>
      </div>
      {mode === "transcript" ? <TranscriptAvtValidator onBack={onBack} /> : <LegacyValidatorPage onBack={onBack} />}
    </>
  );
}

function LegacyValidatorPage({ onBack }: Props) {
  const [groundTruth, setGroundTruth] = useState<GroundTruthExport | null>(null);
  const [groundTruthFileName, setGroundTruthFileName] = useState("");
  const [avtOutput, setAvtOutput] = useState<AvtComponentContent>(emptyAvtOutput);
  const [analysis, setAnalysis] = useState<Level1Analysis | null>(null);
  const [decisions, setDecisions] = useState<Record<string, ReviewDecision>>({});
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [progressPercent, setProgressPercent] = useState<number | undefined>();
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("unreviewed");
  const [reviewView, setReviewView] = useState<ReviewView>("focus");
  const [activeTab, setActiveTab] = useState<ReviewTab>("review");
  const [groundTruthMode, setGroundTruthMode] = useState<"json" | "transcript">("json");
  const [transcriptFileName, setTranscriptFileName] = useState("");
  const [transcriptStatementCount, setTranscriptStatementCount] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const completedComponents = useMemo(
    () => FIRSTNET_COMPONENTS.filter((component) => avtOutput[component].trim()).length,
    [avtOutput]
  );

  const approvedFindings = useMemo(() => {
    if (!analysis) return [];
    return analysis.candidates.flatMap((candidate, index) => {
      const decision = decisions[candidate.id];
      if (decision?.status !== "approved" || !decision.category) return [];
      return [candidateToFinding(candidate, decision.category, index)];
    });
  }, [analysis, decisions]);

  const reviewCounts = useMemo(() => {
    if (!analysis) return { pending: 0, approved: 0, noIssue: 0, reviewed: 0 };
    let pending = 0;
    let approved = 0;
    let noIssue = 0;

    analysis.candidates.forEach((candidate) => {
      const status = decisions[candidate.id]?.status ?? "pending";
      if (status === "approved") approved += 1;
      else if (status === "no-issue") noIssue += 1;
      else pending += 1;
    });

    return {
      pending,
      approved,
      noIssue,
      reviewed: approved + noIssue
    };
  }, [analysis, decisions]);

  const sortedCandidates = useMemo(() => {
    if (!analysis) return [];
    return [...analysis.candidates].sort((a, b) => {
      const priorityDifference = candidatePriority(a) - candidatePriority(b);
      if (priorityDifference !== 0) return priorityDifference;
      return a.id.localeCompare(b.id);
    });
  }, [analysis]);

  const filteredCandidates = useMemo(
    () =>
      sortedCandidates.filter((candidate) => {
        const status = decisions[candidate.id]?.status ?? "pending";
        if (reviewFilter === "all") return true;
        if (reviewFilter === "unreviewed") return status === "pending";
        if (reviewFilter === "approved") return status === "approved";
        return status === "no-issue";
      }),
    [sortedCandidates, decisions, reviewFilter]
  );

  const focusedCandidate = filteredCandidates[focusedIndex] ?? null;

  useEffect(() => {
    if (focusedIndex >= filteredCandidates.length) {
      setFocusedIndex(Math.max(filteredCandidates.length - 1, 0));
    }
  }, [filteredCandidates.length, focusedIndex]);

  useEffect(() => {
    if (!analysis || activeTab !== "review" || reviewView !== "focus" || !focusedCandidate) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setFocusedIndex((current) => Math.min(current + 1, filteredCandidates.length - 1));
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setFocusedIndex((current) => Math.max(current - 1, 0));
        return;
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        setDecision(focusedCandidate, { status: "no-issue" });
        return;
      }

      if (event.key.toLowerCase() === "a") {
        event.preventDefault();
        const current = decisions[focusedCandidate.id];
        const category =
          current?.category ?? focusedCandidate.suggestedCategory ?? VALIDATION_CATEGORIES[0];
        setDecision(focusedCandidate, { status: "approved", category });
        return;
      }

      if (/^[1-9]$/.test(event.key)) {
        event.preventDefault();
        const category = VALIDATION_CATEGORIES[Number(event.key) - 1];
        if (!category) return;
        const current = decisions[focusedCandidate.id];
        setDecision(focusedCandidate, {
          status: current?.status === "approved" ? "approved" : "pending",
          category
        });
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeTab,
    analysis,
    decisions,
    filteredCandidates.length,
    focusedCandidate,
    reviewView
  ]);

  const handleGroundTruthUpload = async (file?: File) => {
    if (!file) return;
    setError("");
    resetAnalysis();

    try {
      const parsed = JSON.parse(await file.text()) as GroundTruthExport;
      if (parsed.schemaVersion !== "1.0" || !parsed.scenario?.id || !Array.isArray(parsed.facts)) {
        throw new Error("This does not look like a Ground Truth Runner JSON file.");
      }
      setGroundTruth(parsed);
      setGroundTruthMode("json");
      setGroundTruthFileName(file.name);
      setTranscriptFileName("");
      setTranscriptStatementCount(0);
    } catch (uploadError) {
      setGroundTruth(null);
      setGroundTruthFileName("");
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to read the ground truth file."
      );
    }
  };

  const handleTranscriptUpload = async (file?: File) => {
    if (!file) return;
    setError("");
    resetAnalysis();

    try {
      const text = await file.text();
      const parsed = transcriptToGroundTruth(text, file.name);
      if (parsed.facts.length === 0) {
        throw new Error("No transcript statements were found in this file.");
      }

      setGroundTruth(parsed);
      setGroundTruthMode("transcript");
      setTranscriptFileName(file.name);
      setTranscriptStatementCount(parsed.facts.length);
      setGroundTruthFileName("");
    } catch (uploadError) {
      setGroundTruth(null);
      setTranscriptFileName("");
      setTranscriptStatementCount(0);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to read the attributed transcript."
      );
    }
  };

  const updateComponent = (component: FirstNetComponent, value: string) => {
    setAvtOutput((current) => ({ ...current, [component]: value }));
    resetAnalysis();
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setDecisions({});
    setProgressText("");
    setProgressPercent(undefined);
    setReviewFilter("unreviewed");
    setReviewView("focus");
    setActiveTab("review");
    setFocusedIndex(0);
  };

  const validate = async () => {
    if (!groundTruth) {
      setError("Upload the ground truth JSON file first.");
      return;
    }

    if (completedComponents === 0) {
      setError("Paste at least one AVT component before analysing.");
      return;
    }

    setError("");
    setIsValidating(true);
    setProgressText("Starting local comparison…");
    setProgressPercent(undefined);

    try {
      const nextAnalysis = await analyseLevel1(groundTruth, avtOutput, (message, percent) => {
        setProgressText(message);
        setProgressPercent(percent);
      });

      setAnalysis(nextAnalysis);
      setDecisions(
        Object.fromEntries(
          nextAnalysis.candidates.map((candidate) => [
            candidate.id,
            { status: "pending", category: candidate.suggestedCategory }
          ])
        )
      );
      setReviewFilter("unreviewed");
      setReviewView("focus");
      setActiveTab("review");
      setFocusedIndex(0);
      setProgressText("");
      setProgressPercent(undefined);
    } catch (validationError) {
      setError(
        validationError instanceof Error
          ? validationError.message
          : "Local validation failed. Try Chrome or Edge and check your connection for the first model download."
      );
    } finally {
      setIsValidating(false);
    }
  };

  const setDecision = (candidate: ReviewCandidate, decision: ReviewDecision) => {
    setDecisions((current) => ({ ...current, [candidate.id]: decision }));
  };

  const changeFilter = (filter: ReviewFilter) => {
    setReviewFilter(filter);
    setFocusedIndex(0);
  };

  return (
    <main className="shell validator-shell">
      <header className="topbar">
        <div>
          <button className="link-button" onClick={onBack}>← Back to home</button>
          <div className="topbar-title">AVT validation</div>
        </div>
        <div className="role-badge">Level 1 · Human reviewed</div>
      </header>

      <section className="panel validator-intro">
        <div className="eyebrow">Synthetic testing workflow</div>
        <h1>Validate AVT output</h1>
        <p className="lead">
          The browser screens for potential mismatches. You remain the final reviewer and decide
          whether each item is actually a discrepancy.
        </p>
      </section>

      <section className="panel validator-source-card">
        <div className="eyebrow">1 · Ground truth</div>
        <h2>Choose ground truth source</h2>
        <p className="section-intro">
          Use either the structured JSON from the Ground Truth Runner or a speaker-attributed script / transcript.
        </p>

        <div className="ground-truth-source-grid">
          <label className={`ground-truth-source ${groundTruthMode === "json" ? "active" : ""}`}>
            <input
              type="file"
              accept="application/json,.json"
              onChange={(event) => handleGroundTruthUpload(event.target.files?.[0])}
            />
            <span className="ground-truth-source-title">Structured ground truth JSON</span>
            <span className="ground-truth-source-copy">
              Best for synthetic testing. Keeps structured source facts and domains.
            </span>
            <span className="ground-truth-source-action">
              {groundTruthFileName || "Choose JSON file"}
            </span>
          </label>

          <label className={`ground-truth-source ${groundTruthMode === "transcript" ? "active" : ""}`}>
            <input
              type="file"
              accept="text/plain,text/markdown,.txt,.md"
              onChange={(event) => handleTranscriptUpload(event.target.files?.[0])}
            />
            <span className="ground-truth-source-title">Attributed script / transcript</span>
            <span className="ground-truth-source-copy">
              Upload a text file attributed as P:/C:, Patient:/Clinician:, or Doctor:.
            </span>
            <span className="ground-truth-source-action">
              {transcriptFileName || "Choose transcript file"}
            </span>
          </label>
        </div>

        {groundTruth && (
          <div className="loaded-source">
            <strong>
              {groundTruthMode === "json"
                ? `${groundTruth.scenario.id} · ${groundTruth.scenario.title}`
                : transcriptFileName}
            </strong>
            <span>
              {groundTruthMode === "json"
                ? `${groundTruth.facts.length} spoken facts loaded`
                : `${transcriptStatementCount} attributed statements loaded`}
            </span>
          </div>
        )}

        {groundTruthMode === "transcript" && groundTruth && (
          <div className="transcript-mode-note">
            Transcript mode uses the attributed text as the content ground truth. Component-placement
            screening is skipped because the transcript does not define an expected FirstNet component.
          </div>
        )}
      </section>

      <section className="validator-workspace">
        <aside className="component-nav panel">
          <div className="eyebrow">2 · AVT record</div>
          <h3>FirstNet components</h3>
          <p className="subtle">Paste each writer block into the matching component.</p>
          <div className="component-nav-list">
            {FIRSTNET_COMPONENTS.map((component) => (
              <a href={`#${slugify(component)}`} key={component}>
                <span className={avtOutput[component].trim() ? "status-dot filled" : "status-dot"} />
                {component}
              </a>
            ))}
          </div>
          <div className="component-count">
            {completedComponents} / {FIRSTNET_COMPONENTS.length} components pasted
          </div>
        </aside>

        <div className="writer-blocks">
          {FIRSTNET_COMPONENTS.map((component) => (
            <section className="writer-block" id={slugify(component)} key={component}>
              <div className="writer-block-header">
                <strong>{component}</strong>
                <span>{avtOutput[component].trim() ? "Pasted" : "Empty"}</span>
              </div>
              <textarea
                value={avtOutput[component]}
                onChange={(event) => updateComponent(component, event.target.value)}
                placeholder={`Paste the AVT ${component} writer block here...`}
                rows={8}
              />
            </section>
          ))}

          {error && <div className="validator-error">{error}</div>}

          {isValidating && (
            <div className="analysis-progress">
              <strong>{progressText || "Analysing…"}</strong>
              {typeof progressPercent === "number" && (
                <div className="progress-track">
                  <div style={{ width: `${Math.min(progressPercent, 100)}%` }} />
                </div>
              )}
              <span>First use may take longer while the local model is downloaded.</span>
            </div>
          )}

          <button
            className="primary-button validate-button"
            onClick={validate}
            disabled={isValidating}
          >
            {isValidating ? "Analysing locally…" : "Find potential discrepancies"}
          </button>
        </div>
      </section>

      {analysis && (
        <section className="review-area">
          <ReviewSummary
            analysis={analysis}
            reviewed={reviewCounts.reviewed}
            approved={reviewCounts.approved}
            noIssue={reviewCounts.noIssue}
          />

          <div className="review-tabs" role="tablist" aria-label="Validation review sections">
            <button
              className={activeTab === "review" ? "active" : ""}
              onClick={() => setActiveTab("review")}
              role="tab"
              aria-selected={activeTab === "review"}
            >
              Review <span>{analysis.candidates.length}</span>
            </button>
            <button
              className={activeTab === "findings" ? "active" : ""}
              onClick={() => setActiveTab("findings")}
              role="tab"
              aria-selected={activeTab === "findings"}
            >
              Approved findings <span>{reviewCounts.approved}</span>
            </button>
          </div>

          {activeTab === "review" ? (
            <section className="panel review-panel">
              <div className="review-toolbar">
                <div>
                  <div className="eyebrow">3 · Human review</div>
                  <h2>Review potential discrepancies</h2>

              <p className="section-intro">
                These are screening suggestions, not final findings. Review the source and AVT
                wording, then mark No issue or approve a discrepancy category.
              </p>

              <ShortcutPanel />
              <CategoryGuide />

              <div className="review-controls-row">
                <div className="filter-group" aria-label="Review status filters">
                  <FilterButton
                    label="Unreviewed"
                    count={reviewCounts.pending}
                    active={reviewFilter === "unreviewed"}
                    onClick={() => changeFilter("unreviewed")}
                  />
                  <FilterButton
                    label="Approved"
                    count={reviewCounts.approved}
                    active={reviewFilter === "approved"}
                    onClick={() => changeFilter("approved")}
                  />
                  <FilterButton
                    label="No issue"
                    count={reviewCounts.noIssue}
                    active={reviewFilter === "no-issue"}
                    onClick={() => changeFilter("no-issue")}
                  />
                  <FilterButton
                    label="All"
                    count={analysis.candidates.length}
                    active={reviewFilter === "all"}
                    onClick={() => changeFilter("all")}
                  />
                </div>

                <div className="view-toggle" aria-label="Review layout">
                  <button
                    className={reviewView === "focus" ? "active" : ""}
                    onClick={() => {
                      setReviewView("focus");
                      setFocusedIndex(0);
                    }}
                  >
                    Review one-by-one
                  </button>
                  <button
                    className={reviewView === "all" ? "active" : ""}
                    onClick={() => setReviewView("all")}
                  >
                    View all
                  </button>
                </div>
              </div>

                  {filteredCandidates.length === 0 ? (
                    <div className="empty-state">No items in this filter.</div>
                  ) : reviewView === "focus" && focusedCandidate ? (
                    <FocusedReview
                      candidate={focusedCandidate}
                      position={focusedIndex + 1}
                      total={filteredCandidates.length}
                      decision={decisions[focusedCandidate.id] ?? { status: "pending" }}
                      onDecision={setDecision}
                      onPrevious={() => setFocusedIndex((current) => Math.max(current - 1, 0))}
                      onNext={() => setFocusedIndex((current) => Math.min(current + 1, filteredCandidates.length - 1))}
                      canPrevious={focusedIndex > 0}
                      canNext={focusedIndex < filteredCandidates.length - 1}
                    />
                  ) : (
                    <CompactReviewList candidates={filteredCandidates} decisions={decisions} onDecision={setDecision} />
                  )}
                </div>
              </div>
            </section>
          ) : (
            <ApprovedFindingsPanel
              findings={approvedFindings}
              noIssueCount={reviewCounts.noIssue}
            />
          )}
        </section>
      )}
    </main>
  );
}

function ReviewSummary({
  analysis,
  reviewed,
  approved,
  noIssue
}: {
  analysis: Level1Analysis;
  reviewed: number;
  approved: number;
  noIssue: number;
}) {
  const progress =
    analysis.candidates.length === 0
      ? 100
      : Math.round((reviewed / analysis.candidates.length) * 100);

  return (
    <section className="panel review-summary">
      <div className="eyebrow">Screening summary</div>
      <div className="summary-grid">
        <div><strong>{analysis.sourceFacts}</strong><span>Source facts</span></div>
        <div><strong>{analysis.likelyCaptured}</strong><span>Likely captured</span></div>
        <div><strong>{analysis.candidates.length}</strong><span>Potential discrepancies</span></div>
        <div><strong>{reviewed}</strong><span>Reviewed</span></div>
      </div>

      <div className="review-summary-footer">
        <div className="review-progress-copy">
          <strong>Review progress</strong>
          <span>{reviewed} of {analysis.candidates.length}</span>
        </div>
        <div className="progress-track review-progress-track">
          <div style={{ width: `${progress}%` }} />
        </div>
        <div className="summary-statuses">
          <span className="summary-chip approved">✓ {approved} approved</span>
          <span className="summary-chip no-issue">✓ {noIssue} no issue</span>
        </div>
      </div>
    </section>
  );
}

function FilterButton({
  label,
  count,
  active,
  onClick
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`filter-button ${active ? "active" : ""}`} onClick={onClick}>
      {label} <span>{count}</span>
    </button>
  );
}

function FocusedReview({
  candidate,
  position,
  total,
  decision,
  onDecision,
  onPrevious,
  onNext,
  canPrevious,
  canNext
}: {
  candidate: ReviewCandidate;
  position: number;
  total: number;
  decision: ReviewDecision;
  onDecision: (candidate: ReviewCandidate, decision: ReviewDecision) => void;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}) {
  return (
    <div className="focus-review">
      <div className="focus-position">Potential discrepancy {position} of {total}</div>
      <article className={`focus-card ${decision.status}`}>
        <CandidateHeader candidate={candidate} decision={decision} />
        <Comparison candidate={candidate} />
        <WhyFlagged candidate={candidate} />
        <ReviewControls candidate={candidate} decision={decision} onDecision={onDecision} />
        <TechnicalDetails candidate={candidate} />
      </article>

      <div className="focus-navigation">
        <button className="secondary-button" onClick={onPrevious} disabled={!canPrevious}>
          ← Previous
        </button>
        <span>Use ← → to move between items</span>
        <button className="secondary-button" onClick={onNext} disabled={!canNext}>
          Next →
        </button>
      </div>
    </div>
  );
}

function CompactReviewList({
  candidates,
  decisions,
  onDecision
}: {
  candidates: ReviewCandidate[];
  decisions: Record<string, ReviewDecision>;
  onDecision: (candidate: ReviewCandidate, decision: ReviewDecision) => void;
}) {
  return (
    <div className="compact-candidate-list">
      {candidates.map((candidate, index) => {
        const decision = decisions[candidate.id] ?? { status: "pending" as const };
        return (
          <details className={`compact-candidate ${decision.status}`} key={candidate.id}>
            <summary>
              <span className="candidate-number">{index + 1}</span>
              <div className="compact-summary-main">
                <div className="compact-summary-title">
                  <strong>{candidate.component}</strong>
                  <StatusPill decision={decision} />
                </div>
                <span className="compact-preview">
                  {candidate.sourceText || "No close source fact"} → {candidate.avtText || "No close AVT wording"}
                </span>
              </div>
              <span className={`priority-badge priority-${candidatePriority(candidate)}`}>
                {priorityLabel(candidate)}
              </span>
            </summary>
            <div className="compact-candidate-body">
              <Comparison candidate={candidate} />
              <WhyFlagged candidate={candidate} />
              <ReviewControls candidate={candidate} decision={decision} onDecision={onDecision} />
              <TechnicalDetails candidate={candidate} />
            </div>
          </details>
        );
      })}
    </div>
  );
}

function CandidateHeader({
  candidate,
  decision
}: {
  candidate: ReviewCandidate;
  decision: ReviewDecision;
}) {
  return (
    <div className="focus-card-header">
      <div>
        <div className="component-label">{candidate.component}</div>
        <div className="priority-line">
          <span className={`priority-badge priority-${candidatePriority(candidate)}`}>
            {priorityLabel(candidate)}
          </span>
          <StatusPill decision={decision} />
        </div>
      </div>
    </div>
  );
}

function Comparison({ candidate }: { candidate: ReviewCandidate }) {
  return (
    <div className="comparison-grid review-comparison">
      <div>
        <span className="comparison-label">Source</span>
        <p>{candidate.sourceText || "No close source fact found."}</p>
      </div>
      <div>
        <span className="comparison-label">AVT</span>
        <p>{candidate.avtText || "No close AVT wording found."}</p>
      </div>
    </div>
  );
}

function WhyFlagged({ candidate }: { candidate: ReviewCandidate }) {
  return (
    <div className="why-flagged">
      <strong>Why was this flagged?</strong>
      <div className="reason-list">
        {candidate.signals.map((signal) => (
          <div key={signal}>
            <span className="reason-icon">!</span>
            <span>{reasonForSignal(signal)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewControls({
  candidate,
  decision,
  onDecision
}: {
  candidate: ReviewCandidate;
  decision: ReviewDecision;
  onDecision: (candidate: ReviewCandidate, decision: ReviewDecision) => void;
}) {
  const category =
    decision.category ?? candidate.suggestedCategory ?? VALIDATION_CATEGORIES[0];

  return (
    <div className="decision-area">
      <div className="decision-question">Is this a discrepancy?</div>
      <div className="decision-actions">
        <button
          className={`review-choice no-issue-action ${decision.status === "no-issue" ? "active" : ""}`}
          onClick={() => onDecision(candidate, { status: "no-issue" })}
        >
          ✓ No issue
        </button>

        <div className="category-control">
          <label htmlFor={`category-${candidate.id}`}>Category</label>
          <select
            id={`category-${candidate.id}`}
            className="category-select"
            value={category}
            onChange={(event) =>
              onDecision(candidate, {
                status: decision.status === "approved" ? "approved" : "pending",
                category: event.target.value as ValidationCategory
              })
            }
          >
            {VALIDATION_CATEGORIES.map((item, index) => (
              <option key={item} value={item}>{index + 1} · {item}</option>
            ))}
          </select>
        </div>

        <button
          className={`review-choice approve ${decision.status === "approved" ? "active" : ""}`}
          onClick={() => onDecision(candidate, { status: "approved", category })}
        >
          {decision.status === "approved" ? `✓ Approved as ${category}` : `Approve as ${category}`}
        </button>
      </div>
    </div>
  );
}

function TechnicalDetails({ candidate }: { candidate: ReviewCandidate }) {
  return (
    <details className="technical-details">
      <summary>Technical details</summary>
      <div className="technical-details-grid">
        <div>
          <span>Similarity</span>
          <strong>
            {typeof candidate.similarity === "number"
              ? `${Math.round(candidate.similarity * 100)}%`
              : "Not available"}
          </strong>
        </div>
        <div>
          <span>Source fact ID</span>
          <strong>{candidate.sourceFactIds.join(", ") || "—"}</strong>
        </div>
        <div>
          <span>Screening signals</span>
          <strong>{candidate.signals.join("; ")}</strong>
        </div>
      </div>
    </details>
  );
}

function StatusPill({ decision }: { decision: ReviewDecision }) {
  if (decision.status === "approved") {
    return <span className="status-pill approved">Approved{decision.category ? ` · ${decision.category}` : ""}</span>;
  }

  if (decision.status === "no-issue") {
    return <span className="status-pill no-issue">No issue</span>;
  }

  return <span className="status-pill pending">Pending review</span>;
}

function CategoryGuide() {
  return (
    <aside className="category-guide" aria-label="Discrepancy category guide">
      <div className="category-guide-heading">
        <div><div className="eyebrow">Category guide</div><strong>Quick reference</strong></div>
        <span>Keys 1–9</span>
      </div>
      <div className="category-guide-list">
        {VALIDATION_CATEGORIES.map((category, index) => (
          <div className="category-guide-item" key={category}>
            <div className="category-guide-title">
              <kbd>{index + 1}</kbd>
              <span className={`category-pill ${categoryClassName(category)}`}>{category}</span>
            </div>
            <p>{CATEGORY_DEFINITIONS[category]}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ShortcutPanel() {
  return (
    <div className="shortcut-panel">
      <div><kbd>N</kbd><span>No issue</span></div>
      <div><kbd>A</kbd><span>Approve current category</span></div>
      <div><kbd>←</kbd><kbd>→</kbd><span>Previous / next</span></div>
      <div><kbd>1–9</kbd><span>Select category using the guide</span></div>
    </div>
  );
}

function ApprovedFindingsPanel({
  findings,
  noIssueCount
}: {
  findings: ValidationFinding[];
  noIssueCount: number;
}) {
  return (
    <section className="panel findings-panel">
      <div className="eyebrow">4 · Approved findings</div>
      <div className="findings-heading-row">
        <div>
          <h2>Human-approved findings</h2>
          <p className="section-intro">
            Only discrepancies approved by the reviewer appear here.
          </p>
        </div>
        <div className="findings-mini-summary">
          <span><strong>{findings.length}</strong> approved</span>
          <span><strong>{noIssueCount}</strong> no issue</span>
        </div>
      </div>

      {findings.length === 0 ? (
        <div className="empty-state">No discrepancies have been approved yet.</div>
      ) : (
        <div className="findings-table-wrap">
          <table className="findings-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Category</th>
                <th>AVT documented</th>
                <th>Source says</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((finding) => (
                <tr key={finding.id}>
                  <td>{finding.component}</td>
                  <td><span className={`category-pill ${categoryClassName(finding.category)}`}>{finding.category}</span></td>
                  <td>{finding.avtText || "—"}</td>
                  <td>{finding.sourceText || "—"}</td>
                  <td>{finding.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function candidatePriority(candidate: ReviewCandidate) {
  const hardSignals = new Set([
    "Number mismatch",
    "Negation mismatch",
    "Laterality mismatch",
    "Timing mismatch",
    "Possible duplication"
  ]);

  if (candidate.signals.some((signal) => hardSignals.has(signal))) return 0;
  if (
    candidate.signals.includes("Possible omission") ||
    candidate.signals.includes("Possible unsupported content")
  ) return 1;
  if (candidate.signals.includes("Possible wrong component")) return 2;
  return 3;
}

function priorityLabel(candidate: ReviewCandidate) {
  const priority = candidatePriority(candidate);
  if (priority === 0) return "Strong rule signal";
  if (priority === 1) return "Strong screening signal";
  if (priority === 2) return "Component check";
  return "Semantic review";
}

function reasonForSignal(signal: ReviewCandidate["signals"][number]) {
  switch (signal) {
    case "Possible omission":
      return "No sufficiently close AVT statement was found for this source fact.";
    case "Possible semantic change":
      return "The closest AVT wording may not preserve the full meaning of the source.";
    case "Number mismatch":
      return "A number or measurement differs between the source and AVT wording.";
    case "Negation mismatch":
      return "The positive / negative meaning may have changed.";
    case "Laterality mismatch":
      return "The documented side may differ from the source.";
    case "Timing mismatch":
      return "Timing or duration differs between the source and AVT wording.";
    case "Possible wrong component":
      return "The closest AVT wording appears in a different FirstNet component.";
    case "Possible unsupported content":
      return "This AVT text has no sufficiently close supporting source fact.";
    case "Possible duplication":
      return "The same content may have been documented more than once.";
  }
}

function transcriptToGroundTruth(text: string, fileName: string): GroundTruthExport {
  const statements = text
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const speakerMatch = line.match(/^(P|Patient|C|Clinician|Doctor)\s*:\s*(.+)$/i);
      const content = (speakerMatch?.[2] ?? line).trim();
      const source: GroundTruthExport["facts"][number]["source"] =
        speakerMatch && /^(P|Patient)$/i.test(speakerMatch[1])
          ? "patient"
          : "clinician";

      return content
        .split(/(?<=[.!?;])\s+/)
        .map((statement) => statement.trim())
        .filter((statement) => statement.length >= 3)
        .map((statement) => ({ source, text: statement }));
    });

  return {
    schemaVersion: "1.0",
    scenario: {
      id: "TRANSCRIPT",
      title: fileName.replace(/\.[^.]+$/, ""),
      specialty: "Imported attributed transcript",
      setting: "Imported transcript"
    },
    sessionId: `transcript-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    facts: statements.map((statement, index) => ({
      id: `transcript_${String(index + 1).padStart(3, "0")}`,
      domain: "History",
      source: statement.source,
      text: statement.text
    })),
    additionalSpokenInformation: ""
  };
}

function suppressTranscriptComponentChecks(analysis: Level1Analysis): Level1Analysis {
  const candidates = analysis.candidates.flatMap((candidate) => {
    const signals = candidate.signals.filter((signal) => signal !== "Possible wrong component");

    if (signals.length === 0) return [];

    const suggestedCategory =
      candidate.suggestedCategory === "Misclassification"
        ? undefined
        : candidate.suggestedCategory;

    return [{
      ...candidate,
      signals,
      suggestedCategory,
      description: signals.join("; ")
    }];
  });

  return {
    ...analysis,
    likelyCaptured: analysis.likelyCaptured + (analysis.candidates.length - candidates.length),
    candidates
  };
}

function candidateToFinding(
  candidate: ReviewCandidate,
  category: ValidationCategory,
  index: number
): ValidationFinding {
  return {
    id: `HUMAN-${index + 1}`,
    component: candidate.component,
    category,
    avtText: candidate.avtText,
    sourceText: candidate.sourceText,
    description: humanDescription(category, candidate),
    sourceFactIds: candidate.sourceFactIds
  };
}

function humanDescription(category: ValidationCategory, candidate: ReviewCandidate) {
  switch (category) {
    case "Omission":
      return candidate.sourceText ? `Omitted: ${stripStop(candidate.sourceText)}.` : "Source content omitted.";
    case "Duplication":
      return "Same content duplicated in the AVT record.";
    case "Over-simplification":
      return "Source detail or qualifier was reduced in the AVT record.";
    case "Misattribution":
      return "Finding attributed to the wrong speaker or person.";
    case "Misclassification":
      return "Correct content documented under the wrong component.";
    case "Addition (not in script)":
      return "Unsupported content; not stated in the source.";
    case "Clinical Decision Support / Inference":
      return "Clinically inferred from the source information but not stated explicitly.";
    case "Extraneous Content":
      return "Non-clinical text included in the clinical component.";
    case "Observation (not an app defect)":
      return "Source-script or workflow issue rather than an app defect.";
  }
}

function categoryClassName(category: ValidationCategory) {
  switch (category) {
    case "Omission": return "category-omission";
    case "Duplication": return "category-duplication";
    case "Over-simplification": return "category-over-simplification";
    case "Misattribution": return "category-misattribution";
    case "Misclassification": return "category-misclassification";
    case "Addition (not in script)": return "category-addition";
    case "Clinical Decision Support / Inference": return "category-cds";
    case "Extraneous Content": return "category-extraneous";
    case "Observation (not an app defect)": return "category-observation";
  }
}

function stripStop(value: string) {
  return value.trim().replace(/[.!?]+$/, "");
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
