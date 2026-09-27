import type { GroundTruthExport } from "../utils/json";
import type { AvtComponentContent, ValidationResult } from "./types";
import { mockValidationProvider } from "./mockValidator";

export interface ValidationProvider {
  validate(
    groundTruth: GroundTruthExport,
    avt: AvtComponentContent
  ): Promise<ValidationResult>;
}

// Swap this single export for an API-backed provider when the LLM endpoint is ready.
export const validationProvider: ValidationProvider = mockValidationProvider;
