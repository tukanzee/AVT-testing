import type { AVTClaim, StatementType, TranscriptComparisonUnit } from "../workflowTypes";

export function classifyTranscriptStatement(text: string): StatementType {
  if (/^\s*C:\s*(?:do you|have you|has the patient|how|what|when|where|why|can you|could you|are you|is there)\b|\?\s*(?:\n|$)/i.test(text)) {
    return "clinician_question";
  }
  if (/^\s*C:\s*.*\b(?:chest is clear|heart rate is|pulse is|blood pressure is|temperature is|oxygen saturation|no guarding|abdomen is|patient appears|on examination|tenderness|auscultation)\b/i.test(text)) {
    return "examination_finding";
  }
  if (/^\s*C:\s*.*\b(?:we(?:'re| are) going to|we will|we'll|i will|i'll|start|continue|refer|admit|monitor|check|investigate|take a|obtain|insert|arrange|repeat)\b/i.test(text)) {
    return "clinician_plan";
  }
  if (/^\s*P:\s*/i.test(text)) return "patient_history";
  return "other";
}

export function classifyClaimStatement(claim: AVTClaim): StatementType {
  if (claim.section === "Plan and Requested Actions") return "clinician_plan";
  if (claim.section === "Examination Findings") return "examination_finding";
  return "other";
}

export function statementTypeCompatibility(unit: TranscriptComparisonUnit, claim: AVTClaim) {
  const transcriptType = classifyTranscriptStatement(unit.text);
  const claimType = classifyClaimStatement(claim);
  if (claimType === "other" || transcriptType === "other") return 0;
  if (claimType === transcriptType) return 0.1;
  if (transcriptType === "clinician_question" && claimType === "patient_history") return 0.02;
  return -0.1;
}
