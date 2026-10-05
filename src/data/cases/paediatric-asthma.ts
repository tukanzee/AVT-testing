import type { ClinicalCase } from "../../types";

export const paediatricAsthmaCase: ClinicalCase = {
  id: "SCEN-14",
  title: "Acute asthma in a child",
  specialty: "Paediatrics / Emergency Medicine",
  setting: "Emergency Department",

  doctorBrief:
    "You are assessing a 6-year-old child with worsening cough and wheeze since yesterday. The mother reports a longer history of nocturnal cough and exercise-related wheeze. Use the prompts below to assess the acute severity while distinguishing today's exacerbation from the child's baseline symptom pattern. The history will be obtained mainly from the mother, with simple questions directed to the child where appropriate.",

  doctorPromptSections: [
    {
      title: "Current breathing problem",
      prompts: [
        "When did the breathing become worse?",
        "How often has the child needed the blue inhaler?",
        "Has the inhaler helped?",
        "Is the child breathless at rest?",
        "Any fever?",
        "Any choking episode?",
        "Any productive cough?"
      ]
    },
    {
      title: "Baseline asthma-type symptoms",
      prompts: [
        "Does the child cough at night?",
        "Does running or exercise trigger wheeze?",
        "How often do these symptoms happen?",
        "Has asthma ever been formally diagnosed?"
      ]
    },
    {
      title: "Previous severity",
      prompts: [
        "Any previous hospital attendances with wheeze?",
        "Any previous intensive care admission?",
        "Any previous ventilation?"
      ]
    },
    {
      title: "Atopy and environment",
      prompts: [
        "Any eczema or allergies?",
        "Any family history of asthma?",
        "Does anyone smoke around the child?",
        "Any medication allergies?"
      ]
    }
  ],

  patientName: "Noah Wilson",
  patientAge: 6,

  patientPortrayal:
    "You are playing the child. Sit upright close to your mother, look slightly anxious and breathe faster than normal. Speak in short phrases when answering simple questions. The mother provides most of the detailed history.",

  openingLine:
    "Mum: He's been coughing and wheezing since yesterday and the blue inhaler hasn't lasted very long.",

  historyItems: [
    {
      id: "asth_h01",
      domain: "History",
      source: "patient",
      label: "Cough and wheeze have worsened since yesterday",
      patientWording: "Mum: His cough and wheeze have been much worse since yesterday."
    },
    {
      id: "asth_h02",
      domain: "History",
      source: "patient",
      label: "Needed repeated salbutamol doses overnight",
      patientWording: "Mum: I had to give him the blue inhaler several times overnight."
    },
    {
      id: "asth_h03",
      domain: "History",
      source: "patient",
      label: "Salbutamol provides only short-lived relief",
      patientWording: "Mum: It helps for a little while, but then the wheeze comes back."
    },
    {
      id: "asth_h04",
      domain: "History",
      source: "patient",
      label: "Child is now breathless while sitting still",
      patientWording: "Mum: Today he's been breathless even when he's just sitting down."
    },
    {
      id: "asth_h05",
      domain: "History",
      source: "patient",
      label: "Has nocturnal cough on several nights each week",
      patientWording: "Mum: He often coughs in the night, usually a few nights each week."
    },
    {
      id: "asth_h06",
      domain: "History",
      source: "patient",
      label: "Often wheezes after running in the playground",
      patientWording: "Mum: He often starts coughing and wheezing after running around at school."
    },
    {
      id: "asth_h07",
      domain: "Review of systems",
      source: "patient",
      label: "No choking episode",
      patientWording: "Mum: There wasn't any choking episode."
    },
    {
      id: "asth_h08",
      domain: "Review of systems",
      source: "patient",
      label: "No significant fever",
      patientWording: "Mum: He hasn't had a significant fever."
    },
    {
      id: "asth_h09",
      domain: "Review of systems",
      source: "patient",
      label: "No productive sputum",
      patientWording: "Mum: He's not bringing up phlegm."
    },
    {
      id: "asth_h10",
      domain: "History",
      source: "patient",
      label: "Has eczema",
      patientWording: "Mum: He has eczema."
    },
    {
      id: "asth_h11",
      domain: "History",
      source: "patient",
      label: "Mother has asthma",
      patientWording: "Mum: I have asthma myself."
    },
    {
      id: "asth_h12",
      domain: "History",
      source: "patient",
      label: "One previous hospital attendance with wheeze",
      patientWording: "Mum: We've had to bring him to hospital once before because of wheezing."
    },
    {
      id: "asth_h13",
      domain: "History",
      source: "patient",
      label: "No previous intensive care admission for asthma or wheeze",
      patientWording: "Mum: He's never needed intensive care."
    },
    {
      id: "asth_h14",
      domain: "History",
      source: "patient",
      label: "No previous ventilation",
      patientWording: "Mum: He's never needed a breathing machine."
    },
    {
      id: "asth_h15",
      domain: "History",
      source: "patient",
      label: "No one smokes inside the home",
      patientWording: "Mum: Nobody smokes inside the house."
    },
    {
      id: "asth_h16",
      domain: "History",
      source: "patient",
      label: "No known drug allergies",
      patientWording: "Mum: He doesn't have any known drug allergies."
    }
  ],

  examinationItems: [
    {
      id: "asth_e01",
      domain: "Examination",
      source: "clinician",
      label: "Child is sitting upright close to the mother and appears anxious"
    },
    {
      id: "asth_e02",
      domain: "Examination",
      source: "clinician",
      label: "Child is alert and responsive"
    },
    {
      id: "asth_e03",
      domain: "Examination",
      source: "clinician",
      label: "Child speaks in short phrases rather than full sentences"
    },
    {
      id: "asth_e04",
      domain: "Observations",
      source: "clinician",
      label: "Respiratory rate is elevated for age"
    },
    {
      id: "asth_e05",
      domain: "Observations",
      source: "clinician",
      label: "Heart rate is elevated for age"
    },
    {
      id: "asth_e06",
      domain: "Observations",
      source: "clinician",
      label: "SpO₂ is mildly reduced on room air"
    },
    {
      id: "asth_e07",
      domain: "Examination",
      source: "clinician",
      label: "Increased work of breathing is present"
    },
    {
      id: "asth_e08",
      domain: "Examination",
      source: "clinician",
      label: "Mild intercostal recession is present"
    },
    {
      id: "asth_e09",
      domain: "Examination",
      source: "clinician",
      label: "Widespread bilateral expiratory wheeze"
    },
    {
      id: "asth_e10",
      domain: "Examination",
      source: "clinician",
      label: "Air entry is reduced but present bilaterally"
    },
    {
      id: "asth_e11",
      domain: "Examination",
      source: "clinician",
      label: "No focal crepitations"
    },
    {
      id: "asth_e12",
      domain: "Examination",
      source: "clinician",
      label: "No stridor"
    },
    {
      id: "asth_e13",
      domain: "Examination",
      source: "clinician",
      label: "No cyanosis"
    }
  ],

  investigationItems: [
    {
      id: "asth_i01",
      domain: "Investigations",
      source: "clinician",
      label: "Severity assessment is primarily clinical"
    },
    {
      id: "asth_i02",
      domain: "Investigations",
      source: "clinician",
      label: "Peak expiratory flow may be attempted if age and cooperation allow"
    },
    {
      id: "asth_i03",
      domain: "Investigations",
      source: "clinician",
      label: "Further investigations are guided by severity and alternative diagnoses"
    }
  ],

  planItems: [
    {
      id: "asth_p01",
      domain: "Plan / actions",
      source: "clinician",
      label: "Working diagnosis is an acute asthma exacerbation"
    },
    {
      id: "asth_p02",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give bronchodilator therapy according to the paediatric asthma pathway"
    },
    {
      id: "asth_p03",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give oxygen if required to maintain appropriate oxygen saturation"
    },
    {
      id: "asth_p04",
      domain: "Plan / actions",
      source: "clinician",
      label: "Give corticosteroid treatment according to severity"
    },
    {
      id: "asth_p05",
      domain: "Plan / actions",
      source: "clinician",
      label: "Reassess work of breathing, wheeze and oxygen saturation after treatment"
    },
    {
      id: "asth_p06",
      domain: "Team involvement",
      source: "clinician",
      label: "Escalate to senior paediatric or emergency review if there is poor response or deterioration"
    },
    {
      id: "asth_p07",
      domain: "Plan / actions",
      source: "clinician",
      label: "Admit if significant symptoms persist after initial treatment"
    }
  ]
};
