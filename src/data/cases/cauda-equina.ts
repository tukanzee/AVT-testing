import type { ClinicalCase } from "../../types";

export const caudaEquinaCase: ClinicalCase = {
  id: "SCEN-19",
  title: "Cauda equina syndrome",
  specialty: "Orthopaedics / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 48-year-old man with severe lower back pain, bilateral leg symptoms and new urinary disturbance. The diagnosis is suspected cauda equina syndrome. Use the prompts below to keep the consultation flowing naturally.",

  doctorPromptSections: [
    {
      title: "Back pain and leg symptoms",
      prompts: [
        "When did the back pain become worse?",
        "Does the pain travel into one or both legs?",
        "Have you noticed any weakness in your legs?"
      ]
    },
    {
      title: "Cauda equina red flags",
      prompts: [
        "Have you had any difficulty passing urine?",
        "Any loss of bladder control?",
        "Any numbness around your bottom, genitals or inner thighs?",
        "Any loss of bowel control?"
      ]
    },
    {
      title: "Background and other red flags",
      prompts: [
        "Have you had back pain before?",
        "Any history of cancer?",
        "Any intravenous drug use?"
      ]
    }
  ],

  patientName: "Mark Hill",
  patientAge: 48,

  patientPortrayal:
    "You are uncomfortable and worried. Do not volunteer the bladder or saddle-area symptoms unless directly asked.",

  openingLine:
    "My back pain has suddenly got much worse and now both my legs feel strange.",

  historyItems: [
    {
      id: "ces_h01",
      domain: "History",
      source: "patient",
      label: "Severe lower back pain has worsened over the last 2 days",
      patientWording: "My back pain has got much worse over the last two days."
    },
    {
      id: "ces_h02",
      domain: "History",
      source: "patient",
      label: "Pain travels down both legs",
      patientWording: "The pain is going down both legs now."
    },
    {
      id: "ces_h03",
      domain: "History",
      source: "patient",
      label: "Both legs feel weaker than usual",
      patientWording: "Both my legs feel weaker than normal."
    },
    {
      id: "ces_h04",
      domain: "History",
      source: "patient",
      label: "New difficulty passing urine since this morning",
      patientWording: "Since this morning I've really struggled to pass urine."
    },
    {
      id: "ces_h05",
      domain: "History",
      source: "patient",
      label: "No urinary incontinence",
      patientWording: "I haven't lost control of my bladder."
    },
    {
      id: "ces_h06",
      domain: "History",
      source: "patient",
      label: "Numbness around the perineum and buttocks",
      patientWording: "I'm numb between my legs and around my bottom."
    },
    {
      id: "ces_h07",
      domain: "History",
      source: "patient",
      label: "No faecal incontinence",
      patientWording: "I haven't lost control of my bowels."
    },
    {
      id: "ces_h08",
      domain: "History",
      source: "patient",
      label: "Has had intermittent mechanical back pain before",
      patientWording: "I've had back pain on and off before, but never anything like this."
    },
    {
      id: "ces_h09",
      domain: "History",
      source: "patient",
      label: "No history of cancer",
      patientWording: "No, I've never had cancer."
    },
    {
      id: "ces_h10",
      domain: "History",
      source: "patient",
      label: "No intravenous drug use",
      patientWording: "No, I've never injected drugs."
    }
  ],

  examinationItems: [
    {
      id: "ces_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 102 bpm"
    },
    {
      id: "ces_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 138/84 mmHg"
    },
    {
      id: "ces_e03",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 36.9°C"
    },
    {
      id: "ces_e04",
      domain: "Examination",
      source: "clinician",
      label: "Reduced power in both legs"
    },
    {
      id: "ces_e05",
      domain: "Examination",
      source: "clinician",
      label: "Reduced sensation in the saddle area"
    },
    {
      id: "ces_e06",
      domain: "Examination",
      source: "clinician",
      label: "Reduced anal tone on rectal examination"
    }
  ],

  investigationItems: [
    {
      id: "ces_i01",
      domain: "Investigations",
      source: "clinician",
      label: "Bladder scan shows approximately 650 mL of urine"
    }
  ],

  planItems: [
    {
      id: "ces_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is suspected cauda equina syndrome"
    },
    {
      id: "ces_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Arrange an urgent MRI of the lumbosacral spine"
    },
    {
      id: "ces_p03",
      domain: "Team involvement",
      source: "clinician",
      label: "Urgently discuss with the spinal surgical team"
    },
    {
      id: "ces_p04",
      domain: "Team involvement",
      source: "clinician",
      label: "Discuss with a senior emergency or acute medical clinician"
    },
    {
      id: "ces_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give analgesia"
    },
    {
      id: "ces_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Manage urinary retention and consider urinary catheterisation"
    }
  ]
};

