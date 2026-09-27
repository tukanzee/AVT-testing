import type { GroundTruthExport } from "../utils/json";
import { RUBRIC_VERSION } from "./rules";
import {
  FIRSTNET_COMPONENTS,
  VALIDATION_CATEGORIES,
  type AvtComponentContent,
  type ValidationFinding,
  type ValidationResult
} from "./types";
import type { ValidationProvider } from "./provider";

const apiUrl = import.meta.env.VITE_VALIDATION_API_URL as string | undefined;

function isFinding(value: unknown): value is ValidationFinding {
  if (!value || typeof value !== "object") return false;
  const finding = value as Record<string, unknown>;
  return (
    typeof finding.id === "string" &&
    FIRSTNET_COMPONENTS.includes(finding.component as (typeof FIRSTNET_COMPONENTS)[number]) &&
    VALIDATION_CATEGORIES.includes(finding.category as (typeof VALIDATION_CATEGORIES)[number]) &&
    typeof finding.avtText === "string" &&
    typeof finding.sourceText === "string" &&
    typeof finding.description === "string"
  );
}

function parseResult(value: unknown): ValidationResult {
  if (!value || typeof value !== "object") {
    throw new Error("Validation service returned an invalid response.");
  }

  const result = value as Record<string, unknown>;
  if (
    result.rubricVersion !== RUBRIC_VERSION ||
    typeof result.sourceFacts !== "number" ||
    typeof result.correctFacts !== "number" ||
    !Array.isArray(result.findings) ||
    !result.findings.every(isFinding)
  ) {
    throw new Error("Validation service response did not match the expected schema.");
  }

  return result as unknown as ValidationResult;
}

export const apiValidationProvider: ValidationProvider = {
  async validate(groundTruth: GroundTruthExport, avt: AvtComponentContent) {
    if (!apiUrl) {
      throw new Error("No validation API has been configured.");
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rubricVersion: RUBRIC_VERSION,
        groundTruth,
        avtOutput: avt
      })
    });

    if (!response.ok) {
      throw new Error(`Validation service failed (${response.status}).`);
    }

    return parseResult(await response.json());
  }
};
