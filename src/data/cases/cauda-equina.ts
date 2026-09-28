import type { ClinicalCase } from "../../types";

export const caudaEquinaCase: ClinicalCase = {
  id: "SCEN-19",
  title: "Cauda equina syndrome",
  specialty: "Orthopaedics / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 48-year-old man with severe worsening lower back pain, bilateral leg symptoms and new urinary disturbance. The diagnosis is suspected cauda equina syndrome. Use the prompts below to help the consultation flow naturally. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Back pain and leg symptoms",
      prompts: [
        "What brought you into hospital today?",
        "When did the back pain become worse?",
        "Where exactly is the pain?",
        "Does the pain travel into one or both legs?",
        "Any numbness or tingling in your legs?",
        "Have you noticed any weakness in your legs?",
        "Are you still able to walk?"
      ]
    },
    {
      title: "Cauda equina red flags",
      prompts: [
        "Have you had any difficulty starting or passing urine?",
        "When did the urinary difficulty start?",
        "Any loss of bladder control?",
        "Any numbness around your bottom, genitals or inner thighs?",
        "Any change in sensation when wiping yourself after the toilet?",
        "Any loss of bowel control?"
      ]
    },
    {
      title: "Other red flags",
      prompts: [
        "Any recent injury or trauma?",
        "Any fever or feeling generally unwell?",
        "Any history of cancer?",
        "Any unexplained weight loss?",
        "Any intravenous drug use?",
        "Have you had back problems before?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "Any other medical conditions?",
        "What regular medications do you take?",
        "Do you take any blood-thinning medication?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Mark Hill",
  patientAge: 48,

  patientPortrayal:
    "You are uncomfortable and worried. Move cautiously because of back pain. Do not volunteer the bladder or saddle-area symptoms unless directly asked.",

  openingLine:
    "My back pain has suddenly got much worse and now both my legs feel strange.",

  historyItems: [
    {
      id: "ces_h01",
      domain: "History",
      source: "patient",
      label: "Severe lower back pain has worsened over the last 2 days",
      patientWording: "My back pain has got much worse over the last two days."
    },
    {
      id: "ces_h02",
      domain: "History",
      source: "patient",
      label: "Pain is across the lower back",
      patientWording: "The pain is right across my lower back."
    },
    {
      id: "ces_h03",
      domain: "History",
      source: "patient",
      label: "Pain travels down both legs and is worse on the right",
      patientWording: "The pain is going down both legs now, but it's worse on the right."
    },
    {
      id: "ces_h04",
      domain: "History",
      source: "patient",
      label: "Has tingling and numbness in both legs",
      patientWording: "Both legs feel tingly and numb in places."
    },
    {
      id: "ces_h05",
      domain: "History",
      source: "patient",
      label: "Both legs feel weaker than usual",
      patientWording: "Both my legs feel weaker than normal."
    },
    {
      id: "ces_h06",
      domain: "History",
      source: "patient",
      label: "Walking has become difficult because the legs feel weak",
      patientWording: "I'm struggling to walk properly because my legs feel weak."
    },
    {
      id: "ces_h07",
      domain: "History",
      source: "patient",
      label: "New difficulty starting and passing urine since this morning",
      patientWording: "Since this morning I've really struggled to start passing urine."
    },
    {
      id: "ces_h08",
      domain: "History",
      source: "patient",
      label: "Feels the bladder is full but cannot empty it properly",
      patientWording: "It feels full, but I can't seem to empty my bladder properly."
    },
    {
      id: "ces_h09",
      domain: "History",
      source: "patient",
      label: "No urinary incontinence",
      patientWording: "I haven't lost control of my bladder."
    },
    {
      id: "ces_h10",
      domain: "History",
      source: "patient",
      label: "New numbness around the perineum and buttocks",
      patientWording: "I'm numb between my legs and around my bottom."
    },
    {
      id: "ces_h11",
      domain: "History",
      source: "patient",
      label: "Sensation when wiping after the toilet feels reduced",
      patientWording: "It doesn't feel normal when I wipe after the toilet. The sensation feels reduced."
    },
    {
      id: "ces_h12",
      domain: "History",
      source: "patient",
      label: "No faecal incontinence",
      patientWording: "I haven't lost control of my bowels."
    },
    {
      id: "ces_h13",
      domain: "History",
      source: "patient",
      label: "Has had intermittent mechanical back pain before",
      patientWording: "I've had back pain on and off before, but never anything like this."
    },
    {
      id: "ces_h14",
      domain: "History",
      source: "patient",
      label: "No recent trauma",
      patientWording: "No, I haven't injured my back recently."
    },
    {
      id: "ces_h15",
      domain: "Review of systems",
      source: "patient",
      label: "No fever or recent illness",
      patientWording: "No fever and I haven't been unwell recently."
    },
    {
      id: "ces_h16",
      domain: "History",
      source: "patient",
      label: "No history of cancer",
      patientWording: "No, I've never had cancer."
    },
    {
      id: "ces_h17",
      domain: "History",
      source: "patient",
      label: "No unexplained weight loss",
      patientWording: "No, I haven't lost any weight without trying."
    },
    {
      id: "ces_h18",
      domain: "History",
      source: "patient",
      label: "No intravenous drug use",
      patientWording: "No, I've never injected drugs."
    },
    {
      id: "ces_h19",
      domain: "History",
      source: "patient",
      label: "Has hypertension",
      patientWording: "I've got high blood pressure."
    },
    {
      id: "ces_h20",
      domain: "History",
      source: "patient",
      label: "Takes ramipril",
      patientWording: "I take ramipril for my blood pressure."
    },
    {
      id: "ces_h21",
      domain: "History",
      source: "patient",
      label: "Does not take anticoagulants",
      patientWording: "No, I don't take any blood thinners."
    },
    {
      id: "ces_h22",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "No known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "ces_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 102 bpm"
    },
    {
      id: "ces_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 138/84 mmHg"
    },
    {
      id: "ces_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 18/min"
    },
    {
      id: "ces_e04",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ 98% on room air"
    },
    {
      id: "ces_e05",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 36.9°C"
    },
    {
      id: "ces_e06",
      domain: "Examination",
      source: "clinician",
      label: "Patient appears uncomfortable and changes position cautiously because of back pain"
    },
    {
      id: "ces_e07",
      domain: "Examination",
      source: "clinician",
      label: "Patient walks with difficulty and needs support"
    },
    {
      id: "ces_e08",
      domain: "Examination",
      source: "clinician",
      label: "Gait is slow and unsteady because both legs feel weak"
    },
    {
      id: "ces_e09",
      domain: "Examination",
      source: "clinician",
      label: "No obvious spinal deformity"
    },
    {
      id: "ces_e10",
      domain: "Examination",
      source: "clinician",
      label: "Lower lumbar spine is tender to palpation"
    },
    {
      id: "ces_e11",
      domain: "Examination",
      source: "clinician",
      label: "Straight leg raise reproduces radicular pain bilaterally"
    },
    {
      id: "ces_e12",
      domain: "Examination",
      source: "clinician",
      label: "Hip flexion is 4/5 bilaterally"
    },
    {
      id: "ces_e13",
      domain: "Examination",
      source: "clinician",
      label: "Knee extension is 4/5 bilaterally"
    },
    {
      id: "ces_e14",
      domain: "Examination",
      source: "clinician",
      label: "Right ankle dorsiflexion is weaker than the left at approximately 3–4/5"
    },
    {
      id: "ces_e15",
      domain: "Examination",
      source: "clinician",
      label: "Reduced sensation in both lower limbs, more marked on the right"
    },
    {
      id: "ces_e16",
      domain: "Examination",
      source: "clinician",
      label: "Reduced sensation in the saddle and perineal area"
    },
    {
      id: "ces_e17",
      domain: "Examination",
      source: "clinician",
      label: "Lower limb reflexes are reduced"
    },
    {
      id: "ces_e18",
      domain: "Examination",
      source: "clinician",
      label: "Distal pulses are palpable"
    },
    {
      id: "ces_e19",
      domain: "Examination",
      source: "clinician",
      label: "Bladder feels distended on abdominal palpation"
    },
    {
      id: "ces_e20",
      domain: "Examination",
      source: "clinician",
      label: "Reduced anal tone on rectal examination"
    }
  ],

  investigationItems: [
    {
      id: "ces_i01",
      domain: "Investigations",
      source: "clinician",
      label: "Bladder scan shows approximately 650 mL of urine"
    },
    {
      id: "ces_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Routine blood tests show no major abnormality"
    },
    {
      id: "ces_i03",
      domain: "Investigations",
      source: "clinician",
      label: "MRI has not yet been performed"
    }
  ],

  planItems: [
    {
      id: "ces_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is suspected cauda equina syndrome"
    },
    {
      id: "ces_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give analgesia"
    },
    {
      id: "ces_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Arrange an urgent MRI of the lumbosacral spine"
    },
    {
      id: "ces_p04",
      domain: "Team involvement",
      source: "clinician",
      label: "Urgently discuss with the spinal surgical team"
    },
    {
      id: "ces_p05",
      domain: "Team involvement",
      source: "clinician",
      label: "Discuss with a senior emergency clinician"
    },
    {
      id: "ces_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Manage urinary retention and consider urinary catheterisation"
    },
    {
      id: "ces_p07",
      domain: "Plan / actions",
      source: "clinician",
      label: "Keep the patient in hospital pending urgent imaging and specialist review"
    }
  ]
};
