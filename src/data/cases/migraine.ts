import type { ClinicalCase } from "../../types";

export const migraineCase: ClinicalCase = {
  id: "SCEN-10",
  title: "Acute migraine",
  specialty: "Neurology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 30-year-old woman with a severe unilateral throbbing headache, photophobia and nausea. She has had migraines before, but today's headache is more severe than usual. Use the prompts below to establish whether this remains consistent with migraine and to screen carefully for secondary headache red flags. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Headache history",
      prompts: [
        "When did the headache start?",
        "Did it come on suddenly or build gradually?",
        "Where is the pain?",
        "What does it feel like?",
        "How severe is it?",
        "Have you had headaches like this before?",
        "Is this headache different from your usual migraines?"
      ]
    },
    {
      title: "Associated symptoms",
      prompts: [
        "Do light or noise make it worse?",
        "Any nausea or vomiting?",
        "Any visual symptoms before or during the headache?",
        "Any weakness, numbness or speech difficulty?",
        "Any dizziness or blackout?"
      ]
    },
    {
      title: "Red flags",
      prompts: [
        "Any fever or neck stiffness?",
        "Any recent head injury?",
        "Any new rash?",
        "Any pregnancy or recent delivery?",
        "Any cancer, immune suppression or blood-thinning medication?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "What usually helps your migraines?",
        "Do you take regular medication?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Sophie Grant",
  patientAge: 30,

  patientPortrayal:
    "You prefer to lie still in a darkened room with your eyes partly covered. You are uncomfortable but alert and able to answer questions normally.",

  openingLine:
    "I've got a really bad throbbing headache on the left side and the lights are making it much worse.",

  historyItems: [
    {
      id: "mig_h01",
      domain: "History",
      source: "patient",
      label: "Left-sided throbbing headache started this morning",
      patientWording: "It started this morning and it's throbbing on the left side of my head."
    },
    {
      id: "mig_h02",
      domain: "History",
      source: "patient",
      label: "Headache built gradually over around one hour",
      patientWording: "It built up gradually over about an hour rather than hitting me all at once."
    },
    {
      id: "mig_h03",
      domain: "History",
      source: "patient",
      label: "Current headache is severe",
      patientWording: "It's really severe, probably about eight or nine out of ten."
    },
    {
      id: "mig_h04",
      domain: "History",
      source: "patient",
      label: "Bright light worsens the headache",
      patientWording: "Bright light makes it much worse."
    },
    {
      id: "mig_h05",
      domain: "History",
      source: "patient",
      label: "Noise worsens the headache",
      patientWording: "Noise makes it worse too."
    },
    {
      id: "mig_h06",
      domain: "Review of systems",
      source: "patient",
      label: "Feels nauseated",
      patientWording: "I feel really sick with it."
    },
    {
      id: "mig_h07",
      domain: "Review of systems",
      source: "patient",
      label: "No vomiting",
      patientWording: "I haven't actually vomited."
    },
    {
      id: "mig_h08",
      domain: "History",
      source: "patient",
      label: "Has had similar migraines previously",
      patientWording: "I've had migraines before that feel quite similar."
    },
    {
      id: "mig_h09",
      domain: "History",
      source: "patient",
      label: "Current headache is more severe than usual but otherwise similar to previous migraines",
      patientWording: "This one is worse than usual, but otherwise it feels like my normal migraines."
    },
    {
      id: "mig_h10",
      domain: "History",
      source: "patient",
      label: "Sometimes sees flashing lights before migraines",
      patientWording: "Sometimes I see flashing lights before a migraine starts."
    },
    {
      id: "mig_h11",
      domain: "Review of systems",
      source: "patient",
      label: "No limb weakness",
      patientWording: "I haven't had any weakness in my arms or legs."
    },
    {
      id: "mig_h12",
      domain: "Review of systems",
      source: "patient",
      label: "No limb numbness",
      patientWording: "I haven't had any numbness."
    },
    {
      id: "mig_h13",
      domain: "Review of systems",
      source: "patient",
      label: "No speech disturbance",
      patientWording: "My speech has been normal."
    },
    {
      id: "mig_h14",
      domain: "Review of systems",
      source: "patient",
      label: "No syncope",
      patientWording: "I haven't blacked out."
    },
    {
      id: "mig_h15",
      domain: "Review of systems",
      source: "patient",
      label: "No fever",
      patientWording: "I haven't had a fever."
    },
    {
      id: "mig_h16",
      domain: "Review of systems",
      source: "patient",
      label: "No neck stiffness",
      patientWording: "My neck doesn't feel stiff."
    },
    {
      id: "mig_h17",
      domain: "History",
      source: "patient",
      label: "No recent head injury",
      patientWording: "I haven't hit my head recently."
    },
    {
      id: "mig_h18",
      domain: "History",
      source: "patient",
      label: "Not taking anticoagulant medication",
      patientWording: "No, I don't take any blood thinners."
    },
    {
      id: "mig_h19",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "I don't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "mig_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 80 bpm"
    },
    {
      id: "mig_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 122/72 mmHg"
    },
    {
      id: "mig_e03",
      domain: "Observations",
      source: "clinician",
      label: "Temperature 36.6°C"
    },
    {
      id: "mig_e04",
      domain: "Examination",
      source: "clinician",
      label: "Patient is lying in a darkened room with eyes partly covered"
    },
    {
      id: "mig_e05",
      domain: "Examination",
      source: "clinician",
      label: "Patient appears uncomfortable but is alert and orientated"
    },
    {
      id: "mig_e06",
      domain: "Examination",
      source: "clinician",
      label: "GCS 15"
    },
    {
      id: "mig_e07",
      domain: "Examination",
      source: "clinician",
      label: "Pupils are equal and reactive"
    },
    {
      id: "mig_e08",
      domain: "Examination",
      source: "clinician",
      label: "Cranial nerve examination is normal"
    },
    {
      id: "mig_e09",
      domain: "Examination",
      source: "clinician",
      label: "Upper and lower limb power is normal bilaterally"
    },
    {
      id: "mig_e10",
      domain: "Examination",
      source: "clinician",
      label: "Sensation is intact in all four limbs"
    },
    {
      id: "mig_e11",
      domain: "Examination",
      source: "clinician",
      label: "Coordination is normal"
    },
    {
      id: "mig_e12",
      domain: "Examination",
      source: "clinician",
      label: "No meningism"
    },
    {
      id: "mig_e13",
      domain: "Examination",
      source: "clinician",
      label: "No rash"
    }
  ],

  investigationItems: [
    {
      id: "mig_i01",
      domain: "Investigations",
      source: "clinician",
      label: "No routine neuroimaging is currently indicated if the assessment remains consistent with uncomplicated migraine"
    },
    {
      id: "mig_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Pregnancy testing should be considered if relevant before medication is given"
    }
  ],

  planItems: [
    {
      id: "mig_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is acute migraine"
    },
    {
      id: "mig_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give appropriate analgesia"
    },
    {
      id: "mig_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give antiemetic treatment if required"
    },
    {
      id: "mig_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Reassess symptoms after treatment"
    },
    {
      id: "mig_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Investigate further if atypical features or neurological changes develop"
    },
    {
      id: "mig_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Provide safety-net advice regarding sudden severe headache, fever or neurological symptoms"
    }
  ]
};
