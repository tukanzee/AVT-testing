export const VALIDATION_CATEGORIES = [
  "Omission",
  "Duplication",
  "Over-simplification",
  "Misattribution",
  "Misclassification",
  "Addition (not in script)",
  "Clinical Decision Support / Inference",
  "Extraneous Content",
  "Observation (not an app defect)"
] as const;

export type ValidationCategory = (typeof VALIDATION_CATEGORIES)[number];

export const FIRSTNET_COMPONENTS = [
  "History of Presenting Complaint",
  "Review of Systems",
  "Examination Findings",
  "Actions for Patient",
  "Actions for GP",
  "Plan and Requested Actions"
] as const;

export type FirstNetComponent = (typeof FIRSTNET_COMPONENTS)[number];

export type AvtComponentContent = Record<FirstNetComponent, string>;

export interface ValidationFinding {
  id: string;
  component: FirstNetComponent;
  category: ValidationCategory;
  avtText: string;
  sourceText: string;
  description: string;
  sourceFactIds?: string[];
  uncertain?: boolean;
  uncertaintyReason?: string;
}

export interface ValidationResult {
  rubricVersion: string;
  sourceFacts: number;
  correctFacts: number;
  findings: ValidationFinding[];
}

export interface ValidationRequest {
  rubricVersion: string;
  groundTruth: unknown;
  avtOutput: AvtComponentContent;
}
