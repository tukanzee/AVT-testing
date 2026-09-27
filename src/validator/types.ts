export const VALIDATION_CATEGORIES = [
  "OMISSION",
  "DUPLICATION",
  "OVER-SIMPLIFICATION",
  "MISATTRIBUTION",
  "MISCLASSIFICATION",
  "ADDITION - NOT IN SCRIPT",
  "CLINICAL DECISION SUPPORT / INFERENCE",
  "EXTRANEOUS CONTENT",
  "OBSERVATION - NOT AN APP DEFECT"
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
  uncertain?: boolean;
}

export interface ValidationResult {
  sourceFacts: number;
  correctFacts: number;
  findings: ValidationFinding[];
}
