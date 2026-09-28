import type { ClinicalCase } from "../../types";

export const suicidalIdeationCase: ClinicalCase = {
  id: "SCEN-08",
  title: "Suicidal ideation",
  specialty: "Mental Health / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 32-year-old patient with worsening low mood and suicidal thoughts. The diagnosis is a mental health crisis with suicidal ideation. Use the prompts below to complete a focused risk assessment and discuss an immediate plan. You do not need to use every prompt or verbalise every available finding.",

  doctorPromptSections: [
    {
      title: "Current mental state",
      prompts: [
        "How have you been feeling recently?",
        "How long have things been getting worse?",
        "Are you still enjoying things you normally enjoy?",
        "How have you been sleeping?",
        "How is your appetite?",
        "Has anything happened recently that has made things worse?"
      ]
    },
    {
      title: "Immediate risk",
      prompts: [
        "Have you had thoughts that you would be better off dead?",
        "Have you had thoughts about ending your life?",
        "Have you thought about how you might harm yourself?",
        "Have you made any preparations?",
        "Have you done anything to harm yourself today?",
        "Do you have access to medication or anything else you could use to harm yourself?",
        "Do you feel safe going home today?",
        "Have you ever attempted suicide or harmed yourself before?"
      ]
    },
    {
      title: "Other risks and symptoms",
      prompts: [
        "Do you have any thoughts about harming anyone else?",
        "Have you been hearing voices?",
        "Have you been seeing things that other people cannot?",
        "Have you felt unusually energetic or needed much less sleep than normal?",
        "Have you used alcohol or recreational drugs today?"
      ]
    },
    {
      title: "Background and protective factors",
      prompts: [
        "Have you had depression or other mental health problems before?",
        "Have you had treatment for your mental health before?",
        "Who do you live with?",
        "Is there anyone you feel able to talk to or who helps keep you safe?",
        "Is there anything that has stopped you acting on these thoughts?"
      ]
    }
  ],

  patientName: "Emma Clarke",
  patientAge: 32,

  patientPortrayal:
    "You are tearful and quiet but engage with the doctor. Do not volunteer all risk details immediately; answer honestly when asked directly.",

  openingLine:
    "I just don't feel like I can cope anymore.",

  historyItems: [
    {
      id: "mh_h01",
      domain: "History",
      source: "patient",
      label: "Low mood has worsened over approximately 4 weeks",
      patientWording: "I've been getting worse over about the last four weeks."
    },
    {
      id: "mh_h02",
      domain: "History",
      source: "patient",
      label: "Feels unable to cope",
      patientWording: "I just don't feel like I can cope anymore."
    },
    {
      id: "mh_h03",
      domain: "History",
      source: "patient",
      label: "Has stopped enjoying usual activities",
      patientWording: "I don't really enjoy anything at the moment."
    },
    {
      id: "mh_h04",
      domain: "History",
      source: "patient",
      label: "Sleeping poorly",
      patientWording: "I'm sleeping really badly."
    },
    {
      id: "mh_h05",
      domain: "History",
      source: "patient",
      label: "Appetite is reduced",
      patientWording: "I haven't really felt like eating much."
    },
    {
      id: "mh_h06",
      domain: "History",
      source: "patient",
      label: "Work has been particularly stressful recently",
      patientWording: "Work has been really stressful lately and I think it's made everything worse."
    },
    {
      id: "mh_h07",
      domain: "History",
      source: "patient",
      label: "Has increasingly thought they would be better off dead",
      patientWording: "I've started thinking I'd be better off dead."
    },
    {
      id: "mh_h08",
      domain: "History",
      source: "patient",
      label: "Has had thoughts about ending their life",
      patientWording: "I've been thinking about ending my life."
    },
    {
      id: "mh_h09",
      domain: "History",
      source: "patient",
      label: "Has thought about taking an overdose of medication",
      patientWording: "I've thought about taking all my tablets."
    },
    {
      id: "mh_h10",
      domain: "History",
      source: "patient",
      label: "Has not taken an overdose",
      patientWording: "I haven't actually taken anything."
    },
    {
      id: "mh_h11",
      domain: "History",
      source: "patient",
      label: "Has not harmed themselves today",
      patientWording: "I haven't done anything to hurt myself today."
    },
    {
      id: "mh_h12",
      domain: "History",
      source: "patient",
      label: "Has not gathered medication or made preparations",
      patientWording: "No, I haven't collected anything or made any preparations."
    },
    {
      id: "mh_h13",
      domain: "History",
      source: "patient",
      label: "Has regular medication available at home",
      patientWording: "I do have my regular tablets at home."
    },
    {
      id: "mh_h14",
      domain: "History",
      source: "patient",
      label: "Does not trust themselves to be alone tonight",
      patientWording: "I don't really trust myself being on my own tonight."
    },
    {
      id: "mh_h15",
      domain: "History",
      source: "patient",
      label: "No previous suicide attempt",
      patientWording: "No, I've never tried to end my life before."
    },
    {
      id: "mh_h16",
      domain: "History",
      source: "patient",
      label: "Previous episode of depression several years ago",
      patientWording: "I had depression a few years ago."
    },
    {
      id: "mh_h17",
      domain: "History",
      source: "patient",
      label: "No thoughts of harming other people",
      patientWording: "No, I don't want to hurt anyone else."
    },
    {
      id: "mh_h18",
      domain: "Review of systems",
      source: "patient",
      label: "No auditory hallucinations",
      patientWording: "No, I haven't been hearing voices."
    },
    {
      id: "mh_h19",
      domain: "Review of systems",
      source: "patient",
      label: "No visual hallucinations",
      patientWording: "No, I haven't been seeing things."
    },
    {
      id: "mh_h20",
      domain: "Review of systems",
      source: "patient",
      label: "No symptoms suggestive of mania",
      patientWording: "No, I haven't had periods of feeling unusually energetic or needing hardly any sleep."
    },
    {
      id: "mh_h21",
      domain: "History",
      source: "patient",
      label: "No alcohol use today",
      patientWording: "I haven't been drinking today."
    },
    {
      id: "mh_h22",
      domain: "History",
      source: "patient",
      label: "No recreational drug use today",
      patientWording: "I haven't taken any recreational drugs today."
    },
    {
      id: "mh_h23",
      domain: "History",
      source: "patient",
      label: "Lives with partner",
      patientWording: "I live with my partner."
    },
    {
      id: "mh_h24",
      domain: "History",
      source: "patient",
      label: "Partner knows things have been difficult but does not know the full extent of the suicidal thoughts",
      patientWording: "My partner knows I've been struggling, but they don't know how bad the thoughts have got."
    },
    {
      id: "mh_h25",
      domain: "History",
      source: "patient",
      label: "Partner is an important protective factor",
      patientWording: "My partner is the main reason I've kept going."
    },
    {
      id: "mh_h26",
      domain: "History",
      source: "patient",
      label: "Came to ED because part of them wants help",
      patientWording: "Part of me still wants help, which is why I came here."
    }
  ],

  examinationItems: [
    {
      id: "mh_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 88 bpm"
    },
    {
      id: "mh_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure 124/76 mmHg"
    },
    {
      id: "mh_e03",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate 16/min"
    },
    {
      id: "mh_e04",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ 99% on room air"
    },
    {
      id: "mh_e05",
      domain: "Examination",
      source: "clinician",
      label: "Patient is tearful but cooperative"
    },
    {
      id: "mh_e06",
      domain: "Examination",
      source: "clinician",
      label: "Eye contact is intermittent but appropriate"
    },
    {
      id: "mh_e07",
      domain: "Examination",
      source: "clinician",
      label: "Speech is coherent and relevant"
    },
    {
      id: "mh_e08",
      domain: "Examination",
      source: "clinician",
      label: "Patient describes their mood as very low"
    },
    {
      id: "mh_e09",
      domain: "Examination",
      source: "clinician",
      label: "Affect is congruent with low mood"
    },
    {
      id: "mh_e10",
      domain: "Examination",
      source: "clinician",
      label: "Suicidal thoughts are present"
    },
    {
      id: "mh_e11",
      domain: "Examination",
      source: "clinician",
      label: "No evidence of responding to unseen stimuli"
    },
    {
      id: "mh_e12",
      domain: "Examination",
      source: "clinician",
      label: "No overt thought disorder is identified"
    },
    {
      id: "mh_e13",
      domain: "Examination",
      source: "clinician",
      label: "Patient engages with the assessment"
    }
  ],

  investigationItems: [],

  planItems: [
    {
      id: "mh_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Complete an immediate suicide and self-harm risk assessment"
    },
    {
      id: "mh_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Maintain a safe emergency department environment"
    },
    {
      id: "mh_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Use an appropriate level of observation while awaiting assessment"
    },
    {
      id: "mh_p04",
      domain: "Team involvement",
      source: "clinician",
      label: "Refer to the mental health liaison team"
    },
    {
      id: "mh_p05",
      domain: "Team involvement",
      source: "clinician",
      label: "Discuss with a senior clinician"
    },
    {
      id: "mh_p06",
      domain: "Plan / actions",
      source: "clinician",
      label: "With the patient's consent, involve their partner in safety planning"
    },
    {
      id: "mh_p07",
      domain: "Plan / actions",
      source: "clinician",
      label: "Do not discharge until a safe disposition has been agreed following mental health assessment"
    }
  ]
};
