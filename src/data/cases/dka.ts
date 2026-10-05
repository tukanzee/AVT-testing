import type { ClinicalCase } from "../../types";

/**
 * REFERENCE CASE
 *
 * Important ground-truth rule:
 * - Patient items may have a concise ground-truth label plus natural patient wording.
 * - Clinician-originated items have ONE canonical `label` only.
 * - The same clinician label is shown in the Doctor view and the Patient checklist.
 * - Do not add alternate clinician-facing wording, because that can change the
 *   information content and contaminate later AVT validation.
 */
export const dkaCase: ClinicalCase = {
  id: "SCEN-7",
  title: "Diabetic ketoacidosis (DKA)",
  specialty: "Endocrinology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 24-year-old patient with Type 1 diabetes who has presented with vomiting, abdominal pain and feeling increasingly unwell. The diagnosis is DKA. Use the prompts below to help the consultation flow naturally. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Presenting complaint",
      prompts: [
        "What brought you into ED today?",
        "When did the vomiting start?",
        "How many times have you vomited?",
        "Are you able to keep food or fluids down?",
        "Any abdominal pain?",
        "Have you been more thirsty than usual?",
        "Have you been passing urine more frequently?",
        "Have you felt drowsy, muddled or not quite yourself?"
      ]
    },
    {
      title: "Diabetes history",
      prompts: [
        "How long have you had Type 1 diabetes?",
        "How have your blood sugars been recently?",
        "Have you checked your ketones at home?",
        "Have you taken your insulin as normal?",
        "What insulin do you normally take?",
        "Have you ever had DKA before?"
      ]
    },
    {
      title: "Possible precipitant / relevant symptoms",
      prompts: [
        "Any recent illness or infection?",
        "Any cough or breathing symptoms?",
        "Any diarrhoea?",
        "Any urinary symptoms?",
        "Any chest pain?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "Any other medical problems?",
        "What regular medications do you take?",
        "Any medication allergies?",
        "Do you drink alcohol?",
        "Any recreational drug use?"
      ]
    }
  ],

  patientName: "Alex Morgan",
  patientAge: 24,

  patientPortrayal:
    "You feel very unwell, tired and thirsty. Speak normally but a little slowly. Do not volunteer every detail at once. Use the suggested wording naturally when the doctor asks something relevant.",

  openingLine:
    "I've been vomiting since yesterday and I feel really unwell.",

  historyItems: [
    {
      id: "dka_h01",
      domain: "History",
      source: "patient",
      label: "Vomiting started yesterday",
      patientWording: "I started being sick yesterday."
    },
    {
      id: "dka_h02",
      domain: "History",
      source: "patient",
      label: "Feels really unwell",
      patientWording: "I feel really unwell."
    },
    {
      id: "dka_h03",
      domain: "History",
      source: "patient",
      label: "Approximately 6–7 episodes of vomiting",
      patientWording: "Probably six or seven times."
    },
    {
      id: "dka_h04",
      domain: "History",
      source: "patient",
      label: "Unable to keep food or fluids down",
      patientWording: "Every time I try to eat or drink, I feel sick again."
    },
    {
      id: "dka_h05",
      domain: "History",
      source: "patient",
      label: "Generalised abdominal pain",
      patientWording: "My stomach is aching all over."
    },
    {
      id: "dka_h06",
      domain: "History",
      source: "patient",
      label: "Very thirsty",
      patientWording: "I've been unbelievably thirsty."
    },
    {
      id: "dka_h07",
      domain: "History",
      source: "patient",
      label: "Passing urine much more frequently than usual",
      patientWording: "I've been going to the toilet much more than usual."
    },
    {
      id: "dka_h08",
      domain: "History",
      source: "patient",
      label: "Feels completely exhausted",
      patientWording: "I feel completely exhausted."
    },
    {
      id: "dka_h09",
      domain: "History",
      source: "patient",
      label: "Feels muddled, foggy and not quite themselves",
      patientWording: "I haven't really felt like myself today. I feel a bit muddled, almost foggy."
    },
    {
      id: "dka_h10",
      domain: "History",
      source: "patient",
      label: "Type 1 diabetes since age 13",
      patientWording: "I've had Type 1 diabetes since I was 13."
    },
    {
      id: "dka_h11",
      domain: "History",
      source: "patient",
      label: "Home blood glucose readings have been mostly in the 20s",
      patientWording: "My sugars have been running high, mostly in the 20s."
    },
    {
      id: "dka_h12",
      domain: "History",
      source: "patient",
      label: "Has not checked ketones at home",
      patientWording: "I haven't checked my ketones at home."
    },
    {
      id: "dka_h13",
      domain: "History",
      source: "patient",
      label: "Missed long-acting insulin last night",
      patientWording: "I didn't take my long-acting insulin last night."
    },
    {
      id: "dka_h14",
      domain: "History",
      source: "patient",
      label: "Thought insulin should be stopped because they were not eating",
      patientWording: "I thought I shouldn't take it because I wasn't eating."
    },
    {
      id: "dka_h15",
      domain: "History",
      source: "patient",
      label: "Previous DKA episode at around age 18",
      patientWording: "I had DKA once before when I was about 18."
    },
    {
      id: "dka_h16",
      domain: "Review of systems",
      source: "patient",
      label: "Sore throat for around 3 days",
      patientWording: "I've had a bit of a sore throat for the last three days."
    },
    {
      id: "dka_h17",
      domain: "Review of systems",
      source: "patient",
      label: "No cough",
      patientWording: "No, I haven't had a cough."
    },
    {
      id: "dka_h18",
      domain: "Review of systems",
      source: "patient",
      label: "No diarrhoea",
      patientWording: "No diarrhoea."
    },
    {
      id: "dka_h19",
      domain: "Review of systems",
      source: "patient",
      label: "No chest pain",
      patientWording: "No chest pain."
    },
    {
      id: "dka_h20",
      domain: "Review of systems",
      source: "patient",
      label: "No burning or pain when passing urine",
      patientWording: "No burning or pain when I pass urine."
    },
    {
      id: "dka_h21",
      domain: "History",
      source: "patient",
      label: "No other significant medical problems",
      patientWording: "No, just the diabetes."
    },
    {
      id: "dka_h22",
      domain: "History",
      source: "patient",
      label: "Takes long-acting insulin at night and rapid-acting insulin with meals",
      patientWording: "I take long-acting insulin at night and rapid-acting insulin with meals."
    },
    {
      id: "dka_h23",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "None that I know of."
    },
    {
      id: "dka_h24",
      domain: "History",
      source: "patient",
      label: "Drinks alcohol occasionally",
      patientWording: "I drink occasionally."
    },
    {
      id: "dka_h25",
      domain: "History",
      source: "patient",
      label: "No recreational drug use",
      patientWording: "No recreational drugs."
    }
  ],

  examinationItems: [
    {
      id: "dka_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 118 bpm"
    },
    {
      id: "dka_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 102/64 mmHg"
    },
    {
      id: "dka_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 28/min"
    },
    {
      id: "dka_e04",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ 98% on room air"
    },
    {
      id: "dka_e05",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 37.8°C"
    },
    {
      id: "dka_e06",
      domain: "Examination",
      source: "clinician",
      label: "Patient appears clinically dehydrated"
    },
    {
      id: "dka_e07",
      domain: "Examination",
      source: "clinician",
      label: "Drowsy but rousable"
    },
    {
      id: "dka_e08",
      domain: "Examination",
      source: "clinician",
      label: "Deep, rapid breathing"
    },
    {
      id: "dka_e09",
      domain: "Examination",
      source: "clinician",
      label: "Chest clear on auscultation"
    },
    {
      id: "dka_e10",
      domain: "Examination",
      source: "clinician",
      label: "Mild generalised abdominal tenderness"
    },
    {
      id: "dka_e11",
      domain: "Examination",
      source: "clinician",
      label: "No guarding or rebound tenderness"
    }
  ],

  investigationItems: [
    {
      id: "dka_i01",
      domain: "Investigations",
      source: "clinician",
      label: "Capillary blood glucose 25 mmol/L"
    },
    {
      id: "dka_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Blood ketones 5.2 mmol/L"
    },
    {
      id: "dka_i03",
      domain: "Investigations",
      source: "clinician",
      label: "VBG pH 7.18"
    },
    {
      id: "dka_i04",
      domain: "Investigations",
      source: "clinician",
      label: "VBG bicarbonate 12 mmol/L"
    },
    {
      id: "dka_i05",
      domain: "Investigations",
      source: "clinician",
      label: "Potassium 4.8 mmol/L"
    },
    {
      id: "dka_i06",
      domain: "Investigations",
      source: "clinician",
      label: "Lactate 1.8 mmol/L"
    },
    {
      id: "dka_i07",
      domain: "Investigations",
      source: "clinician",
      label: "ECG shows sinus tachycardia at approximately 118 bpm"
    },
    {
      id: "dka_i08",
      domain: "Investigations",
      source: "clinician",
      label: "No acute ischaemic changes on ECG"
    }
  ],

  planItems: [
    {
      id: "dka_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is DKA"
    },
    {
      id: "dka_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Start IV fluids"
    },
    {
      id: "dka_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Start fixed-rate IV insulin infusion"
    },
    {
      id: "dka_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Continue basal (long-acting) insulin"
    },
    {
      id: "dka_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Monitor potassium and replace if required"
    },
    {
      id: "dka_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Repeat VBG, glucose and ketones as per DKA pathway"
    },
    {
      id: "dka_p07",
      domain: "Plan / actions",
      source: "clinician",
      label: "Monitor fluid balance and urine output"
    },
    {
      id: "dka_p08",
      domain: "Plan / actions",
      source: "clinician",
      label: "Investigate for an infective or other precipitating cause"
    },
    {
      id: "dka_p09",
      domain: "Team involvement",
      source: "clinician",
      label: "Discuss with senior acute medical clinician"
    },
    {
      id: "dka_p10",
      domain: "Team involvement",
      source: "clinician",
      label: "Refer to the diabetes team"
    },
    {
      id: "dka_p11",
      domain: "Plan / actions",
      source: "clinician",
      label: "Admit to hospital for treatment and monitoring"
    },
    {
      id: "dka_p12",
      domain: "Team involvement",
      source: "clinician",
      label: "Consider critical care / HDU escalation if deteriorating"
    }
  ]
};
