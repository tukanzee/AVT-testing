import type { ClinicalCase } from "../../types";

export const nofCase: ClinicalCase = {
  id: "SCEN-11",
  title: "Neck of femur fracture",
  specialty: "Orthopaedics / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing an 82-year-old woman who has severe left hip pain and cannot weight bear after a fall at home. The diagnosis is a suspected neck of femur fracture. Use the prompts below to help the consultation flow naturally. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Fall and injury",
      prompts: [
        "Can you tell me what happened when you fell?",
        "What caused you to fall?",
        "Where did you land?",
        "Where is the pain?",
        "Were you able to stand or walk afterwards?",
        "Did you hit your head?",
        "Did you black out?",
        "How long were you on the floor?"
      ]
    },
    {
      title: "Symptoms before the fall",
      prompts: [
        "Did you feel dizzy or light-headed before you fell?",
        "Any chest pain before the fall?",
        "Any palpitations before the fall?",
        "Any shortness of breath before the fall?",
        "Did your legs give way?"
      ]
    },
    {
      title: "Background and function",
      prompts: [
        "How do you normally get around?",
        "Do you use a walking aid?",
        "Do you live alone?",
        "Are you normally independent with washing and dressing?",
        "Have you had any previous falls?",
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
    "You are in significant pain and lie very still because moving the left leg hurts. You are alert, orientated and able to give a clear history.",

  openingLine:
    "I tripped over a rug and landed on my left side. I haven't been able to stand since.",

  historyItems: [
    {
      id: "nof_h01",
      domain: "History",
      source: "patient",
      label: "Tripped over a loose rug at home",
      patientWording: "I caught my foot on a loose rug at home."
    },
    {
      id: "nof_h02",
      domain: "History",
      source: "patient",
      label: "Clearly remembers catching her foot before the fall",
      patientWording: "I remember catching my foot and then going down."
    },
    {
      id: "nof_h03",
      domain: "History",
      source: "patient",
      label: "Landed directly on the left side",
      patientWording: "I landed straight on my left side."
    },
    {
      id: "nof_h04",
      domain: "History",
      source: "patient",
      label: "Immediate severe pain in the left hip and groin",
      patientWording: "The pain started straight away, right in my left hip and groin."
    },
    {
      id: "nof_h05",
      domain: "History",
      source: "patient",
      label: "Unable to stand after the fall",
      patientWording: "I couldn't get myself back up after I fell."
    },
    {
      id: "nof_h06",
      domain: "History",
      source: "patient",
      label: "Unable to weight bear through the left leg",
      patientWording: "I can't put any weight through the left leg."
    },
    {
      id: "nof_h07",
      domain: "History",
      source: "patient",
      label: "Neighbour called an ambulance",
      patientWording: "My neighbour called the ambulance for me."
    },
    {
      id: "nof_h08",
      domain: "History",
      source: "patient",
      label: "Was on the floor for around 30 minutes",
      patientWording: "I was probably on the floor for about half an hour."
    },
    {
      id: "nof_h09",
      domain: "History",
      source: "patient",
      label: "Did not hit head",
      patientWording: "No, I didn't hit my head."
    },
    {
      id: "nof_h10",
      domain: "History",
      source: "patient",
      label: "No loss of consciousness",
      patientWording: "No, I didn't black out."
    },
    {
      id: "nof_h11",
      domain: "Review of systems",
      source: "patient",
      label: "No dizziness or light-headedness before the fall",
      patientWording: "No, I didn't feel dizzy or light-headed. I just caught my foot."
    },
    {
      id: "nof_h12",
      domain: "Review of systems",
      source: "patient",
      label: "No chest pain before the fall",
      patientWording: "No chest pain before I fell."
    },
    {
      id: "nof_h13",
      domain: "Review of systems",
      source: "patient",
      label: "No palpitations before the fall",
      patientWording: "No, my heart wasn't racing or pounding before I fell."
    },
    {
      id: "nof_h14",
      domain: "Review of systems",
      source: "patient",
      label: "No shortness of breath before the fall",
      patientWording: "I wasn't short of breath before I fell."
    },
    {
      id: "nof_h15",
      domain: "History",
      source: "patient",
      label: "Normally mobilises independently indoors",
      patientWording: "I normally get around the house on my own."
    },
    {
      id: "nof_h16",
      domain: "History",
      source: "patient",
      label: "Uses a walking stick outdoors",
      patientWording: "I use a walking stick when I go outside."
    },
    {
      id: "nof_h17",
      domain: "History",
      source: "patient",
      label: "Lives alone",
      patientWording: "I live on my own."
    },
    {
      id: "nof_h18",
      domain: "History",
      source: "patient",
      label: "Normally independent with personal care",
      patientWording: "I normally wash and dress myself."
    },
    {
      id: "nof_h19",
      domain: "History",
      source: "patient",
      label: "Had one minor fall around 6 months ago without injury",
      patientWording: "I had a small fall about six months ago, but I wasn't injured."
    },
    {
      id: "nof_h20",
      domain: "History",
      source: "patient",
      label: "Has hypertension",
      patientWording: "I've got high blood pressure."
    },
    {
      id: "nof_h21",
      domain: "History",
      source: "patient",
      label: "Takes amlodipine",
      patientWording: "I take amlodipine."
    },
    {
      id: "nof_h22",
      domain: "History",
      source: "patient",
      label: "Does not take anticoagulants",
      patientWording: "No, I don't take any blood thinners."
    },
    {
      id: "nof_h23",
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
      label: "Patient is lying still in bed and is reluctant to move because of severe left hip pain"
    },
    {
      id: "nof_e07",
      domain: "Examination",
      source: "clinician",
      label: "Patient is alert, orientated and able to give a clear history"
    },
    {
      id: "nof_e08",
      domain: "Examination",
      source: "clinician",
      label: "Left leg is visibly shortened compared with the right"
    },
    {
      id: "nof_e09",
      domain: "Examination",
      source: "clinician",
      label: "Left leg rests externally rotated"
    },
    {
      id: "nof_e10",
      domain: "Examination",
      source: "clinician",
      label: "Patient is unable to straight-leg raise on the left because of pain"
    },
    {
      id: "nof_e11",
      domain: "Examination",
      source: "clinician",
      label: "Marked tenderness is present around the left groin and greater trochanter"
    },
    {
      id: "nof_e12",
      domain: "Examination",
      source: "clinician",
      label: "Any attempted movement of the left hip causes significant pain"
    },
    {
      id: "nof_e13",
      domain: "Examination",
      source: "clinician",
      label: "Log roll of the left leg causes severe groin pain"
    },
    {
      id: "nof_e14",
      domain: "Examination",
      source: "clinician",
      label: "Patient is unable to actively flex the left hip because of pain"
    },
    {
      id: "nof_e15",
      domain: "Examination",
      source: "clinician",
      label: "Left knee and ankle can still be moved"
    },
    {
      id: "nof_e16",
      domain: "Examination",
      source: "clinician",
      label: "No obvious deformity or focal tenderness of the left knee or ankle"
    },
    {
      id: "nof_e17",
      domain: "Examination",
      source: "clinician",
      label: "No open wound is present"
    },
    {
      id: "nof_e18",
      domain: "Examination",
      source: "clinician",
      label: "No obvious bruising or injury to the head"
    },
    {
      id: "nof_e19",
      domain: "Examination",
      source: "clinician",
      label: "Upper limbs are non-tender"
    },
    {
      id: "nof_e20",
      domain: "Examination",
      source: "clinician",
      label: "Distal sensation in the left leg is intact"
    },
    {
      id: "nof_e21",
      domain: "Examination",
      source: "clinician",
      label: "Left dorsalis pedis pulse is palpable"
    },
    {
      id: "nof_e22",
      domain: "Examination",
      source: "clinician",
      label: "Left foot is warm and well perfused"
    },
    {
      id: "nof_e23",
      domain: "Examination",
      source: "clinician",
      label: "No focal neurological deficit is identified"
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
    },
    {
      id: "nof_i03",
      domain: "Investigations",
      source: "clinician",
      label: "Routine pre-operative blood tests have been obtained"
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
    },
    {
      id: "nof_p08",
      domain: "Team involvement",
      source: "clinician",
      label: "Arrange orthogeriatric assessment as part of ongoing inpatient management"
    }
  ]
};
