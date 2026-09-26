# Lovable build / extension prompt

Use this prompt if you later decide to reproduce or extend the project inside Lovable.

---

Build a responsive web application called **Clinical Ground Truth Runner**.

This is NOT an OSCE scoring platform and it is NOT yet an AVT validation platform.

Its only purpose is to run synthetic doctor–patient role-play consultations and create a manual ground-truth record of exactly which predefined clinical facts were actually spoken aloud.

## Roles

There are two separate views that will normally be used on two devices.

### Doctor view

The doctor only needs a read-only clinical script.

Show:

1. Case ID and diagnosis
2. ED setting / short case brief
3. Suggested prompt questions grouped by clinical theme
4. Simulated examination and observation findings
5. Initial bedside / immediately available investigation results
6. Bullet-point management plan prompts
7. Teams that may need involvement

Do NOT score the doctor.
Do NOT put checkboxes on the doctor page.
Do NOT include OSCE communication marks, rapport marks, hand hygiene marks, timers, or pass/fail scoring.

### Patient / Ground Truth view

The patient/actor is also the ground-truth recorder.

Show:

1. Patient role and how to portray the patient
2. Opening line
3. Predefined patient history facts
4. Suggested natural wording for each patient fact
5. Examination / observation findings
6. Initial investigation results
7. Plan / action / team-involvement items

Every predefined clinical fact has ONE checkbox.

The checkbox means only:

**“This information was actually spoken aloud during this run.”**

It does not matter whether the doctor asked the ideal question.
It does not matter whether the doctor behaved correctly.
Only the spoken clinical content matters.

The patient is the only person who ticks boxes.

Add a free-text field labelled:

**Additional spoken information**

for clinically relevant statements that were spoken but are not represented in the predefined list.

## Run workflow

1. Patient selects a case and starts a run.
2. Generate a short random run ID.
3. Generate a doctor URL containing:
   - role=doctor
   - case ID
   - run ID
4. Patient can copy the doctor link.
5. Doctor opens that link on a second device.
6. Patient ticks facts as they hear them spoken.
7. Patient can preview the ground truth.
8. Patient can export the completed ground truth as a PDF.
9. Doctor has no export controls.

## MVP architecture

For the first version, do NOT add a database, login, authentication, analytics or AVT comparison.

The patient’s selected checkboxes may be stored locally in the browser so that an accidental refresh does not immediately lose progress.

The doctor URL only needs to carry the case ID and run ID.

## Visual style

Professional NHS-adjacent clinical education feel, but do not copy NHS branding.

Use:
- white cards
- light neutral background
- restrained blue accent
- clear typography
- large accessible checkboxes
- mobile and tablet friendly layout

Patient page should be easy to use while actively listening to a conversation.

## Initial case

Start with one complete case only:

**SCEN-03 — Diabetic ketoacidosis (DKA)**

Make the case data reusable so additional cases can later be added using the same structure.

The source project already contains the exact DKA clinical content in `src/data/cases.ts`; preserve that content when migrating.

## PDF output

Patient can export a PDF containing:

- case ID
- diagnosis
- run ID
- date/time generated
- only the predefined items that were ticked as spoken
- additional spoken information free text
- disclaimer that this is synthetic role-play ground truth, not a clinical record

Do not include unticked scenario facts in the PDF.
