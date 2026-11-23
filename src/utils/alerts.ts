import { CROP_IDS } from '../data/crops'
import { FIELD_IDS } from '../data/fields'
import { METRICS, THRESHOLD_METRICS } from '../data/metrics'
import { SAMPLE_NOW, getSeries, latest } from '../data/sensors'
import { CROPS } from '../data/crops'
import { FIELDS } from '../data/fields'
import type {
  AnalysisRecord, CropId, FarmAlert, FieldId, Severity, ThresholdMetric, Thresholds,
} from '../types'
import { conditionFrom, evaluate } from './threshold'
import { fmtNumber } from './format'

export const SEVERITY_RANK: Record<Severity, number> = { critical: 0, warning: 1, info: 2 }

const ACTIONS: Record<ThresholdMetric, { low: string; high: string }> = {
  soil: {
    low: 'Check actual soil moisture at several points in the field and review the irrigation schedule against crop stage and soil type.',
    high: 'Check drainage and hold further irrigation until soil conditions are verified; waterlogging can stress roots.',
  },
  temperature: {
    low: 'Inspect plants for cold-stress symptoms and review local forecasts.',
    high: 'Inspect plants for heat-stress symptoms (wilting, leaf scorch, flower drop) and review irrigation timing.',
  },
  humidity: {
    low: 'Low humidity can increase water loss; verify soil moisture and watch for wilting.',
    high: 'Prolonged high humidity can favour foliar diseases; inspect leaves and improve airflow where possible.',
  },
}
const WATCH_ACTION = 'The reading is approaching a configured limit. Keep monitoring and verify in the field.'
const ALERT_TYPE = { soil: 'soil', temperature: 'temperature', humidity: 'humidity' } as const

/** Start time of the latest continuous run in which the metric had the same status. */
function runStart(crop: CropId, field: FieldId, metric: ThresholdMetric, th: Thresholds): number {
  const s = getSeries(crop, field)
  const status = evaluate(s[s.length - 1][metric], th[metric]).status
  let i = s.length - 1
  while (i > 0 && evaluate(s[i - 1][metric], th[metric]).status === status) i--
  return s[i].t
}

export function generateSensorAlerts(thresholds: Record<CropId, Thresholds>): FarmAlert[] {
  const out: FarmAlert[] = []
  for (const crop of CROP_IDS) {
    for (const field of FIELD_IDS) {
      const th = thresholds[crop]
      const cur = latest(crop, field)
      for (const m of THRESHOLD_METRICS) {
        const meta = METRICS[m]
        const e = evaluate(cur[m], th[m])
        if (e.status === 'normal' || !e.severity) continue
        const range = `${th[m].min}–${th[m].max} ${meta.unit}`
        const val = `${fmtNumber(cur[m], meta.decimals)}${meta.unit}`
        const cname = CROPS[crop].name
        const fname = FIELDS[field].name
        let title: string
        let description: string
        let action: string
        if (e.status === 'watch') {
          title = `${meta.label} approaching limit`
          description = `${meta.label} is ${val}, close to the configured range of ${range}.`
          action = WATCH_ACTION
        } else {
          const dir = e.status
          title = m === 'soil' && dir === 'low' ? 'Low soil moisture'
            : m === 'temperature' && dir === 'high' ? 'High temperature warning'
            : m === 'humidity' && dir === 'high' ? 'High humidity warning'
            : `${dir === 'low' ? 'Low' : 'High'} ${meta.label.toLowerCase()}`
          description = `${meta.label} is ${val}, ${dir === 'low' ? 'below' : 'above'} the configured range of ${range}.`
          action = ACTIONS[m][dir]
        }
        out.push({
          id: `sensor-${crop}-${field}-${m}-${e.status}`,
          type: ALERT_TYPE[m],
          severity: e.severity,
          title: `${title} — ${cname}, ${fname}`,
          description,
          crop,
          field,
          timestamp: new Date(runStart(crop, field, m, th)).toISOString(),
          recommendedAction: action,
          source: 'sensor-rule',
          reading: `${val} (range ${range})`,
        })
      }
      const values = { temperature: cur.temperature, humidity: cur.humidity, soil: cur.soil }
      const c = conditionFrom(values, th)
      if (c.label !== 'Stable') {
        out.push({
          id: `condition-${crop}-${field}-${c.label}`,
          type: 'condition',
          severity: c.label === 'Stressed' ? 'warning' : 'info',
          title: `Crop condition: ${c.label} — ${CROPS[crop].name}, ${FIELDS[field].name}`,
          description: `Several readings are outside or near their configured ranges (indicative score ${c.score}/100, derived from threshold rules only).`,
          crop,
          field,
          timestamp: new Date(SAMPLE_NOW).toISOString(),
          recommendedAction: 'Walk the field and visually inspect the crop. The score is only a rule-based indicator, not a measurement of plant health.',
          source: 'condition-rule',
          reading: `Indicative score ${c.score}/100`,
        })
      }
    }
  }
  return out
}

/** Fixed advisory entries (clearly demo). */
export const SEEDED_ALERTS: FarmAlert[] = [
  {
    id: 'demo-schedule-tomato-A', type: 'pest', severity: 'info',
    title: 'Weekly pest scouting due — Tomato, Field A',
    description: 'Demo schedule entry: weekly visual scouting for pest symptoms is due.',
    crop: 'tomato', field: 'A', timestamp: new Date(SAMPLE_NOW - 20 * 3600000).toISOString(),
    recommendedAction: 'Inspect plants in several places, including the underside of leaves, and log what you see.',
    source: 'demo-schedule',
  },
  {
    id: 'demo-schedule-rice-B', type: 'pest', severity: 'info',
    title: 'Scouting window — Rice, Field B',
    description: 'Demo schedule entry: scouting is useful after warm, humid spells.',
    crop: 'rice', field: 'B', timestamp: new Date(SAMPLE_NOW - 44 * 3600000).toISOString(),
    recommendedAction: 'Inspect leaves and tillers for lesions or insect activity and capture photos of anything unusual.',
    source: 'demo-schedule',
  },
]

export function analysisAlerts(analyses: AnalysisRecord[]): FarmAlert[] {
  return analyses
    .filter((a) => a.severity !== 'low')
    .map((a) => ({
      id: `analysis-${a.id}`,
      type: 'pest' as const,
      severity: (a.severity === 'high' ? 'warning' : 'info') as Severity,
      title: `Pest inspection follow-up — ${a.crop === 'other' ? 'Other crop' : CROPS[a.crop].name}`,
      description: `A demo analysis of "${a.fileName}" returned an example "${a.severity}" scenario. It is not a diagnosis.`,
      crop: a.crop,
      field: null,
      timestamp: a.createdAt,
      recommendedAction: a.steps[0],
      source: 'demo-analysis' as const,
    }))
}
