import type { ClinicalCase } from "../types";
import { dkaCase } from "./cases/dka";
import { nofCase } from "./cases/nof";
import { cellulitisCase } from "./cases/cellulitis";
import { suicidalIdeationCase } from "./cases/suicidal-ideation";
import { goutCase } from "./cases/gout";
import { caudaEquinaCase } from "./cases/cauda-equina";
import { thyroidStormCase } from "./cases/thyroid-storm";

export const cases: ClinicalCase[] = [
  dkaCase,
  nofCase,
  cellulitisCase,
  suicidalIdeationCase,
  goutCase,
  caudaEquinaCase,
  thyroidStormCase
];

export function getCaseById(id: string | null): ClinicalCase | undefined {
  if (!id) return undefined;
  return cases.find((item) => item.id === id);
}
