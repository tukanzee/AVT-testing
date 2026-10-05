import type { AVTClaim, EvidenceMatch, OmissionCandidate, TranscriptAVTMatch, TranscriptEvidenceChunk } from "../workflowTypes";
import { cosineSimilarity, embedTexts } from "./embeddings";
import { hasExactPhraseOverlap, keywordOverlap, matchingTerms, phraseMatchScore } from "./lexicalSearch";
import { hasNegationWarning } from "./negation";
import { compareNumbers } from "./numberMatching";
import { classifyTranscriptStatement, statementTypeCompatibility } from "./statementType";
import { expandTerminology } from "./terminology";
import { evidenceWarnings } from "./warnings";
import { classifyRelationships } from "./nli";

type ProgressCallback = (message: string, percent?: number) => void;
export const MIN_SEMANTIC_MATCH_THRESHOLD = 0.42;
export const SEMANTIC_WEIGHT = 0.34;
export const LEXICAL_WEIGHT = 0.28;
export const PHRASE_MATCH_WEIGHT = 0.34;
export const NLI_ENTAILMENT_WEIGHT = 0.2;
export const NLI_CONTRADICTION_PENALTY = 0.22;
export const NLI_NEUTRAL_PENALTY = 0.08;
export const EXACT_PHRASE_WEIGHT = 0.12;
export const NUMBER_MATCH_WEIGHT = 0.1;
export const STATEMENT_TYPE_WEIGHT = 0.08;
export const STATEMENT_TYPE_SCORE_UNIT = 0.1;
export const MIN_LEXICAL_CANDIDATE_SCORE = 0.15;
export const HIGH_NLI_NEUTRAL_THRESHOLD = 0.72;
export const LOW_NLI_RELATION_THRESHOLD = 0.08;
export const SEMANTIC_CANDIDATES = 5;
export const LEXICAL_CANDIDATES = 5;
export const MAX_NLI_CANDIDATES = 10;
const GENERIC_TOPICAL_TOKENS = new Set(["pain", "symptom", "problem", "issue", "report", "deni", "negativ", "positiv"]);

export interface TranscriptComparison {
  matches: Record<string, EvidenceMatch[]>;
  omissionCandidates: OmissionCandidate[];
}

