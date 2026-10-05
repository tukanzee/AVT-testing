import { jsPDF } from 'jspdf';
import type { AVTClaim, TranscriptComparisonUnit, ValidationDecision, OmissionDecision } from './workflowTypes';
import type { CoverageLink } from './coverage';
export interface ReviewReport { sessionReference: string; claims: AVTClaim[]; chunks: TranscriptComparisonUnit[]; claimDecisions: Record<string, ValidationDecision>; omissionDecisions: Record<string, OmissionDecision>; coverage: CoverageLink[]; remaining: number }
export function reportFindings(data: ReviewReport) {
  const fromClaims = data.claims.flatMap(c => {
    const d = data.claimDecisions[c.id];
    return d?.reviewed && !d.correctSupported && d.categories.length ? [{ source: 'AVT claim review', section: c.section, claim: c.text, categories: d.categories, comment: d.comment, evidence: (d.transcriptChunkIds ?? []).map(id => data.chunks.find(u => u.id === id)).filter(u => !!u).map(u => `${u.id} (lines ${u.startLine}-${u.endLine}): ${u.text}`).join('\n') }] : [];
  });
  const fromResidual = Object.values(data.omissionDecisions).flatMap(d => {
    const unit = data.chunks.find(u => `omission-${u.id}` === d.itemId);
    const claim = data.claims.find(c => c.id === d.avtClaimId);
    return d.reviewed && !d.irrelevant && !d.correctSupported && d.categories.length ? [{ source: 'Residual transcript review', section: claim?.section ?? '', claim: claim?.text ?? '', categories: d.categories, comment: d.comment, evidence: unit ? `${unit.id} (lines ${unit.startLine}-${unit.endLine}): ${unit.text}` : '' }] : [];
  });
  return [...fromClaims, ...fromResidual];
}
export function createExceptionPdf(data: ReviewReport) {
  const pdf = new jsPDF();
  let y = 20;
  const clean = (text: string) => text.replace(/[–—]/g, '-').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/→/g, '->');
  const write = (text: string, size = 10, bold = false) => {
    pdf.setFont('helvetica', bold ? 'bold' : 'normal'); pdf.setFontSize(size);
    const lines: string[] = pdf.splitTextToSize(clean(text), 178);
    for (const line of lines) {
      if (y > 278) { pdf.addPage(); y = 20; }
      pdf.text(line, 16, y); y += size * .48 + 1;
    }
    y += 3;
  };
  const findings = reportFindings(data);
  const reviewedClaims = Object.values(data.claimDecisions).filter(d => d.reviewed).length;
  const reviewedResidual = Object.values(data.omissionDecisions).filter(d => d.reviewed).length;
  const complete = reviewedClaims === data.claims.length && data.remaining === 0;
  write('Transcript vs AVT - Exception Report', 18, true);
  write(`Session / case: ${data.sessionReference || 'Not supplied'}`);
  write(`Generated: ${new Date().toISOString()}`);
  write(complete ? 'Review status: complete' : 'Review status: incomplete - unreviewed content remains', 11, true);
  write(`AVT claims reviewed: ${reviewedClaims} / ${data.claims.length}\nResidual transcript items reviewed: ${reviewedResidual}\nResidual items remaining: ${data.remaining}\nFindings identified: ${findings.length}`);
  if (!findings.length) write(complete ? 'Validation completed successfully. No discrepancies were identified during the review.' : 'No discrepancies have been identified in the reviewed content. Validation is not yet complete.', 12, true);
  findings.forEach((f,i) => {
    write(`Finding ${i+1}: ${f.categories.join('; ')}`, 12, true);
    write(`Source: ${f.source}`);
    if (f.section) write(`AVT section: ${f.section}`);
    if (f.claim) write(`AVT claim: ${f.claim}`);
    write(`Linked transcript evidence: ${f.evidence || 'None selected'}`);
    if (f.comment) write(`Reviewer comment: ${f.comment}`);
  });
  write('Category summary', 12, true);
  const counts = new Map<string,number>();
  findings.forEach(f => f.categories.forEach(c => counts.set(c,(counts.get(c) ?? 0)+1)));
  if (!counts.size) write('No finding categories.');
  counts.forEach((count,category) => write(`${category} x ${count}`));
  write('All classifications are human reviewer decisions. Automated retrieval and warnings do not determine correctness.', 9);
  for (let page = 1; page <= pdf.getNumberOfPages(); page++) { pdf.setPage(page); pdf.setFontSize(8); pdf.text(`Page ${page} of ${pdf.getNumberOfPages()}`, 165, 289); }
  return pdf;
}
export function exportExceptionPdf(data: ReviewReport) {
  const pdf = createExceptionPdf(data);
  const blob = pdf.output("blob");
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `transcript-avt-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}