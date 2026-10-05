import { VALIDATION_CATEGORIES, type ValidationCategory } from "../types";
import type {
  AVTClaim,
  OmissionDecision,
  TranscriptEvidenceChunk,
  ValidationDecision
} from "../workflowTypes";

type Props = {
  claims: AVTClaim[];
  chunks: TranscriptEvidenceChunk[];
  claimDecisions: Record<string, ValidationDecision>;
  omissionDecisions: Record<string, OmissionDecision>;
  unresolvedCount: number;
  onEditClaim: (claimId: string) => void;
  onEditResidual: (itemId: string) => void;
};

type FindingRow = {
  id: string;
  source: "AVT claim review" | "Residual transcript review";
  categories: ValidationCategory[];
  comment: string;
  avtClaim?: AVTClaim;
  transcriptUnits: TranscriptEvidenceChunk[];
  omissionItemId?: string;
};

export default function FindingsReview({
  claims,
  chunks,
  claimDecisions,
  omissionDecisions,
  unresolvedCount,
  onEditClaim,
  onEditResidual
}: Props) {
  const findings = buildFindings(claims, chunks, claimDecisions, omissionDecisions);
  const categoryCounts = VALIDATION_CATEGORIES
    .map((category) => ({
      category,
      count: findings.reduce((total, finding) => total + (finding.categories.includes(category) ? 1 : 0), 0)
    }))
    .filter((item) => item.count > 0);

  return (
    <section className="panel findings-review">
      <div className="findings-review-header">
        <div>
          <span className="comparison-label">Final review before export</span>
          <h2>Findings review</h2>
          <p className="muted-copy">
            Review the items you classified as findings before generating the PDF exception report.
          </p>
        </div>
        <div className="findings-count-badge">{findings.length} finding{findings.length === 1 ? "" : "s"}</div>
      </div>

      {unresolvedCount > 0 && (
        <div className="findings-unresolved-note">
          <strong>{unresolvedCount} item{unresolvedCount === 1 ? "" : "s"} still unresolved.</strong>
          <span>You can still review the findings now; PDF export will warn before exporting an incomplete review.</span>
        </div>
      )}

      {categoryCounts.length > 0 && (
        <div className="finding-category-summary" aria-label="Finding category summary">
          {categoryCounts.map(({ category, count }) => (
            <span
              key={category}
              className="finding-category-chip"
              data-category={VALIDATION_CATEGORIES.indexOf(category) + 1}
            >
              {shortCategory(category)} × {count}
            </span>
          ))}
        </div>
      )}

      {!findings.length ? (
        <div className="no-findings-state">
          <strong>No findings identified.</strong>
          <p>
            Reviewed items are currently either supported, resolved elsewhere in the AVT, or judged not to need documentation.
          </p>
        </div>
      ) : (
        <div className="findings-list">
          {findings.map((finding, index) => (
            <article className="finding-review-card" key={finding.id}>
              <div className="finding-card-heading">
                <div>
                  <span className="finding-number">Finding {index + 1}</span>
                  <strong>{finding.source}</strong>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => finding.source === "AVT claim review"
                    ? onEditClaim(finding.avtClaim!.id)
                    : onEditResidual(finding.omissionItemId!)}
                >
                  Edit review
                </button>
              </div>

              <div className="finding-category-row">
                {finding.categories.map((category) => (
                  <span
                    key={category}
                    className="finding-category-chip"
                    data-category={VALIDATION_CATEGORIES.indexOf(category) + 1}
                  >
                    {shortCategory(category)}
                  </span>
                ))}
              </div>

              {finding.avtClaim && (
                <div className="finding-content-block">
                  <span className="comparison-label">AVT claim</span>
                  <strong>{finding.avtClaim.text}</strong>
                  <span className="section-chip">{finding.avtClaim.section}</span>
                </div>
              )}

              <div className="finding-content-block">
                <span className="comparison-label">Transcript evidence / source</span>
                {finding.transcriptUnits.length ? finding.transcriptUnits.map((unit) => (
                  <div className="finding-transcript-unit" key={unit.id}>
                    <small>{unit.id} · lines {unit.startLine}–{unit.endLine}</small>
                    <p>{unit.text}</p>
                  </div>
                )) : <p className="muted-copy">No transcript evidence linked.</p>}
              </div>

              {finding.comment && (
                <div className="finding-content-block">
                  <span className="comparison-label">Reviewer comment</span>
                  <p>{finding.comment}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function buildFindings(
  claims: AVTClaim[],
  chunks: TranscriptEvidenceChunk[],
  claimDecisions: Record<string, ValidationDecision>,
  omissionDecisions: Record<string, OmissionDecision>
): FindingRow[] {
  const rows: FindingRow[] = [];

  Object.values(claimDecisions)
    .filter((decision) => decision.reviewed && decision.categories.length > 0)
    .forEach((decision) => {
      const avtClaim = claims.find((claim) => claim.id === decision.claimId);
      if (!avtClaim) return;
      rows.push({
        id: `claim-${decision.claimId}`,
        source: "AVT claim review",
        categories: decision.categories,
        comment: decision.comment,
        avtClaim,
        transcriptUnits: (decision.transcriptChunkIds ?? [])
          .map((id) => chunks.find((chunk) => chunk.id === id))
          .filter((unit): unit is TranscriptEvidenceChunk => Boolean(unit))
      });
    });

  Object.values(omissionDecisions)
    .filter((decision) => decision.reviewed && !decision.irrelevant && decision.categories.length > 0)
    .forEach((decision) => {
      const unitId = decision.itemId.replace(/^omission-/, "");
      const transcriptUnit = chunks.find((chunk) => chunk.id === unitId);
      const avtClaim = decision.avtClaimId
        ? claims.find((claim) => claim.id === decision.avtClaimId)
        : undefined;

      rows.push({
        id: `residual-${decision.itemId}`,
        source: "Residual transcript review",
        categories: decision.categories,
        comment: decision.comment,
        avtClaim,
        transcriptUnits: transcriptUnit ? [transcriptUnit] : [],
        omissionItemId: decision.itemId
      });
    });

  return rows;
}

function shortCategory(category: ValidationCategory) {
  if (category === "Addition (not in script)") return "Addition";
  if (category === "Observation (not an app defect)") return "Observation";
  return category;
}