export async function compareTranscriptAndAvt(
  claims: AVTClaim[],
  chunks: TranscriptEvidenceChunk[],
  onProgress?: ProgressCallback,
  runtime = { embedTexts, classifyRelationships }
): Promise<TranscriptComparison> {
  if (!claims.length || !chunks.length) return { matches: {}, omissionCandidates: [] };

  // Start independent lexical/structured work alongside model loading/embedding.
  const [vectors, lexicalMatrix] = await Promise.all([
    runtime.embedTexts([...claims.map(c => c.text), ...chunks.map(c => c.text)], onProgress).catch(() => {
      onProgress?.("Embedding model unavailable; using local lexical retrieval"); return null;
    }),
    Promise.resolve().then(() => claims.map(claim => chunks.map(chunk => buildMatch(claim, chunk, 0))))
  ]);
  const semanticMatrix = vectors ? claims.map((_, i) => chunks.map((_, j) => cosineSimilarity(vectors[i], vectors[claims.length + j]))) : null;
  const allMatches = lexicalMatrix.map((row, i) => row.map((match, j) => ({ ...match,
    semanticSimilarity: semanticMatrix?.[i][j] ?? 0,
    rankScore: match.rankScore + (semanticMatrix?.[i][j] ?? 0) * SEMANTIC_WEIGHT
  })));

  onProgress?.("Checking likely evidence relationships", 70);
  const debugClaimPools = new Map<string, ReturnType<typeof selectNliCandidates>>();
  const pairSources = new Map<string, Set<string>>();
  claims.forEach((claim, claimIndex) => {
    const candidates = selectNliCandidates(allMatches[claimIndex], semanticMatrix !== null);
    debugClaimPools.set(claim.id, candidates);
    candidates.forEach(({ index, sources }) => addPairSources(pairSources, `${claimIndex}:${index}`, sources));
  });

  const selectedPairKeys = new Set<string>(Array.from(pairSources.keys()));
  // Reverse direction: retrieve up to three AVT claims for each transcript
  // unit, using the same cross-product scores already computed above.
  chunks.forEach((_, chunkIndex) => {
    const byTranscript = claims.map((_, claimIndex) => allMatches[claimIndex][chunkIndex]);
    selectNliCandidates(byTranscript, semanticMatrix !== null)
      .forEach(({ index: claimIndex, sources }) => {
        const key = `${claimIndex}:${chunkIndex}`;
        selectedPairKeys.add(key);
        addPairSources(pairSources, key, sources.map((source) => `reverse:${source}`));
      });
  });
  const pairsToJudge = Array.from(selectedPairKeys, (key) => key.split(":").map(Number) as [number, number]);
  const nliBatchSize = 12;
  for (let offset = 0; offset < pairsToJudge.length; offset += nliBatchSize) {
    const batch = pairsToJudge.slice(offset, offset + nliBatchSize);
    const relationships = await runtime.classifyRelationships(batch.map(([claimIndex, chunkIndex]) => ({
      premise: chunks[chunkIndex].text,
      hypothesis: claims[claimIndex].text
    })), onProgress);
    batch.forEach(([claimIndex, chunkIndex], batchIndex) => {
      const claim = claims[claimIndex];
      const chunk = chunks[chunkIndex];
      const relationship = relationships[batchIndex];
      const previous = allMatches[claimIndex][chunkIndex];
      const sameAttribute = hasSharedAttribute(previous);
      const numberResult = sameAttribute ? compareNumbers(claim.text, chunk.text) : { matchingNumbers: [], conflictingNumbers: [] };
      const negationWarning = sameAttribute && hasNegationWarning(claim.text, chunk.text, true);
      allMatches[claimIndex][chunkIndex] = {
        ...previous,
        matchingNumbers: numberResult.matchingNumbers,
        conflictingNumbers: numberResult.conflictingNumbers,
        negationWarning,
        nli: relationship,
        statementType: classifyTranscriptStatement(chunk.text),
        rankScore: combinedRankScore(previous, relationship, statementTypeCompatibility(chunk, claim), numberResult.matchingNumbers.length)
      };
    });
    onProgress?.(`Checking likely evidence ${Math.min(offset + batch.length, pairsToJudge.length)} of ${pairsToJudge.length}`, 70 + Math.round((offset + batch.length) / Math.max(1, pairsToJudge.length) * 25));
  }

  const matches = Object.fromEntries(claims.map((claim, claimIndex) => [
    claim.id,
    [...allMatches[claimIndex]].sort((a, b) => b.rankScore - a.rankScore)
      .filter(isPlausibleMatch).slice(0, 3)
  ]));

  if (import.meta.env?.DEV) {
    claims.forEach((claim, claimIndex) => {
      const pool = debugClaimPools.get(claim.id) ?? [];
      const selected = new Set(pool.map(({ index }) => index));
      const ranked = allMatches[claimIndex].map((match, index) => ({ match, index, accepted: isPlausibleMatch(match) }))
        .sort((a, b) => b.match.rankScore - a.match.rankScore);
      console.debug("[TranscriptAVT retrieval]", {
        claim: claim.text,
        semanticCandidates: allMatches[claimIndex].map((match, index) => ({ match, index })).sort((a, b) => b.match.semanticSimilarity - a.match.semanticSimilarity).slice(0, SEMANTIC_CANDIDATES),
        lexicalCandidates: allMatches[claimIndex].map((match, index) => ({ match, index })).sort((a, b) => b.match.rankScore - a.match.rankScore).filter(({ match }) => match.keywordOverlap >= MIN_LEXICAL_CANDIDATE_SCORE || match.phraseMatchScore > 0).slice(0, LEXICAL_CANDIDATES),
        terminologyExpandedQuery: expandTerminology(claim.text),
        terminologyExpandedCandidates: pool.filter(({ sources }) => sources.includes("lexical")).map(({ index }) => ({ id: chunks[index].id, text: expandTerminology(chunks[index].text) })),
        structuredCandidates: allMatches[claimIndex].map((match, index) => ({ match, index })).filter(({ match }) => match.matchingNumbers.length > 0).slice(0, MAX_NLI_CANDIDATES),
        union: pool.map(({ index, sources }) => ({ sources, match: allMatches[claimIndex][index] })),
        nli: ranked.filter(({ index }) => selected.has(index)).map(({ match }) => ({ id: match.transcriptChunkId, nli: match.nli })),
        finalRanking: ranked.map(({ match, accepted }) => ({ id: match.transcriptChunkId, score: match.rankScore, warnings: evidenceWarnings(claim, chunks.find(c => c.id === match.transcriptChunkId)!, match), accepted, rejectionReason: accepted ? undefined : getRejectionReason(match) }))
      });
    });
  }

  const omissionCandidates = chunks.flatMap((chunk, chunkIndex) => {
    const ranked = claims.map((claim, claimIndex) => ({
      claim,
      match: allMatches[claimIndex][chunkIndex]
    })).sort((a, b) => b.match.rankScore - a.match.rankScore);
    if (import.meta.env?.DEV) {
      const pool = selectNliCandidates(claims.map((_, i) => allMatches[i][chunkIndex]), semanticMatrix !== null);
      console.debug("[TranscriptAVT reverse retrieval]", {
        query: chunk.text, terminologyExpandedQuery: expandTerminology(chunk.text),
        semanticCandidates: pool.filter(p => p.sources.includes("semantic")),
        lexicalCandidates: pool.filter(p => p.sources.includes("lexical")),
        terminologyExpandedCandidates: pool.filter(p => p.sources.includes("lexical")).map(p => expandTerminology(claims[p.index].text)),
        structuredCandidates: pool.filter(p => p.sources.includes("structured")), candidateUnion: pool,
        finalRanking: ranked.map(({claim,match}) => ({claimId:claim.id,nli:match.nli,score:match.rankScore,warnings:evidenceWarnings(claim,chunk,match),rejectionReason:isPlausibleMatch(match)?undefined:getRejectionReason(match)}))
      });
    }
    const plausible = ranked.filter((item) => isPlausibleMatch(item.match)).slice(0, 3);
    const best = plausible[0];
    return [{
      itemId: `omission-${chunk.id}`,
      transcriptChunkId: chunk.id,
      transcriptText: chunk.text,
      bestAvtClaimId: best?.claim.id,
      bestAvtClaimText: best?.claim.text,
      retrievalSimilarity: best?.match.semanticSimilarity ?? 0,
      matches: plausible.map(({ claim, match }) => toTranscriptAvtMatch(chunk.id, claim, match)),
      matchDetails: plausible.map(({ match }) => match),
      startLine: chunk.startLine,
      endLine: chunk.endLine,
      originalTurnText: chunk.originalTurnText,
      contextText: chunk.contextText
    }];
  }).sort((a, b) => omissionPriority(a) - omissionPriority(b));

  onProgress?.("Evidence retrieval ready", 100);
  return { matches, omissionCandidates };
}

