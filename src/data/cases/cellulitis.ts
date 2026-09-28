import type { ClinicalCase } from "../../types";

export const cellulitisCase: ClinicalCase = {
  id: "SCEN-07",
  title: "Cellulitis",
  specialty: "Dermatology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 56-year-old man with a painful, red and swollen left lower leg and systemic symptoms. The diagnosis is cellulitis. Use the prompts below to help the consultation flow naturally. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Presenting complaint",
      prompts: [
        "When did the redness start?",
        "Where did it start?",
        "Has the redness been spreading?",
        "Is the leg painful, hot or swollen?",
        "Have you had any fever, shivering or rigors?",
        "Are you able to walk normally?"
      ]
    },
    {
      title: "Possible source",
      prompts: [
        "Any injury or trauma to the leg?",
        "Any cuts, wounds or ulcers?",
        "Any problems with the skin between your toes?",
        "Any insect bites?"
      ]
    },
    {
      title: "Other relevant symptoms",
      prompts: [
        "Any calf pain before the redness appeared?",
        "Any recent surgery or long periods of immobility?",
        "Have you had cellulitis before?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "Any medical problems such as diabetes?",
        "How well controlled is your diabetes normally?",
        "What regular medication do you take?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "David Shah",
  patientAge: 56,

  patientPortrayal:
    "You feel feverish and uncomfortable. Your left lower leg is sore, hot and swollen, and you walk with a slight limp because it hurts to put weight through it.",

  openingLine:
    "My left leg has gone really red and painful over the last couple of days.",

  historyItems: [
    {
      id: "cell_h01",
      domain: "History",
      source: "patient",
      label: "Small red patch appeared on the left lower leg 2 days ago",
      patientWording: "It started as a small red patch on my left lower leg two days ago."
    },
    {
      id: "cell_h02",
      domain: "History",
      source: "patient",
      label: "Redness has gradually spread further up the shin",
      patientWording: "The redness has gradually spread further up my shin."
    },
    {
      id: "cell_h03",
      domain: "History",
      source: "patient",
      label: "Left lower leg feels increasingly hot",
      patientWording: "The leg feels really hot now."
    },
    {
      id: "cell_h04",
      domain: "History",
      source: "patient",
      label: "Left lower leg is swollen",
      patientWording: "It's swollen compared with the other leg."
    },
    {
      id: "cell_h05",
      domain: "History",
      source: "patient",
      label: "Has constant aching pain in the left lower leg",
      patientWording: "It's a constant aching pain."
    },
    {
      id: "cell_h06",
      domain: "History",
      source: "patient",
      label: "Pain is worse when walking",
      patientWording: "It hurts more when I walk on it."
    },
    {
      id: "cell_h07",
      domain: "History",
      source: "patient",
      label: "Had shivering and rigors overnight",
      patientWording: "I was shivering quite badly last night."
    },
    {
      id: "cell_h08",
      domain: "History",
      source: "patient",
      label: "Feels feverish today",
      patientWording: "I've felt feverish today."
    },
    {
      id: "cell_h09",
      domain: "History",
      source: "patient",
      label: "No injury or trauma to the leg",
      patientWording: "I haven't injured the leg."
    },
    {
      id: "cell_h10",
      domain: "History",
      source: "patient",
      label: "No ulcer or open wound",
      patientWording: "I haven't noticed any ulcer or open wound."
    },
    {
      id: "cell_h11",
      domain: "History",
      source: "patient",
      label: "Has cracked skin between the toes of the left foot",
      patientWording: "The skin between my toes has been cracked for a while."
    },
    {
      id: "cell_h12",
      domain: "History",
      source: "patient",
      label: "No insect bite recalled",
      patientWording: "I don't remember being bitten by anything."
    },
    {
      id: "cell_h13",
      domain: "History",
      source: "patient",
      label: "No recent surgery or prolonged immobility",
      patientWording: "No recent surgery and I haven't been stuck in bed or sitting for long periods."
    },
    {
      id: "cell_h14",
      domain: "History",
      source: "patient",
      label: "No previous deep vein thrombosis",
      patientWording: "I've never had a blood clot in my leg before."
    },
    {
      id: "cell_h15",
      domain: "History",
      source: "patient",
      label: "Had one previous episode of cellulitis several years ago",
      patientWording: "I had cellulitis once a few years ago."
    },
    {
      id: "cell_h16",
      domain: "History",
      source: "patient",
      label: "Has Type 2 diabetes",
      patientWording: "I've got Type 2 diabetes."
    },
    {
      id: "cell_h17",
      domain: "History",
      source: "patient",
      label: "Diabetes is usually reasonably controlled",
      patientWording: "My diabetes is usually reasonably controlled."
    },
    {
      id: "cell_h18",
      domain: "History",
      source: "patient",
      label: "Takes metformin",
      patientWording: "I take metformin."
    },
    {
      id: "cell_h19",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "No known drug allergies."
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
      label: "Patient looks flushed and mildly unwell but is alert and speaking normally"
    },
    {
      id: "cell_e07",
      domain: "Examination",
      source: "clinician",
      label: "Patient walks with a limp because weight bearing through the left leg is painful"
    },
    {
      id: "cell_e08",
      domain: "Examination",
      source: "clinician",
      label: "Left lower leg appears visibly more swollen than the right"
    },
    {
      id: "cell_e09",
      domain: "Examination",
      source: "clinician",
      label: "Diffuse erythema extends from around the left ankle to the mid-shin"
    },
    {
      id: "cell_e10",
      domain: "Examination",
      source: "clinician",
      label: "Affected skin is warm to touch"
    },
    {
      id: "cell_e11",
      domain: "Examination",
      source: "clinician",
      label: "Affected area is diffusely tender rather than focally tender"
    },
    {
      id: "cell_e12",
      domain: "Examination",
      source: "clinician",
      label: "Borders of the erythema are poorly defined"
    },
    {
      id: "cell_e13",
      domain: "Examination",
      source: "clinician",
      label: "No fluctuance or focal collection"
    },
    {
      id: "cell_e14",
      domain: "Examination",
      source: "clinician",
      label: "No discharge from the affected area"
    },
    {
      id: "cell_e15",
      domain: "Examination",
      source: "clinician",
      label: "No bullae"
    },
    {
      id: "cell_e16",
      domain: "Examination",
      source: "clinician",
      label: "No crepitus"
    },
    {
      id: "cell_e17",
      domain: "Examination",
      source: "clinician",
      label: "No skin necrosis"
    },
    {
      id: "cell_e18",
      domain: "Examination",
      source: "clinician",
      label: "No pain out of proportion to the examination findings"
    },
    {
      id: "cell_e19",
      domain: "Examination",
      source: "clinician",
      label: "Mild pitting oedema is present around the left ankle"
    },
    {
      id: "cell_e20",
      domain: "Examination",
      source: "clinician",
      label: "Cracked and macerated skin is present between the toes of the left foot"
    },
    {
      id: "cell_e21",
      domain: "Examination",
      source: "clinician",
      label: "No calf tenderness separate from the cellulitic area"
    },
    {
      id: "cell_e22",
      domain: "Examination",
      source: "clinician",
      label: "Distal pulses are palpable"
    },
    {
      id: "cell_e23",
      domain: "Examination",
      source: "clinician",
      label: "Left foot is warm and well perfused"
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
      label: "White cell count 15.1 ×10⁹/L"
    },
    {
      id: "cell_i03",
      domain: "Investigations",
      source: "clinician",
      label: "CRP 96 mg/L"
    },
    {
      id: "cell_i04",
      domain: "Investigations",
      source: "clinician",
      label: "Renal function is preserved"
    },
    {
      id: "cell_i05",
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
      label: "Working diagnosis is left lower limb cellulitis"
    },
    {
      id: "cell_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Assess for sepsis"
    },
    {
      id: "cell_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Request blood tests including FBC, CRP and U&E"
    },
    {
      id: "cell_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Take blood cultures if clinically indicated"
    },
    {
      id: "cell_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Mark the edge of the erythema"
    },
    {
      id: "cell_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Start antibiotics according to local cellulitis guidance"
    },
    {
      id: "cell_p07",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give analgesia"
    },
    {
      id: "cell_p08",
      domain: "Plan / actions",
      source: "clinician",
      label: "Elevate the affected leg"
    },
    {
      id: "cell_p09",
      domain: "Plan / actions",
      source: "clinician",
      label: "Review diabetic control"
    },
    {
      id: "cell_p10",
      domain: "Team involvement",
      source: "clinician",
      label: "Discuss with the acute medical team if admission is required"
    }
  ]
};
