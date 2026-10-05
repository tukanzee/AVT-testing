import EvidencePanel from "./EvidencePanel";
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
  reviewed: number;
  onDecision: (decision: ValidationDecision) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleCategory: (category: ValidationCategory) => void;
  onToggleSupported: () => void;
};

export default function ClaimReview(props: Props) {
  const selectedChunkId = props.decision?.transcriptChunkId ?? props.candidates[0]?.transcriptChunkId;
  const update = (change: Partial<ValidationDecision>) => props.onDecision({
    claimId: props.claim.id,
    reviewed: props.decision?.reviewed ?? false,
    correctSupported: props.decision?.correctSupported ?? false,
    categories: props.decision?.categories ?? [],
    comment: props.decision?.comment ?? "",
    transcriptChunkId: selectedChunkId,
    ...props.decision,
    ...change
  });

  return (
    <section className="panel focused-comparison">
      <div className="review-progress-line"><strong>AVT claims reviewed: {props.reviewed} / {props.total}</strong><span>Claim {props.position} of {props.total}</span></div>
      <div className="comparison-progress"><div style={{ width: `${Math.round(props.reviewed / Math.max(1, props.total) * 100)}%` }} /></div>
      <div className="claim-review-columns">
        <EvidencePanel candidates={props.candidates} chunks={props.chunks} claimSection={props.claim.section} selectedChunkId={selectedChunkId} onSelect={(transcriptChunkId) => update({ transcriptChunkId })} />
        <div className="claim-panel"><span className="comparison-label">AVT claim</span><h3>{props.claim.text}</h3><span className="section-chip">{props.claim.section}</span><details><summary>Original sentence</summary><p>{props.claim.originalSentence}</p></details></div>
        <div className="verdict-panel">
          <span className="comparison-label">Human review</span>
          <button className={`supported-outcome ${props.decision?.correctSupported ? "active" : ""}`} onClick={props.onToggleSupported}>✓ Correct / supported</button>
          <div className="taxonomy-heading"><strong>Finding categories</strong><span>Keys 1–9 toggle</span></div>
          <div className="taxonomy-options">{VALIDATION_CATEGORIES.map((category, index) => <button key={category} className={props.decision?.categories?.includes(category) ? "active" : ""} onClick={() => props.onToggleCategory(category)} title={CATEGORY_DEFINITIONS[category]}><kbd>{index + 1}</kbd><span><strong>{shortCategory(category)}</strong><small>{CATEGORY_DEFINITIONS[category]}</small></span></button>)}</div>
          <label className="comment-label">Reviewer comment<textarea rows={4} value={props.decision?.comment ?? ""} onChange={(event) => update({ comment: event.target.value })} /></label>
        </div>
      </div>
      <div className="focus-navigation"><button className="secondary-button" onClick={props.onPrevious} disabled={props.position === 1}>← Previous</button><button className="secondary-button" onClick={props.onNext} disabled={props.position === props.total}>Next →</button></div>
    </section>
  );
}

function shortCategory(category: ValidationCategory) {
  if (category === "Addition (not in script)") return "Addition";
  if (category === "Observation (not an app defect)") return "Observation — not an app defect";
  return category;
}