function omissionPriority(candidate: OmissionCandidate) {
  if (!candidate.matches.length) return 0;
  const hasConflict = candidate.matches.some((match) =>
    match.negationWarning || match.conflictingNumbers.length > 0 || (match.contradiction ?? 0) >= 0.3);
  if (hasConflict) return 1;
  if (candidate.matches.some((match) => (match.neutral ?? 0) >= 0.6)) return 2;
  return 5;
}

function toTranscriptAvtMatch(transcriptUnitId: string, claim: AVTClaim, match: EvidenceMatch): TranscriptAVTMatch {
  return {
    transcriptUnitId,
    avtClaimId: claim.id,
    avtClaimText: claim.text,
    avtSection: claim.section,
    semanticSimilarity: match.semanticSimilarity,
    matchingTerms: matchingTerms(claim.text, match.transcriptText),
    matchingNumbers: match.matchingNumbers,
    conflictingNumbers: match.conflictingNumbers.map((item) => ({ transcript: item.transcript, avt: item.avt })),
    negationWarning: match.negationWarning,
    exactPhraseOverlap: match.exactPhraseOverlap,
    rankScore: match.rankScore,
    entailment: match.nli?.entailment,
    contradiction: match.nli?.contradiction,
    neutral: match.nli?.neutral,
    statementType: match.statementType
  };
}

