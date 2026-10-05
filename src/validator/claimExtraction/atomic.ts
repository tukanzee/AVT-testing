/** Conservative syntax splitting: never separate conditional actions or temporal contrasts. */
export function atomicPropositions(text: string): string[] {
  return text.split(/(?<=[.!?])\s+(?=[A-Z])|;\s*/).flatMap(sentence => {
    const value = sentence.trim();
    if (!value) return [];
    if (/\b(if|unless|depending|required|needed|but|however)\b/i.test(value) || value.includes('?')) return [value];
    const independent = value.split(/\s+and\s+(?=(?:I|he|she|they|patient)\s+(?:has|have|had|denies|reports|feels)\b)/i);
    if (independent.length > 1) return independent.flatMap(atomicPropositions);
    const denial = value.match(/^((?:patient\s+)?(?:denies|denied|no|without|reports|has|has had|experiences)\s+)(.+?)[.!]?$/i);
    if (denial) return denial[2].split(/,\s*(?:and\s+)?|\s+(?:and|or)\s+/).map(part => `${denial[1]}${part}`);
    const predicate = value.match(/^(.+?)\s+(is|are|was|were|began|started)\s+(.+?)[.!]?$/i);
    if (predicate) {
      const [, subject, verb, rest] = predicate;
      const parts = rest.split(/,\s*(?:and\s+)?|\s+and\s+/);
      if (parts.length > 1) return parts.map((part, index) => {
        if (index === 0) return `${subject} ${verb} ${part}`;
        if (/^(?:is|are|was|were|radiates|goes|started|began)\b/i.test(part)) return `${subject} ${part}`;
        return `${subject} ${verb} ${part}`;
      });
    }
    return [value];
  });
}
