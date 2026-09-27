import { pipeline } from "@huggingface/transformers";
import type { GroundTruthExport } from "../utils/json";
import type {
  AvtComponentContent,
  FirstNetComponent,
  ValidationCategory
} from "./types";

const MODEL_ID = "mixedbread-ai/mxbai-embed-xsmall-v1";
const OMIT_THRESHOLD = 0.47;
const REVIEW_THRESHOLD = 0.69;
const ADDITION_THRESHOLD = 0.42;

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
}

export interface Level1Analysis {
  sourceFacts: number;
  likelyCaptured: number;
  candidates: ReviewCandidate[];
}

type ProgressCallback = (message: string, percent?: number) => void;

type AvtSentence = {
  id: string;
  component: FirstNetComponent;
  text: string;
};

type SourceFact = {
  id: string;
  domain: string;
  text: string;
};

let extractorPromise: ReturnType<typeof createExtractor> | null = null;

async function createExtractor(onProgress?: ProgressCallback) {
  const hasWebGpu = Boolean((navigator as Navigator & { gpu?: unknown }).gpu);
  const device = (hasWebGpu ? "webgpu" : "wasm") as "webgpu" | "wasm";

  onProgress?.(
    hasWebGpu
      ? "Loading local semantic matching model with WebGPU…"
      : "WebGPU unavailable; loading local semantic matching model on CPU…"
  );

  return pipeline("feature-extraction", MODEL_ID, {
    device,
    progress_callback: (progress: { status?: string; progress?: number; file?: string }) => {
      if (typeof progress.progress === "number") {
        onProgress?.(
          progress.file ? `Loading ${progress.file}…` : "Loading semantic model…",
          Math.round(progress.progress)
        );
      }
    }
  });
}

async function getExtractor(onProgress?: ProgressCallback) {
  if (!extractorPromise) extractorPromise = createExtractor(onProgress);
  return extractorPromise;
}

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
        description: `Possible omission: ${fact.text}`
      }))
    };
  }

  const texts = [...sourceFacts.map((fact) => fact.text), ...avtSentences.map((item) => item.text)];
  onProgress?.("Comparing ground truth with AVT content…");

  const extractor = await getExtractor(onProgress);
  const output = await extractor(texts, { pooling: "mean", normalize: true });
  const vectors = output.tolist() as number[][];
  const sourceVectors = vectors.slice(0, sourceFacts.length);
  const avtVectors = vectors.slice(sourceFacts.length);

  const candidates: ReviewCandidate[] = [];
  let likelyCaptured = 0;

  sourceFacts.forEach((fact, sourceIndex) => {
    const ranked = avtSentences
      .map((sentence, avtIndex) => ({
        sentence,
        score: dot(sourceVectors[sourceIndex], avtVectors[avtIndex])
      }))
      .sort((a, b) => b.score - a.score);

    const best = ranked[0];
    const signals = compareProtectedAttributes(fact.text, best.sentence.text);
    const expected = expectedComponent(fact.domain);

    if (best.score < OMIT_THRESHOLD) {
      candidates.push({
        id: `SOURCE-${fact.id}`,
        component: expected,
        sourceFactIds: [fact.id],
        sourceText: fact.text,
        avtText: best.score > 0.25 ? best.sentence.text : "",
        similarity: best.score,
        signals: ["Possible omission"],
        suggestedCategory: "Omission",
        description: `Possible omission: ${fact.text}`
      });
      return;
    }

    if (best.sentence.component !== expected && best.score >= REVIEW_THRESHOLD) {
      signals.push("Possible wrong component");
    }

    if (best.score < REVIEW_THRESHOLD) {
      signals.push("Possible semantic change");
    }

    const uniqueSignals = unique(signals);
    if (uniqueSignals.length > 0) {
      candidates.push({
        id: `SOURCE-${fact.id}`,
        component: best.sentence.component,
        sourceFactIds: [fact.id],
        sourceText: fact.text,
        avtText: best.sentence.text,
        similarity: best.score,
        signals: uniqueSignals,
        suggestedCategory: suggestCategory(uniqueSignals),
        description: describeSignals(uniqueSignals)
      });
    } else {
      likelyCaptured += 1;
    }
  });

  avtSentences.forEach((sentence, avtIndex) => {
    const bestSource = sourceFacts
      .map((fact, sourceIndex) => ({
        fact,
        score: dot(avtVectors[avtIndex], sourceVectors[sourceIndex])
      }))
      .sort((a, b) => b.score - a.score)[0];

    if (bestSource && bestSource.score < ADDITION_THRESHOLD && meaningful(sentence.text)) {
      candidates.push({
        id: `ADDITION-${sentence.id}`,
        component: sentence.component,
        sourceFactIds: [],
        sourceText: "",
        avtText: sentence.text,
        similarity: bestSource.score,
        signals: ["Possible unsupported content"],
        suggestedCategory: "Addition (not in script)",
        description: "Possible unsupported content; no close source fact was found."
      });
    }
  });

  findDuplicates(avtSentences).forEach((duplicate, index) => {
    candidates.push({
      id: `DUP-${index + 1}`,
      component: duplicate.second.component,
      sourceFactIds: [],
      sourceText: "",
      avtText: `${duplicate.first.text} / ${duplicate.second.text}`,
      signals: ["Possible duplication"],
      suggestedCategory: "Duplication",
      description: "Possible duplicate content detected across the AVT record."
    });
  });

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

  splitSentences(groundTruth.additionalSpokenInformation).forEach((text, index) => {
    facts.push({ id: `additional-${index + 1}`, domain: "History", text });
  });

  return facts;
}

