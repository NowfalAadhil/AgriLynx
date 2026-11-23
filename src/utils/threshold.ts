import type { ConditionLabel, Evaluation, Range, ThresholdMetric, Thresholds } from '../types'

/** Fraction of the configured range (at each end) treated as the "approaching limit" zone. */
export const WATCH_MARGIN = 0.1
/** A violation larger than this fraction of the range width is rated critical. */
export const CRITICAL_DEVIATION = 0.15

export function evaluate(value: number, range: Range): Evaluation {
  const width = Math.max(range.max - range.min, 0.0001)
  const margin = width * WATCH_MARGIN
  if (value < range.min) {
    const deviation = (range.min - value) / width
    return { status: 'low', severity: deviation >= CRITICAL_DEVIATION ? 'critical' : 'warning', deviation }
  }
  if (value > range.max) {
    const deviation = (value - range.max) / width
    return { status: 'high', severity: deviation >= CRITICAL_DEVIATION ? 'critical' : 'warning', deviation }
  }
  if (value < range.min + margin || value > range.max - margin) {
    return { status: 'watch', severity: 'info', deviation: 0 }
  }
  return { status: 'normal', severity: null, deviation: 0 }
}

export interface ConditionResult { score: number; label: ConditionLabel }

/**
 * Indicative crop-condition score derived ONLY from threshold rules.
 * It is not a measurement of plant health.
 */
export function conditionFrom(
  values: Record<ThresholdMetric, number>,
  thresholds: Thresholds,
): ConditionResult {
  let score = 100
  ;(Object.keys(thresholds) as ThresholdMetric[]).forEach((m) => {
    const e = evaluate(values[m], thresholds[m])
    if (e.severity === 'critical') score -= 30
    else if (e.severity === 'warning') score -= 18
    else if (e.severity === 'info') score -= 6
  })
  const label: ConditionLabel = score >= 85 ? 'Stable' : score >= 60 ? 'Watch' : 'Stressed'
  return { score, label }
}

export function validateRange(r: Range, bounds: Range): string | null {
  if (!Number.isFinite(r.min) || !Number.isFinite(r.max)) return 'Enter valid numbers.'
  if (r.min >= r.max) return 'Minimum must be lower than maximum.'
  if (r.min < bounds.min || r.max > bounds.max) return `Allowed range is ${bounds.min}–${bounds.max}.`
  return null
}
