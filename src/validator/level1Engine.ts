import type { GroundTruthExport } from "../utils/json";
import type {
  AvtComponentContent,
  FirstNetComponent,
  ValidationCategory
} from "./types";
import {
  judgeAvtStatementsAgainstSource,
  judgeSourceFactsAgainstAvt,
  type AvtJudgement,
  type SemanticAvtSentence,
  type SemanticSourceFact,
  type SourceJudgement
} from "./browserSemantic";

export type ReviewSignal =
  | "Possible omission"
  | "Possible semantic change"
  | "Number mismatch"
  | "Negation mismatch"
  | "Laterality mismatch"
  | "Timing mismatch"
  | "Possible wrong component"
  | "Possible unsupported content"
  | "Possible duplication";

export interface ReviewCandidate {
  id: string;
  component: FirstNetComponent;
  sourceFactIds: string[];
  sourceText: string;
  avtText: string;
  similarity?: number;
  signals: ReviewSignal[];
  suggestedCategory?: ValidationCategory;
  description: string;
  semanticStatus?: string;
  semanticReason?: string;
}

export interface Level1Analysis {
  sourceFacts: number;
  likelyCaptured: number;
  candidates: ReviewCandidate[];
}

type ProgressCallback = (message: string, percent?: number) => void;

type AvtSentence = SemanticAvtSentence & {
  component: FirstNetComponent;
};

type SourceFact = SemanticSourceFact & {
  domain: string;
};

