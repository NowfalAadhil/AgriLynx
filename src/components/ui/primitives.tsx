import { AlertTriangle, CircleCheck, Info, OctagonAlert, X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import type { AlertStatus, Severity, ThresholdStatus } from '../../types'

export type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'neutral'

const TONE: Record<Tone, string> = {
  ok: 'bg-tint text-brand border-brand/20',
  warn: 'bg-warn-soft text-warn-ink border-warn/40',
  danger: 'bg-danger-soft text-danger-ink border-danger/30',
  info: 'bg-info-soft text-info-ink border-info/30',
  neutral: 'bg-page text-muted border-line',
}

export function Badge({ tone = 'neutral', children, icon }: { tone?: Tone; children: ReactNode; icon?: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${TONE[tone]}`}>
      {icon}{children}
    </span>
  )
}

export function DemoBadge({ children = 'DEMO SENSOR DATA' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-warn/50 bg-warn-soft px-2 py-1 text-[11px] font-semibold tracking-wide text-warn-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-warn" aria-hidden />
      {children}
    </span>
  )
}

export function ThresholdBadge({ status, severity }: { status: ThresholdStatus; severity: Severity | null }) {
  if (status === 'normal') return <Badge tone="ok" icon={<CircleCheck className="h-3 w-3" />}>Normal</Badge>
  if (status === 'watch') return <Badge tone="info" icon={<Info className="h-3 w-3" />}>Near limit</Badge>
  const tone: Tone = severity === 'critical' ? 'danger' : 'warn'
  return <Badge tone={tone} icon={<AlertTriangle className="h-3 w-3" />}>{status === 'low' ? 'Below range' : 'Above range'}</Badge>
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  if (severity === 'critical') return <Badge tone="danger" icon={<OctagonAlert className="h-3 w-3" />}>Critical</Badge>
  if (severity === 'warning') return <Badge tone="warn" icon={<AlertTriangle className="h-3 w-3" />}>Warning</Badge>
  return <Badge tone="info" icon={<Info className="h-3 w-3" />}>Info</Badge>
}

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const map: Record<AlertStatus, [Tone, string]> = { active: ['danger', 'Active'], acknowledged: ['warn', 'Acknowledged'], resolved: ['ok', 'Resolved'] }
  return <Badge tone={map[status][0]}>{map[status][1]}</Badge>
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-forest">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ title, subtitle, action, children, className = '' }: { title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`card p-4 sm:p-5 ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold text-forest">{title}</h2>}
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <div className="h-11 w-11 rounded-full bg-tint text-brand grid place-items-center mb-3">{icon}</div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted mt-1 max-w-sm">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-lg border border-line bg-white p-0.5 max-w-full overflow-x-auto">
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}
          className={`px-3 min-h-[36px] rounded-md text-sm font-medium whitespace-nowrap transition-colors ${value === o.value ? 'bg-brand text-white' : 'text-muted hover:text-ink hover:bg-tint'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Right-side panel on desktop, full-width sheet on mobile. */
export function Drawer({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-forest/40" onClick={onClose} aria-hidden />
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="relative bg-white w-full sm:max-w-md h-full flex flex-col shadow-xl outline-none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-semibold text-forest">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="btn-ghost !px-2"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="border-t border-line p-4 flex flex-wrap gap-2">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onCancel }: { open: boolean; title: string; body: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[55] grid place-items-center p-4">
      <div className="absolute inset-0 bg-forest/40" onClick={onCancel} aria-hidden />
      <div role="alertdialog" aria-modal="true" aria-label={title} className="relative card p-5 w-full max-w-sm shadow-xl">
        <h2 className="font-semibold text-forest">{title}</h2>
        <p className="text-sm text-muted mt-2">{body}</p>
        <div className="flex justify-end gap-2 mt-5">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm} autoFocus>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
