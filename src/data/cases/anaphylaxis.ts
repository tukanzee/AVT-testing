import type { ClinicalCase } from "../../types";

export const anaphylaxisCase: ClinicalCase = {
  id: "SCEN-1",
  title: "Anaphylaxis following prawns",
  specialty: "Allergy / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 24-year-old man who developed lip swelling, widespread urticaria, throat tightness, wheeze and light-headedness shortly after eating prawns. The priority is immediate recognition and treatment of anaphylaxis. Use the prompts below only insofar as they do not delay emergency management. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Trigger and timing",
      prompts: [
        "What did you eat before this started?",
        "How long after eating did the symptoms begin?",
        "Have you reacted to shellfish before?"
      ]
    },
    {
      title: "Airway and breathing",
      prompts: [
        "Does your throat feel tight?",
        "Has your voice changed?",
        "Are you having difficulty breathing?",
        "Any wheeze?"
      ]
    },
    {
      title: "Circulation and other symptoms",
      prompts: [
        "Do you feel dizzy or light-headed?",
        "Have you blacked out?",
        "Any vomiting or abdominal pain?",
        "Where is the rash?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "Do you have asthma?",
        "Do you carry an adrenaline auto-injector?",
        "Any other known allergies?"
      ]
    }
  ],

  patientName: "Ryan Patel",
  patientAge: 24,

  patientPortrayal:
    "You look frightened and restless. Your lips are visibly swollen and your voice is slightly hoarse. Speak in short sentences because breathing is more difficult than normal. Do not delay the emergency treatment sequence to give long answers.",

  openingLine:
    "My lips are swelling, my throat feels tight and I'm struggling to breathe after eating prawns.",

  historyItems: [
    {
      id: "ana_h01",
      domain: "History",
      source: "patient",
      label: "Symptoms began about 15 minutes after eating prawn curry",
      patientWording: "This started about fifteen minutes after I ate a prawn curry."
    },
    {
      id: "ana_h02",
      domain: "History",
      source: "patient",
      label: "Lips rapidly became swollen",
      patientWording: "My lips started swelling really quickly."
    },
    {
      id: "ana_h03",
      domain: "History",
      source: "patient",
      label: "Developed widespread itchy urticaria",
      patientWording: "I've come out in itchy hives all over my chest and arms."
    },
    {
      id: "ana_h04",
      domain: "History",
      source: "patient",
      label: "Throat feels tight",
      patientWording: "My throat feels tight."
    },
    {
      id: "ana_h05",
      domain: "History",
      source: "patient",
      label: "Voice has become slightly hoarse",
      patientWording: "My voice sounds a bit different and hoarse."
    },
    {
      id: "ana_h06",
      domain: "History",
      source: "patient",
      label: "Has difficulty breathing",
      patientWording: "I'm finding it harder to breathe."
    },
    {
      id: "ana_h07",
      domain: "History",
      source: "patient",
      label: "Has wheeze",
      patientWording: "I can hear myself wheezing."
    },
    {
      id: "ana_h08",
      domain: "Review of systems",
      source: "patient",
      label: "Feels light-headed",
      patientWording: "I feel light-headed."
    },
    {
      id: "ana_h09",
      domain: "Review of systems",
      source: "patient",
      label: "No loss of consciousness",
      patientWording: "I haven't blacked out."
    },
    {
      id: "ana_h10",
      domain: "Review of systems",
      source: "patient",
      label: "No vomiting",
      patientWording: "I haven't vomited."
    },
    {
      id: "ana_h11",
      domain: "History",
      source: "patient",
      label: "Had a previous mild shellfish reaction",
      patientWording: "I had a mild reaction to shellfish once before, but nothing like this."
    },
    {
      id: "ana_h12",
      domain: "History",
      source: "patient",
      label: "No known asthma",
      patientWording: "I've never been diagnosed with asthma."
    },
    {
      id: "ana_h13",
      domain: "History",
      source: "patient",
      label: "Does not carry an adrenaline auto-injector",
      patientWording: "I don't have an adrenaline pen."
    }
  ],

  examinationItems: [
    {
      id: "ana_e01",
      domain: "Examination",
      source: "clinician",
      label: "Patient appears frightened and restless"
    },
    {
      id: "ana_e02",
      domain: "Examination",
      source: "clinician",
      label: "Widespread urticaria is present over the trunk and arms"
    },
    {
      id: "ana_e03",
      domain: "Examination",
      source: "clinician",
      label: "Visible lip swelling is present"
    },
    {
      id: "ana_e04",
      domain: "Examination",
      source: "clinician",
      label: "Voice is mildly hoarse"
    },
    {
      id: "ana_e05",
      domain: "Examination",
      source: "clinician",
      label: "Increased work of breathing is present"
    },
    {
      id: "ana_e06",
      domain: "Examination",
      source: "clinician",
      label: "Bilateral wheeze is present"
    },
    {
      id: "ana_e07",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 122 bpm"
    },
    {
      id: "ana_e08",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 92/58 mmHg"
    },
    {
      id: "ana_e09",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 26/min"
    },
    {
      id: "ana_e10",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ 94% on room air"
    },
    {
      id: "ana_e11",
      domain: "Examination",
      source: "clinician",
      label: "No complete airway obstruction is present"
    },
    {
      id: "ana_e12",
      domain: "Examination",
      source: "clinician",
      label: "Patient is still able to speak in short sentences"
    }
  ],

  investigationItems: [
    {
      id: "ana_i01",
      domain: "Investigations",
      source: "clinician",
      label: "Emergency treatment should not be delayed for investigations"
    }
  ],

  planItems: [
    {
      id: "ana_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is anaphylaxis"
    },
    {
      id: "ana_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give immediate intramuscular adrenaline according to current resuscitation guidance"
    },
    {
      id: "ana_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Perform an ABC assessment and provide oxygen as required"
    },
    {
      id: "ana_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give IV fluids if there is ongoing hypotension"
    },
    {
      id: "ana_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Repeat intramuscular adrenaline if clinically required"
    },
    {
      id: "ana_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "Continue close cardiorespiratory monitoring"
    },
    {
      id: "ana_p07",
      domain: "Plan / actions",
      source: "clinician",
      label: "Observe for an appropriate period after clinical recovery"
    },
    {
      id: "ana_p08",
      domain: "Team involvement",
      source: "clinician",
      label: "Arrange allergy follow-up and adrenaline auto-injector education when appropriate"
    }
  ]
};
