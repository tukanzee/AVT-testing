# Clinical Ground Truth Runner

A lightweight two-device role-play tool for creating a manual ground-truth record of what was actually spoken aloud during a synthetic clinical consultation.

This first MVP deliberately does **not** perform AVT validation. It only establishes the ground truth.

## Current case

- SCEN-03 — Diabetic ketoacidosis (DKA)

The data structure is ready for more cases once the workflow has been tested.

## How the workflow works

1. The **patient/actor** opens the website and starts a new run.
2. The patient shows a generated **QR code** (or copies the doctor link) to the colleague playing the doctor.
3. The doctor opens the link on a second device.
4. The doctor sees:
   - diagnosis and case brief
   - suggested history prompts
   - simulated examination findings
   - available bedside / initial investigation results
   - management and team-involvement prompts
5. The patient sees:
   - role and opening line
   - patient facts with suggested natural wording
   - the same examination / investigation / plan facts
   - a checkbox beside each fact
6. The patient ticks an item **only after that information is actually spoken aloud**.
7. Free text can be used for relevant spoken information that is not on the predefined checklist.
8. The patient can preview the final ground truth and export it as a PDF.

The doctor never scores or ticks anything.

## Important design choice

There is **no backend in this MVP**.

That is intentional.

The doctor does not need to see the patient's ticks, and the patient is the only person creating the ground truth. The doctor link simply contains the case and run ID in the URL.

Benefits:

- much easier to run locally
- much easier to host
- no database setup
- no login system
- no patient data sent anywhere
- fewer moving parts while we test the workflow

The patient's ticks are stored in that browser's `localStorage`, so refreshing the page does not immediately lose the run.

Later, if you want central storage, team analytics, or automated AVT comparison, a backend can be added.

---

# 1. Requirements

You need:

- Node.js 20 or newer
- npm
- VS Code (recommended, not required)
- Git (recommended for version control / later hosting)

Check them with:

```bash
node --version
npm --version
git --version
code --version
```

If `code --version` fails but VS Code itself is installed, open VS Code, press:

```text
Cmd + Shift + P
```

then choose:

```text
Shell Command: Install 'code' command in PATH
```

---

# 2. First-time setup

Open Terminal and move into this folder.

For example:

```bash
cd ~/Downloads/ground_truth_runner
```

Then run:

```bash
bash check_requirements.sh
```

If Node is missing or too old, install Node.js 20 LTS or newer first.

Then:

```bash
bash setup.sh
```

---

# 3. Start the app

```bash
bash launch.sh
```

The Vite terminal will show something similar to:

```text
Local:   http://localhost:5173/
Network: http://192.168.1.20:5173/
```

## Testing with two devices on the same Wi-Fi

Use the **Network** address, not `localhost`.

For example:

```text
http://192.168.1.20:5173/
```

Open that address on the device being used by the patient/actor.

Start a run. A QR code for the doctor view will appear on the patient screen.

Scan the QR code using the second device, or use the copy-link button.

Both devices must be on the same local network while you are testing this way.

---

# 4. Open the project in VS Code

From inside the project folder:

```bash
code .
```

The main files you will care about are:

```text
src/
├── App.tsx
├── styles.css
├── types.ts
├── data/
│   └── cases.ts
└── utils/
    └── pdf.ts
```

## Editing clinical scenarios

Most clinical content lives in:

```text
src/data/cases.ts
```

You can change the wording or add more cases without changing the main interface.

---

# 5. Build a production version

Run:

```bash
npm run build
```

This creates:

```text
dist/
```

`dist` is the production website.

---

# 6. Hosting later

Do not worry about hosting while you are still testing the workflow locally.

Once the workflow feels right, the easiest production route is usually:

1. create a GitHub repository
2. push this project to GitHub
3. deploy the repo using a static web host such as Vercel or Netlify

The app currently has no server/database, so deployment is simple.

Lovable can also be used later for visual development and publishing. A separate `LOVABLE_PROMPT.md` is included so the same product specification is easy to reproduce or extend there.

---

# 7. Privacy

This prototype is designed for **synthetic test scenarios only**.

Do not enter:

- patient names from real clinical encounters
- NHS numbers
- dates of birth
- addresses
- other patient-identifiable information

The PDF is generated in the browser.

---

# 8. Next development step

Before adding more cases or AVT comparison:

1. test the DKA workflow with two people
2. note anything awkward about the doctor view
3. note whether the patient can keep up with the tick boxes
4. check whether examination and plan items are easy to record
5. refine the layout
6. only then use the same case structure for the other ED scenarios


## QR code sharing

The patient screen generates a QR code containing the doctor-only URL for that run.

When hosted publicly, the QR code will work normally from any device.

When testing locally on two devices, the patient must open the app using Vite's `Network` address, for example:

```text
http://192.168.1.20:5173/
```

Do **not** open the patient page at `localhost:5173` if the QR code will be scanned by another device, because `localhost` would refer to the doctor's own device rather than the computer running the app.


## Local QR troubleshooting

If the patient page is opened at `http://localhost:5173`, a QR code containing that address cannot work on another device because `localhost` refers to the device scanning the QR code.

The patient page now shows a **Network URL for QR testing** field when running on localhost.

1. Start the app with:

```bash
bash launch.sh
```

2. Copy the address Vite prints next to `Network`, for example:

```text
http://192.168.1.20:5173/
```

3. Paste it into the Network URL field on the patient page.

The QR code will then point the doctor's device to the correct computer on your Wi-Fi.

When the website is hosted publicly, this field is not needed and the QR code uses the public website address automatically.

## Ground truth navigation

Pressing **View ground truth** now opens the summary and automatically scrolls the page down to it.


# Adding more cases

Cases now live one-per-file:

```text
src/data/
├── cases.ts
└── cases/
    ├── dka.ts
    └── NEW_CASE_TEMPLATE.md
```

`dka.ts` is the locked reference case.

To add a case:

1. duplicate `src/data/cases/dka.ts`
2. rename it, e.g. `nof.ts`
3. replace the clinical content
4. open `src/data/cases.ts`
5. import the new case
6. add it to the `cases` array
7. run:

```bash
npm run build
```

You do **not** regenerate the whole project.

## Clinician wording consistency

The application no longer supports a separate clinician display phrase.

For examination findings, investigations and plans there is only one canonical `label`.

That exact label is rendered on:
- the Doctor view
- the Patient / Ground Truth checklist
- the exported Ground Truth PDF

This is intentional so that the reference wording cannot drift between views.
