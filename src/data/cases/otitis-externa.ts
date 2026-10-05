import type { ClinicalCase } from "../../types";

export const otitisExternaCase: ClinicalCase = {
  id: "SCEN-12",
  title: "Otitis externa",
  specialty: "ENT / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 28-year-old man with severe left-sided ear pain, tragal tenderness and a blocked sensation after recent swimming. Use the prompts below to distinguish uncomplicated otitis externa from middle-ear or mastoid disease and to identify risk factors for severe infection. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Ear symptoms",
      prompts: [
        "When did the ear pain start?",
        "Is the pain getting worse?",
        "Does touching or pulling the ear make it worse?",
        "Any discharge from the ear?",
        "Has your hearing changed?",
        "Does the ear feel blocked?"
      ]
    },
    {
      title: "Possible trigger and complications",
      prompts: [
        "Have you been swimming recently?",
        "Do you use cotton buds or put anything in the ear?",
        "Any fever?",
        "Any dizziness or vomiting?",
        "Any pain or swelling behind the ear?",
        "Any facial weakness?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "Do you have diabetes?",
        "Any immune system problems?",
        "Any previous ear surgery or recurrent ear infections?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Daniel Moore",
  patientAge: 28,

  patientPortrayal:
    "You are uncomfortable and protective of the left ear. You wince if the outer ear is touched but otherwise look systemically well.",

  openingLine:
    "My left ear is really painful and it feels completely blocked.",

  historyItems: [
    {
      id: "oe_h01",
      domain: "History",
      source: "patient",
      label: "Left ear pain started 3 days ago",
      patientWording: "My left ear started hurting about three days ago."
    },
    {
      id: "oe_h02",
      domain: "History",
      source: "patient",
      label: "Ear pain has progressively worsened",
      patientWording: "It's been getting worse each day."
    },
    {
      id: "oe_h03",
      domain: "History",
      source: "patient",
      label: "Touching or pulling the outer ear causes severe pain",
      patientWording: "It really hurts if I touch the outside of the ear or pull it."
    },
    {
      id: "oe_h04",
      domain: "History",
      source: "patient",
      label: "Left ear feels blocked",
      patientWording: "It feels completely blocked."
    },
    {
      id: "oe_h05",
      domain: "History",
      source: "patient",
      label: "Hearing is mildly reduced on the left",
      patientWording: "My hearing is a bit muffled on that side."
    },
    {
      id: "oe_h06",
      domain: "History",
      source: "patient",
      label: "Small amount of watery ear discharge",
      patientWording: "There's been a small amount of watery discharge."
    },
    {
      id: "oe_h07",
      domain: "History",
      source: "patient",
      label: "Went swimming recently",
      patientWording: "I went swimming a few days before this started."
    },
    {
      id: "oe_h08",
      domain: "History",
      source: "patient",
      label: "Regularly uses cotton buds in the ears",
      patientWording: "I do use cotton buds quite a lot."
    },
    {
      id: "oe_h09",
      domain: "Review of systems",
      source: "patient",
      label: "No significant fever",
      patientWording: "I haven't really had a fever."
    },
    {
      id: "oe_h10",
      domain: "Review of systems",
      source: "patient",
      label: "No vomiting",
      patientWording: "I haven't been sick."
    },
    {
      id: "oe_h11",
      domain: "Review of systems",
      source: "patient",
      label: "No dizziness or vertigo",
      patientWording: "I haven't felt dizzy or like the room is spinning."
    },
    {
      id: "oe_h12",
      domain: "Review of systems",
      source: "patient",
      label: "No pain or swelling behind the ear",
      patientWording: "There's no pain or swelling behind the ear."
    },
    {
      id: "oe_h13",
      domain: "Review of systems",
      source: "patient",
      label: "No facial weakness",
      patientWording: "My face feels normal. I haven't noticed any weakness."
    },
    {
      id: "oe_h14",
      domain: "History",
      source: "patient",
      label: "No diabetes",
      patientWording: "No, I don't have diabetes."
    },
    {
      id: "oe_h15",
      domain: "History",
      source: "patient",
      label: "No immunosuppression",
      patientWording: "I don't have any immune system problems."
    },
    {
      id: "oe_h16",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "I don't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "oe_e01",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 36.9°C"
    },
    {
      id: "oe_e02",
      domain: "Examination",
      source: "clinician",
      label: "Patient is systemically well"
    },
    {
      id: "oe_e03",
      domain: "Examination",
      source: "clinician",
      label: "Patient winces when the left pinna is moved"
    },
    {
      id: "oe_e04",
      domain: "Examination",
      source: "clinician",
      label: "Marked tenderness over the left tragus"
    },
    {
      id: "oe_e05",
      domain: "Examination",
      source: "clinician",
      label: "Left external auditory canal is erythematous and swollen"
    },
    {
      id: "oe_e06",
      domain: "Examination",
      source: "clinician",
      label: "Small amount of debris and discharge is present in the left ear canal"
    },
    {
      id: "oe_e07",
      domain: "Examination",
      source: "clinician",
      label: "Left tympanic membrane cannot be fully visualised because of canal swelling"
    },
    {
      id: "oe_e08",
      domain: "Examination",
      source: "clinician",
      label: "No mastoid swelling"
    },
    {
      id: "oe_e09",
      domain: "Examination",
      source: "clinician",
      label: "No mastoid tenderness"
    },
    {
      id: "oe_e10",
      domain: "Examination",
      source: "clinician",
      label: "No facial weakness"
    },
    {
      id: "oe_e11",
      domain: "Examination",
      source: "clinician",
      label: "Right ear examination is normal"
    }
  ],

  investigationItems: [
    {
      id: "oe_i01",
      domain: "Investigations",
      source: "clinician",
      label: "No routine blood tests are required for uncomplicated otitis externa"
    }
  ],

  planItems: [
    {
      id: "oe_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is left otitis externa"
    },
    {
      id: "oe_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give analgesia"
    },
    {
      id: "oe_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Start topical treatment according to local guidance"
    },
    {
      id: "oe_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Advise the patient to keep the ear dry"
    },
    {
      id: "oe_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Advise against inserting cotton buds or other objects into the ear"
    },
    {
      id: "oe_p06",
      domain: "Team involvement",
      source: "clinician",
      label: "Seek ENT review if there is severe canal obstruction, treatment failure or concern for complications"
    }
  ]
};
