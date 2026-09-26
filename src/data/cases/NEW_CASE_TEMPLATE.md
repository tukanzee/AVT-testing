# New case template

Duplicate `dka.ts` and rename it, for example:

```text
nof.ts
```

Then change the clinical content.

## Ground-truth rule

For a **patient** item:

```ts
{
  id: "nof_h01",
  domain: "History",
  source: "patient",
  label: "Unable to weight bear since the fall",
  patientWording: "I haven't been able to stand on it since I fell."
}
```

The `label` is a concise record of what was actually communicated.
`patientWording` is what the actor can naturally say.

Do not add information to the label that is not present in the patient wording.

For a **clinician** item:

```ts
{
  id: "nof_e01",
  domain: "Examination",
  source: "clinician",
  label: "Left leg shortened and externally rotated"
}
```

There is deliberately **no second doctor-facing wording field**.

The same exact `label` is automatically shown:
- to the doctor as the available finding / plan item
- to the patient as the checkbox they tick when they hear it spoken

This prevents wording drift between the two screens.

## Minimum case structure

Every case exports one `ClinicalCase` object:

```ts
import type { ClinicalCase } from "../../types";

export const exampleCase: ClinicalCase = {
  id: "SCEN-XX",
  title: "Condition",
  specialty: "Specialty / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief: "Short brief.",

  doctorPromptSections: [
    {
      title: "Presenting complaint",
      prompts: [
        "Prompt question one?",
        "Prompt question two?"
      ]
    }
  ],

  patientName: "Synthetic Name",
  patientAge: 50,
  patientPortrayal: "How the actor should behave.",
  openingLine: "Opening sentence.",

  historyItems: [],
  examinationItems: [],
  investigationItems: [],
  planItems: []
};
```

## Register the new case

Open:

```text
src/data/cases.ts
```

Add:

```ts
import { nofCase } from "./cases/nof";
```

and then:

```ts
export const cases: ClinicalCase[] = [
  dkaCase,
  nofCase
];
```

That is all that is needed to make the case appear in the website.
