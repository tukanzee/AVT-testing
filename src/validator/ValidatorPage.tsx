import { useMemo, useState } from "react";
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

export default function ValidatorPage({ onBack }: Props) {
  const [groundTruth, setGroundTruth] = useState<GroundTruthExport | null>(null);
  const [groundTruthFileName, setGroundTruthFileName] = useState("");
  const [avtOutput, setAvtOutput] = useState<AvtComponentContent>(emptyAvtOutput);
  const [analysis, setAnalysis] = useState<Level1Analysis | null>(null);
  const [decisions, setDecisions] = useState<Record<string, ReviewDecision>>({});
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [progressPercent, setProgressPercent] = useState<number | undefined>();

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

  const reviewedCount = useMemo(
    () => Object.values(decisions).filter((decision) => decision.status !== "pending").length,
    [decisions]
  );

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
      setGroundTruthFileName(file.name);
    } catch (uploadError) {
      setGroundTruth(null);
      setGroundTruthFileName("");
      setError(uploadError instanceof Error ? uploadError.message : "Unable to read the ground truth file.");
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
          The browser finds likely mismatches and brings them to you for review. You decide whether
          there is a discrepancy and which category it belongs to.
        </p>
        <div className="notice">
          <strong>Local-first validation.</strong> Semantic matching runs in your browser. The first
          use downloads a small matching model; afterwards it is cached by the browser. No generative
          LLM is making the final classification.
        </div>
      </section>

      <section className="panel validator-source-card">
        <div className="eyebrow">1 · Ground truth</div>
        <h2>Upload ground truth JSON</h2>
        <p className="section-intro">Use the JSON downloaded from the Patient / Ground Truth workflow.</p>
        <label className="file-upload">
          <input type="file" accept="application/json,.json" onChange={(event) => handleGroundTruthUpload(event.target.files?.[0])} />
          <span>{groundTruthFileName || "Choose ground truth JSON"}</span>
        </label>
        {groundTruth && (
          <div className="loaded-source">
            <strong>{groundTruth.scenario.id} · {groundTruth.scenario.title}</strong>
            <span>{groundTruth.facts.length} spoken facts loaded</span>
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
          <div className="component-count">{completedComponents} / {FIRSTNET_COMPONENTS.length} components pasted</div>
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
                <div className="progress-track"><div style={{ width: `${Math.min(progressPercent, 100)}%` }} /></div>
              )}
              <span>First use may take longer while the local model is downloaded.</span>
            </div>
          )}

          <button className="primary-button validate-button" onClick={validate} disabled={isValidating}>
            {isValidating ? "Analysing locally…" : "Find potential discrepancies"}
          </button>
        </div>
      </section>

      {analysis && (
        <ReviewPanel
          analysis={analysis}
          decisions={decisions}
          reviewedCount={reviewedCount}
          approvedFindings={approvedFindings}
          onDecision={setDecision}
        />
      )}
    </main>
  );
}

