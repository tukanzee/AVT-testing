import type { ValidationCategory } from "./types";

export const RUBRIC_VERSION = "1.0";

export const CATEGORY_DEFINITIONS: Record<ValidationCategory, string> = {
  Omission: "Clinical content present in the script but absent from the exported record.",
  Duplication: "The same content reproduced in more than one component or more than once in the same component.",
  "Over-simplification": "Content retained but with detail, qualifier or specificity lost, or reworded in a way that reduces precision.",
  Misattribution: "Content attributed to the wrong person, wrong demographic, wrong speaker, or wrong actor.",
  Misclassification: "Content placed under the wrong heading, component or system category.",
  "Addition (not in script)": "Content that appears in the exported record with no basis in the source script.",
  "Clinical Decision Support / Inference": "The app has interpreted, diagnosed, labelled or drawn a clinical conclusion not stated by the clinician.",
  "Extraneous Content": "Text present in a clinical component that is not clinical documentation (system metadata, meta-commentary, narration).",
  "Observation (not an app defect)": "Noted for completeness; traced to a limitation of the source script or workflow, not to the app."
};

export const PROTECTED_ATTRIBUTES = [
  "negation",
  "numbers and measurements",
  "laterality",
  "timing and duration",
  "frequency",
  "dose",
  "route",
  "severity",
  "uncertainty or certainty",
  "person or speaker"
] as const;

export const VALIDATION_RULES = [
  "Treat semantically equivalent wording as supported when meaning and specificity are preserved.",
  "Do not treat a protected attribute as equivalent when it has changed or been removed.",
  "A fact may be captured and still generate a Misclassification finding if it appears in the wrong FirstNet component.",
  "If one underlying issue genuinely fits two categories, return two separate finding rows.",
  "Use Addition (not in script) where the exported content has no source basis.",
  "Use Clinical Decision Support / Inference where source content exists but the app adds an interpretation, diagnosis, label or clinical conclusion that was not stated by the clinician.",
  "Use Over-simplification when the core content is retained but a clinically meaningful detail or qualifier is lost.",
  "Include Observation (not an app defect) in the findings output when relevant.",
  "Preserve quoted source and AVT wording exactly in evidence fields.",
  "Keep discrepancy descriptions brief, neutral and evidence-based.",
  "Do not invent source content, severity or intent.",
  "When classification is genuinely uncertain, make the best judgement and mark the finding uncertain with a short reason."
] as const;
