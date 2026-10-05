import type { ClinicalCase } from "../../types";

export const recurrentFallsCase: ClinicalCase = {
  id: "SCEN-13",
  title: "Recurrent falls with postural hypotension",
  specialty: "Geriatrics / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing an 82-year-old woman with three falls over the last month. Her most recent fall occurred after standing quickly from an armchair and was preceded by brief light-headedness without loss of consciousness. Use the prompts below to establish the mechanism, identify injuries and assess common reversible contributors to falls. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Most recent fall",
      prompts: [
        "Can you tell me exactly what happened?",
        "What were you doing just before you fell?",
        "Did you feel dizzy or light-headed?",
        "Did you black out?",
        "Do you remember the whole event?",
        "Did you hit your head?",
        "Where did you injure yourself?",
        "Were you able to get up afterwards?"
      ]
    },
    {
      title: "Previous falls and symptoms",
      prompts: [
        "How many times have you fallen recently?",
        "Any chest pain or palpitations before the falls?",
        "Any seizure-like shaking?",
        "Any new weakness, numbness or speech problems?"
      ]
    },
    {
      title: "Baseline function and home",
      prompts: [
        "How do you normally mobilise?",
        "Do you use a walking aid?",
        "Do you live alone?",
        "Have you been eating and drinking normally?"
      ]
    },
    {
      title: "Medication and medical background",
      prompts: [
        "What regular medication do you take?",
        "Any recent medication changes?",
        "Any recent infection or illness?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Eileen Morris",
  patientAge: 82,

  patientPortrayal:
    "You are alert and give a clear history. When asked to stand, you rise cautiously and briefly pause because you feel slightly light-headed.",

  openingLine:
    "I've fallen a few times recently. Today I stood up from my chair, felt light-headed and went down.",

  historyItems: [
    {
      id: "fall_h01",
      domain: "History",
      source: "patient",
      label: "Has had 3 falls over the last month",
      patientWording: "I've fallen three times over the last month."
    },
    {
      id: "fall_h02",
      domain: "History",
      source: "patient",
      label: "Most recent fall occurred after standing quickly from an armchair",
      patientWording: "Today I stood up quickly from my armchair and then I fell."
    },
    {
      id: "fall_h03",
      domain: "History",
      source: "patient",
      label: "Felt briefly light-headed before the fall",
      patientWording: "I felt light-headed for a few seconds after I stood up."
    },
    {
      id: "fall_h04",
      domain: "History",
      source: "patient",
      label: "Legs felt weak immediately before the fall",
      patientWording: "My legs felt a bit weak and then I went down."
    },
    {
      id: "fall_h05",
      domain: "History",
      source: "patient",
      label: "No loss of consciousness",
      patientWording: "I definitely didn't black out."
    },
    {
      id: "fall_h06",
      domain: "History",
      source: "patient",
      label: "Remembers the whole event",
      patientWording: "I remember the whole thing from start to finish."
    },
    {
      id: "fall_h07",
      domain: "History",
      source: "patient",
      label: "No head strike",
      patientWording: "I didn't hit my head."
    },
    {
      id: "fall_h08",
      domain: "History",
      source: "patient",
      label: "Hit the side of the hip against a coffee table",
      patientWording: "I banged the side of my hip on the coffee table."
    },
    {
      id: "fall_h09",
      domain: "History",
      source: "patient",
      label: "Was able to stand after the fall",
      patientWording: "I managed to get myself up afterwards."
    },
    {
      id: "fall_h10",
      domain: "Review of systems",
      source: "patient",
      label: "No chest pain before the fall",
      patientWording: "I didn't have any chest pain."
    },
    {
      id: "fall_h11",
      domain: "Review of systems",
      source: "patient",
      label: "No palpitations before the fall",
      patientWording: "My heart wasn't racing or pounding."
    },
    {
      id: "fall_h12",
      domain: "Review of systems",
      source: "patient",
      label: "No seizure activity",
      patientWording: "No one saw any shaking or anything like a seizure."
    },
    {
      id: "fall_h13",
      domain: "Review of systems",
      source: "patient",
      label: "No new focal weakness, numbness or speech disturbance",
      patientWording: "I haven't had any new weakness, numbness or trouble speaking."
    },
    {
      id: "fall_h14",
      domain: "History",
      source: "patient",
      label: "Normally mobilises independently indoors",
      patientWording: "I usually get around the house on my own."
    },
    {
      id: "fall_h15",
      domain: "History",
      source: "patient",
      label: "Uses a walking stick outdoors",
      patientWording: "I use a walking stick when I go outside."
    },
    {
      id: "fall_h16",
      domain: "History",
      source: "patient",
      label: "Lives alone",
      patientWording: "I live on my own."
    },
    {
      id: "fall_h17",
      domain: "History",
      source: "patient",
      label: "Has been drinking less fluid than usual recently",
      patientWording: "I probably haven't been drinking as much as I should recently."
    },
    {
      id: "fall_h18",
      domain: "History",
      source: "patient",
      label: "Takes amlodipine and a diuretic",
      patientWording: "I take amlodipine and a water tablet for my blood pressure."
    },
    {
      id: "fall_h19",
      domain: "History",
      source: "patient",
      label: "No recent medication changes",
      patientWording: "My tablets haven't changed recently."
    },
    {
      id: "fall_h20",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "I don't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "fall_e01",
      domain: "Observations",
      source: "clinician",
      label: "Patient is alert and orientated"
    },
    {
      id: "fall_e02",
      domain: "Examination",
      source: "clinician",
      label: "Patient rises cautiously from the chair"
    },
    {
      id: "fall_e03",
      domain: "Examination",
      source: "clinician",
      label: "Patient briefly pauses to steady herself after standing"
    },
    {
      id: "fall_e04",
      domain: "Examination",
      source: "clinician",
      label: "Gait is slow with short steps"
    },
    {
      id: "fall_e05",
      domain: "Examination",
      source: "clinician",
      label: "No facial asymmetry"
    },
    {
      id: "fall_e06",
      domain: "Examination",
      source: "clinician",
      label: "No dysarthria"
    },
    {
      id: "fall_e07",
      domain: "Examination",
      source: "clinician",
      label: "No focal unilateral limb weakness"
    },
    {
      id: "fall_e08",
      domain: "Examination",
      source: "clinician",
      label: "Mild bruising over the lateral hip"
    },
    {
      id: "fall_e09",
      domain: "Examination",
      source: "clinician",
      label: "No bony deformity of the hip"
    },
    {
      id: "fall_e10",
      domain: "Examination",
      source: "clinician",
      label: "Patient is able to weight bear"
    },
    {
      id: "fall_e11",
      domain: "Observations",
      source: "clinician",
      label: "Lying blood pressure 142/78 mmHg"
    },
    {
      id: "fall_e12",
      domain: "Observations",
      source: "clinician",
      label: "Standing blood pressure 112/68 mmHg"
    },
    {
      id: "fall_e13",
      domain: "Examination",
      source: "clinician",
      label: "Patient reports mild dizziness after standing for the postural blood pressure measurement"
    }
  ],

  investigationItems: [
    {
      id: "fall_i01",
      domain: "Investigations",
      source: "clinician",
      label: "ECG shows sinus rhythm"
    },
    {
      id: "fall_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Capillary blood glucose is within the reference range"
    },
    {
      id: "fall_i03",
      domain: "Investigations",
      source: "clinician",
      label: "FBC and U&E have been requested"
    },
    {
      id: "fall_i04",
      domain: "Investigations",
      source: "clinician",
      label: "Further imaging is guided by the injury assessment"
    }
  ],

  planItems: [
    {
      id: "fall_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Complete a multifactorial falls assessment"
    },
    {
      id: "fall_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Postural hypotension is likely to be contributing to the falls"
    },
    {
      id: "fall_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Review antihypertensive and diuretic medication"
    },
    {
      id: "fall_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Assess hydration and encourage appropriate fluid intake"
    },
    {
      id: "fall_p05",
      domain: "Team involvement",
      source: "clinician",
      label: "Consider physiotherapy or mobility assessment if required"
    },
    {
      id: "fall_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Assess home safety and social support needs"
    }
  ]
};
