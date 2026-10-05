import { CreateWebWorkerMLCEngine } from "@mlc-ai/web-llm";

export const SEMANTIC_MODEL_ID = "Qwen3-1.7B-q4f16_1-MLC";

export type SourceRelationship =
  | "supported"
  | "partial"
  | "contradicted"
  | "not_present";

export type AvtRelationship =
  | "supported"
  | "partial"
  | "contradicted"
  | "not_supported";

export interface SemanticSourceFact {
  id: string;
  text: string;
}

export interface SemanticAvtSentence {
  id: string;
  component: string;
  text: string;
}

export interface SourceJudgement {
  sourceId: string;
  relationship: SourceRelationship;
  evidenceIds: string[];
  reason: string;
}

export interface AvtJudgement {
  avtId: string;
  relationship: AvtRelationship;
  sourceIds: string[];
  reason: string;
}

type ProgressCallback = (message: string, percent?: number) => void;

type EngineLike = Awaited<
  ReturnType<typeof CreateWebWorkerMLCEngine>
>;

let enginePromise: Promise<EngineLike> | null = null;
let engineReady = false;
let worker: Worker | null = null;
let latestProgressCallback: ProgressCallback | undefined;

const SOURCE_BATCH_SIZE = 10;
const AVT_BATCH_SIZE = 10;

export function browserSemanticAvailable() {
  return Boolean((navigator as Navigator & { gpu?: unknown }).gpu);
}

async function getEngine(onProgress?: ProgressCallback): Promise<EngineLike> {
  latestProgressCallback = onProgress;

  if (!browserSemanticAvailable()) {
    throw new Error(
      "This browser does not expose WebGPU. Open the validator in a recent Chrome or Edge browser to use the local Qwen semantic model."
    );
  }

  if (!enginePromise) {
    onProgress?.("Preparing Qwen3 1.7B for local semantic review…");

    worker = new Worker(new URL("./qwen.worker.ts", import.meta.url), {
      type: "module"
    });

    enginePromise = CreateWebWorkerMLCEngine(
  worker,
  SEMANTIC_MODEL_ID,
  {
    initProgressCallback: (report: { text?: string; progress?: number }) => {
      const percent =
        typeof report.progress === "number"
          ? Math.round(report.progress * 100)
          : undefined;

      latestProgressCallback?.(
        report.text || "Loading local semantic model…",
        percent
      );
    }
  },
  {
    context_window_size: 4096
  }
);

    enginePromise
      .then(() => {
        engineReady = true;
        latestProgressCallback?.("Qwen3 1.7B ready.", 100);
      })
      .catch((error) => {
        enginePromise = null;
        engineReady = false;
        worker?.terminate();
        worker = null;
        throw error;
      });
  } else if (engineReady) {
    onProgress?.("Qwen3 1.7B ready.", 100);
  }

  return enginePromise;
}

export async function judgeSourceFactsAgainstAvt(
  sourceFacts: SemanticSourceFact[],
  avtSentences: SemanticAvtSentence[],
  onProgress?: ProgressCallback
): Promise<SourceJudgement[]> {
  if (sourceFacts.length === 0) return [];

  const engine = await getEngine(onProgress);
  const batches = chunk(sourceFacts, SOURCE_BATCH_SIZE);
  const results: SourceJudgement[] = [];
  const avtContext = formatAvtContext(avtSentences);

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index];
    onProgress?.(
      `Semantic review: source facts ${index * SOURCE_BATCH_SIZE + 1}–${Math.min(
        (index + 1) * SOURCE_BATCH_SIZE,
        sourceFacts.length
      )} of ${sourceFacts.length}`
    );

    const parsed = await runSourceBatch(engine, batch, avtContext);
    results.push(...parsed);
  }

  const missing = sourceFacts.filter(
    (fact) => !results.some((result) => result.sourceId === fact.id)
  );

  if (missing.length > 0) {
    onProgress?.("Retrying a small number of semantic judgements…");
    const retry = await runSourceBatch(engine, missing, avtContext);
    results.push(...retry);
  }

  const stillMissing = sourceFacts.filter(
    (fact) => !results.some((result) => result.sourceId === fact.id)
  );

  if (stillMissing.length > 0) {
    throw new Error(
      `The local semantic model did not return a judgement for: ${stillMissing
        .map((fact) => fact.id)
        .join(", ")}. Please run the analysis again.`
    );
  }

  return dedupeBy(results, (item) => item.sourceId);
}

