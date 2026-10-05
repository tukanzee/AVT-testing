import { Fragment, useMemo, useState, type ReactNode } from "react";
import { lexicalSearchScore, normalizeSearchToken } from "../matching/lexicalSearch";
import type { EvidenceMatch, TranscriptAvtSection, TranscriptEvidenceChunk } from "../workflowTypes";

type Props = {
  candidates: EvidenceMatch[];
  chunks: TranscriptEvidenceChunk[];
  claimSection: TranscriptAvtSection;
  selectedChunkId?: string;
  onSelect: (chunkId: string) => void;
};

export default function EvidencePanel({ candidates, chunks, claimSection, selectedChunkId, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const suggestedId = selectedChunkId ?? candidates[0]?.transcriptChunkId;
  const selectedChunk = chunks.find((chunk) => chunk.id === suggestedId);
  const selectedMatch = candidates.find((match) => match.transcriptChunkId === suggestedId);
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    return chunks.map((chunk) => ({ chunk, score: lexicalSearchScore(search, chunk.text).score }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ chunk }) => chunk);
  }, [chunks, search]);

  return (
    <div className="evidence-panel">
      <span className="comparison-label">Transcript evidence</span>
      <p className="primary-evidence">{selectedChunk?.text ?? candidates[0]?.transcriptText ?? "No plausible transcript evidence found"}</p>
      {selectedChunk && selectedChunk.originalTurnText !== selectedChunk.text.replace(/^(?:C|P|P\/C):\s*/, "") && <details className="source-context"><summary>Original turn and context</summary><p>{selectedChunk.originalTurnText}</p>{selectedChunk.contextText && <small>{selectedChunk.contextText}</small>}</details>}
      {selectedMatch && <div className="retrieval-meta">Retrieval similarity: {selectedMatch.semanticSimilarity.toFixed(3)}</div>}
      {selectedMatch?.nli && <NliSignal match={selectedMatch} claimSection={claimSection} />}
      {selectedMatch?.conflictingNumbers.map((conflict, index) => (
        <div className="evidence-warning" key={`${conflict.avt}-${conflict.transcript}-${index}`}>⚠ Possible numerical discrepancy — AVT: {conflict.avt}; transcript: {conflict.transcript}</div>
      ))}
      {selectedMatch?.negationWarning && <div className="evidence-warning">⚠ Possible negation / contradiction</div>}

      {candidates.length > 1 && <details className="other-evidence">
        <summary>Other possible evidence</summary>
        {candidates.slice(1).map((candidate, index) => (
          <button key={candidate.transcriptChunkId} onClick={() => onSelect(candidate.transcriptChunkId)}>
            <strong>Candidate {index + 2}</strong>
            <span>{candidate.transcriptText}</span>
            <small>Retrieval similarity: {candidate.semanticSimilarity.toFixed(3)}</small>
            {candidate.nli && <NliSignal match={candidate} claimSection={claimSection} />}
          </button>
        ))}
      </details>}

      <details className="manual-search">
        <summary>Search transcript manually</summary>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search words or phrase…" />
        <div>{searchResults.map((chunk) => <button key={chunk.id} onClick={() => onSelect(chunk.id)}><span>{highlightText(chunk.text, search)}</span>{chunk.contextText && <small>{chunk.contextText}</small>}</button>)}</div>
      </details>
    </div>
  );
}

function NliSignal({ match, claimSection }: { match: EvidenceMatch; claimSection: TranscriptAvtSection }) {
  const entailment = match.nli?.entailment ?? 0;
  const contradiction = match.nli?.contradiction ?? 0;
  const neutral = match.nli?.neutral ?? 0;
  const questionVsPlan = match.statementType === "clinician_question" && claimSection === "Plan and Requested Actions";
  const label = questionVsPlan
    ? "⚠ Question is not evidence of a plan action"
    : entailment >= 0.58 && contradiction < 0.25 && !match.negationWarning && match.conflictingNumbers.length === 0
    ? "✓ Likely same meaning"
    : contradiction >= 0.45 || match.negationWarning
      ? "⚠ Meaning may differ"
      : neutral >= 0.6
        ? "? Weak / unrelated match"
        : "? Review meaning";
  return <details className="matching-details"><summary>{label}</summary><small>Local NLI relationship scores: entailment {entailment.toFixed(2)}, contradiction {contradiction.toFixed(2)}, neutral {neutral.toFixed(2)}. Assistive only.</small></details>;
}

function highlightText(text: string, query: string) {
  const terms = (query.match(/[a-z0-9]+/gi) ?? []).map(normalizeSearchToken);
  if (!terms.length) return text;
  const pattern = /[a-z0-9]+/gi;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    const word = match[0];
    if (start > lastIndex) nodes.push(<Fragment key={`plain-${lastIndex}`}>{text.slice(lastIndex, start)}</Fragment>);
    const normalized = normalizeSearchToken(word);
    nodes.push(terms.includes(normalized) ? <mark key={`hit-${start}`}>{word}</mark> : <Fragment key={`word-${start}`}>{word}</Fragment>);
    lastIndex = start + word.length;
  }
  if (lastIndex < text.length) nodes.push(<Fragment key={`tail-${lastIndex}`}>{text.slice(lastIndex)}</Fragment>);
  return nodes;
}
