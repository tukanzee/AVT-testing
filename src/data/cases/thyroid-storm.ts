import type { ClinicalCase } from "../../types";

export const thyroidStormCase: ClinicalCase = {
  id: "SCEN-20",
  title: "Thyroid storm",
  specialty: "Endocrinology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 42-year-old woman with known hyperthyroidism who has fever, agitation, diarrhoea and marked palpitations. The diagnosis is suspected thyroid storm. Use the prompts below to keep the consultation flowing naturally.",

  doctorPromptSections: [
    {
      title: "Presenting complaint",
      prompts: [
        "When did the palpitations start?",
        "Have you felt feverish or unusually hot?",
        "Any diarrhoea or vomiting?",
        "Have you felt agitated, confused or not yourself?"
      ]
    },
    {
      title: "Thyroid history",
      prompts: [
        "Do you have an overactive thyroid?",
        "What thyroid medication do you usually take?",
        "Have you missed or stopped any medication recently?"
      ]
    },
    {
      title: "Possible precipitant",
      prompts: [
        "Any recent infection or illness?",
        "Any sore throat, cough or urinary symptoms?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Sarah Khan",
  patientAge: 42,

  patientPortrayal:
    "You are restless, hot and slightly muddled. You answer questions but find it difficult to sit still.",

  openingLine:
    "My heart has been racing all day and I feel unbearably hot.",

  historyItems: [
    {
      id: "thy_h01",
      domain: "History",
      source: "patient",
      label: "Heart has been racing all day",
      patientWording: "My heart has been racing all day."
    },
    {
      id: "thy_h02",
      domain: "History",
      source: "patient",
      label: "Feels unbearably hot",
      patientWording: "I feel unbearably hot."
    },
    {
      id: "thy_h03",
      domain: "History",
      source: "patient",
      label: "Has had diarrhoea several times today",
      patientWording: "I've had diarrhoea several times today."
    },
    {
      id: "thy_h04",
      domain: "History",
      source: "patient",
      label: "Feels restless and unable to settle",
      patientWording: "I just can't settle down."
    },
    {
      id: "thy_h05",
      domain: "History",
      source: "patient",
      label: "Feels muddled and not quite themselves",
      patientWording: "I feel a bit muddled and not quite myself."
    },
    {
      id: "thy_h06",
      domain: "History",
      source: "patient",
      label: "Has known hyperthyroidism",
      patientWording: "I've got an overactive thyroid."
    },
    {
      id: "thy_h07",
      domain: "History",
      source: "patient",
      label: "Usually takes carbimazole",
      patientWording: "I normally take carbimazole."
    },
    {
      id: "thy_h08",
      domain: "History",
      source: "patient",
      label: "Stopped carbimazole around one week ago after running out",
      patientWording: "I ran out and stopped taking my carbimazole about a week ago."
    },
    {
      id: "thy_h09",
      domain: "Review of systems",
      source: "patient",
      label: "Has had a sore throat and felt unwell for a few days",
      patientWording: "I've had a sore throat and felt unwell for a few days."
    },
    {
      id: "thy_h10",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "No known allergies."
    }
  ],

  examinationItems: [
    {
      id: "thy_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 145 bpm"
    },
    {
      id: "thy_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 146/72 mmHg"
    },
    {
      id: "thy_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 24/min"
    },
    {
      id: "thy_e04",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ 98% on room air"
    },
    {
      id: "thy_e05",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 39.2°C"
    },
    {
      id: "thy_e06",
      domain: "Examination",
      source: "clinician",
      label: "Patient is agitated and restless"
    },
    {
      id: "thy_e07",
      domain: "Examination",
      source: "clinician",
      label: "Patient is warm and sweaty"
    },
    {
      id: "thy_e08",
      domain: "Examination",
      source: "clinician",
      label: "Fine tremor is present"
    }
  ],

  investigationItems: [
    {
      id: "thy_i01",
      domain: "Investigations",
      source: "clinician",
      label: "ECG shows atrial fibrillation with a ventricular rate of approximately 145 bpm"
    },
    {
      id: "thy_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Capillary blood glucose 7.2 mmol/L"
    }
  ],

  planItems: [
    {
      id: "thy_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is suspected thyroid storm"
    },
    {
      id: "thy_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Start cardiac monitoring"
    },
    {
      id: "thy_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Start IV fluids"
    },
    {
      id: "thy_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give beta-blockade if clinically appropriate"
    },
    {
      id: "thy_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Start antithyroid treatment"
    },
    {
      id: "thy_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give corticosteroid treatment"
    },
    {
      id: "thy_p07",
      domain: "Plan / actions",
      source: "clinician",
      label: "Investigate and treat a possible precipitating infection"
    },
    {
      id: "thy_p08",
      domain: "Team involvement",
      source: "clinician",
      label: "Urgently discuss with a senior acute medical clinician"
    },
    {
      id: "thy_p09",
      domain: "Team involvement",
      source: "clinician",
      label: "Refer to the endocrinology team"
    },
    {
      id: "thy_p10",
      domain: "Team involvement",
      source: "clinician",
      label: "Consider critical care / HDU escalation"
    },
    {
      id: "thy_p11",
      domain: "Plan / actions",
      source: "clinician",
      label: "Admit to hospital for treatment and monitoring"
    }
  ]
};

