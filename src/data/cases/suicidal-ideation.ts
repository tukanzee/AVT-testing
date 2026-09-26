import type { ClinicalCase } from "../../types";

export const suicidalIdeationCase: ClinicalCase = {
  id: "SCEN-08",
  title: "Suicidal ideation",
  specialty: "Mental Health / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 32-year-old patient with worsening low mood and suicidal thoughts. The diagnosis is a mental health crisis with suicidal ideation. Use the prompts below to complete a focused risk assessment and discuss an immediate plan.",

  doctorPromptSections: [
    {
      title: "Current mental state",
      prompts: [
        "How have you been feeling recently?",
        "How long have things been getting worse?",
        "Have you had thoughts that you would be better off dead?",
        "Have you had thoughts about ending your life?"
      ]
    },
    {
      title: "Immediate risk",
      prompts: [
        "Have you done anything to harm yourself today?",
        "Have you thought about how you might harm yourself?",
        "Have you made any preparations?",
        "Do you have access to medication or anything else you could use to harm yourself?",
        "Do you have any thoughts about harming anyone else?"
      ]
    },
    {
      title: "Psychotic symptoms and protective factors",
      prompts: [
        "Have you been hearing or seeing things that other people cannot?",
        "Who do you live with?",
        "Is there anyone you feel able to talk to or who helps keep you safe?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "Have you had depression or other mental health problems before?",
        "Have you used alcohol or recreational drugs today?"
      ]
    }
  ],

  patientName: "Emma Clarke",
  patientAge: 32,

  patientPortrayal:
    "You are tearful and quiet but engage with the doctor. Do not volunteer all risk details immediately; answer honestly when asked directly.",

  openingLine:
    "I just don't feel like I can cope anymore.",

  historyItems: [
    {
      id: "mh_h01",
      domain: "History",
      source: "patient",
      label: "Low mood has worsened over the last few weeks",
      patientWording: "I've been getting worse over the last few weeks."
    },
    {
      id: "mh_h02",
      domain: "History",
      source: "patient",
      label: "Feels unable to cope",
      patientWording: "I just don't feel like I can cope anymore."
    },
    {
      id: "mh_h03",
      domain: "History",
      source: "patient",
      label: "Has thoughts of being better off dead",
      patientWording: "I've started thinking I'd be better off dead."
    },
    {
      id: "mh_h04",
      domain: "History",
      source: "patient",
      label: "Has had thoughts about ending their life",
      patientWording: "I've been thinking about ending my life."
    },
    {
      id: "mh_h05",
      domain: "History",
      source: "patient",
      label: "Has not made a suicide attempt today",
      patientWording: "I haven't done anything to hurt myself today."
    },
    {
      id: "mh_h06",
      domain: "History",
      source: "patient",
      label: "Has thought about taking an overdose",
      patientWording: "I've thought about taking all my tablets."
    },
    {
      id: "mh_h07",
      domain: "History",
      source: "patient",
      label: "Has not gathered medication or made preparations",
      patientWording: "No, I haven't collected anything or made any preparations."
    },
    {
      id: "mh_h08",
      domain: "History",
      source: "patient",
      label: "No thoughts of harming other people",
      patientWording: "No, I don't want to hurt anyone else."
    },
    {
      id: "mh_h09",
      domain: "Review of systems",
      source: "patient",
      label: "No auditory or visual hallucinations",
      patientWording: "No, I haven't been hearing or seeing things."
    },
    {
      id: "mh_h10",
      domain: "History",
      source: "patient",
      label: "Lives with partner",
      patientWording: "I live with my partner."
    },
    {
      id: "mh_h11",
      domain: "History",
      source: "patient",
      label: "Partner is an important protective factor",
      patientWording: "My partner is the main reason I've kept going."
    },
    {
      id: "mh_h12",
      domain: "History",
      source: "patient",
      label: "Previous episode of depression",
      patientWording: "I had depression a few years ago."
    },
    {
      id: "mh_h13",
      domain: "History",
      source: "patient",
      label: "No alcohol or recreational drug use today",
      patientWording: "I haven't been drinking or taking drugs today."
    }
  ],

  examinationItems: [
    {
      id: "mh_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 88 bpm"
    },
    {
      id: "mh_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 124/76 mmHg"
    },
    {
      id: "mh_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 16/min"
    },
    {
      id: "mh_e04",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ 99% on room air"
    },
    {
      id: "mh_e05",
      domain: "Examination",
      source: "clinician",
      label: "Patient is tearful but engages appropriately in conversation"
    },
    {
      id: "mh_e06",
      domain: "Examination",
      source: "clinician",
      label: "Speech is coherent and relevant"
    },
    {
      id: "mh_e07",
      domain: "Examination",
      source: "clinician",
      label: "No evidence of responding to unseen stimuli"
    }
  ],

  investigationItems: [],

  planItems: [
    {
      id: "mh_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Complete an immediate suicide and self-harm risk assessment"
    },
    {
      id: "mh_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Maintain a safe environment and appropriate observation"
    },
    {
      id: "mh_p03",
      domain: "Team involvement",
      source: "clinician",
      label: "Refer to the mental health liaison team"
    },
    {
      id: "mh_p04",
      domain: "Team involvement",
      source: "clinician",
      label: "Discuss with a senior clinician"
    },
    {
      id: "mh_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Consider involving the patient's partner with the patient's consent"
    },
    {
      id: "mh_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Agree a safe disposition based on the mental health risk assessment"
    }
  ]
};

