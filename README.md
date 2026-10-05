# Clinical Ground Truth Runner

A simple tool for running synthetic doctor–patient role-play scenarios and recording exactly what was said aloud during the consultation.

## How to use

1. Open the website
2. Choose your role:
   - **Patient / Actor**
   - **Doctor**
3. Choose the same clinical case
4. Click **Continue**
5. Run the consultation naturally

### Patient / Actor
- Use the provided patient script
- Tick an item only when that information has actually been spoken aloud
- Use the free-text box for any clinically relevant information not already listed
- Review the ground truth at the end
- Save the ground truth PDF

### Doctor
- Use the suggested prompts to guide the consultation
- Verbalise examination findings, investigation results and management plans that you want included
- No boxes need to be ticked

## Important

- Only record information that was actually spoken aloud
- Do not infer or add information that was not said
- Use **synthetic scenarios only**
- Do not enter real patient-identifiable information

## Transcript vs AVT validator

The validator includes a transcript-led workflow alongside the original Level 1 validator:

1. Paste a finished C:/P:/P/C:-attributed transcript or upload it as a `.txt` file.
2. Paste the AVT note by section or as a full note.
3. Review atomic AVT claims against contextual transcript evidence.
4. Review clinically relevant transcript evidence that may have been omitted.
5. Export the human-reviewed findings as JSON.

Evidence retrieval runs locally with `Xenova/all-MiniLM-L6-v2`, plus deterministic keyword, number, exact-phrase and negation checks. Retrieved pairs are then checked by the local `Xenova/nli-deberta-v3-small` entailment model; NLI is an assistive relationship signal and does not assign a verdict. Both models are lazy-loaded and cached by the browser; transcript and AVT content are not sent to an inference API. Recent Chrome or Edge with WebGPU gives the best performance, with a WASM/CPU fallback where supported.

## Current cases

- Diabetic ketoacidosis
- Neck of femur fracture
- Cellulitis
- Suicidal ideation
- Acute gout
- Cauda equina syndrome
- Thyroid storm
