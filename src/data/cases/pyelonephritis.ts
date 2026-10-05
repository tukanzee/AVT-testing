import type { ClinicalCase } from "../../types";

export const pyelonephritisCase: ClinicalCase = {
  id: "SCEN-14",
  title: "Acute pyelonephritis",
  specialty: "Nephrology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 42-year-old woman with dysuria, urinary frequency, right-sided loin pain, fever and rigors. Use the prompts below to assess for acute pyelonephritis, sepsis and alternative causes such as renal colic or gynaecological disease. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Urinary symptoms",
      prompts: [
        "When did the urinary symptoms start?",
        "Does it burn when you pass urine?",
        "Are you passing urine more often?",
        "Any blood in the urine?"
      ]
    },
    {
      title: "Loin pain and systemic symptoms",
      prompts: [
        "When did the loin pain start?",
        "Is it constant or does it come in waves?",
        "Any fever or rigors?",
        "Any nausea or vomiting?",
        "Have you been able to keep fluids down?"
      ]
    },
    {
      title: "Relevant background",
      prompts: [
        "Any previous kidney infections?",
        "Any previous kidney stones?",
        "Any known kidney problems?",
        "Could you be pregnant?",
        "Any vaginal discharge or bleeding?"
      ]
    },
    {
      title: "Medication and allergies",
      prompts: [
        "Any recent antibiotics?",
        "Any regular medication?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Laura Ahmed",
  patientAge: 42,

  patientPortrayal:
    "You look flushed and unwell but remain alert and able to answer questions clearly. You are uncomfortable when the right loin is examined.",

  openingLine:
    "I've had burning when I pass urine and now I've got a really bad pain in my right side with shaking chills.",

  historyItems: [
    {
      id: "pyelo_h01",
      domain: "History",
      source: "patient",
      label: "Dysuria started 2 days ago",
      patientWording: "It started burning when I passed urine about two days ago."
    },
    {
      id: "pyelo_h02",
      domain: "History",
      source: "patient",
      label: "Urinary frequency has increased",
      patientWording: "I've been needing to go to the toilet much more often."
    },
    {
      id: "pyelo_h03",
      domain: "History",
      source: "patient",
      label: "Right-sided loin pain started today",
      patientWording: "Today I started getting a really bad pain in my right side around my back."
    },
    {
      id: "pyelo_h04",
      domain: "History",
      source: "patient",
      label: "Right loin pain is constant rather than colicky",
      patientWording: "It's a constant ache rather than coming and going in waves."
    },
    {
      id: "pyelo_h05",
      domain: "Review of systems",
      source: "patient",
      label: "Had rigors this afternoon",
      patientWording: "I was shaking badly with chills this afternoon."
    },
    {
      id: "pyelo_h06",
      domain: "Review of systems",
      source: "patient",
      label: "Feels feverish",
      patientWording: "I feel really feverish."
    },
    {
      id: "pyelo_h07",
      domain: "Review of systems",
      source: "patient",
      label: "Feels nauseated",
      patientWording: "I've felt sick most of the day."
    },
    {
      id: "pyelo_h08",
      domain: "Review of systems",
      source: "patient",
      label: "Vomited once",
      patientWording: "I was sick once earlier."
    },
    {
      id: "pyelo_h09",
      domain: "History",
      source: "patient",
      label: "No visible haematuria",
      patientWording: "I haven't seen any blood in my urine."
    },
    {
      id: "pyelo_h10",
      domain: "Review of systems",
      source: "patient",
      label: "No vaginal discharge",
      patientWording: "No, I haven't had any unusual vaginal discharge."
    },
    {
      id: "pyelo_h11",
      domain: "Review of systems",
      source: "patient",
      label: "No vaginal bleeding",
      patientWording: "I haven't had any unexpected vaginal bleeding."
    },
    {
      id: "pyelo_h12",
      domain: "History",
      source: "patient",
      label: "Has had previous uncomplicated urinary tract infections",
      patientWording: "I've had a few urine infections before."
    },
    {
      id: "pyelo_h13",
      domain: "History",
      source: "patient",
      label: "Has never previously had pyelonephritis",
      patientWording: "I've never had a kidney infection like this before."
    },
    {
      id: "pyelo_h14",
      domain: "History",
      source: "patient",
      label: "No history of renal stones",
      patientWording: "I've never had kidney stones."
    },
    {
      id: "pyelo_h15",
      domain: "History",
      source: "patient",
      label: "No known chronic kidney disease",
      patientWording: "I don't have any known kidney problems."
    },
    {
      id: "pyelo_h16",
      domain: "History",
      source: "patient",
      label: "Patient does not believe they are pregnant",
      patientWording: "No, I don't think I could be pregnant."
    },
    {
      id: "pyelo_h17",
      domain: "History",
      source: "patient",
      label: "No recent antibiotic treatment",
      patientWording: "I haven't taken any antibiotics recently."
    },
    {
      id: "pyelo_h18",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "I don't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "pyelo_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 112 bpm"
    },
    {
      id: "pyelo_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 108/66 mmHg"
    },
    {
      id: "pyelo_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 20/min"
    },
    {
      id: "pyelo_e04",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 39.0°C"
    },
    {
      id: "pyelo_e05",
      domain: "Examination",
      source: "clinician",
      label: "Patient looks flushed and systemically unwell"
    },
    {
      id: "pyelo_e06",
      domain: "Examination",
      source: "clinician",
      label: "Patient is alert and communicating normally"
    },
    {
      id: "pyelo_e07",
      domain: "Examination",
      source: "clinician",
      label: "Abdomen is soft"
    },
    {
      id: "pyelo_e08",
      domain: "Examination",
      source: "clinician",
      label: "Mild suprapubic tenderness is present"
    },
    {
      id: "pyelo_e09",
      domain: "Examination",
      source: "clinician",
      label: "Marked right renal angle tenderness"
    },
    {
      id: "pyelo_e10",
      domain: "Examination",
      source: "clinician",
      label: "Left renal angle is non-tender"
    },
    {
      id: "pyelo_e11",
      domain: "Examination",
      source: "clinician",
      label: "No guarding"
    },
    {
      id: "pyelo_e12",
      domain: "Examination",
      source: "clinician",
      label: "No rebound tenderness"
    }
  ],

  investigationItems: [
    {
      id: "pyelo_i01",
      domain: "Investigations",
      source: "clinician",
      label: "Urinalysis is positive for leukocytes and nitrites"
    },
    {
      id: "pyelo_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Urine has been sent for microscopy, culture and sensitivities"
    },
    {
      id: "pyelo_i03",
      domain: "Investigations",
      source: "clinician",
      label: "White cell count and CRP are raised"
    },
    {
      id: "pyelo_i04",
      domain: "Investigations",
      source: "clinician",
      label: "Renal function has been checked"
    },
    {
      id: "pyelo_i05",
      domain: "Investigations",
      source: "clinician",
      label: "Lactate is not significantly elevated"
    },
    {
      id: "pyelo_i06",
      domain: "Investigations",
      source: "clinician",
      label: "Blood cultures should be taken if clinically indicated"
    }
  ],

  planItems: [
    {
      id: "pyelo_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is acute right-sided pyelonephritis"
    },
    {
      id: "pyelo_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Assess for sepsis"
    },
    {
      id: "pyelo_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Start antibiotics according to local guidance"
    },
    {
      id: "pyelo_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give IV or oral fluids according to clinical status"
    },
    {
      id: "pyelo_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give analgesia"
    },
    {
      id: "pyelo_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give antiemetic treatment if required"
    },
    {
      id: "pyelo_p07",
      domain: "Plan / actions",
      source: "clinician",
      label: "Review renal function and oral intake"
    },
    {
      id: "pyelo_p08",
      domain: "Plan / actions",
      source: "clinician",
      label: "Admit if systemically unwell or unable to tolerate oral treatment"
    }
  ]
};
