import { Fragment, useMemo, useState } from "react";
import { CATEGORY_DEFINITIONS } from "../rules";
import { VALIDATION_CATEGORIES, type ValidationCategory } from "../types";
import type {
  AVTClaim,
  OmissionCandidate,
  OmissionDecision,
  TranscriptAVTMatch,
  TranscriptEvidenceChunk
} from "../workflowTypes";
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
  onReviewedAction: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
};

export default function OmissionReview(props: Props) {
  const remainingTotal = props.remainingTotal ?? props.total;
  const [search, setSearch] = useState("");

  const selectedClaimIds = useMemo(() => {
    if (props.decision?.avtClaimIds?.length) return props.decision.avtClaimIds;
    return props.decision?.avtClaimId ? [props.decision.avtClaimId] : [];
  }, [props.decision?.avtClaimIds, props.decision?.avtClaimId]);

  const linkedUnitIds = props.decision?.transcriptChunkIds ?? [];
  const suggestedClaim = props.claims.find(
    (claim) => claim.id === props.candidate.bestAvtClaimId
  );
  const selectedClaims = props.claims.filter((claim) =>
    selectedClaimIds.includes(claim.id)
  );

  const searchResults = useMemo(
    () => searchClaims(props.claims, search),
    [props.claims, search]
  );

  const queueProgress = Math.min(
    100,
    Math.round((props.position / Math.max(1, props.total)) * 100)
  );

  const update = (change: Partial<OmissionDecision>) =>
    props.onDecision({
      itemId: props.candidate.itemId,
      reviewed: props.decision?.reviewed ?? false,
      correctSupported: props.decision?.correctSupported ?? false,
      categories: props.decision?.categories ?? [],
      comment: props.decision?.comment ?? "",
      avtClaimId: selectedClaimIds[0],
      avtClaimIds: selectedClaimIds,
      transcriptChunkIds: linkedUnitIds,
      ...props.decision,
      ...change
    });

  const toggleClaim = (claimId: string) => {
    const nextClaimIds = selectedClaimIds.includes(claimId)
      ? selectedClaimIds.filter((id) => id !== claimId)
      : [...selectedClaimIds, claimId];

    const hasSavedFinding = Boolean(
      props.decision?.reviewed && (props.decision.categories?.length ?? 0) > 0
    );
    const keepIrrelevant = Boolean(
      !nextClaimIds.length &&
        props.decision?.reviewed &&
        props.decision?.irrelevant
    );

    update({
      avtClaimIds: nextClaimIds,
      avtClaimId: nextClaimIds[0],
      correctSupported: false,
      irrelevant: nextClaimIds.length
        ? false
        : props.decision?.irrelevant ?? false,
      reviewed: hasSavedFinding || keepIrrelevant
    });
  };

  const toggleTranscriptEvidence = (unitId: string) => {
    const nextUnitIds = linkedUnitIds.includes(unitId)
      ? linkedUnitIds.filter((id) => id !== unitId)
      : [...linkedUnitIds, unitId];

    update({
      transcriptChunkIds: nextUnitIds,
      correctSupported: false
    });
  };

  const toggleCategory = (category: ValidationCategory) => {
    const categories = props.decision?.categories ?? [];
    const nextCategories = categories.includes(category)
      ? categories.filter((item) => item !== category)
      : [...categories, category];

    update({
      correctSupported: false,
      reviewed: Boolean(
        props.decision?.reviewed && nextCategories.length > 0
      ),
      irrelevant: false,
      categories: nextCategories
    });
  };

  const confirmCovered = () => {
    const claimIdsToConfirm = selectedClaimIds.length
      ? selectedClaimIds
      : suggestedClaim
        ? [suggestedClaim.id]
        : [];

    if (!claimIdsToConfirm.length) return;

    const confirmedUnitIds = Array.from(
      new Set([props.candidate.transcriptChunkId, ...linkedUnitIds])
    );

    update({
      avtClaimIds: claimIdsToConfirm,
      avtClaimId: claimIdsToConfirm[0],
      transcriptChunkIds: confirmedUnitIds,
      correctSupported: true,
      irrelevant: false,
      categories: [],
      reviewed: true
    });
    props.onReviewedAction();
  };

  return (
    <section className="panel focused-comparison">
      <div className="review-progress-line">
        <strong>
          Residual items reviewed: {props.reviewed} · Remaining: {remainingTotal}
        </strong>
        <span>
          Candidate {props.position} of {props.total}
        </span>
      </div>

      <div
        className="comparison-progress"
        aria-label={`Residual candidate ${props.position} of ${props.total}`}
      >
        <div style={{ width: `${queueProgress}%` }} />
      </div>

      <div className="omission-columns">
        <div>
          <span className="comparison-label">Transcript comparison unit</span>

          <article className="current-comparison-summary">
            <div className="unit-heading">
              <strong>Current transcript claim</strong>
              <span>
                lines {props.candidate.startLine}–{props.candidate.endLine}
              </span>
            </div>
            <p>{props.candidate.transcriptText}</p>
          </article>

          <div className="residual-avt-evidence">
            <span className="comparison-label">Possible AVT evidence</span>

            {suggestedClaim ? (
              <button
                className={`suggested-match-card primary-suggested-match ${
                  selectedClaimIds.includes(suggestedClaim.id)
                    ? "selected-evidence"
                    : ""
                }`}
                onClick={() => toggleClaim(suggestedClaim.id)}
                aria-pressed={selectedClaimIds.includes(suggestedClaim.id)}
              >
                <strong>{suggestedClaim.text}</strong>
                <span>{suggestedClaim.section}</span>
                <small>
                  {matchStrength(props.candidate.matches[0])}
                  {selectedClaimIds.includes(suggestedClaim.id)
                    ? " · Selected — click to clear"
                    : " · Click to select"}
                </small>
              </button>
            ) : (
              <p className="no-plausible-match">
                No strong AVT evidence found.
              </p>
            )}

            {props.candidate.matches.length > 0 && (
              <div className="other-evidence residual-other-evidence">
                <h4>Other possible AVT matches</h4>

                {props.candidate.matches
                  .filter((match) => match.avtClaimId !== suggestedClaim?.id)
                  .map((match) => {
                    const selected = selectedClaimIds.includes(match.avtClaimId);

                    return (
                      <button
                        key={match.avtClaimId}
                        className={selected ? "selected-evidence" : ""}
                        onClick={() => toggleClaim(match.avtClaimId)}
                        aria-pressed={selected}
                      >
                        <strong>{match.avtSection}</strong>
                        <span>{match.avtClaimText}</span>
                        <small>
                          {matchStrength(match)}
                          {selected
                            ? " · Selected — click to clear"
                            : " · Select possible evidence"}
                        </small>
                      </button>
                    );
                  })}
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
                {searchResults.map((claim) => {
                  const selected = selectedClaimIds.includes(claim.id);

                  return (
                    <button
                      key={claim.id}
                      className={selected ? "selected-evidence" : ""}
                      onClick={() => toggleClaim(claim.id)}
                      aria-pressed={selected}
                    >
                      <strong>{claim.section}</strong>
                      <span>{highlightText(claim.text, search)}</span>
                      <small>
                        {selected
                          ? "Selected — click to clear"
                          : "Select as AVT evidence"}
                      </small>
                    </button>
                  );
                })}
              </div>

              {search.trim() && !searchResults.length && (
                <p className="muted-copy">No AVT search results.</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <span className="comparison-label">AVT claim + transcript context</span>

          {selectedClaims.length > 0 ? (
            <div className="selected-avt-evidence-list" style={{ display: "grid", gap: 10 }}>
              <div className="selected-match-heading">
                <strong>Selected AVT evidence ({selectedClaims.length})</strong>
                <button
                  className="compact-button"
                  onClick={() =>
                    update({
                      avtClaimIds: [],
                      avtClaimId: undefined,
                      correctSupported: false
                    })
                  }
                >
                  Clear all
                </button>
              </div>

              {selectedClaims.map((claim) => {
                const match = props.candidate.matches.find(
                  (item) => item.avtClaimId === claim.id
                );

                return (
                  <article
                    className="current-avt-comparison selected-evidence"
                    key={claim.id}
                  >
                    <div className="selected-match-heading">
                      <strong>{claim.text}</strong>
                      <button
                        className="compact-button"
                        onClick={() => toggleClaim(claim.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <span className="section-chip">{claim.section}</span>
                    {match && <MatchDetails match={match} />}
                  </article>
                );
              })}
            </div>
          ) : suggestedClaim ? (
            <article className="current-avt-comparison suggested-avt-summary">
              <span className="comparison-label">Suggested AVT match</span>
              <strong>{suggestedClaim.text}</strong>
              <span className="section-chip">{suggestedClaim.section}</span>
              <small>
                {matchStrength(props.candidate.matches[0])} · suggestion only
              </small>
            </article>
          ) : (
            <p className="no-plausible-match">No AVT match selected.</p>
          )}

          <div className="residual-transcript-viewer">
            <TranscriptContextViewer
              chunks={props.chunks}
              currentUnitId={props.candidate.transcriptChunkId}
              linkedUnitIds={linkedUnitIds}
              onToggleEvidence={toggleTranscriptEvidence}
            />
          </div>
        </div>

        <div className="verdict-panel">
          <span className="comparison-label">
            Human review · {props.decision?.reviewed ? "Reviewed" : "UNREVIEWED"}
          </span>
          <small className="muted-copy">Quick review: C = covered · 1–9 = categories · Enter = save finding · S = skip</small>

          <button
            className={`supported-outcome ${
              props.decision?.correctSupported ? "active" : ""
            }`}
            disabled={!selectedClaimIds.length && !suggestedClaim}
            onClick={confirmCovered}
            title={!selectedClaimIds.length && suggestedClaim ? "Uses the current suggested AVT match automatically" : undefined}
          >
            Actually covered elsewhere in AVT — confirm links <kbd>C</kbd>
          </button>

          <button
            className="secondary-button review-action"
            onClick={() => {
              update({
                irrelevant: true,
                correctSupported: false,
                categories: [],
                reviewed: true
              });
              props.onReviewedAction();
            }}
          >
            Irrelevant / does not need documenting
          </button>

          <div className="taxonomy-heading">
            <strong>Finding categories</strong>
            <span>Keys 1–9 toggle</span>
          </div>

          <div className="taxonomy-options">
            {VALIDATION_CATEGORIES.map((category, index) => {
              const active = props.decision?.categories.includes(category) ?? false;

              return (
                <button
                  key={category}
                  data-category={index + 1}
                  className={active ? "active" : ""}
                  onClick={() => toggleCategory(category)}
                  title={CATEGORY_DEFINITIONS[category]}
                >
                  <kbd>{index + 1}</kbd>
                  <span>
                    <strong>{shortCategory(category)}</strong>
                    <small>{CATEGORY_DEFINITIONS[category]}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            className="primary-button"
            disabled={!props.decision?.categories.length}
            onClick={() => {
              update({
                reviewed: true,
                irrelevant: false,
                correctSupported: false
              });
              props.onReviewedAction();
            }}
          >
            Save relevant / finding <kbd>Enter</kbd>
          </button>

          <label className="comment-label">
            Reviewer comment
            <textarea
              rows={3}
              value={props.decision?.comment ?? ""}
              onChange={(event) => update({ comment: event.target.value })}
            />
          </label>

          <button
            className="secondary-button skip-button"
            onClick={props.onSkip}
          >
            Skip / come back later <kbd>S</kbd>
          </button>
        </div>
      </div>

      <div className="focus-navigation">
        <button
          className="secondary-button"
          onClick={props.onPrevious}
          disabled={props.position === 1}
        >
          ← Previous
        </button>
        <button
          className="secondary-button"
          onClick={props.onNext}
          disabled={props.position === props.total}
        >
          Next →
        </button>
      </div>
    </section>
  );
}

function matchStrength(match?: TranscriptAVTMatch) {
  if (!match) return "No strong match";
  if (match.exactPhraseOverlap || (match.entailment ?? 0) >= 0.58) {
    return "Strong match";
  }
  return "Possible match";
}

function MatchDetails({ match }: { match: TranscriptAVTMatch }) {
  const questionVsPlan =
    match.statementType === "clinician_question" &&
    match.avtSection === "Plan and Requested Actions";

  return (
    <div className="match-details">
      {questionVsPlan && (
        <div className="evidence-warning">Possible history / plan mismatch</div>
      )}
      {(match.contradiction ?? 0) >= 0.45 && (
        <div className="evidence-warning">Possible contradiction</div>
      )}
      {match.conflictingNumbers.map((item, index) => (
        <div
          className="evidence-warning"
          key={`${item.transcript}-${item.avt}-${index}`}
        >
          ⚠ Possible numerical discrepancy — transcript: {item.transcript}; AVT: {item.avt}
        </div>
      ))}
      {match.negationWarning && (
        <div className="evidence-warning">⚠ Possible negation discrepancy</div>
      )}
    </div>
  );
}

function searchClaims(claims: AVTClaim[], query: string) {
  if (!query.trim()) return [];

  return claims
    .map((claim) => ({
      claim,
      score: lexicalSearchScore(query, claim.text).score
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ claim }) => claim);
}

function highlightText(text: string, query: string) {
  const terms = query.match(/[a-z0-9]+/gi) ?? [];
  if (!terms.length) return text;

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");

  return text.split(pattern).map((part, index) =>
    terms.some((term) => part.toLowerCase().startsWith(term.toLowerCase())) ? (
      <mark key={index}>{part}</mark>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    )
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shortCategory(category: ValidationCategory) {
  if (category === "Addition (not in script)") return "Addition";
  if (category === "Clinical Decision Support / Inference")
    return "Clinical Decision Support / Inference";
  if (category === "Observation (not an app defect)")
    return "Observation — not an app defect";
  return category;
}
