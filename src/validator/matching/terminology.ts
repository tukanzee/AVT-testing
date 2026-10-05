/** Language equivalents curated from label/patientWording pairs in the 20 development cases.
 * These are retrieval hints only: no diagnosis expectations, coverage or verdict rules.
 * Ambiguous terms (e.g. stomach/abdomen) deliberately remain suggestions, not evidence of equivalence.
 */
export const TERMINOLOGY: readonly (readonly string[])[] = [
  ['sputum', 'phlegm'], ['salbutamol', 'blue inhaler'],
  ['loss of consciousness', 'blacked out', 'blackout', 'passed out'],
  ['anticoagulant', 'blood thinner'], ['hypertension', 'high blood pressure'],
  ['urticaria', 'hives'], ['weight bear', 'weight bearing', 'put any weight through', 'put weight through'],
  ['shortness of breath', 'breathlessness', 'short of breath', 'breathless'],
  ['myocardial infarction', 'heart attack'], ['abdomen', 'abdominal', 'tummy', 'stomach'],
  ['dysuria', 'burning when passing urine', 'burning when i pee'],
  ['haematuria', 'blood in urine', 'blood in my urine'], ['myopia', 'short sighted'],
  ['perineal numbness', 'numb between legs', 'numb between my legs', 'numb around my bottom', 'numbness around my bottom'],
  ['overdose', 'taking all my tablets'], ['unable', 'cannot', "can't"],
  ['increased', 'more'], ['vomiting', 'being sick', 'vomited'],
  ['palpitations', 'heart racing', 'heart is racing'], ['syncope', 'fainted'],
  ['pruritus', 'itching', 'itchy'], ['melaena', 'black tarry stool', 'black tarry stools'],
  ['oedema', 'swelling'], ['diaphoresis', 'sweating'], ['paraesthesia', 'pins and needles'],
  ['photophobia', 'light hurts', 'sensitive to light'], ['otorrhoea', 'ear discharge'],
  ['haematochezia', 'rectal bleeding', 'blood from my bottom'],
  ['fatigue', 'tiredness', 'tired'], ['tachycardia', 'fast heart rate'],
  ['adrenaline auto injector', 'adrenaline pen'], ['allergy', 'allergies'],
];
export function expandTerminology(text: string) {
  let result = text.toLowerCase().replace(/[’]/g, "'").replace(/[-–]/g, ' ');
  const variants = TERMINOLOGY.flatMap(group => group.map(term => ({ term, canonical: group[0] }))).sort((a,b) => b.term.length-a.term.length);
  // Single replacement pass prevents cascades between ambiguous aliases.
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lookup = new Map(variants.map(v => [v.term, v.canonical]));
  result = result.replace(new RegExp(`\\b(?:${variants.map(v => escape(v.term)).join('|')})\\b`, 'g'), term => lookup.get(term)!);
  return result;
}
