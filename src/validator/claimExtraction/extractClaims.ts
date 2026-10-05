import type { AVTClaim, AVTSection } from "../workflowTypes";
import { atomicPropositions } from "./atomic";

export function extractClaims(sections: AVTSection[]): AVTClaim[] {
  return sections.flatMap(section => {
    let index = 0;
    return section.text.split(/\r?\n/).flatMap(line => line.replace(/^\s*[-•–]\s+/, '').split(/\s+[-–]\s+/)).flatMap(originalSentence =>
      atomicPropositions(originalSentence).map(text => ({ id: `${section.id}-${++index}`, section: section.title, originalSentence: originalSentence.trim(), text })));
  });
}
