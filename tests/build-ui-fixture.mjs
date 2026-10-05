import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('tmp/ui', { recursive: true });
await build({entryPoints:['tests/ui-fixture.tsx'],bundle:true,format:'esm',outfile:'tmp/ui/fixture.js',jsx:'automatic',define:{'import.meta.env.DEV':'false'},plugins:[{name:'local-model-fixture',setup(build){
 build.onResolve({filter:/\/embeddings$|\/nli$/}, args=>({path:args.path,namespace:'fixture'}));
 build.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path.endsWith('/embeddings') ? 'export async function embedTexts() { throw Error("Offline test fixture"); } export function cosineSimilarity() { return 0; }' : 'export const NLI_MODEL_ID="TEST-STUB"; export async function classifyRelationships(pairs) { return pairs.map(()=>({entailment:0.6,contradiction:0.1,neutral:0.3})); }'}));
}}]});
await writeFile('tmp/ui/index.html','<!doctype html><html><head><title>Validator UI regression fixture</title><link rel="stylesheet" href="fixture.css"></head><body><div id="root"></div><script type="module" src="fixture.js"></script></body></html>');
