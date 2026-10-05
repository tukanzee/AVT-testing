import { Fragment, useMemo, useState } from "react";
import { CATEGORY_DEFINITIONS } from "../rules";
import { VALIDATION_CATEGORIES, type ValidationCategory } from "../types";
import type { AVTClaim, OmissionCandidate, OmissionDecision, TranscriptAVTMatch, TranscriptEvidenceChunk } from "../workflowTypes";
import { lexicalSearchScore } from "../matching/lexicalSearch";
import TranscriptContextViewer from "./TranscriptContextViewer";

type Props = {
  candidate: OmissionCandidate;
  claims: AVTClaim[];
  chunks: TranscriptEvidenceChunk[];
  decision?: OmissionDecision;
  position: number;
  total: number;
  remainingTotal?: number;
  reviewed: number;
  onDecision: (decision: OmissionDecision) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
};

export default function OmissionReview(props: Props) {
  const remainingTotal = props.remainingTotal ?? props.total;
  const [search, setSearch] = useState("");
  const selectedClaimId = props.decision?.avtClaimId;
  const suggestedClaim = props.claims.find((claim) => claim.id === props.candidate.bestAvtClaimId);
  const selectedClaim = props.claims.find((claim) => claim.id === selectedClaimId);
  const selectedMatch = props.candidate.matches.find((match) => match.avtClaimId === selectedClaimId);
  const searchResults = useMemo(() => searchClaims(props.claims, search), [props.claims, search]);
  const queueProgress = Math.min(100, Math.round(props.position / Math.max(1, props.total) * 100));

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

  const selectOrClearClaim = (claimId?: string) => {
    const nextClaimId = claimId && claimId !== selectedClaimId ? claimId : undefined;
    const hasSavedFinding = Boolean(props.decision?.reviewed && (props.decision.categories?.length ?? 0) > 0);
    const keepIrrelevant = Boolean(!nextClaimId && props.decision?.reviewed && props.decision?.irrelevant);

    update({
      avtClaimId: nextClaimId,
      correctSupported: false,
      irrelevant: nextClaimId ? false : (props.decision?.irrelevant ?? false),
      reviewed: hasSavedFinding || keepIrrelevant
    });
  };

  const toggleCategory = (category: ValidationCategory) => {
    const categories = props.decision?.categories ?? [];
    const nextCategories = categories.includes(category)
      ? categories.filter((item) => item !== category)
      : [...categories, category];
    update({
      correctSupported: false,
      reviewed: Boolean(props.decision?.reviewed && nextCategories.length > 0),
      irrelevant: false,
      categories: nextCategories
    });
  };

  return (
    <section className="panel focused-comparison">
      <div className="review-progress-line">
        <strong>Residual items reviewed: {props.reviewed} · Remaining: {remainingTotal}</strong>
        <span>Candidate {props.position} of {props.total}</span>
      </div>
      <div className="comparison-progress" aria-label={`Residual candidate ${props.position} of ${props.total}`}>
        <div style={{ width: `${queueProgress}%` }} />
      </div>

      <div className="omission-columns">
        <div>
          <span className="comparison-label">Transcript comparison unit</span>

          <article className="current-comparison-summary">
            <div className="unit-heading">
              <strong>Current transcript claim</strong>
              <span>lines {props.candidate.startLine}–{props.candidate.endLine}</span>
            </div>
            <p>{props.candidate.transcriptText}</p>
          </article>

          <div className="residual-avt-evidence">
            <span className="comparison-label">Possible AVT evidence</span>

            {suggestedClaim ? (
              <button
                className={`suggested-match-card primary-suggested-match ${suggestedClaim.id === selectedClaimId ? "selected-evidence" : ""}`}
                onClick={() => selectOrClearClaim(suggestedClaim.id)}
                aria-pressed={suggestedClaim.id === selectedClaimId}
              >
                <strong>{suggestedClaim.text}</strong>
                <span>{suggestedClaim.section}</span>
                <small>
                  {matchStrength(props.candidate.matches[0])}
                  {suggestedClaim.id === selectedClaimId ? " · Selected — click to clear" : " · Click to select"}
                </small>
              </button>
            ) : (
              <p className="no-plausible-match">No strong AVT evidence found.</p>
            )}

            {props.candidate.matches.length > 0 && (
              <div className="other-evidence residual-other-evidence">
                <h4>Other possible AVT matches</h4>
                {props.candidate.matches
                  .filter((match) => match.avtClaimId !== suggestedClaim?.id)
                  .map((match) => (
                    <button
                      key={match.avtClaimId}
                      className={match.avtClaimId === selectedClaimId ? "selected-evidence" : ""}
                      onClick={() => selectOrClearClaim(match.avtClaimId)}
                      aria-pressed={match.avtClaimId === selectedClaimId}
                    >
                      <strong>{match.avtSection}</strong>
                      <span>{match.avtClaimText}</span>
                      <small>
                        {matchStrength(match)}
                        {match.avtClaimId === selectedClaimId ? " · Selected — click to clear" : " · Select possible evidence"}
                      </small>
                    </button>
                  ))}
              </div>
            )}

            <div className="manual-search">
              <h4>Search AVT</h4>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Type part of a word or phrase…"
              />
              <div>
                {searchResults.map((claim) => (
                  <button
                    key={claim.id}
                    className={claim.id === selectedClaimId ? "selected-evidence" : ""}
                    onClick={() => selectOrClearClaim(claim.id)}
                    aria-pressed={claim.id === selectedClaimId}
                  >
                    <strong>{claim.section}</strong>
                    <span>{highlightText(claim.text, search)}</span>
                    <small>{claim.id === selectedClaimId ? "Selected — click to clear" : "Select for review"}</small>
                  </button>
                ))}
              </div>
              {search.trim() && !searchResults.length && <p className="muted-copy">No AVT search results.</p>}
            </div>
          </div>
        </div>

        <div>
          <span className="comparison-label">AVT claim + transcript context</span>

          {selectedClaim ? (
            <>
              <article className="current-avt-comparison selected-evidence">
                <div className="selected-match-heading">
                  <strong>Selected AVT match</strong>
                  <button className="compact-button" onClick={() => selectOrClearClaim(selectedClaim.id)}>
                    Clear match
                  </button>
                </div>
                <strong>{selectedClaim.text}</strong>
                <span className="section-chip">{selectedClaim.section}</span>
              </article>
              {selectedMatch && <MatchDetails match={selectedMatch} />}
            </>
          ) : suggestedClaim ? (
            <article className="current-avt-comparison suggested-avt-summary">
              <span className="comparison-label">Suggested AVT match</span>
              <strong>{suggestedClaim.text}</strong>
              <span className="section-chip">{suggestedClaim.section}</span>
              <small>{matchStrength(props.candidate.matches[0])} · suggestion only</small>
            </article>
          ) : (
            <p className="no-plausible-match">No AVT match selected.</p>
          )}

          <div className="residual-transcript-viewer">
            <TranscriptContextViewer
              chunks={props.chunks}
              currentUnitId={props.candidate.transcriptChunkId}
            />
          </div>
        </div>

        <div className="verdict-panel">
          <span className="comparison-label">Human review · {props.decision?.reviewed ? "Reviewed" : "UNREVIEWED"}</span>
          <button className={`supported-outcome ${props.decision?.correctSupported ? "active" : ""}`} disabled={!selectedClaimId} onClick={() => update({ correctSupported: true, irrelevant: false, categories: [], reviewed: true })}>Actually covered elsewhere in AVT — confirm link</button>
          <button className="secondary-button review-action" onClick={() => update({ irrelevant: true, correctSupported: false, categories: [], reviewed: true })}>Irrelevant / does not need documenting</button>
          <div className="taxonomy-heading"><strong>Finding categories</strong><span>Keys 1–9 toggle</span></div>
          <div className="taxonomy-options">
            {VALIDATION_CATEGORIES.map((category, index) => {
              const active = props.decision?.categories.includes(category) ?? false;
              return <button key={category} data-category={index + 1} className={active ? "active" : ""} onClick={() => toggleCategory(category)} title={CATEGORY_DEFINITIONS[category]}>
                <kbd>{index + 1}</kbd>
                <span><strong>{shortCategory(category)}</strong><small>{CATEGORY_DEFINITIONS[category]}</small></span>
              </button>;
            })}
          </div>
          <button className="primary-button" disabled={!props.decision?.categories.length} onClick={() => update({ reviewed: true, irrelevant: false, correctSupported: false })}>Save relevant / finding</button>
          <label className="comment-label">Reviewer comment<textarea rows={3} value={props.decision?.comment ?? ""} onChange={(event) => update({ comment: event.target.value })} /></label>
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

function matchStrength(match?: TranscriptAVTMatch) {
  if (!match) return "No strong match";
  if (match.exactPhraseOverlap || (match.entailment ?? 0) >= .58) return "Strong match";
  return "Possible match";
}

function MatchDetails({ match }: { match: TranscriptAVTMatch }) {
  const questionVsPlan = match.statementType === "clinician_question" && match.avtSection === "Plan and Requested Actions";
  return <div className="match-details">
    {questionVsPlan && <div className="evidence-warning">Possible history / plan mismatch</div>}
    {(match.contradiction ?? 0) >= .45 && <div className="evidence-warning">Possible contradiction</div>}
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
  return text.split(pattern).map((part, index) => terms.some((term) => part.toLowerCase().startsWith(term.toLowerCase())) ? <mark key={index}>{part}</mark> : <Fragment key={index}>{part}</Fragment>);
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
