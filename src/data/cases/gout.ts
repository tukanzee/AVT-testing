import type { ClinicalCase } from "../../types";

export const goutCase: ClinicalCase = {
  id: "SCEN-10",
  title: "Acute gout",
  specialty: "Rheumatology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 58-year-old man with sudden severe pain, redness and swelling around the base of the right big toe. The diagnosis is acute gout. Use the prompts below to keep the consultation flowing naturally.",

  doctorPromptSections: [
    {
      title: "Presenting complaint",
      prompts: [
        "When did the pain start?",
        "Where exactly is the pain?",
        "Did it come on suddenly or gradually?",
        "Is the joint red, hot or swollen?",
        "How painful is it when something touches the joint?"
      ]
    },
    {
      title: "Important differentials",
      prompts: [
        "Any injury or trauma?",
        "Any fever, shivering or rigors?"
      ]
    },
    {
      title: "Previous episodes and risk factors",
      prompts: [
        "Have you had anything like this before?",
        "What regular medication do you take?",
        "How much alcohol do you usually drink?"
      ]
    }
  ],

  patientName: "Peter Evans",
  patientAge: 58,

  patientPortrayal:
    "You are in severe pain and do not want the right foot touched. You can otherwise speak normally.",

  openingLine:
    "My right big toe is absolutely killing me.",

  historyItems: [
    {
      id: "gout_h01",
      domain: "History",
      source: "patient",
      label: "Pain came on suddenly overnight",
      patientWording: "It came on really suddenly overnight."
    },
    {
      id: "gout_h02",
      domain: "History",
      source: "patient",
      label: "Pain is at the base of the right big toe",
      patientWording: "It's right at the base of my right big toe."
    },
    {
      id: "gout_h03",
      domain: "History",
      source: "patient",
      label: "Joint is red, hot and swollen",
      patientWording: "It's red, hot and swollen."
    },
    {
      id: "gout_h04",
      domain: "History",
      source: "patient",
      label: "Even light touch over the joint is very painful",
      patientWording: "Even the bedsheet touching it hurts."
    },
    {
      id: "gout_h05",
      domain: "History",
      source: "patient",
      label: "No injury or trauma",
      patientWording: "I haven't injured it."
    },
    {
      id: "gout_h06",
      domain: "Review of systems",
      source: "patient",
      label: "No fever, shivering or rigors",
      patientWording: "No, I haven't had a fever or shivering."
    },
    {
      id: "gout_h07",
      domain: "History",
      source: "patient",
      label: "Had a similar episode around one year ago",
      patientWording: "I had something very similar about a year ago."
    },
    {
      id: "gout_h08",
      domain: "History",
      source: "patient",
      label: "Takes bendroflumethiazide for hypertension",
      patientWording: "I take bendroflumethiazide for my blood pressure."
    },
    {
      id: "gout_h09",
      domain: "History",
      source: "patient",
      label: "Drinks a few pints of beer on most evenings",
      patientWording: "I probably have a few pints most evenings."
    }
  ],

  examinationItems: [
    {
      id: "gout_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 86 bpm"
    },
    {
      id: "gout_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 152/88 mmHg"
    },
    {
      id: "gout_e03",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 36.8°C"
    },
    {
      id: "gout_e04",
      domain: "Examination",
      source: "clinician",
      label: "Right first MTP joint is red, hot and swollen"
    },
    {
      id: "gout_e05",
      domain: "Examination",
      source: "clinician",
      label: "Marked tenderness over the right first MTP joint"
    },
    {
      id: "gout_e06",
      domain: "Examination",
      source: "clinician",
      label: "Movement of the right first MTP joint is limited by pain"
    }
  ],

  investigationItems: [],

  planItems: [
    {
      id: "gout_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Consider septic arthritis if the diagnosis is uncertain"
    },
    {
      id: "gout_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Consider joint aspiration if septic arthritis cannot be excluded"
    },
    {
      id: "gout_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give anti-inflammatory treatment if clinically appropriate"
    },
    {
      id: "gout_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give analgesia"
    },
    {
      id: "gout_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Review medicines and other factors that may contribute to gout"
    },
    {
      id: "gout_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Arrange follow-up with the GP"
    }
  ]
};

