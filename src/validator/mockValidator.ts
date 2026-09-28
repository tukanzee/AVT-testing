import type { ValidationProvider } from "./provider";
import type { ValidationFinding } from "./types";

function containsText(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export const mockValidationProvider: ValidationProvider = {
  async validate(groundTruth, avt) {
    const allAvtText = Object.values(avt).join("\n");
    const findings: ValidationFinding[] = [];

    groundTruth.facts.forEach((fact, index) => {
      if (!containsText(allAvtText, fact.text)) {
        findings.push({
          id: `MOCK-${index + 1}`,
          component: "History of Presenting Complaint",
          category: "Omission",
          avtText: "",
          sourceText: fact.text,
          sourceFactIds: [fact.id],
          description: "Source content not found in AVT output."
        });
      }
    });

    const correctFacts = Math.max(groundTruth.facts.length - findings.length, 0);

    return {
      rubricVersion: "1.0",
      sourceFacts: groundTruth.facts.length,
      correctFacts,
      findings
    };
  }
};