export async function analyseLevel1(
  groundTruth: GroundTruthExport,
  avtOutput: AvtComponentContent,
  onProgress?: ProgressCallback
): Promise<Level1Analysis> {
  const sourceFacts = buildSourceFacts(groundTruth);
  const avtSentences = buildAvtSentences(avtOutput);

  if (avtSentences.length === 0) {
    return {
      sourceFacts: sourceFacts.length,
      likelyCaptured: 0,
      candidates: sourceFacts.map((fact, index) => ({
        id: `OMIT-${index + 1}`,
        component: expectedComponent(fact.domain),
        sourceFactIds: [fact.id],
        sourceText: fact.text,
        avtText: "",
        signals: ["Possible omission"],
        suggestedCategory: "Omission",
        description: `Possible omission: ${fact.text}`,
        semanticStatus: "not_present",
        semanticReason: "No AVT content was supplied."
      }))
    };
  }

  const candidates: ReviewCandidate[] = [];
  let likelyCaptured = 0;

  onProgress?.("Checking exact matches before semantic review…");

  const unresolvedSourceFacts: SourceFact[] = [];

  // PASS 1A: exact matches are deterministic and do not need the LLM.
  sourceFacts.forEach((fact) => {
    const exactMatches = avtSentences.filter(
      (sentence) => normalize(sentence.text) === normalize(fact.text)
    );

    if (exactMatches.length === 0) {
      unresolvedSourceFacts.push(fact);
      return;
    }

    const expected = expectedComponent(fact.domain);
    const inExpectedComponent = exactMatches.some(
      (match) => match.component === expected
    );

    if (inExpectedComponent) {
      likelyCaptured += 1;
      return;
    }

    const first = exactMatches[0];
    candidates.push({
      id: `SOURCE-${fact.id}`,
      component: first.component,
      sourceFactIds: [fact.id],
      sourceText: fact.text,
      avtText: first.text,
      signals: ["Possible wrong component"],
      suggestedCategory: "Misclassification",
      description: "Correct content documented under the wrong component.",
      semanticStatus: "supported",
      semanticReason: "Exact wording was found, but only in a different component."
    });
  });

  // PASS 1B: semantic scan SOURCE -> whole AVT record.
  let sourceJudgements: SourceJudgement[] = [];
  if (unresolvedSourceFacts.length > 0) {
    sourceJudgements = await judgeSourceFactsAgainstAvt(
      unresolvedSourceFacts,
      avtSentences,
      onProgress
    );
  }

  const avtById = new Map(avtSentences.map((sentence) => [sentence.id, sentence]));

  sourceJudgements.forEach((judgement) => {
    const fact = unresolvedSourceFacts.find(
      (item) => item.id === judgement.sourceId
    );
    if (!fact) return;

    const expected = expectedComponent(fact.domain);
    const evidence = judgement.evidenceIds
      .map((id) => avtById.get(id))
      .filter((item): item is AvtSentence => Boolean(item));

    const evidenceText = evidence.map((item) => item.text).join(" / ");
    const evidenceComponent = chooseEvidenceComponent(evidence, expected);

    if (judgement.relationship === "not_present") {
      candidates.push({
        id: `SOURCE-${fact.id}`,
        component: expected,
        sourceFactIds: [fact.id],
        sourceText: fact.text,
        avtText: "",
        signals: ["Possible omission"],
        suggestedCategory: "Omission",
        description: `Possible omission: ${fact.text}`,
        semanticStatus: judgement.relationship,
        semanticReason: judgement.reason
      });
      return;
    }

    if (evidence.length === 0) {
      throw new Error(
        `The semantic model marked ${fact.id} as ${judgement.relationship} but did not return valid AVT evidence. Please run the analysis again.`
      );
    }

    const protectedSignals = compareProtectedAttributes(
      fact.text,
      evidenceText,
      judgement.relationship
    );

    if (judgement.relationship === "contradicted") {
      const signals = unique([
        ...protectedSignals,
        "Possible semantic change" as ReviewSignal
      ]);

      candidates.push({
        id: `SOURCE-${fact.id}`,
        component: evidenceComponent,
        sourceFactIds: [fact.id],
        sourceText: fact.text,
        avtText: evidenceText,
        signals,
        suggestedCategory: "Omission",
        description: "The AVT wording appears to contradict the source fact.",
        semanticStatus: judgement.relationship,
        semanticReason: judgement.reason
      });
      return;
    }

    if (judgement.relationship === "partial" || protectedSignals.length > 0) {
      const signals = unique([
        ...protectedSignals,
        ...(judgement.relationship === "partial"
          ? (["Possible semantic change"] as ReviewSignal[])
          : [])
      ]);

      candidates.push({
        id: `SOURCE-${fact.id}`,
        component: evidenceComponent,
        sourceFactIds: [fact.id],
        sourceText: fact.text,
        avtText: evidenceText,
        signals: signals.length ? signals : ["Possible semantic change"],
        suggestedCategory: "Over-simplification",
        description: "Related AVT content was found but the full source meaning may not be preserved.",
        semanticStatus: judgement.relationship,
        semanticReason: judgement.reason
      });
      return;
    }

    // SUPPORTED: only now consider component placement.
    const supportedInExpectedComponent = evidence.some(
      (item) => item.component === expected
    );

    if (!supportedInExpectedComponent) {
      candidates.push({
        id: `SOURCE-${fact.id}`,
        component: evidenceComponent,
        sourceFactIds: [fact.id],
        sourceText: fact.text,
        avtText: evidenceText,
        signals: ["Possible wrong component"],
        suggestedCategory: "Misclassification",
        description: "Supported content appears only under a different FirstNet component.",
        semanticStatus: judgement.relationship,
        semanticReason: judgement.reason
      });
      return;
    }

    likelyCaptured += 1;
  });

  // PASS 2: AVT -> SOURCE. This finds additions and gives contradictions the
  // second side of the discrepancy (source omission + contradictory AVT content).
  const nonExactAvtSentences = avtSentences.filter(
    (sentence) =>
      !sourceFacts.some(
        (fact) => normalize(fact.text) === normalize(sentence.text)
      )
  );

  let avtJudgements: AvtJudgement[] = [];
  if (nonExactAvtSentences.length > 0) {
    avtJudgements = await judgeAvtStatementsAgainstSource(
      nonExactAvtSentences,
      sourceFacts,
      onProgress
    );
  }

  const sourceById = new Map(sourceFacts.map((fact) => [fact.id, fact]));

  avtJudgements.forEach((judgement) => {
    if (judgement.relationship === "supported") return;

    const statement = avtById.get(judgement.avtId);
    if (!statement) return;

    const sourceEvidence = judgement.sourceIds
      .map((id) => sourceById.get(id))
      .filter((item): item is SourceFact => Boolean(item));

    const sourceText = sourceEvidence.map((item) => item.text).join(" / ");

    if (judgement.relationship === "partial") {
      candidates.push({
        id: `ADDITION-${statement.id}`,
        component: statement.component,
        sourceFactIds: sourceEvidence.map((item) => item.id),
        sourceText,
        avtText: statement.text,
        signals: ["Possible unsupported content"],
        suggestedCategory: "Addition (not in script)",
        description: "The AVT statement is only partly grounded and may add unsupported or inferred content.",
        semanticStatus: judgement.relationship,
        semanticReason: judgement.reason
      });
      return;
    }

    if (judgement.relationship === "contradicted") {
      candidates.push({
        id: `ADDITION-${statement.id}`,
        component: statement.component,
        sourceFactIds: sourceEvidence.map((item) => item.id),
        sourceText,
        avtText: statement.text,
        signals: ["Possible unsupported content"],
        suggestedCategory: "Addition (not in script)",
        description: "The AVT statement conflicts with the source and may represent unsupported contradictory content.",
        semanticStatus: judgement.relationship,
        semanticReason: judgement.reason
      });
      return;
    }

    if (judgement.relationship === "not_supported") {
      candidates.push({
        id: `ADDITION-${statement.id}`,
        component: statement.component,
        sourceFactIds: [],
        sourceText: "",
        avtText: statement.text,
        signals: ["Possible unsupported content"],
        suggestedCategory: "Addition (not in script)",
        description: "Possible unsupported content; no source support was found.",
        semanticStatus: judgement.relationship,
        semanticReason: judgement.reason
      });
    }
  });

  // PASS 3: exact duplication remains deterministic.
  findDuplicates(avtSentences).forEach((duplicate, index) => {
    candidates.push({
      id: `DUP-${index + 1}`,
      component: duplicate.second.component,
      sourceFactIds: [],
      sourceText: "",
      avtText: `${duplicate.first.text} / ${duplicate.second.text}`,
      signals: ["Possible duplication"],
      suggestedCategory: "Duplication",
      description: "Possible duplicate content detected across the AVT record.",
      semanticStatus: "deterministic",
      semanticReason: "The same normalized wording appears more than once."
    });
  });

  onProgress?.("Semantic screening complete.", 100);

  return {
    sourceFacts: sourceFacts.length,
    likelyCaptured,
    candidates: dedupeCandidates(candidates)
  };
}