function buildAvtSentences(avtOutput: AvtComponentContent): AvtSentence[] {
  const result: AvtSentence[] = [];
  Object.entries(avtOutput).forEach(([component, content]) => {
    splitSentences(content).forEach((text, index) => {
      result.push({
        id: `${slug(component)}-${index + 1}`,
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

function compareProtectedAttributes(source: string, avt: string): ReviewSignal[] {
  const signals: ReviewSignal[] = [];

  const sourceNumbers = numbers(source);
  const avtNumbers = numbers(avt);
  if (sourceNumbers.length > 0 && avtNumbers.length > 0 && !sameSet(sourceNumbers, avtNumbers)) {
    signals.push("Number mismatch");
  }

  if (hasNegation(source) !== hasNegation(avt)) signals.push("Negation mismatch");

  const sourceSide = laterality(source);
  const avtSide = laterality(avt);
  if (sourceSide && avtSide && sourceSide !== avtSide) signals.push("Laterality mismatch");

  const sourceTiming = timing(source);
  const avtTiming = timing(avt);
  if (sourceTiming && avtTiming && sourceTiming !== avtTiming) signals.push("Timing mismatch");

  return signals;
}

function suggestCategory(signals: ReviewSignal[]): ValidationCategory | undefined {
  if (signals.includes("Possible omission")) return "Omission";
  if (signals.includes("Possible wrong component")) return "Misclassification";
  if (signals.includes("Possible unsupported content")) return "Addition (not in script)";
  if (signals.includes("Possible duplication")) return "Duplication";
  if (signals.includes("Possible semantic change")) return "Over-simplification";
  return undefined;
}

function describeSignals(signals: ReviewSignal[]) {
  if (signals.length === 1) return signals[0];
  return signals.join("; ");
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

function numbers(text: string) {
  return text.match(/\b\d+(?:\.\d+)?\b/g) ?? [];
}

function hasNegation(text: string) {
  return /\b(no|not|never|none|denies|denied|without|negative for|hasn't|haven't|didn't|doesn't)\b/i.test(text);
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

function sameSet(a: string[], b: string[]) {
  return a.length === b.length && [...a].sort().every((value, index) => value === [...b].sort()[index]);
}

function dot(a: number[], b: number[]) {
  let total = 0;
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i += 1) total += a[i] * b[i];
  return total;
}

function meaningful(text: string) {
  return normalize(text).split(" ").filter(Boolean).length >= 3;
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function slug(text: string) {
  return normalize(text).replace(/\s+/g, "-");
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
