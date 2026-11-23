import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { THRESHOLD_METRICS } from '../data/metrics'
import { getSeries, latest } from '../data/sensors'
import type { CropId, Evaluation, FieldId, Reading, ThresholdMetric } from '../types'
import { conditionFrom, evaluate, type ConditionResult } from '../utils/threshold'

export interface FieldData {
  current: Reading
  evals: Record<ThresholdMetric, Evaluation>
  condition: ConditionResult
  trend: Record<ThresholdMetric | 'light', number>
}

/** Current reading, threshold evaluations and condition for a crop/field: one source of truth for every page. */
export function useFieldData(crop?: CropId, field?: FieldId): FieldData {
  const app = useApp()
  const c = crop ?? app.crop
  const f = field ?? app.field
  const th = app.thresholds[c]
  return useMemo(() => {
    const current = latest(c, f)
    const series = getSeries(c, f)
    const ago = series[series.length - 7]
    const evals = Object.fromEntries(THRESHOLD_METRICS.map((m) => [m, evaluate(current[m], th[m])])) as Record<ThresholdMetric, Evaluation>
    const condition = conditionFrom({ temperature: current.temperature, humidity: current.humidity, soil: current.soil }, th)
    const trend = { temperature: current.temperature - ago.temperature, humidity: current.humidity - ago.humidity, soil: current.soil - ago.soil, light: current.light - ago.light }
    return { current, evals, condition, trend }
  }, [c, f, th])
}
