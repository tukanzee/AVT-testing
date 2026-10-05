import type { ClinicalCase } from "../../types";

export const ironDeficiencyAnaemiaCase: ClinicalCase = {
  id: "SCEN-17",
  title: "Symptomatic iron-deficiency anaemia",
  specialty: "Haematology / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 28-year-old woman with progressive fatigue, exertional breathlessness, pica and heavy menstrual bleeding. Use the prompts below to assess the severity of anaemia, identify possible sources of blood loss and avoid assuming that heavy periods are the only possible cause before appropriate investigation.",

  doctorPromptSections: [
    {
      title: "Anaemia symptoms",
      prompts: [
        "How long have you been feeling tired?",
        "Do you get short of breath on exertion?",
        "Any dizziness or light-headedness?",
        "Any chest pain?",
        "Any blackouts?",
        "Any unusual cravings such as chewing ice?"
      ]
    },
    {
      title: "Bleeding history",
      prompts: [
        "Are your periods heavy?",
        "How long do they last?",
        "How often do you need to change pads or tampons on the heaviest days?",
        "Any bleeding between periods?",
        "Any rectal bleeding or black stools?"
      ]
    },
    {
      title: "Other causes",
      prompts: [
        "What is your diet like?",
        "Any abdominal symptoms?",
        "Any previous anaemia?",
        "Could you be pregnant?"
      ]
    },
    {
      title: "Background",
      prompts: [
        "Any regular medication?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Hannah Price",
  patientAge: 28,

  patientPortrayal:
    "You look tired but are alert and able to speak normally. You become slightly breathless if asked to walk quickly, but you are not breathless at rest.",

  openingLine:
    "I've been exhausted for months and lately I get breathless just going up the stairs.",

  historyItems: [
    {
      id: "ida_h01",
      domain: "History",
      source: "patient",
      label: "Fatigue has progressively worsened over several months",
      patientWording: "I've been getting more and more tired over the last few months."
    },
    {
      id: "ida_h02",
      domain: "History",
      source: "patient",
      label: "Gets breathless climbing one flight of stairs",
      patientWording: "Now I get breathless just climbing one flight of stairs."
    },
    {
      id: "ida_h03",
      domain: "Review of systems",
      source: "patient",
      label: "Occasional light-headedness on standing",
      patientWording: "I sometimes feel light-headed when I stand up."
    },
    {
      id: "ida_h04",
      domain: "Review of systems",
      source: "patient",
      label: "No chest pain",
      patientWording: "I haven't had any chest pain."
    },
    {
      id: "ida_h05",
      domain: "Review of systems",
      source: "patient",
      label: "No syncope",
      patientWording: "I haven't blacked out."
    },
    {
      id: "ida_h06",
      domain: "History",
      source: "patient",
      label: "Craves and chews ice every day",
      patientWording: "I've got this strange craving to chew ice every day."
    },
    {
      id: "ida_h07",
      domain: "History",
      source: "patient",
      label: "Menstrual periods have become very heavy",
      patientWording: "My periods have become really heavy."
    },
    {
      id: "ida_h08",
      domain: "History",
      source: "patient",
      label: "Menstrual bleeding lasts around 7 days",
      patientWording: "They usually last about seven days."
    },
    {
      id: "ida_h09",
      domain: "History",
      source: "patient",
      label: "Needs frequent pad changes during the first few days of menstruation",
      patientWording: "For the first couple of days I need to change pads very frequently."
    },
    {
      id: "ida_h10",
      domain: "History",
      source: "patient",
      label: "No bleeding between periods",
      patientWording: "I don't bleed between periods."
    },
    {
      id: "ida_h11",
      domain: "Review of systems",
      source: "patient",
      label: "No rectal bleeding",
      patientWording: "I haven't noticed blood from my back passage."
    },
    {
      id: "ida_h12",
      domain: "Review of systems",
      source: "patient",
      label: "No melaena",
      patientWording: "I haven't had any black tarry stools."
    },
    {
      id: "ida_h13",
      domain: "History",
      source: "patient",
      label: "Eats a mixed diet including meat",
      patientWording: "I eat a normal mixed diet and I do eat meat."
    },
    {
      id: "ida_h14",
      domain: "History",
      source: "patient",
      label: "Had iron deficiency several years ago",
      patientWording: "I was told I was low in iron a few years ago."
    },
    {
      id: "ida_h15",
      domain: "History",
      source: "patient",
      label: "Patient does not believe they are pregnant",
      patientWording: "No, I don't think I'm pregnant."
    },
    {
      id: "ida_h16",
      domain: "History",
      source: "patient",
      label: "No regular medication",
      patientWording: "I don't take any regular medication."
    },
    {
      id: "ida_h17",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "I don't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "ida_e01",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate 102 bpm"
    },
    {
      id: "ida_e02",
      domain: "Observations",
      source: "clinician",
      label: "Blood pressure is stable"
    },
    {
      id: "ida_e03",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ is normal on room air"
    },
    {
      id: "ida_e04",
      domain: "Examination",
      source: "clinician",
      label: "Patient appears tired but is alert and conversant"
    },
    {
      id: "ida_e05",
      domain: "Examination",
      source: "clinician",
      label: "Conjunctival pallor is present"
    },
    {
      id: "ida_e06",
      domain: "Examination",
      source: "clinician",
      label: "Koilonychia is present"
    },
    {
      id: "ida_e07",
      domain: "Examination",
      source: "clinician",
      label: "No clinical jaundice"
    },
    {
      id: "ida_e08",
      domain: "Examination",
      source: "clinician",
      label: "No active bleeding is identified during assessment"
    },
    {
      id: "ida_e09",
      domain: "Examination",
      source: "clinician",
      label: "Chest is clear to auscultation"
    },
    {
      id: "ida_e10",
      domain: "Examination",
      source: "clinician",
      label: "Soft systolic flow murmur is present"
    },
    {
      id: "ida_e11",
      domain: "Examination",
      source: "clinician",
      label: "Abdomen is soft and non-tender"
    }
  ],

  investigationItems: [
    {
      id: "ida_i01",
      domain: "Investigations",
      source: "clinician",
      label: "Haemoglobin is significantly reduced"
    },
    {
      id: "ida_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Red cell indices are microcytic"
    },
    {
      id: "ida_i03",
      domain: "Investigations",
      source: "clinician",
      label: "Ferritin is low"
    },
    {
      id: "ida_i04",
      domain: "Investigations",
      source: "clinician",
      label: "Pregnancy test is negative"
    },
    {
      id: "ida_i05",
      domain: "Investigations",
      source: "clinician",
      label: "Further investigation is required to establish the source of iron deficiency"
    }
  ],

  planItems: [
    {
      id: "ida_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is symptomatic iron-deficiency anaemia"
    },
    {
      id: "ida_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Assess the need for urgent treatment or transfusion according to symptoms and haemoglobin level"
    },
    {
      id: "ida_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Start or arrange iron replacement when clinically appropriate"
    },
    {
      id: "ida_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Heavy menstrual bleeding is a likely source of iron loss but should not be assumed to be the only possible cause"
    },
    {
      id: "ida_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Arrange appropriate follow-up to investigate the cause of iron deficiency"
    },
    {
      id: "ida_p06",
      domain: "Team involvement",
      source: "clinician",
      label: "Consider gynaecology or primary care follow-up for heavy menstrual bleeding"
    }
  ]
};
