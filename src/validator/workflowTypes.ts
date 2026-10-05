export type SpeakerRole = "clinician" | "patient" | "uncertain";

export interface ParsedTranscriptLine {
  lineNumber: number;
  endLine?: number;
  speaker: SpeakerRole;
  speakerLabel: string;
  text: string;
  raw: string;
}

export interface TranscriptComparisonUnit {
  id: string;
  speaker: "P" | "C" | "P/C";
  text: string;
  originalTurnText: string;
  startLine: number;
  endLine: number;
  parentTurnId: string;
  contextText?: string;
  rawLines: string[];
}

export type TranscriptEvidenceChunk = TranscriptComparisonUnit;

export const TRANSCRIPT_AVT_SECTIONS = [
  "History of Presenting Complaint",
  "Review of Systems",
  "Examination Findings",
  "Plan and Requested Actions"
] as const;

export type TranscriptAvtSection = (typeof TRANSCRIPT_AVT_SECTIONS)[number];

export interface AVTSection {
  id: string;
  title: TranscriptAvtSection;
  text: string;
}

export interface AVTClaim {
  id: string;
  section: TranscriptAvtSection;
  originalSentence: string;
  text: string;
}

export interface EvidenceMatch {
  claimId: string;
  transcriptChunkId: string;
  transcriptText: string;
  semanticSimilarity: number;
  keywordOverlap: number;
  matchedTerms: string[];
  phraseMatchScore: number;
  matchingNumbers: string[];
  conflictingNumbers: Array<{ avt: string; transcript: string }>;
  negationWarning: boolean;
  exactPhraseOverlap: boolean;
  rankScore: number;
  nli?: NLIRelationship;
  statementType?: StatementType;
}

export interface ValidationDecision {
  claimId: string;
  reviewed: boolean;
  correctSupported: boolean;
  categories: import("./types").ValidationCategory[];
  comment: string;
  transcriptChunkIds?: string[];
  skipped?: boolean;
}

export interface OmissionDecision {
  itemId: string;
  reviewed: boolean;
  correctSupported: boolean;
  categories: import("./types").ValidationCategory[];
  comment: string;
  avtClaimId?: string;
  irrelevant?: boolean;
  skipped?: boolean;
}

export interface TranscriptAVTMatch {
  transcriptUnitId: string;
  avtClaimId: string;
  avtClaimText: string;
  avtSection: TranscriptAvtSection;
  semanticSimilarity: number;
  matchingTerms: string[];
  matchingNumbers: string[];
  conflictingNumbers: Array<{ transcript: string; avt: string }>;
  negationWarning: boolean;
  exactPhraseOverlap: boolean;
  rankScore: number;
  entailment?: number;
  contradiction?: number;
  neutral?: number;
  statementType?: StatementType;
}

export type StatementType = "patient_history" | "clinician_question" | "examination_finding" | "clinician_plan" | "other";

export interface NLIRelationship {
  entailment: number;
  contradiction: number;
  neutral: number;
}

export interface OmissionCandidate {
  itemId: string;
  transcriptChunkId: string;
  transcriptText: string;
  bestAvtClaimId?: string;
  bestAvtClaimText?: string;
  retrievalSimilarity: number;
  matches: TranscriptAVTMatch[];
  matchDetails: EvidenceMatch[];
  startLine: number;
  endLine: number;
  originalTurnText: string;
  contextText?: string;
}
