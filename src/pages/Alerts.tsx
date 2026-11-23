import { BellOff, CheckCheck, Eye, RotateCcw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AlertStatusBadge, Card, Drawer, EmptyState, PageHeader, SeverityBadge, ConfirmDialog } from '../components/ui/primitives'
import { useApp, type ManagedAlert } from '../context/AppContext'
import { CROPS, CROP_IDS } from '../data/crops'
import { FIELDS } from '../data/fields'
import { useToast } from '../hooks/useToast'
import type { AlertStatus } from '../types'
import { fmtFull } from '../utils/format'

const TYPE_LABEL = { soil: 'Soil Moisture', temperature: 'Temperature', humidity: 'Humidity', condition: 'Crop Condition', pest: 'Pest Inspection' }
const SOURCE_LABEL = { 'sensor-rule': 'Threshold rule on sample data', 'condition-rule': 'Condition rule on sample data', 'demo-schedule': 'Demo schedule entry', 'demo-analysis': 'Demo pest analysis' }

export default function Alerts() {
  const { alerts, setAlertStatus, resetAlerts, log } = useApp()
  const { push } = useToast()
  const [q, setQ] = useState('')
  const [sev, setSev] = useState('all')
  const [status, setStatus] = useState('all')
  const [crop, setCrop] = useState('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [confirm, setConfirm] = useState(false)

  const filtered = useMemo(() => alerts.filter((a) => {
    const text = `${a.title} ${a.description} ${TYPE_LABEL[a.type]}`.toLowerCase()
    return (!q || text.includes(q.toLowerCase())) && (sev === 'all' || a.severity === sev) && (status === 'all' || a.status === status) && (crop === 'all' || a.crop === crop)
  }), [alerts, q, sev, status, crop])

  const counts = { active: alerts.filter((a) => a.status === 'active').length, ack: alerts.filter((a) => a.status === 'acknowledged').length, res: alerts.filter((a) => a.status === 'resolved').length }
  const open = alerts.find((a) => a.id === openId) ?? null

  const act = (a: ManagedAlert, s: AlertStatus) => {
    setAlertStatus(a.id, s)
    const verb = s === 'acknowledged' ? 'acknowledged' : s === 'resolved' ? 'resolved' : 'reopened'
    log(`Alert ${verb}: ${a.title}`, 'alert')
    push(`Alert ${verb}.`, 'success')
  }
  const filtersOn = q || sev !== 'all' || status !== 'all' || crop !== 'all'

  return (
    <div className="space-y-5">
      <PageHeader title="Alerts" subtitle="Rule-based alerts generated from the sample readings and your thresholds."
        actions={<button className="btn-secondary" onClick={() => setConfirm(true)}><RotateCcw className="h-4 w-4" />Reset demo alerts</button>} />

      <div className="grid grid-cols-3 gap-3">
        {[['Active', counts.active, 'text-danger-ink'], ['Acknowledged', counts.ack, 'text-warn-ink'], ['Resolved', counts.res, 'text-brand']].map(([l, n, c]) => (
          <div key={l as string} className="card p-3 sm:p-4"><div className="label-sm">{l}</div><div className={`text-2xl font-semibold ${c}`}>{n}</div></div>
        ))}
      </div>

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input className="input pl-9" placeholder="Search alerts" aria-label="Search alerts" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="input" aria-label="Filter by severity" value={sev} onChange={(e) => setSev(e.target.value)}>
            <option value="all">All severities</option><option value="critical">Critical</option><option value="warning">Warning</option><option value="info">Informational</option>
          </select>
          <select className="input" aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option><option value="active">Active</option><option value="acknowledged">Acknowledged</option><option value="resolved">Resolved</option>
          </select>
          <select className="input" aria-label="Filter by crop" value={crop} onChange={(e) => setCrop(e.target.value)}>
            <option value="all">All crops</option>{CROP_IDS.map((c) => <option key={c} value={c}>{CROPS[c].name}</option>)}<option value="other">Other</option>
          </select>
        </div>

        <p className="text-xs text-muted mb-2" aria-live="polite">{filtered.length} of {alerts.length} alerts</p>
        {filtered.length === 0 ? (
          <EmptyState icon={<BellOff className="h-5 w-5" />} title="No alerts match" body={filtersOn ? 'Try clearing a filter or search term.' : 'All clear.'}
            action={filtersOn ? <button className="btn-secondary" onClick={() => { setQ(''); setSev('all'); setStatus('all'); setCrop('all') }}>Clear filters</button> : undefined} />
        ) : (
          <ul className="divide-y divide-line border-t border-line">
            {filtered.map((a) => (
              <li key={a.id}>
                <button onClick={() => setOpenId(a.id)} className="w-full text-left py-3 px-1 flex flex-col gap-2 sm:flex-row sm:items-center hover:bg-page rounded-md">
                  <div className="flex flex-wrap items-center gap-2 sm:w-64 shrink-0"><SeverityBadge severity={a.severity} /><AlertStatusBadge status={a.status} /></div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium leading-snug ${a.status === 'resolved' ? 'text-muted line-through' : ''}`}>{a.title}</p>
                    <p className="text-xs text-muted mt-0.5">{TYPE_LABEL[a.type]} · {a.crop === 'other' ? 'Other crop' : CROPS[a.crop].name}{a.field ? ` · ${FIELDS[a.field].name}` : ''} · {fmtFull(a.timestamp)}</p>
                  </div>
                  <Eye className="hidden sm:block h-4 w-4 text-muted shrink-0" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Drawer open={!!open} onClose={() => setOpenId(null)} title="Alert details"
        footer={open && (
          <>
            {open.status === 'active' && <button className="btn-secondary" onClick={() => act(open, 'acknowledged')}><Eye className="h-4 w-4" />Acknowledge</button>}
            {open.status !== 'resolved' && <button className="btn-primary" onClick={() => act(open, 'resolved')}><CheckCheck className="h-4 w-4" />Resolve</button>}
            {open.status !== 'active' && <button className="btn-ghost" onClick={() => act(open, 'active')}>Reopen</button>}
          </>
        )}>
        {open && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2"><SeverityBadge severity={open.severity} /><AlertStatusBadge status={open.status} /></div>
            <h3 className="text-base font-semibold text-forest leading-snug">{open.title}</h3>
            <p>{open.description}</p>
            <dl className="grid grid-cols-2 gap-3">
              <div><dt className="label-sm">Type</dt><dd>{TYPE_LABEL[open.type]}</dd></div>
              <div><dt className="label-sm">Crop</dt><dd>{open.crop === 'other' ? 'Other' : CROPS[open.crop].name}</dd></div>
              <div><dt className="label-sm">Field</dt><dd>{open.field ? FIELDS[open.field].name : 'Not field-specific'}</dd></div>
              <div><dt className="label-sm">Timestamp</dt><dd>{fmtFull(open.timestamp)}</dd></div>
              {open.reading && <div className="col-span-2"><dt className="label-sm">Reading</dt><dd>{open.reading}</dd></div>}
              <div className="col-span-2"><dt className="label-sm">Source</dt><dd>{SOURCE_LABEL[open.source]}</dd></div>
            </dl>
            <div className="rounded-lg bg-tint p-3"><div className="label-sm">Recommended action</div><p className="mt-1">{open.recommendedAction}</p></div>
            {open.statusAt && <p className="text-xs text-muted">Status set {fmtFull(open.statusAt)}.{open.status === 'resolved' && open.source === 'sensor-rule' ? ' The rule condition may still be present in the sample data.' : ''}</p>}
            {open.source === 'sensor-rule' && <p className="text-xs text-muted">This alert follows your configured thresholds. Change them on Farm Monitoring and it updates automatically.</p>}
          </div>
        )}
      </Drawer>

      <ConfirmDialog open={confirm} title="Reset demo alerts?" body="Acknowledged and resolved alerts return to Active. Your thresholds are not changed."
        confirmLabel="Reset alerts" onCancel={() => setConfirm(false)}
        onConfirm={() => { resetAlerts(); setConfirm(false); setOpenId(null); push('Alert states reset.', 'info') }} />
    </div>
  )
}
