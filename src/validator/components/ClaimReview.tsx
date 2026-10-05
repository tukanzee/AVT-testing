import EvidencePanel from "./EvidencePanel";
import TranscriptContextViewer from "./TranscriptContextViewer";
import { CATEGORY_DEFINITIONS } from "../rules";
import { VALIDATION_CATEGORIES, type ValidationCategory } from "../types";
import type { AVTClaim, EvidenceMatch, TranscriptEvidenceChunk, ValidationDecision } from "../workflowTypes";

type Props = {
  claim: AVTClaim;
  candidates: EvidenceMatch[];
  chunks: TranscriptEvidenceChunk[];
  decision?: ValidationDecision;
  position: number;
  total: number;
  reviewTotal?: number;
  reviewed: number;
  onDecision: (decision: ValidationDecision) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleCategory: (category: ValidationCategory) => void;
  onToggleSupported: () => void;
  onSkip: () => void;
};

export default function ClaimReview(props: Props) {
  const reviewTotal = props.reviewTotal ?? props.total;
  const selectedChunkIds = props.decision?.transcriptChunkIds ?? [];
  const bestEvidenceId = props.candidates[0]?.transcriptChunkId;

  const update = (change: Partial<ValidationDecision>) => props.onDecision({
    claimId: props.claim.id,
    reviewed: props.decision?.reviewed ?? false,
    correctSupported: props.decision?.correctSupported ?? false,
    categories: props.decision?.categories ?? [],
    comment: props.decision?.comment ?? "",
    transcriptChunkIds: selectedChunkIds,
    ...props.decision,
    ...change
  });

  const toggleEvidence = (id: string) => {
    const nextIds = selectedChunkIds.includes(id)
      ? selectedChunkIds.filter((value) => value !== id)
      : [...selectedChunkIds, id];
    const remainsSupported = Boolean(props.decision?.correctSupported && nextIds.length);
    update({
      transcriptChunkIds: nextIds,
      correctSupported: remainsSupported,
      reviewed: remainsSupported || (props.decision?.categories.length ?? 0) > 0
    });
  };

  const positionProgress = Math.round(props.position / Math.max(1, props.total) * 100);

  return (
    <section className="panel focused-comparison">
      <div className="review-progress-line">
        <strong>AVT claims reviewed: {props.reviewed} / {reviewTotal}</strong>
        <span>Claim {props.position} of {props.total}</span>
      </div>
      <div className="comparison-progress" aria-label={`Claim ${props.position} of ${props.total}`}>
        <div style={{ width: `${positionProgress}%` }} />
      </div>

      <div className="claim-review-columns">
        <EvidencePanel
          candidates={props.candidates}
          chunks={props.chunks}
          claim={props.claim}
          selectedChunkIds={selectedChunkIds}
          onToggleEvidence={toggleEvidence}
        />

        <div className="claim-panel">
          <span className="comparison-label">AVT claim</span>
          <h3>{props.claim.text}</h3>
          <span className="section-chip">{props.claim.section}</span>
          <details><summary>Original sentence</summary><p>{props.claim.originalSentence}</p></details>

          <TranscriptContextViewer
            chunks={props.chunks}
            currentUnitId={bestEvidenceId}
            linkedUnitIds={selectedChunkIds}
            onToggleEvidence={toggleEvidence}
            compact
          />

          <div className="linked-evidence-summary">
            <h4>Linked evidence</h4>
            {selectedChunkIds.length ? selectedChunkIds.map((id) => {
              const unit = props.chunks.find((chunk) => chunk.id === id);
              return <div className="linked-evidence-chip" key={id}>
                <span>
                  <strong>✓ {id}</strong>
                  {unit && <small>{unit.text}</small>}
                </span>
                <button aria-label={`Unlink ${id}`} onClick={() => toggleEvidence(id)}>×</button>
              </div>;
            }) : <p className="muted-copy">No evidence linked.</p>}
          </div>
        </div>

        <div className="verdict-panel">
          <span className="comparison-label">Human review · {props.decision?.reviewed ? "Reviewed" : "UNREVIEWED"}</span>
          <button className={`supported-outcome ${props.decision?.correctSupported ? "active" : ""}`} disabled={!selectedChunkIds.length} onClick={props.onToggleSupported}>✓ Correct / supported</button>
          <div className="taxonomy-heading"><strong>Finding categories</strong><span>Keys 1–9 toggle</span></div>
          <div className="taxonomy-options">
            {VALIDATION_CATEGORIES.map((category, index) => <button
              key={category}
              data-category={index + 1}
              className={props.decision?.categories?.includes(category) ? "active" : ""}
              onClick={() => props.onToggleCategory(category)}
              title={CATEGORY_DEFINITIONS[category]}
            >
              <kbd>{index + 1}</kbd>
              <span><strong>{shortCategory(category)}</strong><small>{CATEGORY_DEFINITIONS[category]}</small></span>
            </button>)}
          </div>
          <button
            className="primary-button review-action"
            disabled={!props.decision?.categories?.length}
            onClick={() => update({ reviewed: true, correctSupported: false })}
          >
            Save finding
          </button>
          <label className="comment-label">Reviewer comment<textarea rows={4} value={props.decision?.comment ?? ""} onChange={(event) => update({ comment: event.target.value })} /></label>
          <button className="secondary-button skip-button" onClick={props.onSkip}>Skip / come back later</button>
        </div>
      </div>

      <div className="focus-navigation">
        <button className="secondary-button" onClick={props.onPrevious} disabled={props.position === 1}>← Previous</button>
        <button className="secondary-button" onClick={props.onNext} disabled={props.position === props.total}>Next →</button>
      </div>
    </section>
  );
}

function shortCategory(category: ValidationCategory) {
  if (category === "Addition (not in script)") return "Addition";
  if (category === "Observation (not an app defect)") return "Observation — not an app defect";
  return category;
}
