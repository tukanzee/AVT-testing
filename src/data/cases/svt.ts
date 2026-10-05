import type { ClinicalCase } from "../../types";

export const svtCase: ClinicalCase = {
  id: "SCEN-15",
  title: "Paroxysmal supraventricular tachycardia",
  specialty: "Cardiology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 35-year-old man with sudden-onset palpitations and light-headedness. The tachycardia began abruptly while he was sitting at work and is described as fast and regular. Use the prompts below to establish the rhythm history, assess haemodynamic symptoms and identify potential triggers. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Palpitations",
      prompts: [
        "When did the palpitations start?",
        "Did they start suddenly or gradually?",
        "Does the heartbeat feel regular or irregular?",
        "How long has the episode lasted?",
        "Have you had anything like this before?"
      ]
    },
    {
      title: "Associated symptoms",
      prompts: [
        "Any chest pain?",
        "Any shortness of breath?",
        "Any dizziness or light-headedness?",
        "Any loss of consciousness?"
      ]
    },
    {
      title: "Potential triggers",
      prompts: [
        "How much caffeine do you drink?",
        "Any energy drinks?",
        "Any recreational drugs or stimulant use?",
        "Any recent illness or dehydration?"
      ]
    },
    {
      title: "Cardiac background",
      prompts: [
        "Any known heart problems?",
        "Any regular medication?",
        "Any family history of sudden cardiac death?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Adam Hughes",
  patientAge: 35,

  patientPortrayal:
    "During the tachycardia you are anxious but alert. After the rhythm stops, you rapidly feel much better. Make the change in symptoms obvious if the doctor asks after conversion.",

  openingLine:
    "My heart suddenly started racing while I was sitting at work, and it feels like it's pounding in my throat.",

  historyItems: [
    {
      id: "svt_h01",
      domain: "History",
      source: "patient",
      label: "Palpitations started suddenly while sitting at work",
      patientWording: "It started completely out of nowhere while I was sitting at my desk."
    },
    {
      id: "svt_h02",
      domain: "History",
      source: "patient",
      label: "Heartbeat feels very fast and regular",
      patientWording: "It feels incredibly fast but regular, like it's just racing."
    },
    {
      id: "svt_h03",
      domain: "History",
      source: "patient",
      label: "Feels pounding in the throat during the episode",
      patientWording: "I can feel it pounding up in my throat."
    },
    {
      id: "svt_h04",
      domain: "History",
      source: "patient",
      label: "Current episode has lasted around 25 minutes",
      patientWording: "It's been going for about twenty-five minutes."
    },
    {
      id: "svt_h05",
      domain: "Review of systems",
      source: "patient",
      label: "Feels light-headed during the episode",
      patientWording: "I feel light-headed while it's racing."
    },
    {
      id: "svt_h06",
      domain: "Review of systems",
      source: "patient",
      label: "Has mild shortness of breath during the episode",
      patientWording: "I'm a little short of breath with it."
    },
    {
      id: "svt_h07",
      domain: "Review of systems",
      source: "patient",
      label: "No chest pain",
      patientWording: "I don't have any chest pain."
    },
    {
      id: "svt_h08",
      domain: "Review of systems",
      source: "patient",
      label: "No loss of consciousness",
      patientWording: "I haven't blacked out."
    },
    {
      id: "svt_h09",
      domain: "History",
      source: "patient",
      label: "Had a similar shorter episode several months ago",
      patientWording: "I had something similar a few months ago, but it only lasted a few minutes."
    },
    {
      id: "svt_h10",
      domain: "History",
      source: "patient",
      label: "Drinks 3 to 4 coffees per day",
      patientWording: "I probably drink three or four coffees most days."
    },
    {
      id: "svt_h11",
      domain: "History",
      source: "patient",
      label: "No recreational stimulant drug use",
      patientWording: "I don't use cocaine or other stimulant drugs."
    },
    {
      id: "svt_h12",
      domain: "History",
      source: "patient",
      label: "No known cardiac disease",
      patientWording: "I've never been told I have a heart problem."
    },
    {
      id: "svt_h13",
      domain: "History",
      source: "patient",
      label: "No regular medication",
      patientWording: "I don't take any regular medication."
    },
    {
      id: "svt_h14",
      domain: "History",
      source: "patient",
      label: "No family history of sudden cardiac death",
      patientWording: "There's no sudden unexplained death in my family that I know of."
    },
    {
      id: "svt_h15",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "I don't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "svt_e01",
      domain: "Examination",
      source: "clinician",
      label: "Patient is alert but anxious during the tachycardia"
    },
    {
      id: "svt_e02",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate approximately 190 bpm during the episode"
    },
    {
      id: "svt_e03",
      domain: "Examination",
      source: "clinician",
      label: "Pulse is regular during the tachycardia"
    },
    {
      id: "svt_e04",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 118/72 mmHg during the episode"
    },
    {
      id: "svt_e05",
      domain: "Examination",
      source: "clinician",
      label: "Patient is warm and well perfused"
    },
    {
      id: "svt_e06",
      domain: "Examination",
      source: "clinician",
      label: "Chest is clear to auscultation"
    },
    {
      id: "svt_e07",
      domain: "Examination",
      source: "clinician",
      label: "No clinical signs of heart failure"
    },
    {
      id: "svt_e08",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 88 bpm after spontaneous termination of the tachycardia"
    },
    {
      id: "svt_e09",
      domain: "Examination",
      source: "clinician",
      label: "Symptoms resolve rapidly after the tachycardia terminates"
    }
  ],

  investigationItems: [
    {
      id: "svt_i01",
      domain: "Investigations",
      source: "clinician",
      label: "ECG during symptoms shows a regular narrow-complex tachycardia consistent with SVT"
    },
    {
      id: "svt_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Post-conversion ECG shows sinus rhythm"
    },
    {
      id: "svt_i03",
      domain: "Investigations",
      source: "clinician",
      label: "Electrolytes have been checked"
    }
  ],

  planItems: [
    {
      id: "svt_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is paroxysmal supraventricular tachycardia"
    },
    {
      id: "svt_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Continue cardiac monitoring while symptomatic"
    },
    {
      id: "svt_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Manage persistent tachycardia according to the SVT pathway"
    },
    {
      id: "svt_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Check for reversible precipitants including electrolyte disturbance and stimulant use"
    },
    {
      id: "svt_p05",
      domain: "Team involvement",
      source: "clinician",
      label: "Arrange cardiology or ambulatory follow-up if episodes recur"
    }
  ]
};
