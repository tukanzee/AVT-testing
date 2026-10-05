import { useMemo, useState } from "react";
import { lexicalSearchScore } from "../matching/lexicalSearch";
import { evidenceWarnings } from "../matching/warnings";
import type { AVTClaim, EvidenceMatch, TranscriptEvidenceChunk } from "../workflowTypes";

type Props = {
  claim: AVTClaim;
  candidates: EvidenceMatch[];
  chunks: TranscriptEvidenceChunk[];
  selectedChunkIds: string[];
  onToggleEvidence: (id: string) => void;
};

export default function EvidencePanel({ claim, candidates, chunks, selectedChunkIds, onToggleEvidence }: Props) {
  const [search, setSearch] = useState("");
  const searchResults = useMemo(() => !search.trim() ? [] : chunks
    .map((chunk) => ({ chunk, score: lexicalSearchScore(search, chunk.text).score }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20), [chunks, search]);

  const evidenceCard = (id: string, label: string) => {
    const unit = chunks.find((chunk) => chunk.id === id);
    if (!unit) return null;
    const match = candidates.find((candidate) => candidate.transcriptChunkId === id);
    const selected = selectedChunkIds.includes(id);
    const strength = getEvidenceStrength(match);

    return <article className={`evidence-card ${selected ? "selected-evidence" : ""}`} key={id}>
      <div className="unit-heading">
        <strong>{label}</strong>
        <span className={`strength-hint ${strength.className}`}>{strength.label}</span>
      </div>
      <small>{id} · lines {unit.startLine}–{unit.endLine}</small>
      <p className="primary-evidence">{unit.text}</p>
      {evidenceWarnings(claim, unit, match).map((warning) => <div className="evidence-warning" key={warning}>{warning}</div>)}
      <button className={selected ? "unlink-button" : "compact-button"} aria-pressed={selected} onClick={() => onToggleEvidence(id)}>
        {selected ? "✓ Selected · Unlink" : "Use this evidence"}
      </button>
    </article>;
  };

  return <div className="evidence-panel">
    <div className="evidence-panel-heading">
      <span className="comparison-label">Transcript evidence</span>
      <p className="muted-copy">Select one or more passages. Context is shown beside the AVT claim.</p>
    </div>

    <h4>Best transcript evidence</h4>
    {candidates[0]
      ? evidenceCard(candidates[0].transcriptChunkId, "Best evidence")
      : <div className="no-plausible-match"><strong>No strong match</strong><p>No strong transcript evidence found.</p></div>}

    <h4>Other possible evidence</h4>
    {candidates.slice(1).map((candidate, index) => evidenceCard(candidate.transcriptChunkId, `Possible evidence ${index + 1}`))}
    {candidates.length < 2 && <p className="muted-copy">No other candidates.</p>}

    <div className="manual-search">
      <label>Search transcript
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Type part of a word or phrase…" />
      </label>
      {searchResults.map(({ chunk }, index) => evidenceCard(chunk.id, `Search result ${index + 1}`))}
      {search.trim() && !searchResults.length && <p>No search results.</p>}
    </div>
  </div>;
}

function getEvidenceStrength(match?: EvidenceMatch) {
  if (!match) return { label: "No strong match", className: "weak" };
  if (match.exactPhraseOverlap || match.phraseMatchScore >= .66 || (match.nli?.entailment ?? 0) >= .58) {
    return { label: "Strong match", className: "strong" };
  }
  return { label: "Possible match", className: "possible" };
}
