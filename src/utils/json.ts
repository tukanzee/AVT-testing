import type { ClinicalCase, GroundTruthItem } from "../types";

export interface GroundTruthExport {
  schemaVersion: "1.0";
  scenario: {
    id: string;
    title: string;
    specialty: string;
    setting: string;
  };
  sessionId: string;
  generatedAt: string;
  facts: Array<{
    id: string;
    domain: GroundTruthItem["domain"];
    source: GroundTruthItem["source"];
    text: string;
  }>;
  additionalSpokenInformation: string;
}

type ExportArgs = {
  clinicalCase: ClinicalCase;
  sessionId: string;
  selectedItems: GroundTruthItem[];
  additionalNotes: string;
};

export function buildGroundTruthExport({
  clinicalCase,
  sessionId,
  selectedItems,
  additionalNotes
}: ExportArgs): GroundTruthExport {
  return {
    schemaVersion: "1.0",
    scenario: {
      id: clinicalCase.id,
      title: clinicalCase.title,
      specialty: clinicalCase.specialty,
      setting: clinicalCase.setting
    },
    sessionId,
    generatedAt: new Date().toISOString(),
    facts: selectedItems.map((item) => ({
      id: item.id,
      domain: item.domain,
      source: item.source,
      text: item.label
    })),
    additionalSpokenInformation: additionalNotes.trim()
  };
}

export function exportGroundTruthJson(args: ExportArgs) {
  const data = buildGroundTruthExport(args);
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${args.clinicalCase.id}_${args.sessionId}_ground_truth.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
