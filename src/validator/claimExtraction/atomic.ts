/**
 * Conservative AVT claim splitting.
 *
 * Goals:
 * - Keep the original AVT wording faithful.
 * - Split only when the structure is clear enough to create useful review units.
 * - Preserve shared meaning such as negation ("Denies X, Y" -> "Denies X", "Denies Y").
 * - Never invent a new clinical subject/predicate merely to make a fragment grammatical.
 * - When a structure is ambiguous, keep the sentence intact.
 */
export function atomicPropositions(text: string): string[] {
  return splitSentenceBoundaries(text).flatMap(splitAtomicSentence);
}

function splitSentenceBoundaries(text: string): string[] {
  return text
    .replace(/^[•\-*]+\s*/gm, "")
    .split(/(?<=[.!?])\s+(?=[A-Z])|;\s*/)
    .map(clean)
    .filter(Boolean);
}

function splitAtomicSentence(value: string): string[] {
  if (!value) return [];

  // Keep questions and conditional / linked actions intact.
  if (
    value.includes("?") ||
    /\b(if|unless|depending|required|needed|provided that|as long as)\b/i.test(value)
  ) {
    return [value];
  }

  // Split clearly independent clauses where the second clause repeats its own subject + predicate.
  const independent = value.split(
    /\s+and\s+(?=(?:I|he|she|they|the patient|patient)\s+(?:has|have|had|denies|denied|reports|reported|feels|felt|notes|noted)\b)/i
  );

  if (independent.length > 1) {
    return independent.flatMap((part) => splitAtomicSentence(clean(part)));
  }

  /**
   * Common AVT summary:
   * "... , presenting with pain, redness, swelling and fever"
   *
   * Keep the preamble intact, then split the presenting symptom list.
   */
  const trailingPresentation = value.match(
    /^(.+?),\s*(?:and\s+)?present(?:s|ing|ed)?\s+with\s+(.+?)[.!]?$/i
  );

  if (trailingPresentation) {
    const preamble = clean(trailingPresentation[1]);
    const symptoms = splitClinicalList(trailingPresentation[2]);

    if (symptoms.length > 1) {
      return [preamble, ...symptoms];
    }
  }

  /**
   * Sentence beginning directly with "presenting with".
   * Do not generate nonsense such as "The patient is redness".
   */
  const directPresentation = value.match(
    /^(?:(?:the\s+)?patient\s+(?:is\s+)?)?present(?:s|ing|ed)?\s+with\s+(.+?)[.!]?$/i
  );

  if (directPresentation) {
    const symptoms = splitClinicalList(directPresentation[1]);
    return symptoms.length > 1 ? symptoms : [value];
  }

  /**
   * Shared predicates that can safely be carried across a list.
   *
   * "Denies trauma, injury, cuts or wounds"
   * -> "Denies trauma" / "Denies injury" / ...
   *
   * "No discharge, bullae, crepitus or skin necrosis"
   * -> "No discharge" / "No bullae" / ...
   */
  const sharedPredicate = value.match(
    /^((?:(?:the\s+)?patient\s+)?(?:denies|denied|reports|reported|notes|noted|endorses|endorsed|has|has had|complains of|complained of|takes|taking|uses|using|is allergic to|allergic to|positive for|negative for|no|without)\s+)(.+?)[.!]?$/i
  );

  if (sharedPredicate) {
    const [, prefix, remainder] = sharedPredicate;
    const parts = splitClinicalList(remainder);

    if (parts.length > 1) {
      return parts.map((part) => clean(`${prefix}${part}`));
    }
  }

  /**
   * Split comma-linked clinical clauses only when every later fragment begins
   * with a recognisable modifier/action. This is intentionally conservative.
   *
   * "Increasing pain, constant, worsens with walking, causing limp"
   * -> four review units.
   *
   * "Medical history includes type 2 diabetes mellitus, managed with metformin,
   * reports good glycaemic control"
   * -> three review units.
   */
  const commaClauses = splitSafeCommaClauses(value);
  if (commaClauses.length > 1) {
    return commaClauses;
  }

  /**
   * Safe descriptive lists only.
   *
   * "The leg is red, swollen and warm"
   * -> "The leg is red" / "The leg is swollen" / "The leg is warm"
   *
   * Restrict this heavily so that "The patient is a 36-year-old female with..."
   * is never rewritten.
   */
  const descriptive = value.match(
    /^(.+?)\s+(is|are|was|were)\s+(.+?)[.!]?$/i
  );

  if (descriptive) {
    const [, subject, verb, remainder] = descriptive;

    if (!/^(?:presenting|presented|associated|treated|managed|started|began)\b/i.test(remainder)) {
      const parts = splitClinicalList(remainder);

      if (parts.length > 1 && parts.every(isSimpleDescriptor)) {
        return parts.map((part) => clean(`${subject} ${verb} ${part}`));
      }
    }
  }

  // Ambiguous structures stay intact.
  return [value];
}

