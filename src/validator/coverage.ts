import type { TranscriptComparisonUnit, ValidationDecision, OmissionDecision } from './workflowTypes';

export interface CoverageLink {
  claimId: string;
  unitId: string;
  source: 'claim' | 'residual';
  equivalentTo?: string;
  confirmed?: boolean;
}

// Exact normalized repeats only. Preserve speaker, numbers, qualifiers, uncertainty and Q+A context.
export function equivalenceKey(unit: TranscriptComparisonUnit) {
  return unit.text.toLowerCase().replace(/[’]/g, "'").replace(/\bcan't\b/g, 'cannot').replace(/[.!](?!\d)|,/g, '').replace(/\s+/g, ' ').trim();
}

export function duplicateGroupKey(unit: TranscriptComparisonUnit) {
  const exact = equivalenceKey(unit);
  const text = exact.replace(/^(?:p|patient):\s*/, "");
  const hasMobilityInability = /\b(?:cannot|unable|haven't been able|have not been able)\b/.test(text)
    && /\b(?:walk|stand|weight bear|put .* weight)\b/.test(text);
  const hasDistinctQualifier = /\b(?:because|due to|normally|usually|stick|frame|crutch|outdoors|outside|distance|far|metres?|yards?|minutes?)\b/.test(text)
    || /\d/.test(text);
  if (unit.speaker === "P" && hasMobilityInability && !hasDistinctQualifier) return "P:mobility-unable";
  return exact;
}

export function coverageMap(units: TranscriptComparisonUnit[], decisions: Record<string, ValidationDecision>, residual: Record<string, OmissionDecision>): CoverageLink[] {
  const links: CoverageLink[] = [];

  // Pass 1 evidence selected by the reviewer is treated as provisionally accounted for
  // in the residual queue so the same transcript proposition is not reviewed twice.
  // `confirmed` remains false until the reviewer explicitly marks the AVT claim supported.
  Object.values(decisions).forEach((decision) => {
    const confirmed = Boolean(decision.reviewed && decision.correctSupported && !decision.categories.length);
    (decision.transcriptChunkIds ?? []).forEach((unitId) => {
      links.push({ claimId: decision.claimId, unitId, source: 'claim', confirmed });
    });
  });

  // Pass 2 selection alone is not enough to resolve a residual item.
  // Only an explicitly confirmed residual link counts as coverage.
  // Residual review can link multiple AVT claims to multiple transcript units.
  Object.values(residual)
    .filter((decision) => decision.reviewed && decision.correctSupported && !decision.categories.length && !decision.irrelevant)
    .forEach((decision) => {
      const claimIds = decision.avtClaimIds?.length
        ? decision.avtClaimIds
        : decision.avtClaimId
          ? [decision.avtClaimId]
          : [];

      if (!claimIds.length) return;

      const currentUnitId = decision.itemId.replace(/^omission-/, '');
      const unitIds = Array.from(new Set([currentUnitId, ...(decision.transcriptChunkIds ?? [])]));

      claimIds.forEach((claimId) => {
        unitIds.forEach((unitId) => {
          links.push({ claimId, unitId, source: 'residual', confirmed: true });
        });
      });
    });

  // Carry coverage over exact/conservative duplicate groups so repeated transcript
  // statements do not create duplicate residual review work.
  for (const link of [...links]) {
    const original = units.find((unit) => unit.id === link.unitId);
    if (!original) continue;
    units.filter((unit) => unit.id !== original.id && duplicateGroupKey(unit) === duplicateGroupKey(original)).forEach((unit) => {
      if (!links.some((existing) => existing.claimId === link.claimId && existing.unitId === unit.id)) {
        links.push({ ...link, unitId: unit.id, equivalentTo: original.id });
      }
    });
  }

  return links;
}

export function residualUnits(units: TranscriptComparisonUnit[], links: CoverageLink[], decisions: Record<string, OmissionDecision>) {
  const covered = new Set(links.map((link) => link.unitId));
  const resolved = new Set(units.filter((unit) => decisions[`omission-${unit.id}`]?.reviewed).map(duplicateGroupKey));
  const seen = new Set<string>();

  return units.filter((unit) => {
    const groupKey = duplicateGroupKey(unit);
    const exactKey = equivalenceKey(unit);
    if (covered.has(unit.id) || resolved.has(groupKey) || seen.has(exactKey)) return false;
    seen.add(exactKey);
    return true;
  });
}
