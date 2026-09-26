import type { ClinicalCase } from "../../types";

export const cellulitisCase: ClinicalCase = {
  id: "SCEN-07",
  title: "Cellulitis",
  specialty: "Dermatology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 56-year-old man with a painful, red and swollen left lower leg and systemic symptoms. The diagnosis is cellulitis. Use the prompts below to keep the consultation flowing naturally.",

  doctorPromptSections: [
    {
      title: "Presenting complaint",
      prompts: [
        "When did the redness start?",
        "Has the redness been spreading?",
        "Is the leg painful, hot or swollen?",
        "Have you had any fever, shivering or rigors?",
        "Any injury or trauma to the leg?"
      ]
    },
    {
      title: "Possible source",
      prompts: [
        "Any cuts, ulcers or broken skin?",
        "Any problems with the skin between your toes?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "Any medical problems such as diabetes?",
        "What regular medication do you take?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "David Shah",
  patientAge: 56,

  patientPortrayal:
    "You feel feverish and uncomfortable. Your left lower leg is sore, hot and swollen.",

  openingLine:
    "My left leg has gone really red and painful over the last couple of days.",

  historyItems: [
    {
      id: "cell_h01",
      domain: "History",
      source: "patient",
      label: "Red patch on the left lower leg started 2 days ago",
      patientWording: "It started as a small red patch on my left lower leg two days ago."
    },
    {
      id: "cell_h02",
      domain: "History",
      source: "patient",
      label: "Redness has spread further up the shin",
      patientWording: "The redness has spread further up my shin."
    },
    {
      id: "cell_h03",
      domain: "History",
      source: "patient",
      label: "Left lower leg feels hot, swollen and painful",
      patientWording: "It feels hot, swollen and really sore."
    },
    {
      id: "cell_h04",
      domain: "History",
      source: "patient",
      label: "Had shivering and rigors overnight",
      patientWording: "I was shivering quite badly last night."
    },
    {
      id: "cell_h05",
      domain: "History",
      source: "patient",
      label: "No injury or trauma to the leg",
      patientWording: "I haven't injured the leg."
    },
    {
      id: "cell_h06",
      domain: "History",
      source: "patient",
      label: "Has cracked skin between the toes of the left foot",
      patientWording: "The skin between my toes has been cracked for a while."
    },
    {
      id: "cell_h07",
      domain: "History",
      source: "patient",
      label: "Has Type 2 diabetes",
      patientWording: "I've got Type 2 diabetes."
    },
    {
      id: "cell_h08",
      domain: "History",
      source: "patient",
      label: "Takes metformin",
      patientWording: "I take metformin."
    },
    {
      id: "cell_h09",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "No known allergies."
    }
  ],

  examinationItems: [
    {
      id: "cell_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 106 bpm"
    },
    {
      id: "cell_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 128/74 mmHg"
    },
    {
      id: "cell_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 18/min"
    },
    {
      id: "cell_e04",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ 98% on room air"
    },
    {
      id: "cell_e05",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 38.2°C"
    },
    {
      id: "cell_e06",
      domain: "Examination",
      source: "clinician",
      label: "Left lower leg has diffuse erythema, warmth and tenderness"
    },
    {
      id: "cell_e07",
      domain: "Examination",
      source: "clinician",
      label: "Left lower leg is swollen"
    },
    {
      id: "cell_e08",
      domain: "Examination",
      source: "clinician",
      label: "No bullae or crepitus"
    },
    {
      id: "cell_e09",
      domain: "Examination",
      source: "clinician",
      label: "Distal pulses are palpable"
    }
  ],

  investigationItems: [
    {
      id: "cell_i01",
      domain: "Investigations",
      source: "clinician",
      label: "Capillary blood glucose 11.2 mmol/L"
    },
    {
      id: "cell_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Lactate 1.6 mmol/L"
    }
  ],

  planItems: [
    {
      id: "cell_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Assess for sepsis"
    },
    {
      id: "cell_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Request blood tests including FBC, CRP and U&E"
    },
    {
      id: "cell_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Take blood cultures if clinically indicated"
    },
    {
      id: "cell_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Mark the edge of the erythema"
    },
    {
      id: "cell_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Start antibiotics according to local cellulitis guidance"
    },
    {
      id: "cell_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give analgesia"
    },
    {
      id: "cell_p07",
      domain: "Plan / actions",
      source: "clinician",
      label: "Elevate the affected leg"
    },
    {
      id: "cell_p08",
      domain: "Team involvement",
      source: "clinician",
      label: "Discuss with the acute medical team if admission is required"
    }
  ]
};

