import type { ClinicalCase } from "../../types";

export const copdExacerbationCase: ClinicalCase = {
  id: "SCEN-6",
  title: "Acute exacerbation of COPD",
  specialty: "Respiratory / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 65-year-old woman with known COPD who has four days of worsening breathlessness, increased cough and purulent sputum. Use the prompts below to assess the severity of the exacerbation, identify possible infection and establish her baseline respiratory status. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Current respiratory symptoms",
      prompts: [
        "How long have you been more breathless than usual?",
        "How does this compare with your normal breathing?",
        "Has your cough changed?",
        "Has the amount or colour of your sputum changed?",
        "Any wheeze?",
        "Any fever, shivering or rigors?",
        "Any chest pain?",
        "Any coughing up blood?"
      ]
    },
    {
      title: "Current treatment and severity",
      prompts: [
        "How often are you using your blue inhaler?",
        "Is it helping?",
        "Do you use oxygen at home?",
        "Have you needed steroids or antibiotics recently?",
        "Have you ever needed NIV, intensive care or ventilation for COPD?"
      ]
    },
    {
      title: "Baseline and background",
      prompts: [
        "How far can you normally walk before becoming breathless?",
        "How many exacerbations have you had in the last year?",
        "Do you still smoke?",
        "Any heart problems or previous blood clots?"
      ]
    },
    {
      title: "Medication and allergies",
      prompts: [
        "What regular inhalers or medications do you use?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Janet Collins",
  patientAge: 65,

  patientPortrayal:
    "You are sitting upright and mildly breathless. You can answer in full sentences but occasionally pause to catch your breath. Do not exaggerate distress unless asked to move or speak at length.",

  openingLine:
    "I've been much more short of breath for the last few days and my inhaler isn't really helping.",

  historyItems: [
    {
      id: "copd_h01",
      domain: "History",
      source: "patient",
      label: "Breathlessness has worsened over the last 4 days",
      patientWording: "I've been much more short of breath for about four days."
    },
    {
      id: "copd_h02",
      domain: "History",
      source: "patient",
      label: "Now breathless walking across a room",
      patientWording: "Normally I can get around the house, but now I'm breathless just walking across the room."
    },
    {
      id: "copd_h03",
      domain: "History",
      source: "patient",
      label: "Cough has become more frequent",
      patientWording: "I've been coughing a lot more than usual."
    },
    {
      id: "copd_h04",
      domain: "History",
      source: "patient",
      label: "Sputum volume has increased",
      patientWording: "I'm bringing up more phlegm than I normally do."
    },
    {
      id: "copd_h05",
      domain: "History",
      source: "patient",
      label: "Sputum has changed from clear to yellow-green",
      patientWording: "It's normally clear, but now it's yellow-green."
    },
    {
      id: "copd_h06",
      domain: "History",
      source: "patient",
      label: "Has increased wheeze",
      patientWording: "I've been wheezing more as well."
    },
    {
      id: "copd_h07",
      domain: "Review of systems",
      source: "patient",
      label: "Feels mildly feverish",
      patientWording: "I've felt a bit feverish, but I haven't had shaking chills."
    },
    {
      id: "copd_h08",
      domain: "Review of systems",
      source: "patient",
      label: "No rigors",
      patientWording: "No, I haven't had any rigors."
    },
    {
      id: "copd_h09",
      domain: "Review of systems",
      source: "patient",
      label: "No haemoptysis",
      patientWording: "I haven't coughed up any blood."
    },
    {
      id: "copd_h10",
      domain: "Review of systems",
      source: "patient",
      label: "No pleuritic chest pain",
      patientWording: "I don't have any sharp pain when I breathe in."
    },
    {
      id: "copd_h11",
      domain: "History",
      source: "patient",
      label: "Using salbutamol much more frequently than usual",
      patientWording: "I've been using my blue inhaler every couple of hours."
    },
    {
      id: "copd_h12",
      domain: "History",
      source: "patient",
      label: "Salbutamol is providing little relief",
      patientWording: "It helps a little for a short time, but not like it normally does."
    },
    {
      id: "copd_h13",
      domain: "History",
      source: "patient",
      label: "Does not use home oxygen",
      patientWording: "No, I don't use oxygen at home."
    },
    {
      id: "copd_h14",
      domain: "History",
      source: "patient",
      label: "Has had 2 COPD exacerbations in the last year",
      patientWording: "I've had two flare-ups in the last year."
    },
    {
      id: "copd_h15",
      domain: "History",
      source: "patient",
      label: "Has never required invasive ventilation for COPD",
      patientWording: "I've never been put on a ventilator for my COPD."
    },
    {
      id: "copd_h16",
      domain: "History",
      source: "patient",
      label: "Has not previously required intensive care for COPD",
      patientWording: "I've never needed intensive care because of it."
    },
    {
      id: "copd_h17",
      domain: "History",
      source: "patient",
      label: "Continues to smoke approximately 5 cigarettes per day",
      patientWording: "I still smoke about five cigarettes a day."
    },
    {
      id: "copd_h18",
      domain: "History",
      source: "patient",
      label: "Uses a regular combination inhaler and salbutamol inhaler",
      patientWording: "I use my regular combination inhaler every day and the blue salbutamol inhaler when I need it."
    },
    {
      id: "copd_h19",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "I don't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "copd_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 104 bpm"
    },
    {
      id: "copd_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 136/78 mmHg"
    },
    {
      id: "copd_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 24/min"
    },
    {
      id: "copd_e04",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ 89% on room air"
    },
    {
      id: "copd_e05",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 37.8°C"
    },
    {
      id: "copd_e06",
      domain: "Examination",
      source: "clinician",
      label: "Patient is sitting upright and appears mildly breathless at rest"
    },
    {
      id: "copd_e07",
      domain: "Examination",
      source: "clinician",
      label: "Patient can complete sentences but pauses occasionally to breathe"
    },
    {
      id: "copd_e08",
      domain: "Examination",
      source: "clinician",
      label: "Mild accessory muscle use is present"
    },
    {
      id: "copd_e09",
      domain: "Examination",
      source: "clinician",
      label: "Widespread bilateral expiratory wheeze"
    },
    {
      id: "copd_e10",
      domain: "Examination",
      source: "clinician",
      label: "Air entry is reduced bilaterally"
    },
    {
      id: "copd_e11",
      domain: "Examination",
      source: "clinician",
      label: "No focal crepitations"
    },
    {
      id: "copd_e12",
      domain: "Examination",
      source: "clinician",
      label: "No peripheral oedema"
    },
    {
      id: "copd_e13",
      domain: "Examination",
      source: "clinician",
      label: "No unilateral calf swelling"
    }
  ],

  investigationItems: [
    {
      id: "copd_i01",
      domain: "Investigations",
      source: "clinician",
      label: "VBG shows mild hypercapnia without severe acidosis"
    },
    {
      id: "copd_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Chest X-ray shows hyperinflation with no focal consolidation"
    },
    {
      id: "copd_i03",
      domain: "Investigations",
      source: "clinician",
      label: "ECG shows sinus tachycardia"
    },
    {
      id: "copd_i04",
      domain: "Investigations",
      source: "clinician",
      label: "FBC, CRP and U&E have been requested"
    }
  ],

  planItems: [
    {
      id: "copd_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is an acute exacerbation of COPD"
    },
    {
      id: "copd_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give controlled oxygen to the appropriate COPD target saturation range"
    },
    {
      id: "copd_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give bronchodilator therapy"
    },
    {
      id: "copd_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Start corticosteroid treatment"
    },
    {
      id: "copd_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Consider antibiotics according to clinical features and local guidance"
    },
    {
      id: "copd_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Repeat blood gas if respiratory status deteriorates"
    },
    {
      id: "copd_p07",
      domain: "Team involvement",
      source: "clinician",
      label: "Discuss with a senior clinician if oxygen requirement or work of breathing increases"
    },
    {
      id: "copd_p08",
      domain: "Plan / actions",
      source: "clinician",
      label: "Admit if ongoing oxygen requirement or clinical status warrants inpatient treatment"
    }
  ]
};
