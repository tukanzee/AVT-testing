import type { ClinicalCase } from "../types";
import { dkaCase } from "./cases/dka";
import { nofCase } from "./cases/nof";
import { cellulitisCase } from "./cases/cellulitis";
import { suicidalIdeationCase } from "./cases/suicidal-ideation";
import { goutCase } from "./cases/gout";
import { caudaEquinaCase } from "./cases/cauda-equina";
import { thyroidStormCase } from "./cases/thyroid-storm";
import { chestPainCase } from "./cases/chest-pain";
import { copdExacerbationCase } from "./cases/copd-exacerbation";
import { biliaryColicCase } from "./cases/biliary-colic";
import { migraineCase } from "./cases/migraine";
import { otitisExternaCase } from "./cases/otitis-externa";
import { pyelonephritisCase } from "./cases/pyelonephritis";
import { retinalDetachmentCase } from "./cases/retinal-detachment";
import { recurrentFallsCase } from "./cases/recurrent-falls";
import { paediatricAsthmaCase } from "./cases/paediatric-asthma";
import { svtCase } from "./cases/svt";
import { rectalBleedingCase } from "./cases/rectal-bleeding";
import { ironDeficiencyAnaemiaCase } from "./cases/iron-deficiency-anaemia";
import { anaphylaxisCase } from "./cases/anaphylaxis";

export const cases: ClinicalCase[] = [
  dkaCase,
  nofCase,
  cellulitisCase,
  suicidalIdeationCase,
  goutCase,
  caudaEquinaCase,
  thyroidStormCase,
  chestPainCase,
  copdExacerbationCase,
  biliaryColicCase,
  migraineCase,
  otitisExternaCase,
  pyelonephritisCase,
  retinalDetachmentCase,
  recurrentFallsCase,
  paediatricAsthmaCase,
  svtCase,
  rectalBleedingCase,
  ironDeficiencyAnaemiaCase,
  anaphylaxisCase
];

export function getCaseById(id: string | null): ClinicalCase | undefined {
  if (!id) return undefined;
  return cases.find((item) => item.id === id);
}
