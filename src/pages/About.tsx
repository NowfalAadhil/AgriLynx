import { Check, Circle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/brand/Logo'
import { Badge, Card, PageHeader } from '../components/ui/primitives'
import { FEATURE_STATUS, ROADMAP } from '../data/architecture'

const OBJECTIVES = [
  'Improve agricultural monitoring.', 'Make environmental data easier to understand.', 'Explore crop image analysis.',
  'Support early crop inspection.', 'Provide understandable warnings.', 'Establish a foundation for IoT integration.',
]
const FEATURES = [
  ['Overview dashboard', 'KPIs, environmental chart, field overview and attention list.'],
  ['Farm Monitoring', 'Per-parameter history with configurable thresholds.'],
  ['Crop Intelligence', 'General crop information and a persistent checklist.'],
  ['Pest Analysis', 'Image upload, validation and a clearly labelled demo report.'],
  ['Alerts', 'Search, filter, acknowledge and resolve rule-based alerts.'],
  ['System Architecture', 'Layers from field to user with honest status labels.'],
]
const TECH = ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router', 'Recharts', 'Lucide icons', 'LocalStorage']
const LIMITS = [
  'Sensor values are deterministic sample data. No physical sensors or ESP32 are connected.',
  'Image analysis is a demonstration: no trained model, no accuracy or confidence is claimed.',
  'Default thresholds are illustrative and not agronomic recommendations.',
  'Data is stored only in your browser; there is no backend, account or cloud sync.',
  'The project has not been validated in the field.',
]

export default function About() {
  return (
    <div className="space-y-5">
      <PageHeader title="About AgriLynx" subtitle="Smart Agriculture / IoT / Crop Intelligence" />

      <div className="card p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center bg-gradient-to-r from-tint to-white">
        <Logo tone="dark" size={56} />
        <p className="text-sm sm:max-w-xl sm:ml-auto">AgriLynx is a prototype that explores how environmental monitoring, IoT-based data, crop image inspection and risk alerts could come together in one accessible platform.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Problem statement"><p className="text-sm">Farmers may face difficulty monitoring environmental conditions, identifying potential crop stress, and obtaining timely insights for field management.</p></Card>
        <Card title="Proposed solution"><p className="text-sm">AgriLynx aims to combine environmental monitoring, IoT-based data acquisition, crop image analysis, and risk alerts into a unified platform.</p></Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Objectives"><ul className="space-y-2 text-sm">{OBJECTIVES.map((o) => <li key={o} className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-brand shrink-0" />{o}</li>)}</ul></Card>
        <Card title="Core features">
          <ul className="space-y-2 text-sm">{FEATURES.map(([t, d]) => <li key={t}><span className="font-medium">{t}.</span> <span className="text-muted">{d}</span></li>)}</ul>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Technology"><div className="flex flex-wrap gap-2">{TECH.map((t) => <Badge key={t} tone="ok">{t}</Badge>)}</div>
          <p className="text-sm text-muted mt-3">Frontend only, no paid APIs or keys. Deployable as a static site. See <Link to="/architecture" className="text-brand font-medium hover:underline">System Architecture</Link> for the proposed hardware path.</p></Card>
        <Card title="Project status" action={<Badge tone="warn">Prototype</Badge>}>
          <ul className="space-y-2 text-sm">{FEATURE_STATUS.map((f) => <li key={f.name} className="flex gap-2 items-start"><Badge tone={f.status === 'Implemented' ? 'ok' : f.status === 'Simulated' ? 'warn' : 'info'}>{f.status}</Badge><span>{f.name}</span></li>)}</ul>
        </Card>
      </div>

      <Card title="Limitations"><ul className="space-y-2 text-sm">{LIMITS.map((l) => <li key={l} className="flex gap-2"><Circle className="h-2 w-2 mt-2 fill-warn text-warn shrink-0" />{l}</li>)}</ul></Card>

      <Card title="Future scope" subtitle="Planned directions only. None of these are implemented yet.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAP.map((r) => (
            <li key={r.title} className="rounded-lg border border-dashed border-line p-3">
              <div className="flex items-center justify-between gap-2"><p className="text-sm font-medium">{r.title}</p><Badge tone="info">Planned</Badge></div>
              <p className="text-xs text-muted mt-1">{r.detail}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
