import { jsPDF } from "jspdf";
import type { ClinicalCase, GroundTruthItem } from "../types";

type ExportArgs = {
  clinicalCase: ClinicalCase;
  sessionId: string;
  selectedItems: GroundTruthItem[];
  additionalNotes: string;
};

export function exportGroundTruthPdf({
  clinicalCase,
  sessionId,
  selectedItems,
  additionalNotes
}: ExportArgs) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });

  const left = 16;
  const right = 194;
  const lineHeight = 6;
  let y = 18;

  const ensureSpace = (needed = 12) => {
    if (y + needed > 280) {
      pdf.addPage();
      y = 18;
    }
  };

  const addWrapped = (text: string, indent = 0, fontSize = 10) => {
    pdf.setFontSize(fontSize);
    const width = right - left - indent;
    const lines = pdf.splitTextToSize(text, width);
    ensureSpace(lines.length * lineHeight + 2);
    pdf.text(lines, left + indent, y);
    y += lines.length * lineHeight;
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Clinical Ground Truth Record", left, y);
  y += 9;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  addWrapped(`${clinicalCase.id} — ${clinicalCase.title}`);
  addWrapped(`Setting: ${clinicalCase.setting}`);
  addWrapped(`Session reference: ${sessionId}`);
  addWrapped(`Generated: ${new Date().toLocaleString()}`);
  y += 3;

  const domains = Array.from(new Set(selectedItems.map((item) => item.domain)));

  if (selectedItems.length === 0) {
    pdf.setFont("helvetica", "italic");
    addWrapped("No predefined clinical facts were marked as spoken.");
    pdf.setFont("helvetica", "normal");
  } else {
    for (const domain of domains) {
      ensureSpace(16);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(domain, left, y);
      y += 7;

      pdf.setFont("helvetica", "normal");
      const items = selectedItems.filter((item) => item.domain === domain);
      for (const item of items) {
        addWrapped(`• ${item.label}`, 2, 10);
      }
      y += 2;
    }
  }

  if (additionalNotes.trim()) {
    ensureSpace(18);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Additional spoken information", left, y);
    y += 7;

    pdf.setFont("helvetica", "normal");
    addWrapped(additionalNotes.trim(), 0, 10);
  }

  y += 4;
  ensureSpace(20);
  pdf.setDrawColor(210);
  pdf.line(left, y, right, y);
  y += 7;
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(8);
  addWrapped(
    "This record reflects only items manually marked as having been spoken aloud during a synthetic role-play consultation. It is not a clinical record and should not contain real patient-identifiable information.",
    0,
    8
  );

  pdf.save(`${clinicalCase.id}_${sessionId}_ground_truth.pdf`);
}
