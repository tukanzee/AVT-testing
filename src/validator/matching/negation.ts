const NEGATION = /\b(no|not|denies|denied|never|without|negative|hasn't|haven't|didn't|doesn't|none)\b/i;

export function hasNegation(text: string) {
  return NEGATION.test(text);
}

export function hasNegationWarning(avt: string, transcript: string, hasSharedConcept: boolean) {
  return hasSharedConcept && hasNegation(avt) !== hasNegation(transcript);
}
