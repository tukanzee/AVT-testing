import { testComponents } from "./components.test";
import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync } from 'node:fs';
import { atomicPropositions } from '../src/validator/claimExtraction/atomic';
import { extractClaims } from '../src/validator/claimExtraction/extractClaims';
import { parseTranscript } from '../src/validator/transcript/parseTranscript';
import { createEvidenceChunks } from '../src/validator/transcript/createEvidenceChunks';
import { coverageMap, residualUnits } from '../src/validator/coverage';
import { compareTranscriptAndAvt, buildMatch, selectNliCandidates } from '../src/validator/matching/evidenceMatcher';
import { keywordOverlap, lexicalSearchScore } from '../src/validator/matching/lexicalSearch';
import { compareNumbers } from '../src/validator/matching/numberMatching';
import { conflictingSources, duplicateClaims, evidenceWarnings } from '../src/validator/matching/warnings';
import { createExceptionPdf, reportFindings } from '../src/validator/exceptionReport';
import { loadReviewAutosave, saveReviewAutosave } from '../src/validator/reviewAutosave';
import { cases } from '../src/data/cases';
import type { ValidationDecision, OmissionDecision, AVTClaim } from '../src/validator/workflowTypes';
const chunks = (s: string) => createEvidenceChunks(parseTranscript(s));
const claim = (text: string): AVTClaim => ({ id: 'claim-1', section: 'History of Presenting Complaint', text, originalSentence: text });
testComponents();
let passed = 0;
function test(name: string, action: () => void) { action(); passed++; console.log(`PASS ${name}`); }
test('atomic denials, independent predicates, conditional actions, original source', () => {
 assert.equal(atomicPropositions('Patient denies chest pain, shortness of breath and headache.').length, 3);
 assert.deepEqual(atomicPropositions('Pain began yesterday and is left-sided.'), ['Pain began yesterday','Pain is left-sided']);
 assert.equal(atomicPropositions('Monitor potassium and replace if required').length, 1);
 const cs = extractClaims([{id:'s',title:'History of Presenting Complaint',text:'Patient denies chest pain, shortness of breath and headache.'}]);
 assert.equal(new Set(cs.map(c=>c.id)).size,3); assert.ok(cs.every(c=>c.originalSentence.includes('headache')));
});
const units = chunks('P: My abdominal pain is severe, right-sided and radiates to my shoulder.');
const supported: ValidationDecision = { claimId:'claim-1',reviewed:true,correctSupported:true,categories:[],comment:'',transcriptChunkIds:units.slice(0,2).map(u=>u.id) };
test('partial coverage, many-to-many links, undo and no automatic coverage', () => {
 assert.equal(units.length,3); assert.match(units[2].text,/radiates/);
 assert.equal(residualUnits(units,[],{}).length,3);
 const map = coverageMap(units,{'claim-1':supported},{});
 assert.equal(map.length,2); assert.equal(residualUnits(units,map,{}).length,1);
 assert.match(residualUnits(units,map,{})[0].text,/shoulder/);
 assert.equal(coverageMap(units,{a:supported,b:{...supported,claimId:'b'}},{}).length,4);
 assert.equal(coverageMap(units,{a:{...supported,correctSupported:false}},{}).length,0);
});
test('manual residual link, irrelevant and findings leave the queue', () => {
 const d: OmissionDecision = {itemId:`omission-${units[2].id}`,reviewed:true,correctSupported:true,avtClaimId:'claim-1',categories:[],comment:'linked'};
 assert.equal(residualUnits(units,coverageMap(units,{'claim-1':supported},{[d.itemId]:d}),{[d.itemId]:d}).length,0);
 assert.equal(residualUnits(units,[],{[d.itemId]:{...d,correctSupported:false,irrelevant:true}}).length,2);
 assert.equal(residualUnits(units,[],{[d.itemId]:{...d,correctSupported:false,categories:['Omission']}}).length,2);
});
test('repeat deduplication preserves qualifiers and speaker', () => {
 const u=chunks("P: I can't walk.\nP: I can't walk.\nP: I can't walk far.\nMum: I can't walk.");
 assert.equal(residualUnits(u,[],{}).length,3);
 assert.equal(residualUnits(chunks('P: Dose 1.5 mg.\nP: Dose 15 mg.'),[],{}).length,2);
 const map=coverageMap(u,{a:{...supported,transcriptChunkIds:[u[0].id]}},{});
 assert.equal(map.length,2); assert.equal(residualUnits(u,map,{}).length,2);
 const paraphrases=chunks("P: I can't walk.\nP: I really can't walk on it.\nP: I haven't been able to stand.\nP: I can't walk because of pain.\nP: I normally use a stick outdoors.");
 const paraphraseMap=coverageMap(paraphrases,{a:{...supported,transcriptChunkIds:[paraphrases[0].id]}},{});
 assert.equal(paraphraseMap.length,3);
 assert.equal(residualUnits(paraphrases,paraphraseMap,{}).length,2);
});
test('Q+A remains grouped and uncertain answers are preserved', () => {
 const u=chunks("C: You're not able to keep fluids down?\nP: No.\nC: Your heart rate was 118?\nP: I don't know.");
 assert.equal(u.length,2);assert.match(u[0].text,/No/); assert.match(u[1].text,/don't know/);
 assert.ok(evidenceWarnings(claim('Heart rate 118'),u[1]).some(w=>w.includes('does not establish')));
});
test('questions pair with answers while facts, actions and filler are handled conservatively', () => {
 const u=chunks("C: Any chest pain?\nP: No.\nC: Have you checked ketones?\nP: No.\nC: Do you take blood thinners?\nP: No.\nC: Heart rate is 118.\nC: We're going to start IV fluids.\nC: Okay.\nC: Sure.\nC: Thank you.");
 assert.equal(u.length,5);
 assert.match(u[0].text,/Any chest pain\?[\s\S]*No/);
 assert.match(u[1].text,/checked ketones\?[\s\S]*No/);
 assert.match(u[2].text,/blood thinners\?[\s\S]*No/);
 assert.match(u[3].text,/Heart rate is 118/);
 assert.match(u[4].text,/start IV fluids/);
 assert.ok(u.every(item=>!/(?:Okay|Sure|Thank you)/.test(item.text)));
});
test('live search supports partial prefixes and terminology phrases', () => {
 for (const [query, document] of [
  ['dehyd','dehydrated'], ['dehyd','dehydration'], ['insul','insulin'],
  ['allerg','allergy'], ['allerg','allergies'], ['phleg','phlegm'],
  ['anticoag','anticoagulant'], ['blood thin','blood thinner'], ['haem','haemoglobin']
 ]) assert.ok(lexicalSearchScore(query, document).score > 0, `${query} should find ${document}`);
});
test('review autosave round-trips decisions, links, skips and progress locally', () => {
 const values = new Map<string,string>();
 const storage = { getItem: (key:string) => values.get(key) ?? null, setItem: (key:string,value:string) => { values.set(key,value); } };
 const state = { stage:'claims', claimIndex:3, claimDecisions:{c:{...supported,skipped:true}}, coverage:[{claimId:'c',unitId:'u'}] };
 saveReviewAutosave(storage,'review',state);
 assert.deepEqual(loadReviewAutosave(storage,'review'),state);
});
test('terminology rescues different specialties and stems', () => {
 for(const [a,b] of [['sputum','phlegm'],['salbutamol','blue inhaler'],['loss of consciousness','blacked out'],['unable to weight bear',"I can't put any weight through the left leg"],['perineal numbness','numb between my legs and around my bottom'],['overdose','taking all my tablets'],['hypertension','high blood pressure'],['injury','injuries'],['miss','missed']]) assert.ok(keywordOverlap(a,b)>=.66,`${a}: ${keywordOverlap(a,b)}`);
});
test('number equivalences and unrelated warnings',()=>{
 for(const [a,b] of [['30 minutes','half an hour'],['6–7','six or seven'],['118 bpm','heart rate 118'],['102/64','102 over 64']]) assert.equal(compareNumbers(a,b).matchingNumbers.length,1);
 assert.equal(compareNumbers('a few days','3 days').matchingNumbers.length,0);
 assert.equal(buildMatch(claim('6 vomiting episodes'),chunks('P: Diabetes since age 13.')[0],0).conflictingNumbers.length,0);
});
test('lexical candidates survive zero embeddings and large semantic pools',()=>{
 const c=claim('Missed long-acting insulin last night');
 const u=chunks('P: I actually missed my long-acting insulin last night.');
 const match=buildMatch(c,u[0],0);assert.ok(match.phraseMatchScore>.9);
 assert.ok(selectNliCandidates([match],true).some(x=>x.sources.includes('lexical')));
 assert.ok(buildMatch(claim('Sore throat for three days'),chunks('P: A bit of sore throat for three days.')[0],0).phraseMatchScore>.9);
});
test('change, actor, temporal, duplicate and uncertainty warnings only',()=>{
 const u=chunks('P: No allergies.\nP: Actually penicillin caused a rash.');assert.equal(conflictingSources(u).length,1);
 assert.ok(evidenceWarnings(claim('Child has asthma'),chunks('Mum: I have asthma.')[0]).some(w=>w.includes('actor')));
 assert.ok(evidenceWarnings(claim('Denies chest pain'),chunks('P: No chest pain now, but I had pain earlier.')[0]).some(w=>w.includes('temporal')));
 assert.equal(duplicateClaims(claim('No fever'),[{...claim('Denies fever'),id:'other'}]).length,1);
 assert.ok(evidenceWarnings(claim('Pain'),chunks('P: [UNCERTAIN: speaker unclear] Pain.')[0]).some(w=>w.includes('Uncertain')));
});
test('previous history can link two separate passages', () => {
 const u=chunks('P: I had something similar when I was about 18.\nP: I think they said it was DKA.');
 const map=coverageMap(u,{a:{...supported,transcriptChunkIds:u.map(x=>x.id)}},{});
 assert.equal(map.length,2);assert.equal(residualUnits(u,map,{}).length,0);
});
const history=claim('Has not checked ketones');
const plan={...claim('Check ketones'),id:'plan',section:'Plan and Requested Actions' as const};
const qa=chunks('C: Have you checked ketones?\nP: No.');
const comparison=await compareTranscriptAndAvt([history,plan],qa,undefined,{embedTexts:async()=>{throw Error('test offline')}, classifyRelationships:async pairs=>pairs.map(()=>({entailment:.6,neutral:.3,contradiction:.1}))});
test('shared bidirectional engine with injected NLI never creates coverage',()=>{
 assert.ok(comparison.matches[history.id].length);assert.equal(comparison.omissionCandidates.length,1);
 assert.equal(coverageMap(qa,{},{}).length,0);
 assert.ok(comparison.matches[history.id][0].rankScore>comparison.matches[plan.id][0].rankScore);
});
const report={sessionReference:'Regression',claims:[claim('Severe right-sided abdominal pain')],chunks:units,claimDecisions:{a:supported},omissionDecisions:{},coverage:coverageMap(units,{a:supported},{}),remaining:0};
test('PDF contains exceptions only and zero findings is nonempty',()=>{
 assert.equal(reportFindings(report).length,0);
 const pdf=createExceptionPdf(report);assert.match(pdf.output(),/No discrepancies/);
 if (process.env.PDF_QA) { mkdirSync('tmp/pdfs',{recursive:true}); writeFileSync('tmp/pdfs/zero-findings.pdf',Buffer.from(pdf.output('arraybuffer'))); }
 const findings={...report,claimDecisions:{a:{...supported,correctSupported:false,categories:['Addition (not in script)' as const]}}};
 // Dictionary keys correspond to claim IDs in actual state.
 findings.claimDecisions={'claim-1':{...supported,correctSupported:false,categories:['Addition (not in script)']}} as typeof findings.claimDecisions;
 assert.equal(reportFindings(findings).length,1);
 if (process.env.PDF_QA) {
   const longReport = {...findings, claimDecisions: {'claim-1': {...findings.claimDecisions['claim-1'], comment: 'Review the linked evidence and temporal qualifiers. '.repeat(300)}}};
   writeFileSync('tmp/pdfs/findings.pdf',Buffer.from(createExceptionPdf(longReport).output('arraybuffer')));
 }
 assert.match(createExceptionPdf({...report,remaining:2}).output(),/incomplete/);
});
// All case imports are confined to this development harness, never validator runtime.
const benchmark = cases.map(c => {
 const pairs=[...c.historyItems,...c.examinationItems,...c.investigationItems,...c.planItems].filter(i=>i.patientWording);
 const rows=pairs.map(item=>{
   const ranked=pairs.map(candidate=>({id:candidate.id,score:buildMatch(claim(item.label),chunks(`P: ${candidate.patientWording}`)[0],0).rankScore})).sort((a,b)=>b.score-a.score);
   return {id:item.id,label:item.label,patientWording:item.patientWording,rank:ranked.findIndex(r=>r.id===item.id)+1};
 });
 assert.ok(rows.length>0,c.id);
 return {caseId:c.id,total:rows.length,top3:rows.filter(r=>r.rank<=3).length,rows};
});
assert.equal(benchmark.length,20);
assert.ok(benchmark.reduce((n,c)=>n+c.top3,0) / benchmark.reduce((n,c)=>n+c.total,0) >= .8, 'Lexical-only top-three recall regression');
for (const row of benchmark) assert.ok(row.top3 / row.total >= .5, `Specialty regression: ${row.caseId}`);
writeFileSync('tmp/tests/retrieval-benchmark.json',JSON.stringify(benchmark,null,2));
console.log(`PASS all 20 case benchmarks: ${benchmark.reduce((n,c)=>n+c.top3,0)}/${benchmark.reduce((n,c)=>n+c.total,0)} lexical-only top-3 retrieval (no model accuracy claim)`);
console.log(`${passed} regression groups passed.`);
