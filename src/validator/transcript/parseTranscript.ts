import type { ParsedTranscriptLine, SpeakerRole } from "../workflowTypes";

const SPEAKER_LINE = /^\s*(C|P|P\s*\/\s*C|Clinician|Doctor|Patient|Mum|Dad|Mother|Father|Carer|Child)\s*:\s*(.*)$/i;

export function parseTranscript(text: string): ParsedTranscriptLine[] {
  const parsed: ParsedTranscriptLine[] = [];

  text.split(/\r?\n/).forEach((raw, index) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const match = trimmed.match(SPEAKER_LINE);

    if (!match) {
      const previous = parsed.at(-1);
      if (previous) {
        previous.endLine = index + 1;
        previous.text = `${previous.text} ${trimmed}`.trim();
        previous.raw = `${previous.raw}\n${raw}`;
      } else {
        parsed.push({
          lineNumber: index + 1,
          speaker: "uncertain",
          speakerLabel: "P/C",
          text: trimmed,
          raw
        });
      }
      return;
    }

    const speaker = normalizeSpeaker(match[1]);
    parsed.push({
      lineNumber: index + 1,
      speaker,
      speakerLabel: match[1],
      text: match[2].trim(),
      raw
    });
  });

  return parsed.filter((line) => line.text);
}

function normalizeSpeaker(label: string): SpeakerRole {
  const normalized = label.toLowerCase().replace(/\s/g, "");
  if (normalized === "c" || normalized === "clinician" || normalized === "doctor") return "clinician";
  if (normalized === "p" || normalized === "patient") return "patient";
  return "uncertain";
}
