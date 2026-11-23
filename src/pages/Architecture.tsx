import { ArrowDown, Cpu, Leaf, LayoutDashboard, Radio, Sprout, type LucideIcon } from 'lucide-react'
import { Badge, Card, PageHeader, type Tone } from '../components/ui/primitives'
import { ARCH_CARDS, FEATURE_STATUS, LAYERS, type ImplStatus } from '../data/architecture'

export const STATUS_TONE: Record<ImplStatus, Tone> = { Concept: 'neutral', Prototype: 'ok', Demonstration: 'warn', Planned: 'info' }
const ICON: Record<string, LucideIcon> = { field: Sprout, sensors: Radio, iot: Cpu, app: Leaf, ui: LayoutDashboard }

export default function Architecture() {
  return (
    <div className="space-y-5">
      <PageHeader title="System Architecture" subtitle="Understanding the connection between field monitoring and digital agricultural intelligence." />

      <Card title="Data flow" subtitle="From the field to the user. Status badges show what exists today.">
        <ol className="max-w-3xl mx-auto">
          {LAYERS.map((l, i) => {
            const Icon = ICON[l.id]
            return (
              <li key={l.id}>
                <div className={`rounded-lg border p-4 ${l.status === 'Prototype' ? 'border-brand/40 bg-tint' : 'border-line bg-white'}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="h-10 w-10 rounded-lg bg-forest text-white grid place-items-center shrink-0"><Icon className="h-5 w-5" /></span>
                    <h3 className="font-semibold text-forest">{l.title}</h3>
                    <span className="ml-auto"><Badge tone={STATUS_TONE[l.status]}>{l.status}</Badge></span>
                  </div>
                  <ul className="flex flex-wrap gap-1.5 mt-3">{l.items.map((it) => <li key={it} className="rounded-md border border-line bg-white px-2 py-1 text-xs">{it}</li>)}</ul>
                  <p className="text-xs text-muted mt-3">{l.note}</p>
                </div>
                {i < LAYERS.length - 1 && <div className="flex justify-center py-1.5 text-accent" aria-hidden><ArrowDown className="h-6 w-6" /></div>}
              </li>
            )
          })}
        </ol>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-muted">
          <span>Status key:</span>{(['Concept', 'Prototype', 'Demonstration', 'Planned'] as ImplStatus[]).map((s) => <Badge key={s} tone={STATUS_TONE[s]}>{s}</Badge>)}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ARCH_CARDS.map((c) => (
          <Card key={c.title} title={c.title} action={<Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>}><p className="text-sm">{c.body}</p></Card>
        ))}
      </div>

      <Card title="What is real, simulated or planned" subtitle="Be clear about what this prototype does today.">
        <ul className="divide-y divide-line">
          {FEATURE_STATUS.map((f) => (
            <li key={f.name} className="py-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <div className="sm:w-28 shrink-0"><Badge tone={f.status === 'Implemented' ? 'ok' : f.status === 'Simulated' ? 'warn' : 'info'}>{f.status}</Badge></div>
              <div className="flex-1"><p className="text-sm font-medium">{f.name}</p><p className="text-xs text-muted">{f.detail}</p></div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
