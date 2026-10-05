const STOP_WORDS = new Set([
  "the", "and", "with", "that", "this", "from", "have", "has", "had", "was", "were", "are", "for", "you", "your", "patient", "reports", "reported", "does", "did", "not", "other", "since", "about"
]);

const IRREGULAR = new Map([["injuries", "injury"], ["allergies", "allergy"], ["falls", "fall"], ["episodes", "episode"]]);
const MAX_PHRASE_TOKENS = 4;
const PHRASE_SCORE_NORMALIZER = 3;

export function normalizeSearchText(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

export function normalizeSearchToken(token: string) {
  const normalized = token.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (IRREGULAR.has(normalized)) return IRREGULAR.get(normalized)!;
  if (normalized.length > 4 && normalized.endsWith("ies")) return `${normalized.slice(0, -3)}y`;
  if (normalized.length > 3 && normalized.endsWith("s") && !normalized.endsWith("ss")) return normalized.slice(0, -1);
  if (normalized.length > 5 && normalized.endsWith("ing")) return normalized.slice(0, -3);
  if (normalized.length > 4 && normalized.endsWith("ed")) return normalized.slice(0, -2);
  return normalized;
}

export function searchTokens(text: string) {
  const expanded = text.toLowerCase().replace(/\bhr\b/g, "heart rate").replace(/\bbp\b/g, "blood pressure").replace(/\bspo2\b/g, "oxygen saturation").replace(/-/g, " ");
  return Array.from(new Set((expanded.match(/[a-z][a-z0-9]*/g) ?? [])
    .map((token) => normalizeSearchToken(token))
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token))));
}

export function lexicalSearchScore(query: string, document: string) {
  const queryTokens = searchTokens(query);
  const documentTokens = new Set(searchTokens(document));
  if (!queryTokens.length) return { score: 0, matchedTerms: [] as string[] };
  const matchedTerms = queryTokens.filter((token) => documentTokens.has(token));
  return { score: matchedTerms.length / queryTokens.length, matchedTerms };
}

export function keywordOverlap(query: string, document: string) {
  return lexicalSearchScore(query, document).score;
}

export function matchingTerms(query: string, document: string) {
  return lexicalSearchScore(query, document).matchedTerms;
}

export function hasExactPhraseOverlap(query: string, document: string) {
  return phraseMatchScore(query, document) > 0;
}

export function phraseMatchScore(query: string, document: string) {
  const normalizedQuery = normalizeSearchText(query);
  const normalizedDocument = normalizeSearchText(document);
  if (normalizedQuery.length >= 12 && normalizedDocument.includes(normalizedQuery)) return 1;
  const queryTokens = searchTokens(normalizedQuery);
  const documentTokens = searchTokens(normalizedDocument);
  let best = 0;
  for (let size = Math.min(MAX_PHRASE_TOKENS, queryTokens.length); size >= 2; size -= 1) {
    for (let index = 0; index <= queryTokens.length - size; index += 1) {
      const phrase = queryTokens.slice(index, index + size).join(" ");
      for (let documentIndex = 0; documentIndex <= documentTokens.length - size; documentIndex += 1) {
        if (documentTokens.slice(documentIndex, documentIndex + size).join(" ") === phrase) {
          best = Math.max(best, size / PHRASE_SCORE_NORMALIZER);
        }
      }
    }
  }
  return Math.min(1, best);
}
