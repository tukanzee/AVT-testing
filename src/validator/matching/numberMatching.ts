const NUMBER_WORDS: Record<string, string> = {
  zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
  eleven: "11", twelve: "12", thirteen: "13", fourteen: "14", fifteen: "15", sixteen: "16", seventeen: "17", eighteen: "18", nineteen: "19", twenty: "20"
};

export function extractNumbers(text: string) {
  const normalizedText = text.toLowerCase()
    .replace(/\bhalf an hour\b/g, "30 minutes")
    .replace(/\b(\d+(?:\.\d+)?)\s+over\s+(\d+(?:\.\d+)?)\b/g, "$1/$2")
    .replace(/\b(\d+(?:\.\d+)?)\s+(?:to|or)\s+(\d+(?:\.\d+)?)\b/g, "$1–$2")
    .replace(/\b(six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\s+(?:to|or|[-–])\s+(six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/g, (_match, first: string, second: string) => `${NUMBER_WORDS[first]}–${NUMBER_WORDS[second]}`)
    .replace(/\b(?:in the|in their) twenties\b/g, "20s")
    .replace(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/g, (word) => NUMBER_WORDS[word]);
  return Array.from(new Set(normalizedText.match(
    /\b\d+(?:\.\d+)?(?:\s*[–-]\s*\d+(?:\.\d+)?)?(?:\s*\/\s*\d+(?:\.\d+)?)?(?:\s*(?:bpm|s(?=\b)))?/g
  ) ?? [])).map(normalizeNumber);
}

export function compareNumbers(avt: string, transcript: string) {
  const avtNumbers = extractNumbers(avt);
  const transcriptNumbers = extractNumbers(transcript);
  const matchingNumbers = avtNumbers.filter((value) => transcriptNumbers.includes(value));
  const conflictingNumbers: Array<{ avt: string; transcript: string }> = [];

  if (avtNumbers.length && transcriptNumbers.length && matchingNumbers.length === 0) {
    for (const avtValue of avtNumbers) {
      for (const transcriptValue of transcriptNumbers) conflictingNumbers.push({ avt: avtValue, transcript: transcriptValue });
    }
  }

  return { matchingNumbers, conflictingNumbers };
}

function normalizeNumber(value: string) {
  return value.toLowerCase().replace(/\s+/g, "").replace("-", "–").replace(/bpm$/, "");
}