export async function judgeAvtStatementsAgainstSource(
  avtSentences: SemanticAvtSentence[],
  sourceFacts: SemanticSourceFact[],
  onProgress?: ProgressCallback
): Promise<AvtJudgement[]> {
  if (avtSentences.length === 0) return [];

  const engine = await getEngine(onProgress);
  const batches = chunk(avtSentences, AVT_BATCH_SIZE);
  const results: AvtJudgement[] = [];
  const sourceContext = formatSourceContext(sourceFacts);

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index];
    onProgress?.(
      `Semantic review: AVT statements ${index * AVT_BATCH_SIZE + 1}–${Math.min(
        (index + 1) * AVT_BATCH_SIZE,
        avtSentences.length
      )} of ${avtSentences.length}`
    );

    const parsed = await runAvtBatch(engine, batch, sourceContext);
    results.push(...parsed);
  }

  const missing = avtSentences.filter(
    (statement) => !results.some((result) => result.avtId === statement.id)
  );

  if (missing.length > 0) {
    onProgress?.("Retrying a small number of AVT semantic judgements…");
    const retry = await runAvtBatch(engine, missing, sourceContext);
    results.push(...retry);
  }

  const stillMissing = avtSentences.filter(
    (statement) => !results.some((result) => result.avtId === statement.id)
  );

  if (stillMissing.length > 0) {
    throw new Error(
      `The local semantic model did not return a judgement for: ${stillMissing
        .map((statement) => statement.id)
        .join(", ")}. Please run the analysis again.`
    );
  }

  return dedupeBy(results, (item) => item.avtId);
}

async function runSourceBatch(
  engine: EngineLike,
  sourceFacts: SemanticSourceFact[],
  avtContext: string
): Promise<SourceJudgement[]> {
  const sourceBlock = sourceFacts
    .map((fact) => `[${fact.id}] ${oneLine(fact.text)}`)
    .join("\n");

  const prompt = `You are a clinical semantic matching assistant for validation of an ambient clinical note.

Your task is NOT to assign validation categories and NOT to make new clinical conclusions.
For each SOURCE FACT, decide whether its clinical meaning is represented anywhere in the AVT RECORD.

Important rules:
- Search the entire AVT record for each fact. The evidence may be inside a longer sentence.
- Treat genuine clinical synonyms, abbreviations and paraphrases as equivalent when meaning is preserved (for example SpO2 = oxygen saturation, HR = heart rate, RR = respiratory rate, IV = intravenous, VBG = venous blood gas).
- Preserve negation, numbers, laterality, timing/duration, severity, uncertainty, dose, route and speaker/person.
- SUPPORTED = the full clinical meaning is preserved.
- PARTIAL = related content is present but a detail/qualifier is lost, or the AVT adds an interpretation/clinical label beyond what was explicitly stated.
- CONTRADICTED = the AVT states an opposing fact or a conflicting clinically meaningful value.
- NOT_PRESENT = there is no supporting content anywhere in the AVT record.
- Evidence IDs must be copied from the AVT record below. You may return multiple IDs separated by commas.
- Do not force a match. If nothing supports a source fact, use NOT_PRESENT and NONE.

AVT RECORD:
${avtContext}

SOURCE FACTS:
${sourceBlock}

Output EXACTLY one tab-separated line for every source fact, with no markdown and no header:
SOURCE_ID<TAB>SUPPORTED|PARTIAL|CONTRADICTED|NOT_PRESENT<TAB>EVIDENCE_IDS_OR_NONE<TAB>SHORT_REASON`;

  const content = await complete(engine, prompt, Math.max(500, sourceFacts.length * 70));
  return parseSourceLines(content, sourceFacts);
}

