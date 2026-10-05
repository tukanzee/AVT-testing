# Transcript vs AVT regression checks

Run `npm run test:validator`, then `npm run build`.

The test runner bundles TypeScript with the existing esbuild dependency and runs Node assertions. No new services or test dependencies are required. `tmp/tests/retrieval-benchmark.json` records every label/patientWording pair across all 20 supplied cases, including misses. A lexical-only benchmark currently retrieves 320/377 paired passages in the top three (84.9%); aggregate recall must remain at least 80%, and each case at least 50%. This is a retrieval benchmark, not a correctness or NLI accuracy score. Case data is imported only by the development tests, never by the transcript validator.

Regression groups cover atomic splitting, original source retention, many-to-many links, partial coverage, residual linking, irrelevant/finding resolution, conservative repeat grouping, decimal qualifiers, general Q+A pairing, clinician fact/action preservation, filler filtering, partial-prefix search, clinical/lay terminology, number normalization, lexical rescue, changes in history, actor/temporal/uncertainty warnings, duplicate claims, history vs plan, multi-passage history, PDF filtering/completion, and component rendering. The component checks cover the shared transcript scroller, two linked highlights, unlink controls, linked navigation wrapping, skipped actions and the absence of normal-UI conflict cards. NLI and embeddings are injected in the pipeline test, so tests run without model downloads. Real browser MiniLM/DeBERTa accuracy is not measured by these tests.

For optional PDF visual QA run `PDF_QA=1 npm run test:validator`. This generates a zero-finding PDF and a deliberately long four-page finding PDF in `tmp/pdfs`. Both were rendered and all pages inspected using macOS PDFKit; no clipping was observed.

For a manual UI smoke test run `node tests/build-ui-fixture.mjs` and serve `tmp/ui` locally. This renders the actual validator with test-only model stubs. Verify three denial cards, select two distant transcript passages, use previous/next linked evidence, unlink from both the viewer and AVT-column chip, and confirm support. Check that only uncovered propositions remain in Pass 2. Verify partial searches such as `dehyd` and `insul`, select an AVT suggestion without confirming it, then explicitly confirm the link. Exercise skip/return, undo, reload autosave restoration, linked-only mode and the pre-export unresolved warning. Confirm search typing does not trigger shortcuts, arrow navigation works, and both context viewers retain their highlights while scrolling. Automated computer access was unavailable in this environment, so interactive UI verification remains outstanding.

## Architecture and changed files

- `src/validator/claimExtraction/atomic.ts`, `extractClaims.ts`: conservative syntax splitting and original source retention. Conditional actions and temporal contrasts stay together.
- `src/validator/transcript/createEvidenceChunks.ts`, `parseTranscript.ts`: proposition units, short-answer Q+A, source speaker/line retention; no automatic clinical relevance filtering.
- `src/validator/workflowTypes.ts`, `coverage.ts`, `TranscriptAvtValidator.tsx`: multiple evidence IDs, coverage derived solely from human confirmations, repeat provenance, residual queue, explicit irrelevant decisions, resolved/reopen view and full JSON export.
- `src/validator/matching/evidenceMatcher.ts`, `lexicalSearch.ts`, `terminology.ts`, `numberMatching.ts`, `negation.ts`, `statementType.ts`, `warnings.ts`: shared parallel candidate union and NLI reranking, language normalization, generic warnings and development logs in both directions. The terminology table was curated from clinical/lay wording in the supplied cases; it contains no disease expectation rules.
- `src/validator/components/TranscriptContextViewer.tsx`, `ClaimReview.tsx`, `EvidencePanel.tsx`, `OmissionReview.tsx`, `threeWay.css`: shared scrollable context, linked navigation/highlighting/unlinking, visible partial search, residual suggestions, skip controls, rounded controls, original category palette, keyboard navigation and unreviewed initial state.
- `src/validator/TranscriptAvtValidator.tsx`: one-step undo, browser-local autosave/restore, active/skipped queues, compact progress summary and unresolved pre-export warning.
- `src/validator/exceptionReport.ts`: paginated findings-only PDF with counts, evidence, categories, comments, source, zero-finding statement and incomplete-review handling.
- `package.json`, `tests/*`: runnable regression/benchmark and local UI harness.

Ground Truth Runner, Level 1 Validator and the user's existing case-file edits were not changed.

## Deliberate limits

Syntax-based splitting is conservative and cannot resolve every natural-language compound. Repeated propositions are grouped only when normalized wording, speaker and qualifiers match; paraphrased repeats may still require review. Conflicting-history and inference alerts are heuristic prompts, not exhaustive detection. The history/plan distinction affects ranking and warnings only, never automatically denies or confirms a reviewer link. First use still requires the existing local-model downloads. Review state remains in memory and is fully exportable as JSON; no persistence/import workflow was added. PDF uses the existing jsPDF standard font, which has limited support for characters outside Western European text.
