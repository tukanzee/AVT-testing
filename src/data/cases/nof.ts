import type { ClinicalCase } from "../../types";

export const nofCase: ClinicalCase = {
  id: "SCEN-06",
  title: "Neck of femur fracture",
  specialty: "Orthopaedics / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing an 82-year-old woman who has severe left hip pain and cannot weight bear after a fall at home. The diagnosis is a suspected neck of femur fracture. Use the prompts below to keep the consultation flowing naturally.",

  doctorPromptSections: [
    {
      title: "Fall and injury",
      prompts: [
        "Can you tell me what happened when you fell?",
        "Where did you land?",
        "Where is the pain?",
        "Were you able to stand or walk afterwards?",
        "Did you hit your head?",
        "Did you black out?"
      ]
    },
    {
      title: "Symptoms before the fall",
      prompts: [
        "Did you feel dizzy or light-headed before you fell?",
        "Any chest pain or palpitations before the fall?"
      ]
    },
    {
      title: "Background and function",
      prompts: [
        "How do you normally get around?",
        "Do you use a walking aid?",
        "Do you live alone?",
        "Any other medical problems?",
        "What medications do you take?",
        "Do you take any blood-thinning medication?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Margaret Lewis",
  patientAge: 82,

  patientPortrayal:
    "You are in significant pain and do not want to move your left leg. You are alert and able to answer questions normally.",

  openingLine:
    "I tripped over a rug and landed on my left side. I haven't been able to stand since.",

  historyItems: [
    {
      id: "nof_h01",
      domain: "History",
      source: "patient",
      label: "Tripped over a rug at home",
      patientWording: "I tripped over a rug at home."
    },
    {
      id: "nof_h02",
      domain: "History",
      source: "patient",
      label: "Landed on the left side",
      patientWording: "I landed straight on my left side."
    },
    {
      id: "nof_h03",
      domain: "History",
      source: "patient",
      label: "Immediate severe pain in the left hip and groin",
      patientWording: "The pain started straight away, right in my left hip and groin."
    },
    {
      id: "nof_h04",
      domain: "History",
      source: "patient",
      label: "Unable to stand or weight bear since the fall",
      patientWording: "I haven't been able to stand or put any weight through that leg since."
    },
    {
      id: "nof_h05",
      domain: "History",
      source: "patient",
      label: "Did not hit head",
      patientWording: "No, I didn't hit my head."
    },
    {
      id: "nof_h06",
      domain: "History",
      source: "patient",
      label: "No loss of consciousness",
      patientWording: "No, I didn't black out."
    },
    {
      id: "nof_h07",
      domain: "Review of systems",
      source: "patient",
      label: "No dizziness or light-headedness before the fall",
      patientWording: "No, I didn't feel dizzy or light-headed. I just caught my foot."
    },
    {
      id: "nof_h08",
      domain: "Review of systems",
      source: "patient",
      label: "No chest pain or palpitations before the fall",
      patientWording: "No chest pain or racing heart before I fell."
    },
    {
      id: "nof_h09",
      domain: "History",
      source: "patient",
      label: "Normally mobilises independently indoors",
      patientWording: "I normally get around the house on my own."
    },
    {
      id: "nof_h10",
      domain: "History",
      source: "patient",
      label: "Uses a walking stick outdoors",
      patientWording: "I use a walking stick when I go outside."
    },
    {
      id: "nof_h11",
      domain: "History",
      source: "patient",
      label: "Lives alone",
      patientWording: "I live on my own."
    },
    {
      id: "nof_h12",
      domain: "History",
      source: "patient",
      label: "Has hypertension",
      patientWording: "I've got high blood pressure."
    },
    {
      id: "nof_h13",
      domain: "History",
      source: "patient",
      label: "Takes amlodipine",
      patientWording: "I take amlodipine."
    },
    {
      id: "nof_h14",
      domain: "History",
      source: "patient",
      label: "Does not take blood-thinning medication",
      patientWording: "No, I don't take any blood thinners."
    },
    {
      id: "nof_h15",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "No allergies that I know of."
    }
  ],

  examinationItems: [
    {
      id: "nof_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 94 bpm"
    },
    {
      id: "nof_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 146/82 mmHg"
    },
    {
      id: "nof_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 18/min"
    },
    {
      id: "nof_e04",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ 97% on room air"
    },
    {
      id: "nof_e05",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 36.7°C"
    },
    {
      id: "nof_e06",
      domain: "Examination",
      source: "clinician",
      label: "Left leg is shortened and externally rotated"
    },
    {
      id: "nof_e07",
      domain: "Examination",
      source: "clinician",
      label: "Marked tenderness over the left hip and groin"
    },
    {
      id: "nof_e08",
      domain: "Examination",
      source: "clinician",
      label: "Severe pain on movement of the left hip"
    },
    {
      id: "nof_e09",
      domain: "Examination",
      source: "clinician",
      label: "Distal neurovascular examination is intact"
    }
  ],

  investigationItems: [
    {
      id: "nof_i01",
      domain: "Investigations",
      source: "clinician",
      label: "X-ray pelvis and left hip shows a displaced intracapsular fracture of the left neck of femur"
    },
    {
      id: "nof_i02",
      domain: "Investigations",
      source: "clinician",
      label: "ECG shows sinus rhythm"
    }
  ],

  planItems: [
    {
      id: "nof_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give analgesia"
    },
    {
      id: "nof_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Consider a fascia iliaca block for pain relief"
    },
    {
      id: "nof_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Request blood tests including FBC, U&E, coagulation screen and group and save"
    },
    {
      id: "nof_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Arrange an ECG"
    },
    {
      id: "nof_p05",
      domain: "Team involvement",
      source: "clinician",
      label: "Refer to the orthopaedic team"
    },
    {
      id: "nof_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Admit to hospital for further management"
    },
    {
      id: "nof_p07",
      domain: "Plan / actions",
      source: "clinician",
      label: "Complete a falls assessment"
    }
  ]
};

