import type { AVTClaim, AVTSection } from "../workflowTypes";

export function extractClaims(sections: AVTSection[]): AVTClaim[] {
  const claims: AVTClaim[] = [];
  sections.forEach((section) => {
    parseSectionClaims(section.text).forEach((text, claimIndex) => {
      claims.push({
        id: `${section.id}-${claimIndex + 1}`,
        section: section.title,
        originalSentence: text,
        text
      });
    });
  });
  return claims;
}

function parseSectionClaims(text: string) {
  const lines = text.split(/\r?\n/);
  const claims: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const explicitBullet = trimmed.match(/^[-•–]\s+(.+)$/);
    const lineText = explicitBullet?.[1] ?? trimmed;
    const inlineBullets = lineText
      .split(/\s+[-–]\s+(?=\S)/)
      .map((part) => part.trim())
      .filter(Boolean);
    claims.push(...inlineBullets.flatMap(splitIndependentPropositions));
  }

  // Handle unbulleted prose as a single claim unless explicit bullet separators
  // were present. Hyphens without surrounding whitespace remain part of words.
  if (claims.length === 1 && !/^[-•–]\s+/m.test(text) && !/\s+[-–]\s+/.test(text)) {
    return claims[0].split(/(?<=[.!?])\s+(?=[A-Z0-9])/).map((part) => part.trim()).filter((part) => part.length >= 3);
  }
  return claims.filter((value) => value.length >= 3);
}

function splitIndependentPropositions(text: string) {
  const fallbacks = [
    { pattern: /^(.*?\b(?:denies?|no|without)\b.*?\bmedical conditions?)\s+and\s+(?:denies?\s+)?(?:any\s+)?(medication allergies?)$/i, secondPrefix: "Denies" },
    { pattern: /^(no\s+smoking)\s+or\s+(recreational drug use)$/i, secondPrefix: "No" }
  ];
  for (const { pattern, secondPrefix } of fallbacks) {
    const match = text.match(pattern);
    if (match) return [match[1].trim(), `${secondPrefix} ${match[2].trim()}`];
  }
  // Explicitly preserve linked/conditional plans; other conjunctions remain a
  // single bullet unless a narrow independent-domain rule above applies.
  return [text];
}
