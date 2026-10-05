# AVT Project Handover Prompt

You are joining a working React + TypeScript + Vite project for an AVT/clinical validation tool. Your job is to understand the existing app, identify the current product direction, and continue the work without assuming the older Lovable-era project description is still correct.

## Project summary

This repo is a synthetic clinical consultation and validation platform with two main workflows:

1. Runner workflow: create a synthetic doctor-patient consultation and capture ground-truth facts that were actually spoken aloud.
2. Validator workflow: compare an AVT-generated record against a ground-truth dataset and review discrepancies using a structured rubric.

The app is a browser-based tool aimed at structured clinical case testing in a synthetic-only environment.

## Important context

- The project is not a generic Lovable starter app anymore.
- The older file LOVABLE_PROMPT.md describes an earlier, different project framing and should be treated as historical context rather than current product truth.
- The current code and README are the authoritative source of intent.
- There is no clear milestone note in the current repo, so treat the next priority as intentionally open-ended unless the codebase or ticketing system says otherwise.

## What is currently implemented

### Core app and routing
- src/App.tsx
  - Provides the main workflow selection screen.
  - Routes between the runner and validator experiences via URL search params.
  - Lets the user choose a role and case.
  - Stores session IDs in localStorage for the synthetic ground-truth runner.

### Ground-truth runner
- README.md
  - Describes the synthetic doctor-patient workflow and usage pattern.
  - Lists the current case set.
- src/data/cases.ts
  - Registers the available clinical cases.
- src/types.ts
  - Defines the case and fact structures used by the ground-truth runner.
- src/utils/json.ts
  - Exports structured ground-truth JSON with scenario metadata, spoken facts, notes, and session details.
- src/utils/pdf.ts
  - Exports the session details and spoken clinical facts to PDF.

### Validator workflow
- src/validator/ValidatorPage.tsx
  - Accepts uploaded JSON or pasted attributed transcript content.
  - Maps AVT output into FirstNet-style components for review.
  - Calls the analysis engine and provides a human review path.
- src/validator/level1Engine.ts
  - Builds candidate review items from matching and semantic-comparison logic.
  - Flags omission, semantic-change, and placement issues.
- src/validator/browserSemantic.ts
  - Handles local semantic comparison using browser-based tooling.
- src/validator/qwen.worker.ts
  - Runs a local Qwen-backed semantic comparison worker.
- src/validator/rules.ts
  - Defines the clinical discrepancy categories and protected fact attributes.
- src/validator/types.ts
  - Defines the validator data structures.

### Local runtime details
- package.json
  - Vite React app with TypeScript.
  - Uses @mlc-ai/web-llm and jspdf.
  - Includes a build script based on TypeScript compile plus Vite build.
- The validator browser-path is designed to work with WebGPU-capable browsers and a local Qwen model workflow.

## Current cases in the app

The runner currently includes seven synthetic case modules:

- DKA
- Neck of femur fracture
- Cellulitis
- Suicidal ideation
- Acute gout
- Cauda equina syndrome
- Thyroid storm

## Working assumptions to keep in mind

- This is a synthetic-only project; no real patient information should be stored or processed.
- The ground-truth runner is intentionally strict about recording only what was actually spoken aloud.
- The validator is built around structured fact comparison and human review; do not assume a production-grade external API is required or already wired in.
- The code currently shows the local WebLLM/WebGPU validator path as the active implementation, while provider/mock scaffolding may still exist alongside it.

## What to do next

Please continue from here by doing the following:

1. Read the current code and determine the most likely product milestone or priority without relying on the stale Lovable prompt.
2. Identify the next concrete implementation task or improvement that fits the repo’s current architecture.
3. Propose a sensible milestone, if needed, and then implement the next step.
4. Keep the current AVT validation and synthetic-clinical-runner architecture in mind.
5. Call out any ambiguity or missing requirements rather than inventing assumptions.

## Suggested handoff wording

Use the following as the initial instruction to the next AI assistant if needed:

> Continue the AVT project from the current codebase, not from the stale Lovable-era prompt. Treat README.md and the app source as the source of truth. This project is a synthetic doctor-patient clinical ground-truth runner plus an AVT validation workflow with structured discrepancy checks and local semantic comparison. Prioritise working within the existing architecture, keep the synthetic-only safety constraints, and clarify the next milestone before making large feature bets. If no milestone is documented, propose one and implement the next small, well-scoped improvement.

## Final instruction

Start by reviewing the repo structure, checking the current implementation paths, and then propose the most useful next milestone and implementation plan. Do not assume the earlier Lovable project description is still accurate.
