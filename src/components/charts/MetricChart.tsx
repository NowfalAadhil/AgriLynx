import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { METRICS } from '../../data/metrics'
import type { CropId, FieldId, MetricId, Range } from '../../types'
import { fmtNumber } from '../../utils/format'
import { rangeData, rangeTicks, tickFormatter, tooltipLabel, type RangeKey } from './chartData'

const AXIS = { fontSize: 11, fill: '#718078' }

interface Props { crop: CropId; field: FieldId; metric: MetricId; range: RangeKey; threshold?: Range; height?: number }

export function MetricChart({ crop, field, metric, range, threshold, height = 190 }: Props) {
  const meta = METRICS[metric]
  const data = useMemo(() => rangeData(crop, field, range), [crop, field, range])
  const ticks = useMemo(() => rangeTicks(data, range), [data, range])
  const vals = data.map((d) => d[metric])
  const lo = Math.min(...vals, threshold?.min ?? Infinity)
  const hi = Math.max(...vals, threshold?.max ?? -Infinity)
  const pad = (hi - lo) * 0.12 || 1
  const domain: [number, number] = metric === 'light'
    ? [0, Math.ceil((hi + pad) / 10000) * 10000]
    : [Math.max(0, Math.floor(lo - pad)), Math.ceil(hi + pad)]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 6, right: 12, left: -14, bottom: 0 }} accessibilityLayer>
        <CartesianGrid stroke="#EEF2ED" vertical={false} />
        <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} ticks={ticks} tickFormatter={tickFormatter(range)} tick={AXIS} axisLine={{ stroke: '#E1E7E0' }} tickLine={false} />
        <YAxis domain={domain} tick={AXIS} axisLine={false} tickLine={false} width={metric === 'light' ? 52 : 40} tickFormatter={(v: number) => (metric === 'light' ? `${Math.round(v / 1000)}k` : String(v))} />
        {threshold && <ReferenceArea y1={threshold.min} y2={threshold.max} fill="#65A879" fillOpacity={0.1} stroke="none" ifOverflow="extendDomain" />}
        {threshold && <ReferenceLine y={threshold.min} stroke="#718078" strokeDasharray="4 4" />}
        {threshold && <ReferenceLine y={threshold.max} stroke="#718078" strokeDasharray="4 4" />}
        <Tooltip
          cursor={{ stroke: '#9AA8A0', strokeDasharray: '3 3' }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div className="card px-3 py-2 text-xs shadow-md">
                <div className="font-medium">{tooltipLabel(label as number)}</div>
                <div className="text-muted">{meta.label}: <span className="text-ink font-medium">{fmtNumber(payload[0].value as number, meta.decimals)}{meta.unit === 'lux' ? ' lux' : meta.unit}</span></div>
              </div>
            ) : null
          }
        />
        <Line type="monotone" dataKey={metric} stroke={meta.color} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
