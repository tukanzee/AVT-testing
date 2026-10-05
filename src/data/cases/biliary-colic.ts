import type { ClinicalCase } from "../../types";

export const biliaryColicCase: ClinicalCase = {
  id: "SCEN-2",
  title: "Biliary colic",
  specialty: "Gastroenterology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 40-year-old woman with recurrent right upper quadrant pain that is usually triggered by fatty meals. Today's pain began after a takeaway and has lasted longer than some previous episodes. Use the prompts below to distinguish uncomplicated biliary colic from cholecystitis, pancreatitis or biliary obstruction. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Pain history",
      prompts: [
        "When did today's pain start?",
        "Where exactly is the pain?",
        "Does it travel anywhere?",
        "How would you describe it?",
        "How long do the episodes usually last?",
        "Does food trigger the pain?",
        "Have you had similar episodes before?"
      ]
    },
    {
      title: "Associated symptoms",
      prompts: [
        "Any nausea or vomiting?",
        "Any fever, shivering or rigors?",
        "Any yellowing of the skin or eyes?",
        "Any dark urine or pale stools?",
        "Any diarrhoea?",
        "Any chest pain or shortness of breath?"
      ]
    },
    {
      title: "Other causes and background",
      prompts: [
        "Any urinary symptoms?",
        "Any chance you could be pregnant?",
        "Any previous abdominal operations?",
        "How much alcohol do you drink?",
        "Any previous gallstones or pancreatitis?"
      ]
    },
    {
      title: "Medication and allergies",
      prompts: [
        "Do you take any regular medication?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Rachel Bennett",
  patientAge: 40,

  patientPortrayal:
    "You are uncomfortable during the pain but not systemically unwell. You can speak normally. Do not volunteer the absence of jaundice or fever until asked.",

  openingLine:
    "I've got a really bad pain under my right ribs after eating a takeaway.",

  historyItems: [
    {
      id: "bil_h01",
      domain: "History",
      source: "patient",
      label: "Severe right upper quadrant pain started after a takeaway this evening",
      patientWording: "The pain started after I had a takeaway this evening, right under my right ribs."
    },
    {
      id: "bil_h02",
      domain: "History",
      source: "patient",
      label: "Pain builds over around 30 minutes",
      patientWording: "It seems to build up over about half an hour."
    },
    {
      id: "bil_h03",
      domain: "History",
      source: "patient",
      label: "Pain radiates towards the right shoulder and upper back",
      patientWording: "It goes round towards my right shoulder and upper back."
    },
    {
      id: "bil_h04",
      domain: "History",
      source: "patient",
      label: "Episodes usually last between 1 and 3 hours",
      patientWording: "Normally it lasts an hour or two, sometimes up to three hours."
    },
    {
      id: "bil_h05",
      domain: "History",
      source: "patient",
      label: "Has had several similar episodes over the last few months",
      patientWording: "I've had a few episodes like this over the last few months."
    },
    {
      id: "bil_h06",
      domain: "History",
      source: "patient",
      label: "Pain is commonly triggered by fatty meals",
      patientWording: "It often happens after greasy food like fish and chips or a takeaway."
    },
    {
      id: "bil_h07",
      domain: "Review of systems",
      source: "patient",
      label: "Feels nauseated",
      patientWording: "I feel quite sick with it."
    },
    {
      id: "bil_h08",
      domain: "Review of systems",
      source: "patient",
      label: "No vomiting today",
      patientWording: "I haven't actually vomited today."
    },
    {
      id: "bil_h09",
      domain: "Review of systems",
      source: "patient",
      label: "No fever or rigors",
      patientWording: "I haven't had a fever or shaking chills."
    },
    {
      id: "bil_h10",
      domain: "Review of systems",
      source: "patient",
      label: "No jaundice",
      patientWording: "No, I haven't noticed my skin or eyes going yellow."
    },
    {
      id: "bil_h11",
      domain: "Review of systems",
      source: "patient",
      label: "No dark urine",
      patientWording: "My urine hasn't gone dark."
    },
    {
      id: "bil_h12",
      domain: "Review of systems",
      source: "patient",
      label: "No pale stools",
      patientWording: "My stools haven't looked pale."
    },
    {
      id: "bil_h13",
      domain: "Review of systems",
      source: "patient",
      label: "No diarrhoea",
      patientWording: "No diarrhoea."
    },
    {
      id: "bil_h14",
      domain: "Review of systems",
      source: "patient",
      label: "No chest pain or shortness of breath",
      patientWording: "I haven't had any chest pain or breathing problems."
    },
    {
      id: "bil_h15",
      domain: "Review of systems",
      source: "patient",
      label: "No urinary symptoms",
      patientWording: "No burning, frequency or other urine problems."
    },
    {
      id: "bil_h16",
      domain: "History",
      source: "patient",
      label: "No previous abdominal surgery",
      patientWording: "I've never had abdominal surgery."
    },
    {
      id: "bil_h17",
      domain: "History",
      source: "patient",
      label: "No previous pancreatitis",
      patientWording: "No, I've never had pancreatitis."
    },
    {
      id: "bil_h18",
      domain: "History",
      source: "patient",
      label: "No regular medication",
      patientWording: "I don't take any regular medication."
    },
    {
      id: "bil_h19",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "I don't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "bil_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 88 bpm"
    },
    {
      id: "bil_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 126/74 mmHg"
    },
    {
      id: "bil_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 16/min"
    },
    {
      id: "bil_e04",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 36.8°C"
    },
    {
      id: "bil_e05",
      domain: "Examination",
      source: "clinician",
      label: "Patient appears uncomfortable but not systemically unwell"
    },
    {
      id: "bil_e06",
      domain: "Examination",
      source: "clinician",
      label: "Abdomen is soft"
    },
    {
      id: "bil_e07",
      domain: "Examination",
      source: "clinician",
      label: "Right upper quadrant tenderness is present"
    },
    {
      id: "bil_e08",
      domain: "Examination",
      source: "clinician",
      label: "No guarding"
    },
    {
      id: "bil_e09",
      domain: "Examination",
      source: "clinician",
      label: "No rebound tenderness"
    },
    {
      id: "bil_e10",
      domain: "Examination",
      source: "clinician",
      label: "Murphy's sign is not clearly positive"
    },
    {
      id: "bil_e11",
      domain: "Examination",
      source: "clinician",
      label: "No palpable abdominal mass"
    },
    {
      id: "bil_e12",
      domain: "Examination",
      source: "clinician",
      label: "No clinical jaundice"
    }
  ],

  investigationItems: [
    {
      id: "bil_i01",
      domain: "Investigations",
      source: "clinician",
      label: "Pregnancy test is negative"
    },
    {
      id: "bil_i02",
      domain: "Investigations",
      source: "clinician",
      label: "FBC and CRP are not significantly raised"
    },
    {
      id: "bil_i03",
      domain: "Investigations",
      source: "clinician",
      label: "Liver function tests are within the reference range"
    },
    {
      id: "bil_i04",
      domain: "Investigations",
      source: "clinician",
      label: "Lipase is within the reference range"
    },
    {
      id: "bil_i05",
      domain: "Investigations",
      source: "clinician",
      label: "Ultrasound imaging is required to assess for gallstones"
    }
  ],

  planItems: [
    {
      id: "bil_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is biliary colic"
    },
    {
      id: "bil_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give analgesia"
    },
    {
      id: "bil_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give antiemetic treatment if required"
    },
    {
      id: "bil_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Exclude acute cholecystitis, pancreatitis and biliary obstruction"
    },
    {
      id: "bil_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Arrange gallbladder ultrasound according to the local pathway"
    },
    {
      id: "bil_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Arrange surgical or outpatient biliary follow-up if clinically appropriate"
    }
  ]
};