export function buildMatch(claim: AVTClaim, chunk: TranscriptEvidenceChunk, semanticSimilarity: number): EvidenceMatch {
  const retrievalText = chunk.text;
  const overlap = keywordOverlap(claim.text, retrievalText);
  const matchedTerms = matchingTerms(claim.text, retrievalText);
  const preliminaryNumberResult = compareNumbers(claim.text, retrievalText);
  const phraseScore = phraseMatchScore(claim.text, retrievalText);
  const exactPhraseOverlap = hasExactPhraseOverlap(claim.text, retrievalText);
  const sameAttribute = matchedTerms.some((term) => !GENERIC_TOPICAL_TOKENS.has(term)) || exactPhraseOverlap;
  const numberResult = sameAttribute ? preliminaryNumberResult : { matchingNumbers: [], conflictingNumbers: [] };
  const negationWarning = sameAttribute && hasNegationWarning(claim.text, chunk.text, true);
  const initialRankScore = semanticSimilarity * SEMANTIC_WEIGHT + overlap * LEXICAL_WEIGHT
    + phraseScore * PHRASE_MATCH_WEIGHT
    + (exactPhraseOverlap ? EXACT_PHRASE_WEIGHT : 0)
    + (numberResult.matchingNumbers.length ? NUMBER_MATCH_WEIGHT : 0);

  return {
    claimId: claim.id,
    transcriptChunkId: chunk.id,
    transcriptText: chunk.text,
    semanticSimilarity,
    keywordOverlap: overlap,
    matchedTerms,
    phraseMatchScore: phraseScore,
    matchingNumbers: numberResult.matchingNumbers,
    conflictingNumbers: numberResult.conflictingNumbers,
    negationWarning,
    exactPhraseOverlap,
    rankScore: initialRankScore
  };
}

function isPlausibleMatch(match: EvidenceMatch) {
  // Non-candidates never receive an NLI result and must not appear in final
  // review, even if their raw semantic score happens to be high.
  if (!match.nli) return false;
  const strongLexicalSignal = hasSharedAttribute(match) && (match.keywordOverlap >= MIN_LEXICAL_CANDIDATE_SCORE || match.phraseMatchScore > 0);
  if (match.nli && match.nli.entailment < LOW_NLI_RELATION_THRESHOLD && match.nli.contradiction < LOW_NLI_RELATION_THRESHOLD
    && match.nli.neutral > HIGH_NLI_NEUTRAL_THRESHOLD && !strongLexicalSignal) return false;
  if (!isTopicallyRelated(match, match.semanticSimilarity, Boolean(match.nli && (match.nli.entailment >= 0.2 || match.nli.contradiction >= 0.3)))) return false;
  if (match.semanticSimilarity < MIN_SEMANTIC_MATCH_THRESHOLD
    && match.keywordOverlap < MIN_LEXICAL_CANDIDATE_SCORE
    && match.phraseMatchScore === 0
    && !match.exactPhraseOverlap
    && match.matchingNumbers.length === 0
    && !(match.negationWarning && match.keywordOverlap > 0)) return false;
  return match.semanticSimilarity >= MIN_SEMANTIC_MATCH_THRESHOLD
    || match.keywordOverlap >= MIN_LEXICAL_CANDIDATE_SCORE
    || match.phraseMatchScore > 0
    || (match.nli?.entailment ?? 0) >= 0.2
    || (match.nli?.contradiction ?? 0) >= 0.3
    || match.exactPhraseOverlap
    || (match.matchingNumbers.length > 0 && match.keywordOverlap > 0)
    || match.negationWarning
    || match.conflictingNumbers.length > 0 && match.keywordOverlap > 0;
}

