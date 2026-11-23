import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'

interface Props {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  unit?: string
  status: ReactNode
  description: string
  trend?: { delta: number; unit: string; hours: number }
}

export function KpiCard({ icon: Icon, label, value, unit, status, description, trend }: Props) {
  const dir = !trend || Math.abs(trend.delta) < 0.05 ? 'flat' : trend.delta > 0 ? 'up' : 'down'
  const TIcon = dir === 'up' ? ArrowUpRight : dir === 'down' ? ArrowDownRight : ArrowRight
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-muted">
        <span className="h-8 w-8 shrink-0 rounded-lg bg-tint text-brand grid place-items-center"><Icon className="h-4 w-4" /></span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-end gap-1.5 min-w-0">
          <span className="text-3xl font-semibold text-forest leading-none">{value}</span>
          {unit && <span className="text-sm text-muted pb-0.5">{unit}</span>}
        </div>
        <div className="shrink-0">{status}</div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs text-muted" title={`Change over the last ${trend.hours} hours (sample data)`}>
          <TIcon className="h-3.5 w-3.5" aria-hidden />
          {dir === 'flat' ? 'steady' : `${trend.delta > 0 ? '+' : ''}${trend.delta.toFixed(trend.unit === '°C' ? 1 : 0)}${trend.unit}`} in last {trend.hours}h
        </div>
      )}
      <p className="text-xs text-muted leading-relaxed">{description}</p>
    </div>
  )
}