function buildSourceFacts(groundTruth: GroundTruthExport): SourceFact[] {
  const facts: SourceFact[] = groundTruth.facts.map((fact) => ({
    id: fact.id,
    domain: fact.domain,
    text: fact.text
  }));

  splitSentences(groundTruth.additionalSpokenInformation).forEach(
    (text, index) => {
      facts.push({
        id: `additional-${index + 1}`,
        domain: "History",
        text
      });
    }
  );

  return facts;
}

function buildAvtSentences(avtOutput: AvtComponentContent): AvtSentence[] {
  const result: AvtSentence[] = [];

  Object.entries(avtOutput).forEach(([component, content]) => {
    splitSentences(content).forEach((text, index) => {
      result.push({
        id: `${componentCode(component as FirstNetComponent)}-${index + 1}`,
        component: component as FirstNetComponent,
        text
      });
    });
  });

  return result;
}

function splitSentences(text: string) {
  return text
    .replace(/^[•\-*]+\s*/gm, "")
    .split(/\n+|(?<=[.!?;])\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 3);
}

function expectedComponent(domain: string): FirstNetComponent {
  if (domain === "Review of systems") return "Review of Systems";

  if (["Examination", "Observations", "Investigations"].includes(domain)) {
    return "Examination Findings";
  }

  if (["Plan / actions", "Team involvement"].includes(domain)) {
    return "Plan and Requested Actions";
  }

  return "History of Presenting Complaint";
}