function ReviewPanel({ analysis, decisions, reviewedCount, approvedFindings, onDecision }: {
  analysis: Level1Analysis;
  decisions: Record<string, ReviewDecision>;
  reviewedCount: number;
  approvedFindings: ValidationFinding[];
  onDecision: (candidate: ReviewCandidate, decision: ReviewDecision) => void;
}) {
  return (
    <>
      <section className="panel review-panel">
        <div className="eyebrow">3 · Human review</div>
        <h2>Review potential discrepancies</h2>
        <p className="section-intro">
          These are screening suggestions, not final findings. Review the source and AVT wording,
          then mark No issue or approve a discrepancy category.
        </p>

        <div className="finding-stats">
          <div><strong>{analysis.sourceFacts}</strong><span>Source facts</span></div>
          <div><strong>{analysis.likelyCaptured}</strong><span>Likely captured</span></div>
          <div><strong>{analysis.candidates.length}</strong><span>Needs review</span></div>
        </div>

        <div className="review-progress-line">Reviewed {reviewedCount} of {analysis.candidates.length}</div>

        {analysis.candidates.length === 0 ? (
          <div className="empty-state">No potential discrepancies were detected by the Level 1 screen.</div>
        ) : (
          <div className="candidate-list">
            {analysis.candidates.map((candidate, index) => (
              <CandidateCard key={candidate.id} candidate={candidate} number={index + 1} decision={decisions[candidate.id] ?? { status: "pending" }} onDecision={onDecision} />
            ))}
          </div>
        )}
      </section>

      <section className="panel findings-panel">
        <div className="eyebrow">4 · Approved findings</div>
        <h2>Human-approved findings</h2>
        <p className="section-intro">Only items you approve appear in this table.</p>
        {approvedFindings.length === 0 ? (
          <div className="empty-state">No discrepancies have been approved yet.</div>
        ) : (
          <div className="findings-table-wrap">
            <table className="findings-table">
              <thead><tr><th>Component</th><th>Category</th><th>AVT documented</th><th>Source says</th><th>Description</th></tr></thead>
              <tbody>
                {approvedFindings.map((finding) => (
                  <tr key={finding.id}>
                    <td>{finding.component}</td>
                    <td><span className="category-pill">{finding.category}</span></td>
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
    </>
  );
}

function CandidateCard({ candidate, number, decision, onDecision }: {
  candidate: ReviewCandidate;
  number: number;
  decision: ReviewDecision;
  onDecision: (candidate: ReviewCandidate, decision: ReviewDecision) => void;
}) {
  const category = decision.category ?? candidate.suggestedCategory ?? "Omission";
  return (
    <article className={`candidate-card ${decision.status !== "pending" ? `reviewed ${decision.status}` : ""}`}>
      <div className="candidate-header">
        <div><span className="candidate-number">{number}</span><strong>{candidate.component}</strong></div>
        {typeof candidate.similarity === "number" && <span className="similarity">semantic match {Math.round(candidate.similarity * 100)}%</span>}
      </div>
      <div className="signal-row">{candidate.signals.map((signal) => <span key={signal}>{signal}</span>)}</div>
      <div className="comparison-grid">
        <div><span className="comparison-label">Source</span><p>{candidate.sourceText || "No close source fact found."}</p></div>
        <div><span className="comparison-label">AVT</span><p>{candidate.avtText || "No close AVT wording found."}</p></div>
      </div>
      <div className="review-controls">
        <button className={`review-choice ${decision.status === "no-issue" ? "active" : ""}`} onClick={() => onDecision(candidate, { status: "no-issue" })}>No issue</button>
        <select className="category-select" value={category} onChange={(event) => onDecision(candidate, { status: decision.status === "approved" ? "approved" : "pending", category: event.target.value as ValidationCategory })}>
          {VALIDATION_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button className={`review-choice approve ${decision.status === "approved" ? "active" : ""}`} onClick={() => onDecision(candidate, { status: "approved", category })}>Approve finding</button>
      </div>
    </article>
  );
}

function candidateToFinding(candidate: ReviewCandidate, category: ValidationCategory, index: number): ValidationFinding {
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
    case "Omission": return candidate.sourceText ? `Omitted: ${stripStop(candidate.sourceText)}.` : "Source content omitted.";
    case "Duplication": return "Same content duplicated in the AVT record.";
    case "Over-simplification": return "Source detail or qualifier was reduced in the AVT record.";
    case "Misattribution": return "Finding attributed to the wrong speaker or person.";
    case "Misclassification": return "Correct content documented under the wrong component.";
    case "Addition (not in script)": return "Unsupported content; not stated in the source.";
    case "Clinical Decision Support / Inference": return "Clinically inferred from the source information but not stated explicitly.";
    case "Extraneous Content": return "Non-clinical text included in the clinical component.";
    case "Observation (not an app defect)": return "Source-script or workflow issue rather than an app defect.";
  }
}

function stripStop(value: string) { return value.trim().replace(/[.!?]+$/, ""); }
function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
