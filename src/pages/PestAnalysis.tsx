import { AlertTriangle, ImagePlus, Info, Loader2, ScanSearch, Trash2, UploadCloud, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react'
import { Badge, Card, EmptyState, PageHeader, type Tone } from '../components/ui/primitives'
import { useApp } from '../context/AppContext'
import { CROPS, CROP_IDS } from '../data/crops'
import { NEXT_STEPS, SCENARIOS } from '../data/pestScenarios'
import { useToast } from '../hooks/useToast'
import type { AnalysisRecord, CropId, DemoSeverity } from '../types'
import { fmtDateTime } from '../utils/format'
import { hashString } from '../utils/hash'
import { ACCEPTED, loadImage, makeThumbnail, measureImage, qualityNotes, validateFile } from '../utils/imageTools'

type Target = CropId | 'other'
const SEV_TONE: Record<DemoSeverity, Tone> = { low: 'ok', moderate: 'warn', high: 'danger' }
const STEPS = ['Validating image', 'Measuring image properties', 'Selecting a demo scenario', 'Preparing report']
const cropName = (c: Target) => (c === 'other' ? 'Other' : CROPS[c].name)

export default function PestAnalysis() {
  const { crop: appCrop, analyses, addAnalysis, removeAnalysis, clearAnalyses, log } = useApp()
  const { push } = useToast()
  const [crop, setCrop] = useState<Target>(appCrop)
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<AnalysisRecord | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => { window.clearInterval(timer.current) }, [])
  useEffect(() => () => { if (url) URL.revokeObjectURL(url) }, [url])

  const clear = useCallback(() => {
    setFile(null); setUrl(null); setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  const accept = useCallback((f: File | undefined | null) => {
    if (!f) return
    const err = validateFile(f)
    if (err) { setError(err); setFile(null); setUrl(null); push(err, 'error'); return }
    setError(null); setResult(null); setFile(f); setUrl(URL.createObjectURL(f))
  }, [push])

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDrag(false); accept(e.dataTransfer.files?.[0]) }

  const analyze = async () => {
    if (!file || !url) return
    setBusy(true); setStep(0); setResult(null)
    timer.current = window.setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 600)
    try {
      const img = await loadImage(url)
      const stats = measureImage(img)
      const thumbnail = makeThumbnail(img)
      await new Promise((r) => window.setTimeout(r, 2400))
      const list = SCENARIOS[crop]
      const sc = list[hashString(`${file.name}:${file.size}`) % list.length]
      const rec: AnalysisRecord = {
        id: `${Date.now()}`, createdAt: new Date().toISOString(), crop, fileName: file.name, fileSizeKb: Math.round(file.size / 1024),
        thumbnail, scenarioId: sc.id, observation: sc.observation, concern: sc.concern, severity: sc.severity,
        steps: NEXT_STEPS[sc.severity], stats, qualityNotes: qualityNotes(stats),
      }
      setResult(rec); setResultUrl(url); addAnalysis(rec)
      log(`Demo analysis run for ${cropName(crop)} (${file.name})`, 'analysis')
      push('Demo analysis complete.', 'success')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Analysis failed.'
      setError(msg); push(msg, 'error')
    } finally {
      window.clearInterval(timer.current); setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Crop Pest & Damage Analysis" subtitle="Explore image-based crop inspection and potential damage analysis." />

      <div className="rounded-lg border border-warn/50 bg-warn-soft px-4 py-3 text-sm text-warn-ink flex gap-3" role="note">
        <Info className="h-5 w-5 shrink-0" />
        <p><strong>Demonstration workflow.</strong> No trained model runs here and no confidence scores are produced. The example result is picked from a template list and does not describe what is in your photo. Images stay in your browser.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="1. Select crop and upload an image">
          <div className="mb-4">
            <label htmlFor="crop" className="label-sm">Crop</label>
            <select id="crop" className="input mt-1" value={crop} onChange={(e) => setCrop(e.target.value as Target)} disabled={busy}>
              {CROP_IDS.map((c) => <option key={c} value={c}>{CROPS[c].name}</option>)}
              <option value="other">Other</option>
            </select>
          </div>

          {!url ? (
            <div onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={onDrop}
              className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${drag ? 'border-brand bg-tint' : 'border-line bg-page'}`}>
              <UploadCloud className="mx-auto h-9 w-9 text-brand" />
              <p className="mt-2 font-medium">Drag and drop a crop photo here</p>
              <p className="text-xs text-muted mt-1">JPG, PNG or WebP · up to 8 MB</p>
              <button className="btn-primary mt-4" onClick={() => inputRef.current?.click()}><ImagePlus className="h-4 w-4" />Browse files</button>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-lg border border-line bg-page">
              <img src={url} alt="Preview of the selected crop" className="mx-auto max-h-72 w-auto object-contain" />
              {busy && <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none"><div className="scan-line absolute left-0 right-0 h-[3px] bg-accent/90 shadow-[0_0_12px_#65A879]" /></div>}
              <button className="absolute top-2 right-2 btn-secondary !px-2 !min-h-[36px]" onClick={clear} disabled={busy} aria-label="Remove image"><X className="h-4 w-4" /></button>
            </div>
          )}
          <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} className="sr-only" aria-label="Upload crop image" onChange={(e) => accept(e.target.files?.[0])} />

          {file && <p className="text-xs text-muted mt-2 truncate">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>}
          {error && <p className="mt-3 flex items-start gap-2 text-sm text-danger-ink" role="alert"><AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />{error}</p>}

          <button className="btn-primary w-full mt-4" disabled={!file || busy} onClick={analyze}>
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Analyzing…</> : <><ScanSearch className="h-4 w-4" />Analyze (demo)</>}
          </button>
          {busy && (
            <ol className="mt-3 space-y-1 text-sm" aria-live="polite">
              {STEPS.map((s, i) => <li key={s} className={i <= step ? 'text-ink' : 'text-muted/60'}>{i < step ? '✓' : i === step ? '…' : '·'} {s}</li>)}
            </ol>
          )}
        </Card>

        <Card title="2. Analysis report" action={result ? <Badge tone="warn">DEMO ANALYSIS — NOT AI MODEL INFERENCE</Badge> : undefined}>
          {!result ? (
            <EmptyState icon={<ScanSearch className="h-5 w-5" />} title="No analysis yet" body="Choose a crop, upload a photo and press Analyze to see an example report." />
          ) : (
            <Report r={result} img={resultUrl} />
          )}
        </Card>
      </div>

      <Card title="Recent analysis history" subtitle="Saved in this browser · last 10"
        action={analyses.length > 0 ? <button className="btn-ghost !min-h-[32px]" onClick={() => { clearAnalyses(); push('Analysis history cleared.', 'info') }}><Trash2 className="h-4 w-4" />Clear all</button> : undefined}>
        {analyses.length === 0 ? <EmptyState icon={<ImagePlus className="h-5 w-5" />} title="History is empty" body="Completed demo analyses are listed here." /> : (
          <ul className="divide-y divide-line">
            {analyses.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-3">
                <img src={a.thumbnail} alt="" className="h-14 w-14 rounded-md object-cover border border-line" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{cropName(a.crop)} · {a.fileName}</p>
                  <p className="text-xs text-muted">{fmtDateTime(a.createdAt)} · demo scenario</p>
                </div>
                <Badge tone={SEV_TONE[a.severity]}>{a.severity}</Badge>
                <button className="btn-ghost !px-2" aria-label={`Remove ${a.fileName} from history`} onClick={() => { removeAnalysis(a.id); push('Removed from history.', 'info') }}><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

function Report({ r, img }: { r: AnalysisRecord; img: string | null }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex gap-3 items-start">
        <img src={img ?? r.thumbnail} alt="Analyzed crop" className="h-24 w-24 rounded-lg object-cover border border-line" />
        <div>
          <div className="label-sm">Selected crop</div><div className="font-medium">{cropName(r.crop)}</div>
          <div className="label-sm mt-2">Demonstration severity</div><Badge tone={SEV_TONE[r.severity]}>{r.severity}</Badge>
        </div>
      </div>
      <div><div className="label-sm">Example observation</div><p>{r.observation}</p></div>
      <div><div className="label-sm">Potential concern (to verify)</div><p>{r.concern}</p></div>
      <div>
        <div className="label-sm">Suggested next steps</div>
        <ol className="list-decimal pl-5 space-y-1 mt-1">{r.steps.map((s) => <li key={s}>{s}</li>)}</ol>
      </div>
      <div className="rounded-lg border border-line bg-page p-3">
        <div className="label-sm">Measured image properties (real computation, not a diagnosis)</div>
        <p className="mt-1 text-muted">{r.stats.width}×{r.stats.height}px · brightness {r.stats.brightness}/255 · green-ish pixels {r.stats.greenShare}% · yellow/brown/red-ish pixels {r.stats.warmShare}%</p>
        <ul className="list-disc pl-5 mt-1 text-muted">{r.qualityNotes.map((n) => <li key={n}>{n}</li>)}</ul>
      </div>
      <p className="text-xs text-muted border-t border-line pt-3">Disclaimer: this is an example output from a demonstration workflow. It is not a diagnosis and does not reflect model inference or accuracy. Verify symptoms in the field and consult a qualified agricultural expert or regional guidance.</p>
    </div>
  )
}
