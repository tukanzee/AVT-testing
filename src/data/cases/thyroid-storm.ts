import type { ClinicalCase } from "../../types";

export const thyroidStormCase: ClinicalCase = {
  id: "SCEN-20",
  title: "Thyroid storm",
  specialty: "Endocrinology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 42-year-old woman with known hyperthyroidism who has fever, agitation, diarrhoea and marked palpitations. The diagnosis is suspected thyroid storm. Use the prompts below to help the consultation flow naturally. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Presenting complaint",
      prompts: [
        "What brought you into hospital today?",
        "When did the palpitations start?",
        "Has your heart been racing continuously?",
        "Have you felt feverish or unusually hot?",
        "Any shaking or tremor?",
        "Any diarrhoea?",
        "Any vomiting?",
        "Have you felt agitated, confused or not yourself?",
        "Any chest pain?",
        "Any shortness of breath?"
      ]
    },
    {
      title: "Thyroid history",
      prompts: [
        "Do you have an overactive thyroid?",
        "How long have you had it?",
        "What thyroid medication do you usually take?",
        "Have you missed or stopped any medication recently?",
        "When did you last take it?"
      ]
    },
    {
      title: "Possible precipitant",
      prompts: [
        "Any recent infection or illness?",
        "Any fever or sore throat?",
        "Any cough?",
        "Any urinary symptoms?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "Any other medical problems?",
        "What other regular medications do you take?",
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
      label: "Heart has been racing continuously since this morning",
      patientWording: "My heart has been racing continuously since this morning."
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
      label: "Has been sweating excessively",
      patientWording: "I've been sweating loads today."
    },
    {
      id: "thy_h04",
      domain: "History",
      source: "patient",
      label: "Hands have been shaky",
      patientWording: "My hands have been really shaky."
    },
    {
      id: "thy_h05",
      domain: "History",
      source: "patient",
      label: "Has had diarrhoea several times today",
      patientWording: "I've had diarrhoea several times today."
    },
    {
      id: "thy_h06",
      domain: "Review of systems",
      source: "patient",
      label: "No vomiting",
      patientWording: "No, I haven't been vomiting."
    },
    {
      id: "thy_h07",
      domain: "History",
      source: "patient",
      label: "Feels increasingly restless",
      patientWording: "I just can't settle down."
    },
    {
      id: "thy_h08",
      domain: "History",
      source: "patient",
      label: "Family noticed the patient seemed muddled this afternoon",
      patientWording: "My family said I seemed a bit muddled this afternoon."
    },
    {
      id: "thy_h09",
      domain: "History",
      source: "patient",
      label: "Feels muddled and not quite themselves",
      patientWording: "I feel a bit muddled and not quite myself."
    },
    {
      id: "thy_h10",
      domain: "Review of systems",
      source: "patient",
      label: "No chest pain",
      patientWording: "No chest pain."
    },
    {
      id: "thy_h11",
      domain: "Review of systems",
      source: "patient",
      label: "Mild shortness of breath during the palpitations",
      patientWording: "I do feel a bit short of breath when my heart is racing."
    },
    {
      id: "thy_h12",
      domain: "History",
      source: "patient",
      label: "Known hyperthyroidism diagnosed around 2 years ago",
      patientWording: "I've had an overactive thyroid for about two years."
    },
    {
      id: "thy_h13",
      domain: "History",
      source: "patient",
      label: "Usually takes carbimazole",
      patientWording: "I normally take carbimazole."
    },
    {
      id: "thy_h14",
      domain: "History",
      source: "patient",
      label: "Ran out of carbimazole approximately 1 week ago",
      patientWording: "I ran out of my carbimazole about a week ago."
    },
    {
      id: "thy_h15",
      domain: "History",
      source: "patient",
      label: "Has taken no carbimazole for approximately 1 week",
      patientWording: "I haven't taken any carbimazole since I ran out."
    },
    {
      id: "thy_h16",
      domain: "Review of systems",
      source: "patient",
      label: "Has had a sore throat and felt generally unwell for 3 days",
      patientWording: "I've had a sore throat and felt generally unwell for about three days."
    },
    {
      id: "thy_h17",
      domain: "Review of systems",
      source: "patient",
      label: "No cough",
      patientWording: "No, I haven't had a cough."
    },
    {
      id: "thy_h18",
      domain: "Review of systems",
      source: "patient",
      label: "No urinary symptoms",
      patientWording: "No, I haven't had any urinary symptoms."
    },
    {
      id: "thy_h19",
      domain: "History",
      source: "patient",
      label: "No other significant medical history",
      patientWording: "No, nothing else significant."
    },
    {
      id: "thy_h20",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "No known drug allergies."
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
    },
    {
      id: "thy_e09",
      domain: "Examination",
      source: "clinician",
      label: "Patient is mildly confused but able to engage"
    },
    {
      id: "thy_e10",
      domain: "Examination",
      source: "clinician",
      label: "Heart rhythm is irregularly irregular"
    },
    {
      id: "thy_e11",
      domain: "Examination",
      source: "clinician",
      label: "Chest is clear on auscultation"
    },
    {
      id: "thy_e12",
      domain: "Examination",
      source: "clinician",
      label: "No peripheral oedema"
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
    },
    {
      id: "thy_i03",
      domain: "Investigations",
      source: "clinician",
      label: "TSH is suppressed"
    },
    {
      id: "thy_i04",
      domain: "Investigations",
      source: "clinician",
      label: "Free T4 is significantly elevated"
    },
    {
      id: "thy_i05",
      domain: "Investigations",
      source: "clinician",
      label: "Inflammatory markers are raised"
    },
    {
      id: "thy_i06",
      domain: "Investigations",
      source: "clinician",
      label: "Full blood count does not show neutropenia"
    },
    {
      id: "thy_i07",
      domain: "Investigations",
      source: "clinician",
      label: "Electrolytes have been checked"
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
      domain: "Plan / actions",
      source: "clinician",
      label: "Admit to hospital for treatment and monitoring"
    },
    {
      id: "thy_p11",
      domain: "Team involvement",
      source: "clinician",
      label: "Consider critical care / HDU escalation depending on response"
    }
  ]
};
