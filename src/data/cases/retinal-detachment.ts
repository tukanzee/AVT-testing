import type { ClinicalCase } from "../../types";

export const retinalDetachmentCase: ClinicalCase = {
  id: "SCEN-12",
  title: "Suspected retinal detachment",
  specialty: "Ophthalmology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 70-year-old man with new flashes, floaters and a painless curtain-like visual field defect in the right eye. Use the prompts below to establish the chronology, identify ophthalmic risk factors and screen for neurological or painful-eye features that would suggest an alternative diagnosis. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Visual symptoms",
      prompts: [
        "When did the visual change start?",
        "Did you notice flashing lights?",
        "Any new floaters?",
        "Can you describe the shadow or curtain?",
        "Which eye is affected?",
        "Is the visual loss painful?",
        "Has the vision continued to worsen?"
      ]
    },
    {
      title: "Alternative causes",
      prompts: [
        "Any eye trauma?",
        "Any headache?",
        "Any weakness, numbness or speech difficulty?",
        "Any eye redness or severe eye pain?"
      ]
    },
    {
      title: "Ophthalmic background",
      prompts: [
        "Any previous eye surgery?",
        "Are you very short-sighted?",
        "Any previous retinal problems?",
        "Any problems with the other eye?"
      ]
    },
    {
      title: "Medical background",
      prompts: [
        "Any diabetes?",
        "Any blood-thinning medication?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "George Walker",
  patientAge: 70,

  patientPortrayal:
    "You are worried but not in pain. You can describe the visual disturbance clearly. Keep the left eye symptoms normal unless specifically asked.",

  openingLine:
    "Yesterday I started seeing flashes and floaters in my right eye, and now it feels like a dark curtain has come down over part of my vision.",

  historyItems: [
    {
      id: "ret_h01",
      domain: "History",
      source: "patient",
      label: "Flashing lights began in the right eye yesterday",
      patientWording: "Yesterday I started seeing flashing lights in my right eye."
    },
    {
      id: "ret_h02",
      domain: "History",
      source: "patient",
      label: "New floaters developed in the right eye",
      patientWording: "Then I suddenly noticed lots of new little floaters."
    },
    {
      id: "ret_h03",
      domain: "History",
      source: "patient",
      label: "A dark curtain-like shadow developed in the right visual field",
      patientWording: "After that it felt like a dark curtain or shadow came over part of the vision in my right eye."
    },
    {
      id: "ret_h04",
      domain: "History",
      source: "patient",
      label: "Shadow is described as coming from the upper part of the right visual field",
      patientWording: "It seems to come down from the top part of my vision."
    },
    {
      id: "ret_h05",
      domain: "History",
      source: "patient",
      label: "Visual loss is painless",
      patientWording: "It doesn't hurt at all."
    },
    {
      id: "ret_h06",
      domain: "History",
      source: "patient",
      label: "Left eye vision is unaffected",
      patientWording: "My left eye seems normal."
    },
    {
      id: "ret_h07",
      domain: "History",
      source: "patient",
      label: "No recent eye trauma",
      patientWording: "I haven't injured or hit the eye."
    },
    {
      id: "ret_h08",
      domain: "Review of systems",
      source: "patient",
      label: "No headache",
      patientWording: "I haven't had a headache."
    },
    {
      id: "ret_h09",
      domain: "Review of systems",
      source: "patient",
      label: "No limb weakness",
      patientWording: "I haven't had any weakness in my arms or legs."
    },
    {
      id: "ret_h10",
      domain: "Review of systems",
      source: "patient",
      label: "No limb numbness",
      patientWording: "I haven't had any numbness."
    },
    {
      id: "ret_h11",
      domain: "Review of systems",
      source: "patient",
      label: "No speech disturbance",
      patientWording: "My speech has been normal."
    },
    {
      id: "ret_h12",
      domain: "Review of systems",
      source: "patient",
      label: "No severe eye pain or eye redness",
      patientWording: "The eye isn't painful or red."
    },
    {
      id: "ret_h13",
      domain: "History",
      source: "patient",
      label: "Previous cataract surgery in the right eye",
      patientWording: "I had cataract surgery on the right eye a few years ago."
    },
    {
      id: "ret_h14",
      domain: "History",
      source: "patient",
      label: "Has significant myopia",
      patientWording: "I've always been very short-sighted and wear strong glasses."
    },
    {
      id: "ret_h15",
      domain: "History",
      source: "patient",
      label: "No previous retinal detachment",
      patientWording: "I've never had a detached retina before."
    },
    {
      id: "ret_h16",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "I don't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "ret_e01",
      domain: "Examination",
      source: "clinician",
      label: "Patient is comfortable and not systemically unwell"
    },
    {
      id: "ret_e02",
      domain: "Examination",
      source: "clinician",
      label: "Visual acuity is reduced in the right eye compared with the left"
    },
    {
      id: "ret_e03",
      domain: "Examination",
      source: "clinician",
      label: "A visual field defect is present in the right eye"
    },
    {
      id: "ret_e04",
      domain: "Examination",
      source: "clinician",
      label: "Left visual fields are intact"
    },
    {
      id: "ret_e05",
      domain: "Examination",
      source: "clinician",
      label: "Pupils are examined for a relative afferent pupillary defect"
    },
    {
      id: "ret_e06",
      domain: "Examination",
      source: "clinician",
      label: "No conjunctival injection"
    },
    {
      id: "ret_e07",
      domain: "Examination",
      source: "clinician",
      label: "Cornea is clear"
    },
    {
      id: "ret_e08",
      domain: "Examination",
      source: "clinician",
      label: "No eye tenderness"
    },
    {
      id: "ret_e09",
      domain: "Examination",
      source: "clinician",
      label: "Extraocular movements are intact"
    },
    {
      id: "ret_e10",
      domain: "Examination",
      source: "clinician",
      label: "No facial asymmetry"
    },
    {
      id: "ret_e11",
      domain: "Examination",
      source: "clinician",
      label: "No focal limb neurological deficit"
    }
  ],

  investigationItems: [
    {
      id: "ret_i01",
      domain: "Investigations",
      source: "clinician",
      label: "Bedside fundoscopy should be attempted if the clinician is competent to perform it"
    },
    {
      id: "ret_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Urgent ophthalmic assessment is required to confirm or exclude retinal detachment"
    }
  ],

  planItems: [
    {
      id: "ret_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is suspected right retinal detachment"
    },
    {
      id: "ret_p02",
      domain: "Team involvement",
      source: "clinician",
      label: "Urgently discuss with ophthalmology"
    },
    {
      id: "ret_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Arrange same-day ophthalmic assessment"
    },
    {
      id: "ret_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Avoid documenting stroke as the diagnosis in the absence of supporting neurological findings"
    }
  ]
};
