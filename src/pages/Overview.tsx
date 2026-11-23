import { Activity, ArrowRight, CheckCircle2, Droplets, Gauge, Thermometer, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LogoMark } from '../components/brand/Logo'
import { EnvironmentChart } from '../components/charts/EnvironmentChart'
import { CropIllustration } from '../components/crops/CropIllustration'
import { KpiCard } from '../components/ui/KpiCard'
import { CropSelector, FieldSelector } from '../components/ui/Selectors'
import { Badge, Card, DemoBadge, EmptyState, PageHeader, SeverityBadge, ThresholdBadge } from '../components/ui/primitives'
import { useApp } from '../context/AppContext'
import { CROPS } from '../data/crops'
import { FARM_NAME, FIELDS, STAGE_INDEX } from '../data/fields'
import { METRICS } from '../data/metrics'
import { SAMPLE_NOW } from '../data/sensors'
import { useFieldData } from '../hooks/useFieldData'
import { fmtDateTime, fmtFull, fmtNumber, relativeTo } from '../utils/format'

export default function Overview() {
  const { crop, field, alerts, activity, thresholds } = useApp()
  const rangeText = (m: 'temperature' | 'humidity' | 'soil') => `${thresholds[crop][m].min}–${thresholds[crop][m].max}${METRICS[m].unit}`
  const d = useFieldData()
  const c = CROPS[crop]
  const f = FIELDS[field]

  const mine = alerts.filter((a) => a.crop === crop && (a.field === field || a.field === null) && a.status === 'active')
  const others = alerts.filter((a) => a.status === 'active').length - mine.length
  const worst = alerts.filter((a) => a.crop === crop && a.field === field && a.status !== 'resolved').some((a) => a.severity === 'critical')
  const statusLabel = worst ? 'Attention needed' : mine.length ? 'Monitoring · items to review' : 'Monitoring · all within range'

  const feed = [
    ...alerts.filter((a) => a.crop === crop && (a.field === field || a.field === null) && a.source !== 'demo-analysis')
      .map((a) => ({ id: a.id, at: new Date(a.timestamp).getTime(), text: `${a.title} (rule-based)` })),
    ...activity.map((a) => ({ id: a.id, at: new Date(a.at).getTime(), text: a.text })),
  ].sort((a, b) => b.at - a.at).slice(0, 6)

  const cond = d.condition

  return (
    <div className="space-y-5">
      <PageHeader title="Good morning, Farm Manager" subtitle="Your agricultural monitoring overview." actions={<DemoBadge />} />

      <div className="card p-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div><div className="label-sm">Farm / field</div><div className="font-medium">{FARM_NAME} · {f.name}</div></div>
          <div><div className="label-sm">Crop</div><div className="font-medium">{c.name}</div></div>
          <div><div className="label-sm">Monitoring status</div><div className="font-medium flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${worst ? 'bg-danger' : mine.length ? 'bg-warn' : 'bg-accent'}`} />{statusLabel}</div></div>
          <div><div className="label-sm">Sample data timestamp</div><div className="font-medium">{fmtFull(SAMPLE_NOW)}</div></div>
        </div>
        <div className="flex flex-wrap gap-2"><CropSelector /><FieldSelector /></div>
      </div>

      <div className="card p-4 sm:p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-gradient-to-r from-tint to-white">
        <div className="flex gap-4 items-start">
          <LogoMark size={44} />
          <div>
            <p className="font-semibold text-forest">AgriLynx combines field monitoring, crop image inspection and alerts in one platform.</p>
            <p className="text-sm text-muted mt-1">This is a working prototype: threshold rules, alerts and checklists are real logic. Sensor readings are simulated and the pest analysis is a demonstration.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Badge tone="ok">Implemented: UI &amp; rules</Badge><Badge tone="warn">Simulated: sensors</Badge><Badge tone="neutral">Planned: ESP32, ML</Badge>
          <Link to="/architecture" className="btn-secondary !min-h-[28px] !px-2.5 text-xs">See status <ArrowRight className="h-3 w-3" /></Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Thermometer} label="Temperature" value={fmtNumber(d.current.temperature, 1)} unit="°C" status={<ThresholdBadge {...d.evals.temperature} />}
          description={`Configured range ${rangeText('temperature')}`} trend={{ delta: d.trend.temperature, unit: '°C', hours: 6 }} />
        <KpiCard icon={Droplets} label="Air Humidity" value={fmtNumber(d.current.humidity)} unit="%" status={<ThresholdBadge {...d.evals.humidity} />}
          description={`Configured range ${rangeText('humidity')}`} trend={{ delta: d.trend.humidity, unit: '%', hours: 6 }} />
        <KpiCard icon={Waves} label="Soil Moisture" value={fmtNumber(d.current.soil)} unit="%" status={<ThresholdBadge {...d.evals.soil} />}
          description={`Configured range ${rangeText('soil')}`} trend={{ delta: d.trend.soil, unit: '%', hours: 6 }} />
        <KpiCard icon={Gauge} label="Crop Condition" value={cond.label}
          status={<Badge tone={cond.label === 'Stable' ? 'ok' : cond.label === 'Watch' ? 'warn' : 'danger'}>{cond.score}/100</Badge>}
          description="Indicative, rule-based score from the three readings above; not a measurement of plant health." />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Environmental Monitoring" subtitle={`${c.name} · ${f.name} · sample data`} action={<DemoBadge>SIMULATED</DemoBadge>}>
          <EnvironmentChart crop={crop} field={field} />
        </Card>

        <Card title="Attention Required" subtitle="Active alerts for this crop and field" action={<Link to="/alerts" className="text-xs font-medium text-brand hover:underline">View all</Link>}>
          {mine.length === 0 ? (
            <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} title="Nothing needs attention" body={`No active alerts for ${c.name} in ${f.name}.`} />
          ) : (
            <ul className="space-y-3">
              {mine.slice(0, 4).map((a) => (
                <li key={a.id} className="rounded-lg border border-line p-3">
                  <div className="flex items-center justify-between gap-2 mb-1"><SeverityBadge severity={a.severity} /><span className="text-xs text-muted">{fmtDateTime(a.timestamp)}</span></div>
                  <p className="text-sm font-medium leading-snug">{a.title.split(' — ')[0]}</p>
                  <p className="text-xs text-muted mt-1">{a.description}</p>
                </li>
              ))}
            </ul>
          )}
          {others > 0 && <p className="text-xs text-muted mt-3">{others} more active alert{others > 1 ? 's' : ''} in other fields or crops.</p>}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Field Overview" subtitle="Sample field profile">
          <div className="grid gap-4 sm:grid-cols-5">
            <div className="sm:col-span-2 overflow-hidden rounded-lg border border-line aspect-[5/3] sm:aspect-auto">
              <CropIllustration crop={crop} className="h-full w-full" />
            </div>
            <dl className="sm:col-span-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm content-start">
              <div><dt className="label-sm">Crop</dt><dd className="font-medium">{c.name}</dd></div>
              <div><dt className="label-sm">Growth stage</dt><dd className="font-medium">{c.stages[STAGE_INDEX[crop][field]]}</dd></div>
              <div><dt className="label-sm">Farm area</dt><dd className="font-medium">{f.areaHa} ha</dd></div>
              <div><dt className="label-sm">Field status</dt><dd className="font-medium">{cond.label}</dd></div>
              <div className="col-span-2"><dt className="label-sm">Monitoring summary</dt>
                <dd className="text-muted">Temperature {fmtNumber(d.current.temperature, 1)}°C, humidity {d.current.humidity}%, soil moisture {d.current.soil}% (sample values). Illustration, not a photograph.</dd></div>
            </dl>
          </div>
        </Card>

        <Card title="Recent Activity" subtitle="Rule-based events and your actions in this browser">
          {feed.length === 0 ? <EmptyState icon={<Activity className="h-5 w-5" />} title="No activity yet" body="Alert rules and your actions will appear here." /> : (
            <ol className="space-y-3">
              {feed.map((e) => (
                <li key={e.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
                  <div className="min-w-0"><p className="leading-snug">{e.text}</p><p className="text-xs text-muted">{e.at <= SAMPLE_NOW ? `${relativeTo(e.at, SAMPLE_NOW)} (sample timeline)` : fmtDateTime(e.at)}</p></div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </div>
  )
}