export function selectNliCandidates(matches: EvidenceMatch[], hasEmbeddings: boolean) {
  const sources = new Map<number, Set<string>>();
  const mark = (index: number, source: string) => {
    const current = sources.get(index) ?? new Set<string>();
    current.add(source);
    sources.set(index, current);
  };
  if (hasEmbeddings) {
    matches.map((match, index) => ({ match, index }))
      .sort((a, b) => b.match.semanticSimilarity - a.match.semanticSimilarity)
      .slice(0, SEMANTIC_CANDIDATES)
      .forEach(({ index }) => mark(index, "semantic"));
  }
  matches.map((match, index) => ({ match, index }))
    .filter(({ match }) => match.keywordOverlap >= MIN_LEXICAL_CANDIDATE_SCORE || match.phraseMatchScore > 0)
    .sort((a, b) => b.match.rankScore - a.match.rankScore)
    .slice(0, LEXICAL_CANDIDATES)
    .forEach(({ index }) => mark(index, "lexical"));
  matches.map((match, index) => ({ match, index }))
    .filter(({ match }) => match.matchingNumbers.length > 0 && (match.keywordOverlap > 0 || match.semanticSimilarity >= 0.25))
    .sort((a, b) => b.match.rankScore - a.match.rankScore)
    .slice(0, MAX_NLI_CANDIDATES)
    .forEach(({ index }) => mark(index, "structured"));

  // Union every independently capped pool; never let one channel evict another.
  const ranked = Array.from(sources.keys())
    .map((index) => ({ index, match: matches[index] }))
    .sort((a, b) => b.match.rankScore - a.match.rankScore);
  return ranked.map((candidate) => ({ ...candidate, sources: Array.from(sources.get(candidate.index) ?? []) }));
}

function addPairSources(target: Map<string, Set<string>>, key: string, sources: string[]) {
  const current = target.get(key) ?? new Set<string>();
  sources.forEach((source) => current.add(source));
  target.set(key, current);
}

function getRejectionReason(match: EvidenceMatch) {
  if (!match.nli) return "not selected into the NLI candidate union";
  const strongLexicalSignal = hasSharedAttribute(match) && (match.keywordOverlap >= MIN_LEXICAL_CANDIDATE_SCORE || match.phraseMatchScore > 0);
  if (match.nli.neutral > HIGH_NLI_NEUTRAL_THRESHOLD && match.nli.entailment < LOW_NLI_RELATION_THRESHOLD && match.nli.contradiction < LOW_NLI_RELATION_THRESHOLD && !strongLexicalSignal) return "high NLI neutrality without strong lexical support";
  if (!isTopicallyRelated(match, match.semanticSimilarity, Boolean(match.nli && (match.nli.entailment >= 0.2 || match.nli.contradiction >= 0.3)))) return "no topical relevance";
  if (match.semanticSimilarity < MIN_SEMANTIC_MATCH_THRESHOLD && match.keywordOverlap < MIN_LEXICAL_CANDIDATE_SCORE && match.phraseMatchScore === 0 && match.matchingNumbers.length === 0) return "below final relevance threshold";
  return "candidate not retained in top three";
}

function isTopicallyRelated(match: Pick<EvidenceMatch, "semanticSimilarity" | "keywordOverlap" | "matchedTerms" | "exactPhraseOverlap" | "matchingNumbers" | "nli">, semanticSimilarity: number, nliRelated = false, relationship = match.nli) {
  const sharedSpecificTerms = match.matchedTerms.some((term) => !GENERIC_TOPICAL_TOKENS.has(term));
  if (nliRelated || sharedSpecificTerms || match.exactPhraseOverlap) return true;
  if (relationship) return semanticSimilarity >= 0.5 && relationship.neutral < 0.72;
  return semanticSimilarity >= 0.36;
}

function hasSharedAttribute(match: Pick<EvidenceMatch, "matchedTerms" | "exactPhraseOverlap">) {
  return match.matchedTerms.some((term) => !GENERIC_TOPICAL_TOKENS.has(term)) || match.exactPhraseOverlap;
}

function combinedRankScore(match: EvidenceMatch, nli: NonNullable<EvidenceMatch["nli"]>, statementTypeScore: number, numberMatches: number) {
  return match.semanticSimilarity * SEMANTIC_WEIGHT
    + match.keywordOverlap * LEXICAL_WEIGHT
    + match.phraseMatchScore * PHRASE_MATCH_WEIGHT
    + nli.entailment * NLI_ENTAILMENT_WEIGHT
    - nli.contradiction * NLI_CONTRADICTION_PENALTY
    - nli.neutral * NLI_NEUTRAL_PENALTY
    + (match.exactPhraseOverlap ? EXACT_PHRASE_WEIGHT : 0)
    + (numberMatches > 0 ? NUMBER_MATCH_WEIGHT : 0)
    + statementTypeScore * (STATEMENT_TYPE_WEIGHT / STATEMENT_TYPE_SCORE_UNIT);
}
