import type { ClinicalCase } from "../../types";

export const chestPainCase: ClinicalCase = {
  id: "SCEN-01",
  title: "New-onset exertional chest pain",
  specialty: "Cardiology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 58-year-old man with new exertional central chest discomfort. He is currently pain free, but today's episode was more prolonged than previous episodes. The priority is to assess for acute coronary syndrome while clarifying whether the pattern is consistent with exertional angina. Use the prompts below to help the consultation flow naturally. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Chest pain",
      prompts: [
        "What brought you into ED today?",
        "When did the chest discomfort first start?",
        "Where exactly do you feel it?",
        "How would you describe the sensation?",
        "Does it travel anywhere?",
        "What tends to bring it on?",
        "How long does each episode usually last?",
        "What makes it go away?",
        "Was today's episode different from the others?",
        "Are you having any pain now?"
      ]
    },
    {
      title: "Associated symptoms",
      prompts: [
        "Do you become short of breath with the pain?",
        "Any sweating or clamminess?",
        "Any nausea or vomiting?",
        "Any palpitations?",
        "Any dizziness or blackouts?",
        "Does the pain change with breathing, movement or pressing on the chest?"
      ]
    },
    {
      title: "Cardiovascular risk",
      prompts: [
        "Any previous heart problems?",
        "Do you have high blood pressure, diabetes or high cholesterol?",
        "Do you smoke?",
        "Any family history of heart disease at a young age?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "What regular medications do you take?",
        "Any medication allergies?",
        "Any recent long journeys, surgery or periods of immobility?"
      ]
    }
  ],

  patientName: "Michael Turner",
  patientAge: 58,

  patientPortrayal:
    "You are comfortable now and speak normally. You are worried because today's episode lasted longer than usual. Do not volunteer every cardiovascular risk factor at once; answer naturally when asked.",

  openingLine:
    "I've been getting a tight feeling in my chest when I walk, and today it lasted longer than usual.",

  historyItems: [
    {
      id: "cp_h01",
      domain: "History",
      source: "patient",
      label: "Central chest tightness has occurred intermittently for about one week",
      patientWording: "I've had this tight feeling in the middle of my chest on and off for about a week."
    },
    {
      id: "cp_h02",
      domain: "History",
      source: "patient",
      label: "Chest discomfort is described as tight and squeezing",
      patientWording: "It feels tight and squeezing rather than sharp."
    },
    {
      id: "cp_h03",
      domain: "History",
      source: "patient",
      label: "Symptoms are triggered by walking uphill or walking quickly",
      patientWording: "It usually comes on if I'm walking uphill or trying to walk quickly."
    },
    {
      id: "cp_h04",
      domain: "History",
      source: "patient",
      label: "Typical episodes settle after about 5 minutes of rest",
      patientWording: "If I stop and rest, it normally settles after about five minutes."
    },
    {
      id: "cp_h05",
      domain: "History",
      source: "patient",
      label: "Today's episode lasted around 15 minutes",
      patientWording: "Today it lasted about fifteen minutes, which is longer than the others."
    },
    {
      id: "cp_h06",
      domain: "History",
      source: "patient",
      label: "Today's episode occurred while walking to the shops",
      patientWording: "It started while I was walking to the shops."
    },
    {
      id: "cp_h07",
      domain: "History",
      source: "patient",
      label: "Chest discomfort does not radiate to the arm or jaw",
      patientWording: "It stays in the middle of my chest. It doesn't go into my arm or jaw."
    },
    {
      id: "cp_h08",
      domain: "Review of systems",
      source: "patient",
      label: "Mild shortness of breath occurs during the chest discomfort",
      patientWording: "I do get a bit short of breath when the tightness comes on."
    },
    {
      id: "cp_h09",
      domain: "Review of systems",
      source: "patient",
      label: "No vomiting",
      patientWording: "No, I haven't been sick."
    },
    {
      id: "cp_h10",
      domain: "Review of systems",
      source: "patient",
      label: "No palpitations",
      patientWording: "No, I haven't noticed my heart racing or skipping."
    },
    {
      id: "cp_h11",
      domain: "Review of systems",
      source: "patient",
      label: "No syncope or near-syncope",
      patientWording: "I haven't blacked out or felt like I was going to pass out."
    },
    {
      id: "cp_h12",
      domain: "History",
      source: "patient",
      label: "Pain is not pleuritic",
      patientWording: "Taking a deep breath doesn't make it worse."
    },
    {
      id: "cp_h13",
      domain: "History",
      source: "patient",
      label: "Pain is not reproducible with movement or pressing on the chest",
      patientWording: "Moving around or pressing on my chest doesn't bring the pain on."
    },
    {
      id: "cp_h14",
      domain: "History",
      source: "patient",
      label: "Currently pain free",
      patientWording: "I don't have any pain at the moment."
    },
    {
      id: "cp_h15",
      domain: "History",
      source: "patient",
      label: "Has hypertension",
      patientWording: "I've got high blood pressure."
    },
    {
      id: "cp_h16",
      domain: "History",
      source: "patient",
      label: "Has hypercholesterolaemia",
      patientWording: "I've also been told my cholesterol is high."
    },
    {
      id: "cp_h17",
      domain: "History",
      source: "patient",
      label: "Smokes approximately 10 cigarettes per day",
      patientWording: "I smoke about ten cigarettes a day."
    },
    {
      id: "cp_h18",
      domain: "History",
      source: "patient",
      label: "Father had a myocardial infarction at age 54",
      patientWording: "My dad had a heart attack when he was 54."
    },
    {
      id: "cp_h19",
      domain: "History",
      source: "patient",
      label: "Takes amlodipine and atorvastatin",
      patientWording: "I take amlodipine for my blood pressure and atorvastatin for cholesterol."
    },
    {
      id: "cp_h20",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "I don't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "cp_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 82 bpm"
    },
    {
      id: "cp_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 156/88 mmHg"
    },
    {
      id: "cp_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 16/min"
    },
    {
      id: "cp_e04",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ 98% on room air"
    },
    {
      id: "cp_e05",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 36.7°C"
    },
    {
      id: "cp_e06",
      domain: "Examination",
      source: "clinician",
      label: "Patient is comfortable at rest and speaking in full sentences"
    },
    {
      id: "cp_e07",
      domain: "Examination",
      source: "clinician",
      label: "Patient is warm and well perfused"
    },
    {
      id: "cp_e08",
      domain: "Examination",
      source: "clinician",
      label: "Heart sounds are normal with no audible murmur"
    },
    {
      id: "cp_e09",
      domain: "Examination",
      source: "clinician",
      label: "Chest is clear to auscultation bilaterally"
    },
    {
      id: "cp_e10",
      domain: "Examination",
      source: "clinician",
      label: "No chest wall tenderness"
    },
    {
      id: "cp_e11",
      domain: "Examination",
      source: "clinician",
      label: "No peripheral oedema"
    },
    {
      id: "cp_e12",
      domain: "Examination",
      source: "clinician",
      label: "No unilateral calf swelling or tenderness"
    }
  ],

  investigationItems: [
    {
      id: "cp_i01",
      domain: "Investigations",
      source: "clinician",
      label: "ECG shows sinus rhythm with no acute ST elevation"
    },
    {
      id: "cp_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Initial high-sensitivity troponin is within the reference range"
    },
    {
      id: "cp_i03",
      domain: "Investigations",
      source: "clinician",
      label: "Repeat troponin is planned according to the local chest pain pathway"
    },
    {
      id: "cp_i04",
      domain: "Investigations",
      source: "clinician",
      label: "Chest X-ray shows no acute cardiopulmonary abnormality"
    }
  ],

  planItems: [
    {
      id: "cp_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Treat as possible cardiac chest pain until acute coronary syndrome is excluded"
    },
    {
      id: "cp_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Repeat ECG if symptoms recur"
    },
    {
      id: "cp_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Complete serial troponin testing according to the local pathway"
    },
    {
      id: "cp_p04",
      domain: "Team involvement",
      source: "clinician",
      label: "Discuss with a senior emergency clinician"
    },
    {
      id: "cp_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Assess cardiovascular risk factors and secondary prevention needs"
    },
    {
      id: "cp_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Determine disposition after acute coronary syndrome risk assessment is complete"
    }
  ]
};
