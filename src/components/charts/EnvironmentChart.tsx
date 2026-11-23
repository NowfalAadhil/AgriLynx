import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { METRICS } from '../../data/metrics'
import type { CropId, FieldId, MetricId } from '../../types'
import { Segmented } from '../ui/primitives'
import { rangeData, rangeTicks, tickFormatter, tooltipLabel, type RangeKey } from './chartData'

const SERIES: MetricId[] = ['temperature', 'humidity', 'soil']
const AXIS = { fontSize: 11, fill: '#718078' }

function TipBox({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; value: number }[]; label?: number }) {
  if (!active || !payload?.length || label === undefined) return null
  return (
    <div className="card px-3 py-2 text-xs shadow-md">
      <div className="font-medium mb-1">{tooltipLabel(label)}</div>
      {payload.map((p) => {
        const m = METRICS[p.dataKey as MetricId]
        return (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
            <span className="text-muted">{m.label}</span>
            <span className="ml-auto font-medium pl-3">{p.value}{m.unit}</span>
          </div>
        )
      })}
    </div>
  )
}

export function EnvironmentChart({ crop, field }: { crop: CropId; field: FieldId }) {
  const [range, setRange] = useState<RangeKey>('24h')
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const [on, setOn] = useState<Record<MetricId, boolean>>({ temperature: true, humidity: true, soil: true, light: false })
  const data = useMemo(() => rangeData(crop, field, range), [crop, field, range])
  const ticks = useMemo(() => rangeTicks(data, range), [data, range])
  const pct = SERIES.filter((s) => s !== 'temperature' && on[s])

  const xAxis = (hide: boolean) => (
    <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} ticks={ticks} tickFormatter={tickFormatter(range)} tick={AXIS} axisLine={{ stroke: '#E1E7E0' }} tickLine={false} hide={hide} />
  )

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Series visibility">
          {SERIES.map((s) => (
            <button key={s} type="button" aria-pressed={on[s]} onClick={() => setOn((o) => ({ ...o, [s]: !o[s] }))}
              className={`inline-flex items-center gap-2 rounded-full border px-3 min-h-[32px] text-xs font-medium ${on[s] ? 'border-line bg-white text-ink' : 'border-dashed border-line text-muted'}`}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: on[s] ? METRICS[s].color : '#C9D2CB' }} />
              {METRICS[s].label} ({METRICS[s].unit})
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Segmented label="View" value={view} onChange={setView} options={[{ value: 'chart', label: 'Chart' }, { value: 'table', label: 'Table' }]} />
          <Segmented label="Time range" value={range} onChange={setRange} options={[{ value: '24h', label: '24 hours' }, { value: '7d', label: '7 days' }]} />
        </div>
      </div>

      {view === 'chart' ? (
        <div className="space-y-1">
          {on.temperature && (
            <div>
              <div className="text-xs text-muted mb-1">Temperature (°C)</div>
              <ResponsiveContainer width="100%" height={on.humidity || on.soil ? 140 : 230}>
                <LineChart data={data} syncId="env" margin={{ top: 4, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2ED" vertical={false} />
                  {xAxis(pct.length > 0)}
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={AXIS} axisLine={false} tickLine={false} tickFormatter={(v: number) => Math.round(v).toString()} width={44} />
                  <Tooltip content={<TipBox />} cursor={{ stroke: '#9AA8A0', strokeDasharray: '3 3' }} />
                  <Line type="monotone" dataKey="temperature" stroke={METRICS.temperature.color} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {pct.length > 0 && (
            <div>
              <div className="text-xs text-muted mb-1">Humidity and soil moisture (%)</div>
              <ResponsiveContainer width="100%" height={on.temperature ? 170 : 230}>
                <LineChart data={data} syncId="env" margin={{ top: 4, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2ED" vertical={false} />
                  {xAxis(false)}
                  <YAxis domain={[0, 100]} tick={AXIS} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<TipBox />} cursor={{ stroke: '#9AA8A0', strokeDasharray: '3 3' }} />
                  {pct.map((s) => (
                    <Line key={s} type="monotone" dataKey={s} stroke={METRICS[s].color} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {!on.temperature && pct.length === 0 && <p className="text-sm text-muted py-10 text-center">Select at least one series above to show the chart.</p>}
        </div>
      ) : (
        <div className="max-h-[320px] overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <caption className="sr-only">Sample environmental readings</caption>
            <thead className="bg-page text-muted text-xs sticky top-0">
              <tr><th className="text-left p-2 font-medium">Time (IST)</th><th className="text-right p-2 font-medium">Temp °C</th><th className="text-right p-2 font-medium">Humidity %</th><th className="text-right p-2 font-medium">Soil %</th></tr>
            </thead>
            <tbody>
              {[...data].reverse().map((d) => (
                <tr key={d.t} className="border-t border-line"><td className="p-2">{tooltipLabel(d.t)}</td><td className="p-2 text-right">{d.temperature}</td><td className="p-2 text-right">{d.humidity}</td><td className="p-2 text-right">{d.soil}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
