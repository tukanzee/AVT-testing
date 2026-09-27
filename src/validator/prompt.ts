import type { GroundTruthExport } from "../utils/json";
import {
  CATEGORY_DEFINITIONS,
  PROTECTED_ATTRIBUTES,
  RUBRIC_VERSION,
  VALIDATION_RULES
} from "./rules";
import { FIRSTNET_COMPONENTS, VALIDATION_CATEGORIES, type AvtComponentContent } from "./types";

export function buildValidationPrompt(
  groundTruth: GroundTruthExport,
  avtOutput: AvtComponentContent
) {
  const categoryBlock = VALIDATION_CATEGORIES.map(
    (category) => `- ${category}: ${CATEGORY_DEFINITIONS[category]}`
  ).join("\n");

  const rulesBlock = VALIDATION_RULES.map((rule, index) => `${index + 1}. ${rule}`).join("\n");
  const protectedBlock = PROTECTED_ATTRIBUTES.map((attribute) => `- ${attribute}`).join("\n");

  const sourceFacts = groundTruth.facts
    .map(
      (fact) =>
        `- ${fact.id} | domain=${fact.domain} | speaker=${fact.source} | text=${JSON.stringify(fact.text)}`
    )
    .join("\n");

  const components = FIRSTNET_COMPONENTS.map(
    (component) => `### ${component}\n${avtOutput[component].trim() || "[EMPTY]"}`
  ).join("\n\n");

  return `You are validating an Ambient Voice Technology generated clinical record against a confirmed synthetic ground truth.

Rubric version: ${RUBRIC_VERSION}

Use only these nine categories and their exact names:\n${categoryBlock}

Operational rules:\n${rulesBlock}

Protected attributes that must not be silently changed or dropped:\n${protectedBlock}

GROUND TRUTH FACTS\n${sourceFacts || "[NO FACTS]"}

Additional spoken information:\n${groundTruth.additionalSpokenInformation || "[NONE]"}

AVT FIRSTNET COMPONENTS\n${components}

TASK
1. Compare every ground-truth fact against the full AVT record.
2. Compare every AVT clinical statement against the ground truth.
3. Treat paraphrases as correct only where meaning and specificity are preserved.
4. Detect duplication both within one component and across components.
5. If correct content appears in the wrong component, count it as captured but return a Misclassification finding.
6. If one issue genuinely spans two categories, return two separate finding objects.
7. Return correctly captured facts in the correctFactIds array; do not create finding rows for them unless a separate defect applies.
8. Keep descriptions minimal and neutral.
9. Never invent missing source evidence.

Return JSON only, matching this shape exactly:
{
  "rubricVersion": "${RUBRIC_VERSION}",
  "correctFactIds": ["fact-id"],
  "findings": [
    {
      "component": "one of the supplied FirstNet component names",
      "category": "one of the nine exact category names",
      "avtText": "exact quoted AVT wording, or empty string",
      "sourceText": "exact quoted source wording, or empty string",
      "sourceFactIds": ["fact-id"],
      "description": "short neutral description",
      "uncertain": false,
      "uncertaintyReason": ""
    }
  ]
}`;
}
