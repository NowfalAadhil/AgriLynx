import { CheckCircle2, ClipboardCheck, Droplets, Leaf, Lightbulb, RotateCcw, ShieldAlert, Thermometer } from 'lucide-react'
import { CropIllustration } from '../components/crops/CropIllustration'
import { CropSelector, FieldSelector } from '../components/ui/Selectors'
import { Badge, Card, PageHeader } from '../components/ui/primitives'
import { useApp } from '../context/AppContext'
import { CHECKLIST_ITEMS } from '../data/checklist'
import { CROPS } from '../data/crops'
import { FIELDS, STAGE_INDEX } from '../data/fields'
import { useToast } from '../hooks/useToast'

function Bullets({ items }: { items: string[] }) {
  return <ul className="space-y-2 text-sm">{items.map((t) => <li key={t} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />{t}</li>)}</ul>
}

export default function CropIntelligence() {
  const { crop, field, checked, toggleChecked, resetChecklist, log } = useApp()
  const { push } = useToast()
  const c = CROPS[crop]
  const stageIdx = STAGE_INDEX[crop][field]
  const done = CHECKLIST_ITEMS.filter((i) => checked(crop, field, i.id)).length

  return (
    <div className="space-y-5">
      <PageHeader title="Crop Intelligence" subtitle="General crop information and a monitoring checklist for each crop." />
      <div className="card p-4 flex flex-wrap gap-2"><CropSelector /><FieldSelector /></div>

      <div className="rounded-lg border border-info/30 bg-info-soft px-4 py-3 text-sm text-info-ink" role="note">
        This is general educational information, not a recommendation. Crop requirements depend on variety, growth stage, soil type, location and environmental conditions. Check regional agricultural guidance.
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 !p-0 overflow-hidden">
          <CropIllustration crop={crop} className="w-full aspect-[5/3]" />
          <div className="p-5">
            <h2 className="text-xl font-semibold text-forest">{c.name}</h2>
            <p className="text-xs italic text-muted">{c.scientific}</p>
            <p className="text-sm mt-3">{c.summary}</p>
            <div className="mt-4">
              <div className="label-sm mb-2">Growth stages · {FIELDS[field].name} (sample)</div>
              <ol className="flex flex-wrap gap-1.5">
                {c.stages.map((s, i) => <li key={s}><Badge tone={i === stageIdx ? 'ok' : 'neutral'}>{i === stageIdx ? '● ' : ''}{s}</Badge></li>)}
              </ol>
            </div>
            <p className="text-[11px] text-muted mt-3">Illustration, not a photograph.</p>
          </div>
        </Card>

        <div className="lg:col-span-2 grid gap-4 md:grid-cols-2 content-start">
          <Card title="Environmental considerations" action={<Thermometer className="h-4 w-4 text-brand" />}><Bullets items={c.environment} /></Card>
          <Card title="Soil moisture considerations" action={<Droplets className="h-4 w-4 text-brand" />}><Bullets items={c.soilMoisture} /></Card>
          <Card title="Common stress factors" action={<ShieldAlert className="h-4 w-4 text-brand" />}><Bullets items={c.stress} /></Card>
          <Card title="General insights" action={<Lightbulb className="h-4 w-4 text-brand" />}><Bullets items={c.insights} /></Card>
          <Card title="What to monitor" action={<Leaf className="h-4 w-4 text-brand" />} className="md:col-span-2">
            <div className="flex flex-wrap gap-2">{c.monitoring.map((m) => <Badge key={m} tone="ok">{m}</Badge>)}</div>
          </Card>
        </div>
      </div>

      <Card title="Crop monitoring checklist" subtitle={`${c.name} · ${FIELDS[field].name} · saved in this browser`}
        action={<div className="flex items-center gap-2"><Badge tone={done === CHECKLIST_ITEMS.length ? 'ok' : 'neutral'}>{done}/{CHECKLIST_ITEMS.length} done</Badge>
          <button className="btn-ghost !min-h-[32px]" onClick={() => { resetChecklist(crop, field); push('Checklist cleared.', 'info') }}><RotateCcw className="h-4 w-4" />Clear</button></div>}>
        <ul className="grid gap-2 md:grid-cols-2">
          {CHECKLIST_ITEMS.map((i) => {
            const on = checked(crop, field, i.id)
            return (
              <li key={i.id}>
                <label className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer min-h-[56px] ${on ? 'border-brand/30 bg-tint' : 'border-line hover:bg-page'}`}>
                  <input type="checkbox" className="mt-1 h-5 w-5 accent-[#2D6A4F]" checked={on}
                    onChange={() => { toggleChecked(crop, field, i.id); if (!on) log(`${i.label}: done (${c.name}, ${FIELDS[field].name})`, 'checklist') }} />
                  <span><span className={`block text-sm font-medium ${on ? 'line-through text-muted' : ''}`}>{i.label}</span><span className="block text-xs text-muted">{i.hint}</span></span>
                  {on && <CheckCircle2 className="ml-auto h-4 w-4 text-brand shrink-0" aria-hidden />}
                </label>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-xs text-muted flex items-center gap-1.5"><ClipboardCheck className="h-3.5 w-3.5" />Checklist progress is stored per crop and field in your browser.</p>
      </Card>
    </div>
  )
}
