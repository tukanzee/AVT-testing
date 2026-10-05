export const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";

type ProgressCallback = (message: string, percent?: number) => void;
type Extractor = (texts: string[], options: object) => Promise<{ tolist(): number[][] }>;
let extractorPromise: Promise<Extractor> | null = null;

export async function embedTexts(texts: string[], onProgress?: ProgressCallback) {
  const extractor = await getExtractor(onProgress);
  const output = await extractor(texts, { pooling: "mean", normalize: true });
  return output.tolist();
}

async function getExtractor(onProgress?: ProgressCallback) {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const { env, pipeline } = await import("@huggingface/transformers");
      env.allowLocalModels = false;
      env.useBrowserCache = true;
      const useWebGpu = Boolean((navigator as Navigator & { gpu?: unknown }).gpu);
      const options = {
        device: useWebGpu ? "webgpu" as const : "wasm" as const,
        dtype: useWebGpu ? "fp32" as const : "q8" as const,
        progress_callback: (event: any) => onProgress?.(
          "Loading local MiniLM embedding model",
          typeof event.progress === "number" ? Math.round(event.progress) : undefined
        )
      };
      try {
        return await pipeline("feature-extraction", EMBEDDING_MODEL, options) as unknown as Extractor;
      } catch (error) {
        if (!useWebGpu) throw error;
        onProgress?.("Using WASM embedding fallback");
        return pipeline("feature-extraction", EMBEDDING_MODEL, { device: "wasm", dtype: "q8" }) as unknown as Extractor;
      }
    })().catch((error) => { extractorPromise = null; throw error; });
  }
  return extractorPromise;
}

export function cosineSimilarity(a: number[], b: number[]) {
  let value = 0;
  for (let index = 0; index < Math.min(a.length, b.length); index += 1) value += a[index] * b[index];
  return value;
}