function chooseEvidenceComponent(
  evidence: AvtSentence[],
  expected: FirstNetComponent
): FirstNetComponent {
  const expectedEvidence = evidence.find(
    (item) => item.component === expected
  );
  return expectedEvidence?.component ?? evidence[0]?.component ?? expected;
}

function compareProtectedAttributes(
  source: string,
  evidence: string,
  relationship: SourceJudgement["relationship"]
): ReviewSignal[] {
  const signals: ReviewSignal[] = [];

  const sourceNumbers = numbers(source);
  const evidenceNumbers = numbers(evidence);

  // Extra numbers in a longer AVT sentence do not constitute a mismatch.
  // Only flag when a source number is absent from the supporting evidence.
  if (
    sourceNumbers.length > 0 &&
    !sourceNumbers.every((value) => evidenceNumbers.includes(value))
  ) {
    signals.push("Number mismatch");
  }

  const sourceNegated = hasNegation(source);
  const evidenceNegated = hasNegation(evidence);

  // Be conservative with long sentences. A positive source fact should only
  // be treated as a negation mismatch when Qwen has already judged a contradiction.
  if (
    (sourceNegated && !evidenceNegated) ||
    (!sourceNegated && evidenceNegated && relationship === "contradicted")
  ) {
    signals.push("Negation mismatch");
  }

  const sourceSide = laterality(source);
  const evidenceSide = laterality(evidence);
  if (sourceSide && evidenceSide && sourceSide !== evidenceSide) {
    signals.push("Laterality mismatch");
  }

  const sourceTiming = timing(source);
  const evidenceTiming = timing(evidence);
  if (sourceTiming && evidenceTiming && sourceTiming !== evidenceTiming) {
    signals.push("Timing mismatch");
  }

  return signals;
}

function findDuplicates(sentences: AvtSentence[]) {
  const duplicates: Array<{ first: AvtSentence; second: AvtSentence }> = [];

  for (let i = 0; i < sentences.length; i += 1) {
    for (let j = i + 1; j < sentences.length; j += 1) {
      const first = normalize(sentences[i].text);
      const second = normalize(sentences[j].text);

      if (first.length >= 12 && first === second) {
        duplicates.push({ first: sentences[i], second: sentences[j] });
      }
    }
  }

  return duplicates;
}

function numbers(text: string): string[] {
  return Array.from(text.match(/\b\d+(?:\.\d+)?\b/g) ?? []);
}

function hasNegation(text: string) {
  return /\b(no|not|never|none|denies|denied|without|negative for|hasn't|haven't|didn't|doesn't)\b/i.test(
    text
  );
}

function laterality(text: string) {
  if (/\bleft\b/i.test(text)) return "left";
  if (/\bright\b/i.test(text)) return "right";
  if (/\bbilateral\b|\bboth\b/i.test(text)) return "bilateral";
  return "";
}

function timing(text: string) {
  const match = text.toLowerCase().match(
    /\b(?:today|yesterday|tonight|this morning|this afternoon|\d+\s*(?:hour|hours|day|days|week|weeks|month|months|year|years))\b/
  );
  return match?.[0] ?? "";
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function componentCode(component: FirstNetComponent) {
  switch (component) {
    case "History of Presenting Complaint":
      return "HPC";
    case "Review of Systems":
      return "ROS";
    case "Examination Findings":
      return "EXAM";
    case "Actions for Patient":
      return "PAT";
    case "Actions for GP":
      return "GP";
    case "Plan and Requested Actions":
      return "PLAN";
  }
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function dedupeCandidates(candidates: ReviewCandidate[]) {
  const seen = new Set<string>();

  return candidates.filter((candidate) => {
    const key = `${candidate.sourceText}|${candidate.avtText}|${candidate.signals.join("|")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
