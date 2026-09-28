import type { ClinicalCase } from "../../types";

export const goutCase: ClinicalCase = {
  id: "SCEN-10",
  title: "Acute gout",
  specialty: "Rheumatology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 58-year-old man with sudden severe pain, redness and swelling around the base of the right big toe. The diagnosis is acute gout. Use the prompts below to help the consultation flow naturally. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Presenting complaint",
      prompts: [
        "What brought you into hospital today?",
        "When did the pain start?",
        "Where exactly is the pain?",
        "Did it come on suddenly or gradually?",
        "Is the joint red, hot or swollen?",
        "How severe is the pain?",
        "Are you able to walk on it?",
        "Does even light touch hurt?"
      ]
    },
    {
      title: "Important differentials",
      prompts: [
        "Any injury or trauma?",
        "Any fever, shivering or rigors?",
        "Any other painful or swollen joints?",
        "Any cuts, wounds or recent infection?"
      ]
    },
    {
      title: "Previous episodes and risk factors",
      prompts: [
        "Have you had anything like this before?",
        "Were you ever told it was gout?",
        "Any kidney problems?",
        "Any other medical conditions?",
        "What regular medication do you take?",
        "How much alcohol do you usually drink?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Peter Evans",
  patientAge: 58,

  patientPortrayal:
    "You are in severe pain and keep the right foot very still. You are reluctant to let the doctor touch the joint and cannot tolerate a shoe or sock over it.",

  openingLine:
    "My right big toe is absolutely killing me.",

  historyItems: [
    {
      id: "gout_h01",
      domain: "History",
      source: "patient",
      label: "Pain came on suddenly overnight",
      patientWording: "It came on really suddenly overnight."
    },
    {
      id: "gout_h02",
      domain: "History",
      source: "patient",
      label: "Pain is at the base of the right big toe",
      patientWording: "It's right at the base of my right big toe."
    },
    {
      id: "gout_h03",
      domain: "History",
      source: "patient",
      label: "Right first MTP joint is red, hot and swollen",
      patientWording: "It's red, hot and swollen."
    },
    {
      id: "gout_h04",
      domain: "History",
      source: "patient",
      label: "Pain is approximately 9/10",
      patientWording: "It's about nine out of ten."
    },
    {
      id: "gout_h05",
      domain: "History",
      source: "patient",
      label: "Even light touch over the joint is very painful",
      patientWording: "Even the bedsheet touching it hurts."
    },
    {
      id: "gout_h06",
      domain: "History",
      source: "patient",
      label: "Struggling to walk because of the pain",
      patientWording: "I'm struggling to walk on it because it hurts so much."
    },
    {
      id: "gout_h07",
      domain: "History",
      source: "patient",
      label: "No injury or trauma",
      patientWording: "I haven't injured it."
    },
    {
      id: "gout_h08",
      domain: "Review of systems",
      source: "patient",
      label: "No fever",
      patientWording: "No, I haven't had a fever."
    },
    {
      id: "gout_h09",
      domain: "Review of systems",
      source: "patient",
      label: "No shivering or rigors",
      patientWording: "No shivering or rigors."
    },
    {
      id: "gout_h10",
      domain: "History",
      source: "patient",
      label: "No other joints are affected",
      patientWording: "No, none of my other joints are painful or swollen."
    },
    {
      id: "gout_h11",
      domain: "History",
      source: "patient",
      label: "No broken skin or recent wound around the foot",
      patientWording: "I haven't had any cuts or wounds around the foot."
    },
    {
      id: "gout_h12",
      domain: "History",
      source: "patient",
      label: "Had a similar episode around one year ago",
      patientWording: "I had something very similar about a year ago."
    },
    {
      id: "gout_h13",
      domain: "History",
      source: "patient",
      label: "Was previously told the similar episode was probably gout",
      patientWording: "They told me last time it was probably gout."
    },
    {
      id: "gout_h14",
      domain: "History",
      source: "patient",
      label: "Has hypertension",
      patientWording: "I've got high blood pressure."
    },
    {
      id: "gout_h15",
      domain: "History",
      source: "patient",
      label: "Takes bendroflumethiazide for hypertension",
      patientWording: "I take bendroflumethiazide for my blood pressure."
    },
    {
      id: "gout_h16",
      domain: "History",
      source: "patient",
      label: "No known chronic kidney disease",
      patientWording: "I've never been told I have kidney disease."
    },
    {
      id: "gout_h17",
      domain: "History",
      source: "patient",
      label: "Drinks several pints of beer on most evenings",
      patientWording: "I probably have a few pints most evenings."
    },
    {
      id: "gout_h18",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "No known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "gout_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 86 bpm"
    },
    {
      id: "gout_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 152/88 mmHg"
    },
    {
      id: "gout_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 16/min"
    },
    {
      id: "gout_e04",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 36.8°C"
    },
    {
      id: "gout_e05",
      domain: "Examination",
      source: "clinician",
      label: "Patient is sitting with the right foot held very still"
    },
    {
      id: "gout_e06",
      domain: "Examination",
      source: "clinician",
      label: "Patient is reluctant to let the examiner touch the right foot"
    },
    {
      id: "gout_e07",
      domain: "Examination",
      source: "clinician",
      label: "Patient cannot tolerate a shoe or sock over the affected joint"
    },
    {
      id: "gout_e08",
      domain: "Examination",
      source: "clinician",
      label: "Walking is very painful and the patient avoids weight bearing through the right forefoot"
    },
    {
      id: "gout_e09",
      domain: "Examination",
      source: "clinician",
      label: "Right first MTP joint is visibly swollen"
    },
    {
      id: "gout_e10",
      domain: "Examination",
      source: "clinician",
      label: "Skin over the right first MTP joint is red and shiny"
    },
    {
      id: "gout_e11",
      domain: "Examination",
      source: "clinician",
      label: "Right first MTP joint is noticeably warmer than the opposite side"
    },
    {
      id: "gout_e12",
      domain: "Examination",
      source: "clinician",
      label: "There is exquisite focal tenderness over the right first MTP joint"
    },
    {
      id: "gout_e13",
      domain: "Examination",
      source: "clinician",
      label: "Even very light touch over the right first MTP joint causes marked pain"
    },
    {
      id: "gout_e14",
      domain: "Examination",
      source: "clinician",
      label: "Active and passive movement of the right first MTP joint are severely limited by pain"
    },
    {
      id: "gout_e15",
      domain: "Examination",
      source: "clinician",
      label: "No spreading erythema up the foot"
    },
    {
      id: "gout_e16",
      domain: "Examination",
      source: "clinician",
      label: "No wound or break in the skin"
    },
    {
      id: "gout_e17",
      domain: "Examination",
      source: "clinician",
      label: "No discharge"
    },
    {
      id: "gout_e18",
      domain: "Examination",
      source: "clinician",
      label: "No other joint swelling is identified"
    },
    {
      id: "gout_e19",
      domain: "Examination",
      source: "clinician",
      label: "Remaining toes and right ankle are non-tender"
    },
    {
      id: "gout_e20",
      domain: "Examination",
      source: "clinician",
      label: "Distal neurovascular examination is normal"
    }
  ],

  investigationItems: [
    {
      id: "gout_i01",
      domain: "Investigations",
      source: "clinician",
      label: "Full blood count shows no significant leukocytosis"
    },
    {
      id: "gout_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Renal function is normal"
    },
    {
      id: "gout_i03",
      domain: "Investigations",
      source: "clinician",
      label: "Serum urate is elevated"
    }
  ],

  planItems: [
    {
      id: "gout_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is acute gout"
    },
    {
      id: "gout_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Septic arthritis is considered but clinically less likely"
    },
    {
      id: "gout_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Consider joint aspiration if septic arthritis cannot be excluded"
    },
    {
      id: "gout_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give anti-inflammatory treatment if clinically appropriate"
    },
    {
      id: "gout_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give analgesia"
    },
    {
      id: "gout_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Review medicines and other factors that may contribute to gout"
    },
    {
      id: "gout_p07",
      domain: "Plan / actions",
      source: "clinician",
      label: "Provide advice regarding alcohol and other risk factors once the acute episode settles"
    },
    {
      id: "gout_p08",
      domain: "Plan / actions",
      source: "clinician",
      label: "Arrange follow-up with the GP"
    }
  ]
};
