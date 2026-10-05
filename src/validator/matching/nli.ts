import type { NLIRelationship } from "../workflowTypes";

export const NLI_MODEL_ID = "Xenova/nli-deberta-v3-small";
type ProgressCallback = (message: string, percent?: number) => void;
type NliRuntime = { tokenizer: any; model: any; id2label: Record<string, string> };

let pipelinePromise: Promise<NliRuntime> | null = null;
const resultCache = new Map<string, NLIRelationship>();

export async function classifyRelationships(
  pairs: Array<{ premise: string; hypothesis: string }>,
  onProgress?: ProgressCallback
): Promise<NLIRelationship[]> {
  const keys = pairs.map(({ premise, hypothesis }) => `${premise.trim().toLowerCase()}\u0000${hypothesis.trim().toLowerCase()}`);
  const missingIndices = keys.flatMap((key, index) => resultCache.has(key) ? [] : [index]);
  if (missingIndices.length > 0) {
    const { tokenizer, model, id2label } = await getPipeline(onProgress);
    const premises = missingIndices.map((index) => pairs[index].premise.trim());
    const hypotheses = missingIndices.map((index) => pairs[index].hypothesis.trim());
    // Use actual paired tokenization: transcript premise, AVT hypothesis.
    const encoded = tokenizer(premises, {
      text_pair: hypotheses,
      padding: true,
      truncation: true
    });
    const output = await model(encoded);
    const logitsData = Array.from(output.logits.data as ArrayLike<number>, Number);
    const dims = output.logits.dims as number[];
    const labelCount = dims.at(-1) ?? 3;
    missingIndices.forEach((pairIndex, batchIndex) => {
      const relationship = relationshipFromLogits(logitsData.slice(batchIndex * labelCount, (batchIndex + 1) * labelCount), id2label);
      resultCache.set(keys[pairIndex], relationship);
    });
  }
  return keys.map((key) => resultCache.get(key) ?? { entailment: 0, contradiction: 0, neutral: 1 });
}

function relationshipFromLogits(logits: number[], id2label: Record<string, string>): NLIRelationship {
  const values = softmax(logits);
  const relationship: NLIRelationship = { entailment: 0, contradiction: 0, neutral: 0 };
  values.forEach((score, index) => {
    const label = (id2label[String(index)] ?? "").toLowerCase();
    if (label.includes("entail")) relationship.entailment = score;
    else if (label.includes("contradict")) relationship.contradiction = score;
    else if (label.includes("neutral")) relationship.neutral = score;
  });
  if (relationship.entailment + relationship.contradiction + relationship.neutral === 0) {
    throw new Error("The local NLI model did not return entailment, contradiction and neutral labels.");
  }
  return relationship;
}

async function getPipeline(onProgress?: ProgressCallback) {
  if (!pipelinePromise) {
    onProgress?.("Loading semantic comparison model", 0);
    pipelinePromise = (async () => {
      const { AutoModelForSequenceClassification, AutoTokenizer, env } = await import("@huggingface/transformers");
      env.allowLocalModels = false;
      env.useBrowserCache = true;
      const useWebGpu = Boolean((navigator as Navigator & { gpu?: unknown }).gpu);
      try {
        const [tokenizer, model] = await Promise.all([
          AutoTokenizer.from_pretrained(NLI_MODEL_ID, { progress_callback: (event: any) => onProgress?.("Loading semantic comparison model", event.progress) }),
          AutoModelForSequenceClassification.from_pretrained(NLI_MODEL_ID, {
          device: useWebGpu ? "webgpu" : "wasm",
          dtype: useWebGpu ? "fp16" : "q8",
            progress_callback: (event: any) => onProgress?.("Loading semantic comparison model", event.progress)
          })
        ]);
        return { tokenizer, model, id2label: ((model.config as any).id2label ?? {}) as Record<string, string> };
      } catch (error) {
        if (!useWebGpu) throw error;
        onProgress?.("Loading semantic comparison model with WASM fallback");
        const [tokenizer, model] = await Promise.all([
          AutoTokenizer.from_pretrained(NLI_MODEL_ID),
          AutoModelForSequenceClassification.from_pretrained(NLI_MODEL_ID, { device: "wasm", dtype: "q8" })
        ]);
        return { tokenizer, model, id2label: ((model.config as any).id2label ?? {}) as Record<string, string> };
      }
    })().catch((error) => { pipelinePromise = null; throw error; });
  }
  return pipelinePromise;
}

function softmax(logits: number[]) {
  const max = Math.max(...logits);
  const exponentials = logits.map((value) => Math.exp(value - max));
  const sum = exponentials.reduce((total, value) => total + value, 0);
  return exponentials.map((value) => value / sum);
}
