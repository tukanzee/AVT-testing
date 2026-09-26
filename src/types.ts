export type GroundTruthDomain =
  | "History"
  | "Review of systems"
  | "Examination"
  | "Observations"
  | "Investigations"
  | "Plan / actions"
  | "Team involvement";

export type SpokenSource = "patient" | "clinician";

export interface GroundTruthItem {
  id: string;
  domain: GroundTruthDomain;
  source: SpokenSource;
  label: string;
  patientWording?: string;
}

export interface PromptSection {
  title: string;
  prompts: string[];
}

export interface ClinicalCase {
  id: string;
  title: string;
  specialty: string;
  setting: string;
  doctorBrief: string;
  doctorPromptSections: PromptSection[];
  patientName: string;
  patientAge: number;
  patientPortrayal: string;
  openingLine: string;
  historyItems: GroundTruthItem[];
  examinationItems: GroundTruthItem[];
  investigationItems: GroundTruthItem[];
  planItems: GroundTruthItem[];
}
