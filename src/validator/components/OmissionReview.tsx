import { Fragment, useMemo, useState } from "react";
import { CATEGORY_DEFINITIONS } from "../rules";
import { VALIDATION_CATEGORIES, type ValidationCategory } from "../types";
import type { AVTClaim, OmissionCandidate, OmissionDecision, TranscriptAVTMatch } from "../workflowTypes";
import { lexicalSearchScore } from "../matching/lexicalSearch";

type Props = {
  candidate: OmissionCandidate;
  claims: AVTClaim[];
  decision?: OmissionDecision;
  position: number;
  total: number;
  reviewed: number;
  onDecision: (decision: OmissionDecision) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export default function OmissionReview(props: Props) {
  const [search, setSearch] = useState("");
  const selectedClaimId = props.decision?.avtClaimId ?? props.candidate.bestAvtClaimId;
  const selectedClaim = props.claims.find((claim) => claim.id === selectedClaimId);
  const selectedMatch = props.candidate.matches.find((match) => match.avtClaimId === selectedClaimId);
  const searchResults = useMemo(() => searchClaims(props.claims, search), [props.claims, search]);

  const update = (change: Partial<OmissionDecision>) => props.onDecision({
    itemId: props.candidate.itemId,
    reviewed: props.decision?.reviewed ?? false,
    correctSupported: props.decision?.correctSupported ?? false,
    categories: props.decision?.categories ?? [],
    comment: props.decision?.comment ?? "",
    avtClaimId: selectedClaimId,
    ...props.decision,
    ...change
  });

  const toggleCategory = (category: ValidationCategory) => {
    const categories = props.decision?.categories ?? [];
    const nextCategories = categories.includes(category)
      ? categories.filter((item) => item !== category)
      : [...categories, category];
    update({
      correctSupported: false,
      reviewed: nextCategories.length > 0,
      categories: nextCategories
    });
  };

  return (
    <section className="panel focused-comparison">
      <div className="review-progress-line"><strong>Possible omissions reviewed: {props.reviewed} / {props.total}</strong><span>Candidate {props.position} of {props.total}</span></div>
      <div className="comparison-progress"><div style={{ width: `${Math.round(props.reviewed / Math.max(1, props.total) * 100)}%` }} /></div>
      <div className="omission-columns">
        <div>
          <span className="comparison-label">Transcript comparison unit</span>
          <p className="primary-evidence">{props.candidate.transcriptText}</p>
          <div className="retrieval-meta">Transcript lines {props.candidate.startLine}–{props.candidate.endLine}</div>
          {(props.candidate.originalTurnText || props.candidate.contextText) && <details className="source-context"><summary>Original turn and context</summary><p>{props.candidate.originalTurnText}</p>{props.candidate.contextText && <small>{props.candidate.contextText}</small>}</details>}
        </div>

        <div>
          <span className="comparison-label">Best AVT match</span>
          {selectedClaim ? <>
            <p>{selectedClaim.text}</p><span className="section-chip">{selectedClaim.section}</span>
            {selectedMatch && <MatchDetails match={selectedMatch} />}
          </> : <p className="no-plausible-match">No plausible AVT match found</p>}

          {props.candidate.matches.length > 1 && <details className="other-evidence">
            <summary>Other candidate AVT matches</summary>
            {props.candidate.matches.filter((match) => match.avtClaimId !== selectedClaimId).map((match) => (
              <button key={match.avtClaimId} onClick={() => update({ avtClaimId: match.avtClaimId })}>
                <strong>{match.avtSection}</strong><span>{match.avtClaimText}</span><small>Retrieval similarity: {match.semanticSimilarity.toFixed(3)}</small>
              </button>
            ))}
          </details>}

          <details className="manual-search">
            <summary>Search AVT</summary>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="insulin, 20s, catheter…" />
            <div>{searchResults.map((claim) => <button key={claim.id} onClick={() => update({ avtClaimId: claim.id })}><strong>{claim.section}</strong><span>{highlightText(claim.text, search)}</span></button>)}</div>
          </details>
        </div>

        <div className="verdict-panel">
          <span className="comparison-label">Human review</span>
          <button className={`supported-outcome ${props.decision?.correctSupported ? "active" : ""}`} onClick={() => update({ correctSupported: !props.decision?.correctSupported, categories: [], reviewed: !props.decision?.correctSupported })}>✓ Correct / supported</button>
          <div className="taxonomy-heading"><strong>Finding categories</strong><span>Keys 1–9 toggle</span></div>
          <div className="taxonomy-options">
            {VALIDATION_CATEGORIES.map((category, index) => {
              const active = props.decision?.categories.includes(category) ?? false;
              return <button key={category} className={active ? "active" : ""} onClick={() => toggleCategory(category)} title={CATEGORY_DEFINITIONS[category]}><kbd>{index + 1}</kbd><span><strong>{shortCategory(category)}</strong><small>{CATEGORY_DEFINITIONS[category]}</small></span></button>;
            })}
          </div>
          <label className="comment-label">Reviewer comment<textarea rows={3} value={props.decision?.comment ?? ""} onChange={(event) => update({ comment: event.target.value })} /></label>
        </div>
      </div>
      <div className="focus-navigation"><button className="secondary-button" onClick={props.onPrevious} disabled={props.position === 1}>← Previous</button><button className="secondary-button" onClick={props.onNext} disabled={props.position === props.total}>Next →</button></div>
    </section>
  );
}

function MatchDetails({ match }: { match: TranscriptAVTMatch }) {
  const questionVsPlan = match.statementType === "clinician_question" && match.avtSection === "Plan and Requested Actions";
  return <div className="match-details">
    <span>Retrieval similarity: {match.semanticSimilarity.toFixed(3)}</span>
    {typeof match.entailment === "number" && <details className="matching-details"><summary>{questionVsPlan ? "⚠ Question is not evidence of a plan action" : match.entailment >= 0.58 && (match.contradiction ?? 0) < 0.25 && !match.negationWarning && match.conflictingNumbers.length === 0 ? "✓ Likely same meaning" : (match.contradiction ?? 0) >= 0.45 || match.negationWarning || match.conflictingNumbers.length > 0 ? "⚠ Meaning may differ" : (match.neutral ?? 0) >= 0.6 ? "? Weak / unrelated match" : "? Review meaning"}</summary><small>Local NLI relationship scores: entailment {match.entailment.toFixed(2)}, contradiction {(match.contradiction ?? 0).toFixed(2)}, neutral {(match.neutral ?? 0).toFixed(2)}. Assistive only.</small></details>}
    {match.conflictingNumbers.map((item, index) => <div className="evidence-warning" key={`${item.transcript}-${item.avt}-${index}`}>⚠ Possible numerical discrepancy — transcript: {item.transcript}; AVT: {item.avt}</div>)}
    {match.negationWarning && <div className="evidence-warning">⚠ Possible negation discrepancy</div>}
  </div>;
}

function searchClaims(claims: AVTClaim[], query: string) {
  if (!query.trim()) return [];
  return claims.map((claim) => ({ claim, score: lexicalSearchScore(query, claim.text).score }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ claim }) => claim);
}

function highlightText(text: string, query: string) {
  const terms = query.match(/[a-z0-9]+/gi) ?? [];
  if (!terms.length) return text;
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return text.split(pattern).map((part, index) => terms.some((term) => term.toLowerCase() === part.toLowerCase()) ? <mark key={index}>{part}</mark> : <Fragment key={index}>{part}</Fragment>);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shortCategory(category: ValidationCategory) {
  if (category === "Addition (not in script)") return "Addition";
  if (category === "Clinical Decision Support / Inference") return "Clinical Decision Support / Inference";
  if (category === "Observation (not an app defect)") return "Observation — not an app defect";
  return category;
}
