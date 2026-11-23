import type { CropId, Field, FieldId } from '../types'

export const FARM_NAME = 'Demo Farm'
export const FIELD_IDS: FieldId[] = ['A', 'B', 'C']

export const FIELDS: Record<FieldId, Field> = {
  A: { id: 'A', name: 'Field A', areaHa: 1.2, note: 'Demo field — reference conditions' },
  B: { id: 'B', name: 'Field B', areaHa: 0.8, note: 'Demo field — warmer, slightly drier' },
  C: { id: 'C', name: 'Field C', areaHa: 1.5, note: 'Demo field — hottest and driest sample' },
}

/** Sample growth-stage index (into Crop.stages) for each crop/field combination. */
export const STAGE_INDEX: Record<CropId, Record<FieldId, number>> = {
  tomato: { A: 2, B: 1, C: 3 },
  rice: { A: 2, B: 3, C: 1 },
  cotton: { A: 1, B: 2, C: 3 },
  groundnut: { A: 2, B: 1, C: 3 },
}