/**
 * Split a clinical list while protecting nested concepts.
 *
 * "Denies other chronic medical conditions, allergies, or family history
 * of cancer or hypertension"
 *
 * becomes:
 * - Denies other chronic medical conditions
 * - Denies allergies
 * - Denies family history of cancer or hypertension
 *
 * It does NOT create "Denies hypertension".
 */
function splitClinicalList(text: string): string[] {
  const value = clean(text);
  if (!value) return [];

  if (value.includes(",")) {
    return value
      .split(/\s*,\s*/)
      .flatMap((part) => splitUnnestedConjunctions(stripLeadingConjunction(part)))
      .map(clean)
      .filter(Boolean);
  }

  return splitUnnestedConjunctions(value)
    .map(clean)
    .filter(Boolean);
}

function splitUnnestedConjunctions(text: string): string[] {
  const value = clean(text);
  if (!value) return [];

  // Protect conjunctions that belong inside a higher-level concept.
  if (
    /\b(?:family\s+)?history\s+of\b/i.test(value) ||
    /\bcompared\s+(?:with|to)\b/i.test(value) ||
    /\bdue\s+to\b/i.test(value) ||
    /\bsecondary\s+to\b/i.test(value) ||
    /\bbetween\b/i.test(value)
  ) {
    return [stripLeadingConjunction(value)];
  }

  return value
    .split(/\s+(?:and|or)\s+/i)
    .map(stripLeadingConjunction)
    .map(clean)
    .filter(Boolean);
}

function splitSafeCommaClauses(value: string): string[] {
  if (!value.includes(",")) return [value];

  const parts = value
    .replace(/[.!]+$/, "")
    .split(/\s*,\s*/)
    .map(clean)
    .filter(Boolean);

  if (parts.length < 2) return [value];

  const laterPartsAreSafe = parts.slice(1).every((part) =>
    /^(?:initially|subsequently|later|now|currently|constant|intermittent|localized|localised|spreading|extending|radiating|worsens|worse|improves|improving|increasing|decreasing|causing|associated|managed|treated|reports|reported|denies|denied|notes|noted|feeling|remains|remaining)\b/i.test(
      part
    )
  );

  return laterPartsAreSafe ? parts : [value];
}

function isSimpleDescriptor(text: string): boolean {
  const value = clean(text);
  if (!value) return false;

  if (value.split(/\s+/).length > 5) return false;

  if (
    /\b(?:with|of|for|to|from|because|due|history|presenting|presented|managed|treated|including)\b/i.test(
      value
    )
  ) {
    return false;
  }

  return true;
}

function stripLeadingConjunction(text: string): string {
  return text.replace(/^(?:and|or)\s+/i, "").trim();
}

function clean(text: string): string {
  return text.trim().replace(/\s+/g, " ").replace(/[.!]+$/, "");
}
