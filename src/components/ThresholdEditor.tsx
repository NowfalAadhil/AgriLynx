import { RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { CROPS } from '../data/crops'
import { METRICS, THRESHOLD_METRICS } from '../data/metrics'
import { useFieldData } from '../hooks/useFieldData'
import { useToast } from '../hooks/useToast'
import type { ThresholdMetric } from '../types'
import { fmtNumber } from '../utils/format'
import { validateRange } from '../utils/threshold'
import { ThresholdBadge } from './ui/primitives'

function Row({ metric }: { metric: ThresholdMetric }) {
  const { crop, thresholds, setThreshold, log } = useApp()
  const d = useFieldData()
  const meta = METRICS[metric]
  const range = thresholds[crop][metric]
  const [min, setMin] = useState(String(range.min))
  const [max, setMax] = useState(String(range.max))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setMin(String(range.min)); setMax(String(range.max)); setError(null) }, [range.min, range.max, crop])

  const apply = (a: string, b: string) => {
    setMin(a); setMax(b)
    const next = { min: parseFloat(a), max: parseFloat(b) }
    const err = a.trim() === '' || b.trim() === '' ? 'Enter both values.' : validateRange(next, meta.bounds)
    setError(err)
    if (!err) {
      setThreshold(crop, metric, next)
    }
  }
  const onBlur = () => { if (!error) log(`${meta.label} threshold for ${CROPS[crop].name} set to ${min}–${max}${meta.unit}`, 'threshold') }
  const e = d.evals[metric]
  const id = `th-${metric}`

  return (
    <div className="rounded-lg border border-line p-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-medium">{meta.label}</span>
        <ThresholdBadge {...e} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${id}-min`} className="label-sm">Min ({meta.unit})</label>
          <input id={`${id}-min`} className="input mt-1" type="number" inputMode="decimal" step={meta.step} value={min} onChange={(ev) => apply(ev.target.value, max)} onBlur={onBlur} aria-invalid={!!error} />
        </div>
        <div>
          <label htmlFor={`${id}-max`} className="label-sm">Max ({meta.unit})</label>
          <input id={`${id}-max`} className="input mt-1" type="number" inputMode="decimal" step={meta.step} value={max} onChange={(ev) => apply(min, ev.target.value)} onBlur={onBlur} aria-invalid={!!error} />
        </div>
      </div>
      {error ? <p className="text-xs text-danger-ink mt-2" role="alert">{error}</p>
        : <p className="text-xs text-muted mt-2">Current {fmtNumber(d.current[metric], meta.decimals)}{meta.unit}. Status is re-evaluated as you edit.</p>}
    </div>
  )
}

export function ThresholdEditor() {
  const { crop, resetThresholds, log } = useApp()
  const { push } = useToast()
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">Thresholds are saved per crop ({CROPS[crop].name}). Defaults are illustrative only; real limits depend on variety, growth stage, soil type, location and conditions.</p>
      {THRESHOLD_METRICS.map((m) => <Row key={m} metric={m} />)}
      <button className="btn-secondary w-full" onClick={() => { resetThresholds(crop); log(`Thresholds for ${CROPS[crop].name} reset to defaults`, 'threshold'); push('Thresholds reset to illustrative defaults.', 'info') }}>
        <RotateCcw className="h-4 w-4" /> Reset to defaults
      </button>
    </div>
  )
}
