import type { AVTClaim, EvidenceMatch, TranscriptComparisonUnit } from '../workflowTypes';
import { keywordOverlap, searchTokens } from './lexicalSearch';
import { hasNegation } from './negation';
export function evidenceWarnings(claim: AVTClaim, unit: TranscriptComparisonUnit, match?: EvidenceMatch): string[] {
  const warnings: string[] = [];
  if (/\[UNCERTAIN|speaker unclear|\b(?:P\/C|Mum|Dad|Mother|Father|Carer):/i.test(unit.text)) warnings.push('Uncertain source / attribution — review before linking');
  if (/\b(?:Mum|Dad|Mother|Father):.*\bI\b/i.test(unit.text) && /\b(child|patient)\b/i.test(claim.text)) warnings.push('Possible actor/person mismatch');
  if (/\?|\b(?:do not know|don.t know|unsure)\b/i.test(unit.text)) warnings.push('Question / uncertain answer — does not establish the queried fact');
  if (claim.section === 'Plan and Requested Actions' && /\n(?:P|Patient):/i.test(unit.text)) warnings.push('Possible history / plan mismatch');
  if (keywordOverlap(claim.text, unit.text) > 0.2 && /\b(now|earlier|previously|but|however)\b/i.test(unit.text)) warnings.push('Possible qualifier / temporal mismatch');
  if (match?.negationWarning) warnings.push('Possible negation mismatch');
  if ((match?.nli?.contradiction ?? 0) >= .45) warnings.push('Possible contradiction');
  if (match?.conflictingNumbers.length) warnings.push('Possible number mismatch');
  if ((match?.nli?.neutral ?? 0) > .6 && !match?.exactPhraseOverlap) warnings.push('Possible inference — review source evidence');
  return warnings;
}
export function conflictingSources(units: TranscriptComparisonUnit[]): [string, string][] {
  const conflicts: [string, string][] = [];
  units.forEach((a,i) => units.slice(i+1).forEach(b => {
    const shared = searchTokens(a.text).filter(t => searchTokens(b.text).includes(t) && !['actually','pain','have'].includes(t));
    const allergyCorrection = /\bno\b.*allerg/i.test(a.text) && /\bactually\b.*\b(rash|reaction|allerg)/i.test(b.text);
    if (allergyCorrection || (shared.length >= 2 && hasNegation(a.text) !== hasNegation(b.text))) conflicts.push([a.id,b.id]);
  }));
  return conflicts;
}
export function duplicateClaims(claim: AVTClaim, claims: AVTClaim[]) {
  const key = (s: string) => s.toLowerCase().replace(/\b(?:denies|denied)\b/g, 'no').replace(/\bpatient\b/g,'').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();
  return claims.filter(c => c.id !== claim.id && key(c.text) === key(claim.text));
}