async function runAvtBatch(
  engine: EngineLike,
  avtStatements: SemanticAvtSentence[],
  sourceContext: string
): Promise<AvtJudgement[]> {
  const avtBlock = avtStatements
    .map(
      (statement) =>
        `[${statement.id}] [${statement.component}] ${oneLine(statement.text)}`
    )
    .join("\n");

  const prompt = `You are a clinical semantic matching assistant for validation of an ambient clinical note.

Your task is NOT to assign validation categories.
For each AVT STATEMENT, decide whether the statement is grounded in the SOURCE FACTS.

Important rules:
- Treat genuine clinical synonyms, abbreviations and paraphrases as equivalent when meaning is preserved.
- SUPPORTED = everything stated by the AVT statement has a basis in the source. It may be less detailed than the source.
- PARTIAL = some of the AVT statement is grounded, but it also adds an unsupported detail, interpretation, diagnosis or clinical label.
- CONTRADICTED = the AVT statement conflicts with one or more source facts.
- NOT_SUPPORTED = there is no basis for the AVT statement in the source facts.
- Do not reject a statement simply because wording differs.
- Source IDs must be copied from the SOURCE FACTS. Use multiple IDs separated by commas when needed.
- Do not invent source support.

SOURCE FACTS:
${sourceContext}

AVT STATEMENTS:
${avtBlock}

Output EXACTLY one tab-separated line for every AVT statement, with no markdown and no header:
AVT_ID<TAB>SUPPORTED|PARTIAL|CONTRADICTED|NOT_SUPPORTED<TAB>SOURCE_IDS_OR_NONE<TAB>SHORT_REASON`;

  const content = await complete(engine, prompt, Math.max(500, avtStatements.length * 70));
  return parseAvtLines(content, avtStatements);
}

async function complete(
  engine: EngineLike,
  prompt: string,
  maxTokens: number
): Promise<string> {
  const response = (await engine.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Follow the requested output format exactly. Do not use markdown. Do not provide hidden reasoning."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0,
    top_p: 1,
    max_tokens: Math.min(maxTokens, 1200),
    seed: 7,
    stream: false,
    extra_body: {
      enable_thinking: false
    }
  })) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const content = response.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("The local semantic model returned an empty response.");
  }

  return content.replace(/^```(?:text|tsv)?\s*/i, "").replace(/```$/i, "").trim();
}

function parseSourceLines(
  content: string,
  expectedFacts: SemanticSourceFact[]
): SourceJudgement[] {
  const expectedIds = new Set(expectedFacts.map((fact) => fact.id));
  const allowed = new Set(["SUPPORTED", "PARTIAL", "CONTRADICTED", "NOT_PRESENT"]);

  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const parts = line.split("\t");
      if (parts.length < 4) return [];

      const sourceId = cleanId(parts[0]);
      const status = parts[1].trim().toUpperCase();
      if (!expectedIds.has(sourceId) || !allowed.has(status)) return [];

      return [
        {
          sourceId,
          relationship: status.toLowerCase() as SourceRelationship,
          evidenceIds: parseIds(parts[2]),
          reason: parts.slice(3).join(" ").trim()
        }
      ];
    });
}

function parseAvtLines(
  content: string,
  expectedStatements: SemanticAvtSentence[]
): AvtJudgement[] {
  const expectedIds = new Set(expectedStatements.map((statement) => statement.id));
  const allowed = new Set(["SUPPORTED", "PARTIAL", "CONTRADICTED", "NOT_SUPPORTED"]);

  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const parts = line.split("\t");
      if (parts.length < 4) return [];

      const avtId = cleanId(parts[0]);
      const status = parts[1].trim().toUpperCase();
      if (!expectedIds.has(avtId) || !allowed.has(status)) return [];

      return [
        {
          avtId,
          relationship: status.toLowerCase() as AvtRelationship,
          sourceIds: parseIds(parts[2]),
          reason: parts.slice(3).join(" ").trim()
        }
      ];
    });
}

function formatAvtContext(statements: SemanticAvtSentence[]) {
  return statements
    .map(
      (statement) =>
        `[${statement.id}] [${statement.component}] ${oneLine(statement.text)}`
    )
    .join("\n");
}

function formatSourceContext(facts: SemanticSourceFact[]) {
  return facts.map((fact) => `[${fact.id}] ${oneLine(fact.text)}`).join("\n");
}

function parseIds(value: string) {
  if (!value || value.trim().toUpperCase() === "NONE") return [];
  return value
    .split(",")
    .map(cleanId)
    .filter(Boolean);
}

function cleanId(value: string) {
  return value.trim().replace(/^\[/, "").replace(/\]$/, "");
}

function oneLine(value: string) {
  return value.replace(/\s+/g, " ").replace(/\t/g, " ").trim();
}

function chunk<T>(items: T[], size: number) {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

function dedupeBy<T>(items: T[], key: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}
