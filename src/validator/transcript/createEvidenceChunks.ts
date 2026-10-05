import type { ParsedTranscriptLine, TranscriptComparisonUnit } from "../workflowTypes";

const SHORT_RESPONSE = /^(?:yes|no|never|sometimes|occasionally|not really|none|i don'?t know|okay|ok|sure)[,.! ]*$/i;
const ACTION_VERBS = [
  "start", "continue", "monitor", "check", "take", "obtain", "repeat", "insert",
  "investigate", "refer", "admit", "discuss", "escalate", "replace", "review", "arrange",
  "perform", "do", "put", "keep", "speak"
];
const ACTION_PATTERN = new RegExp(`\\b(?:${ACTION_VERBS.join("|")})(?:s|ed|ing)?\\b`, "i");

export function createEvidenceChunks(lines: ParsedTranscriptLine[]): TranscriptComparisonUnit[] {
  const units: TranscriptComparisonUnit[] = [];

  for (let turnIndex = 0; turnIndex < lines.length; turnIndex += 1) {
    const turn = lines[turnIndex];
    const next = lines[turnIndex + 1];
    const parentTurnId = `turn-${turnIndex + 1}`;

    if (isQuestion(turn) && next && next.speaker !== "clinician") {
      const answerSentences = splitSentences(next.text);
      const firstAnswer = answerSentences.shift() ?? next.text;
      units.push(makeUnit({
        turn: next,
        parentTurnId: `turn-${turnIndex + 2}`,
        text: `${turn.speakerLabel}: ${turn.text}\n${next.speakerLabel}: ${firstAnswer}`,
        originalTurnText: next.text,
        startLine: turn.lineNumber,
        rawLines: [turn.raw, next.raw],
        contextText: `${turn.speakerLabel}: ${turn.text}`,
        unitIndex: units.length
      }));
      answerSentences.forEach((sentence) => units.push(makeUnit({
        turn: next,
        parentTurnId: `turn-${turnIndex + 2}`,
        text: sentence,
        originalTurnText: next.text,
        startLine: next.lineNumber,
        rawLines: [next.raw],
        contextText: `${turn.speakerLabel}: ${turn.text}`,
        unitIndex: units.length
      })));
      turnIndex += 1;
      continue;
    }

    splitTurn(turn).forEach((text) => units.push(makeUnit({
      turn,
      parentTurnId,
      text,
      originalTurnText: turn.text,
      startLine: turn.lineNumber,
      rawLines: [turn.raw],
      contextText: surroundingContext(lines, turnIndex),
      unitIndex: units.length
    })));
  }

  return units;
}

function surroundingContext(lines: ParsedTranscriptLine[], index: number) {
  return lines.slice(Math.max(0, index - 1), Math.min(lines.length, index + 2))
    .map((line) => `${line.speakerLabel}: ${line.text}`).join("\n");
}

export function isLikelyClinicalChunk(unit: TranscriptComparisonUnit) {
  const text = unit.text.toLowerCase().replace(/\[[^\]]+\]/g, "").replace(/^(?:c|p|p\/c):\s*/gm, " ").trim();
  if (text.length < 4) return false;
  if (/^(?:hello|hi|thank you|thanks|okay|ok|sure|nice to meet you|that's fine|thats fine|goodbye|bye)[.! ]*$/i.test(text)) return false;
  if (/^(?:hello|hi)\b.*\b(?:doctor|doctors|ed|emergency department)\b/i.test(text)) return false;
  if (/\b(?:what(?:'s| is) your name|confirm your name|my name is|date of birth|dob)\b/i.test(text)) return false;
  if (/^(?:can you |could you )?(?:lie down|sit down|come in|take a seat|move over|turn around)(?: please)?[?.! ]*$/i.test(text)) return false;
  if (/\b(?:microphone|recording|equipment|sound check|test recording|before we start)\b/i.test(text)) return false;
  return true;
}

function splitTurn(turn: ParsedTranscriptLine) {
  return splitSentences(turn.text).flatMap((sentence) =>
    turn.speaker === "clinician" ? splitClinicalActions(sentence) : [sentence]
  );
}

function splitSentences(text: string) {
  return text.split(/(?<=[.!?])\s+(?=[A-Z"'])/).map((value) => value.trim()).filter(Boolean);
}

function splitClinicalActions(sentence: string) {
  if (!ACTION_PATTERN.test(sentence)) return [sentence];
  if (/\b(?:if|required|needed|unless|depending on)\b/i.test(sentence)) return [sentence];

  const candidates = sentence.split(
    /\s+(?:and also|and)\s+(?=(?:(?:we|I)(?:'re|'ll|'m| are| will| am)(?: going to)?\s+)?(?:start|continue|monitor|check|take|obtain|repeat|insert|investigate|refer|admit|discuss|escalate|replace|review|arrange|perform|do|put|keep|speak)\b)|,\s*(?:which means\s+)?(?=(?:we|I)(?:'re|'ll|'m| are| will| am)(?: going to)?\s+)/i
  ).map((value) => value.trim()).filter(Boolean);

  if (candidates.length < 2 || !candidates.every((candidate) => ACTION_PATTERN.test(candidate))) return [sentence];
  return candidates;
}

function isQuestion(line: ParsedTranscriptLine) {
  return line.speaker === "clinician" && (/\?$/.test(line.text) || /^(?:do|did|are|is|have|has|how|what|when|where|why|can|could|any)\b/i.test(line.text));
}

function makeUnit(args: {
  turn: ParsedTranscriptLine;
  parentTurnId: string;
  text: string;
  originalTurnText: string;
  startLine: number;
  rawLines: string[];
  contextText?: string;
  unitIndex: number;
}): TranscriptComparisonUnit {
  const speaker = args.turn.speaker === "clinician" ? "C" : args.turn.speaker === "patient" ? "P" : "P/C";
  const prefixed = /^(?:C|P|P\/C):/m.test(args.text) ? args.text : `${speaker}: ${args.text}`;
  return {
    id: `transcript-unit-${args.unitIndex + 1}`,
    speaker,
    text: prefixed,
    originalTurnText: args.originalTurnText,
    startLine: args.startLine,
    endLine: args.turn.lineNumber,
    parentTurnId: args.parentTurnId,
    contextText: args.contextText,
    rawLines: args.rawLines
  };
}

export function isShortResponse(text: string) {
  return SHORT_RESPONSE.test(text.trim());
}
