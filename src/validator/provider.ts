import type { GroundTruthExport } from "../utils/json";
import type { AvtComponentContent, ValidationResult } from "./types";
import { apiValidationProvider } from "./apiProvider";
import { mockValidationProvider } from "./mockValidator";

export interface ValidationProvider {
  validate(
    groundTruth: GroundTruthExport,
    avt: AvtComponentContent
  ): Promise<ValidationResult>;
}

const useApiProvider = Boolean(import.meta.env.VITE_VALIDATION_API_URL);

// The UI talks only to this provider. Configure VITE_VALIDATION_API_URL to switch
// from the local mock to an API/LLM-backed validator without changing the UI.
export const validationProvider: ValidationProvider = useApiProvider
  ? apiValidationProvider
  : mockValidationProvider;
