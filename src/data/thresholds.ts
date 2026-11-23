import type { CropId, Thresholds } from '../types'

/**
 * Illustrative default thresholds for the DEMONSTRATION only.
 * They are not agronomic recommendations: real limits depend on variety,
 * growth stage, soil type, location and weather.
 */
export const DEFAULT_THRESHOLDS: Record<CropId, Thresholds> = {
  tomato: { temperature: { min: 15, max: 32 }, humidity: { min: 50, max: 80 }, soil: { min: 40, max: 75 } },
  rice: { temperature: { min: 20, max: 34 }, humidity: { min: 60, max: 90 }, soil: { min: 65, max: 95 } },
  cotton: { temperature: { min: 21, max: 35 }, humidity: { min: 40, max: 70 }, soil: { min: 30, max: 65 } },
  groundnut: { temperature: { min: 22, max: 34 }, humidity: { min: 45, max: 75 }, soil: { min: 35, max: 65 } },
}
