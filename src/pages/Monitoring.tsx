import { Cpu, Droplets, Sun, Thermometer, Waves, type LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MetricChart } from '../components/charts/MetricChart'
import { rangeData, type RangeKey } from '../components/charts/chartData'
import { ThresholdEditor } from '../components/ThresholdEditor'
import { CropSelector, FieldSelector } from '../components/ui/Selectors'
import { Badge, Card, PageHeader, Segmented, ThresholdBadge } from '../components/ui/primitives'
import { useApp } from '../context/AppContext'
import { CROPS } from '../data/crops'
import { FIELDS } from '../data/fields'
import { METRICS } from '../data/metrics'
import { useFieldData } from '../hooks/useFieldData'
import type { MetricId } from '../types'
import { fmtNumber } from '../utils/format'

const ICONS: Record<MetricId, LucideIcon> = { temperature: Thermometer, humidity: Droplets, soil: Waves, light: Sun }
const ORDER: MetricId[] = ['temperature', 'humidity', 'soil', 'light']

export default function Monitoring() {
  const { crop, field, thresholds } = useApp()
  const d = useFieldData()
  const [range, setRange] = useState<RangeKey>('24h')
  const data = useMemo(() => rangeData(crop, field, range), [crop, field, range])

  return (
    <div className="space-y-5">
      <PageHeader title="Farm Monitoring" subtitle={`${CROPS[crop].name} · ${FIELDS[field].name} — environmental parameters, thresholds and history.`}
        actions={<Segmented label="Time range" value={range} onChange={setRange} options={[{ value: '24h', label: '24 hours' }, { value: '7d', label: '7 days' }]} />} />

      <div className="rounded-lg border border-warn/50 bg-warn-soft px-4 py-2.5 text-sm font-semibold text-warn-ink" role="note">
        SIMULATED DATA — NOT CONNECTED TO PHYSICAL SENSORS
      </div>

      <div className="card p-4 flex flex-wrap gap-2"><CropSelector /><FieldSelector /></div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 grid gap-4 md:grid-cols-2 content-start">
          {ORDER.map((m) => {
            const meta = METRICS[m]
            const Icon = ICONS[m]
            const vals = data.map((x) => x[m])
            const th = m === 'light' ? undefined : thresholds[crop][m]
            const e = m === 'light' ? null : d.evals[m]
            return (
              <Card key={m} className="!p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-tint text-brand grid place-items-center"><Icon className="h-4 w-4" /></span><span className="font-medium text-sm">{meta.label}</span></div>
                  {e ? <ThresholdBadge {...e} /> : <Badge>Optional · no alerts</Badge>}
                </div>
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="text-3xl font-semibold text-forest leading-none">{fmtNumber(d.current[m], meta.decimals)}</span>
                  <span className="text-sm text-muted pb-0.5">{meta.unit}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted">
                  <span>Min {fmtNumber(Math.min(...vals), meta.decimals)}{meta.unit === 'lux' ? '' : meta.unit}</span>
                  <span>Max {fmtNumber(Math.max(...vals), meta.decimals)}{meta.unit === 'lux' ? '' : meta.unit}</span>
                  <span>{th ? `Threshold ${th.min}–${th.max}${meta.unit}` : 'No threshold set'}</span>
                </div>
                <div className="mt-3">
                  <MetricChart crop={crop} field={field} metric={m} range={range} threshold={th} />
                </div>
                {th && <p className="text-[11px] text-muted mt-1">Shaded band and dashed lines show the configured range.</p>}
              </Card>
            )
          })}
        </div>

        <div className="space-y-4">
          <Card title="Threshold Settings" subtitle="Adjust limits and watch status and alerts update"><ThresholdEditor /></Card>
          <Card title="Hardware Integration" action={<Badge tone="neutral">Planned</Badge>}>
            <div className="flex gap-3">
              <span className="h-9 w-9 shrink-0 rounded-lg bg-tint text-brand grid place-items-center"><Cpu className="h-5 w-5" /></span>
              <div className="text-sm space-y-2">
                <p>The proposed design reads soil moisture, temperature, humidity and optional light sensors with an ESP32 and sends the data over Wi-Fi.</p>
                <p className="text-muted">No hardware is connected here. Every value on this page is deterministic sample data.</p>
                <Link to="/architecture" className="text-brand font-medium hover:underline">View system architecture →</Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
