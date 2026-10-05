import type { ClinicalCase } from "../../types";

export const rectalBleedingCase: ClinicalCase = {
  id: "SCEN-15",
  title: "Rectal bleeding with altered bowel habit",
  specialty: "Gastroenterology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 55-year-old man with three weeks of bright red rectal bleeding and a change in bowel habit. He is haemodynamically stable, but the combination of altered bowel habit, weight loss and family history is concerning and requires urgent investigation. Use the prompts below to characterise the bleeding and assess for anaemia, haemodynamic compromise and red-flag colorectal symptoms.",

  doctorPromptSections: [
    {
      title: "Bleeding history",
      prompts: [
        "When did the bleeding start?",
        "Is the blood bright red or dark?",
        "Is it only on the paper or mixed with the stool?",
        "How much blood are you seeing?",
        "Any black tarry stools?"
      ]
    },
    {
      title: "Bowel habit and abdominal symptoms",
      prompts: [
        "Has your bowel habit changed?",
        "Are you going more or less often?",
        "Any diarrhoea or constipation?",
        "Any abdominal pain?",
        "Any vomiting?"
      ]
    },
    {
      title: "Red flags",
      prompts: [
        "Any unintentional weight loss?",
        "Any increasing tiredness or breathlessness?",
        "Any known inflammatory bowel disease?",
        "Any family history of bowel cancer?"
      ]
    },
    {
      title: "Medication and background",
      prompts: [
        "Do you take blood-thinning medication?",
        "Any previous bowel investigations?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Martin Cole",
  patientAge: 55,

  patientPortrayal:
    "You are comfortable and not actively distressed. You are concerned because the bleeding has persisted and your bowel habit has changed.",

  openingLine:
    "I've been seeing bright red blood when I go to the toilet for about three weeks, and my bowel habit has changed as well.",

  historyItems: [
    {
      id: "rb_h01",
      domain: "History",
      source: "patient",
      label: "Bright red rectal bleeding has been present for around 3 weeks",
      patientWording: "I've been seeing bright red blood for about three weeks."
    },
    {
      id: "rb_h02",
      domain: "History",
      source: "patient",
      label: "Bleeding initially appeared only on toilet paper",
      patientWording: "At first it was just on the toilet paper."
    },
    {
      id: "rb_h03",
      domain: "History",
      source: "patient",
      label: "More recently some blood has been mixed with the stool",
      patientWording: "More recently I've noticed some of the blood mixed in with the stool."
    },
    {
      id: "rb_h04",
      domain: "History",
      source: "patient",
      label: "No large-volume bleeding",
      patientWording: "It's not pouring out or filling the toilet bowl."
    },
    {
      id: "rb_h05",
      domain: "Review of systems",
      source: "patient",
      label: "No melaena",
      patientWording: "I haven't had any black tarry stools."
    },
    {
      id: "rb_h06",
      domain: "History",
      source: "patient",
      label: "Bowel habit has changed from normal",
      patientWording: "My bowel habit definitely isn't normal for me anymore."
    },
    {
      id: "rb_h07",
      domain: "History",
      source: "patient",
      label: "Alternates between loose stools and constipation",
      patientWording: "I've been alternating between loose stools and constipation."
    },
    {
      id: "rb_h08",
      domain: "History",
      source: "patient",
      label: "Has mild intermittent lower abdominal discomfort",
      patientWording: "I sometimes get a mild ache low down in my abdomen."
    },
    {
      id: "rb_h09",
      domain: "Review of systems",
      source: "patient",
      label: "No severe abdominal pain",
      patientWording: "I haven't had severe abdominal pain."
    },
    {
      id: "rb_h10",
      domain: "Review of systems",
      source: "patient",
      label: "No vomiting",
      patientWording: "I haven't been vomiting."
    },
    {
      id: "rb_h11",
      domain: "History",
      source: "patient",
      label: "Unintentional weight loss of approximately 3 kg over 2 months",
      patientWording: "I've lost about three kilos over the last couple of months without trying."
    },
    {
      id: "rb_h12",
      domain: "History",
      source: "patient",
      label: "Feels more tired than usual",
      patientWording: "I've been more tired than normal recently."
    },
    {
      id: "rb_h13",
      domain: "History",
      source: "patient",
      label: "No known inflammatory bowel disease",
      patientWording: "I've never been diagnosed with Crohn's or ulcerative colitis."
    },
    {
      id: "rb_h14",
      domain: "History",
      source: "patient",
      label: "Father had bowel cancer in his 60s",
      patientWording: "My dad had bowel cancer when he was in his sixties."
    },
    {
      id: "rb_h15",
      domain: "History",
      source: "patient",
      label: "Not taking anticoagulant medication",
      patientWording: "I don't take any blood thinners."
    },
    {
      id: "rb_h16",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "I don't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "rb_e01",
      domain: "Observations",
      source: "clinician",
      label: "Patient is haemodynamically stable"
    },
    {
      id: "rb_e02",
      domain: "Examination",
      source: "clinician",
      label: "Patient appears mildly pale"
    },
    {
      id: "rb_e03",
      domain: "Examination",
      source: "clinician",
      label: "Abdomen is soft"
    },
    {
      id: "rb_e04",
      domain: "Examination",
      source: "clinician",
      label: "Mild lower abdominal discomfort on palpation"
    },
    {
      id: "rb_e05",
      domain: "Examination",
      source: "clinician",
      label: "No guarding"
    },
    {
      id: "rb_e06",
      domain: "Examination",
      source: "clinician",
      label: "No rebound tenderness"
    },
    {
      id: "rb_e07",
      domain: "Examination",
      source: "clinician",
      label: "No palpable abdominal mass"
    },
    {
      id: "rb_e08",
      domain: "Examination",
      source: "clinician",
      label: "No evidence of large-volume active rectal bleeding during assessment"
    }
  ],

  investigationItems: [
    {
      id: "rb_i01",
      domain: "Investigations",
      source: "clinician",
      label: "FBC shows mild anaemia"
    },
    {
      id: "rb_i02",
      domain: "Investigations",
      source: "clinician",
      label: "U&E and liver function tests have been requested"
    },
    {
      id: "rb_i03",
      domain: "Investigations",
      source: "clinician",
      label: "Further colorectal investigation is required to determine the cause of bleeding"
    }
  ],

  planItems: [
    {
      id: "rb_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Assess the severity of rectal bleeding and anaemia"
    },
    {
      id: "rb_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "There is no current evidence of haemodynamic instability"
    },
    {
      id: "rb_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Arrange urgent colorectal investigation because of red-flag symptoms"
    },
    {
      id: "rb_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Do not document colorectal cancer as confirmed without diagnostic evidence"
    },
    {
      id: "rb_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Provide safety-net advice for heavier bleeding, syncope or worsening symptoms"
    }
  ]
};
