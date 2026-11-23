import { getSeries } from '../../data/sensors'
import type { CropId, FieldId, Reading } from '../../types'
import { fmtDay, fmtHour } from '../../utils/format'

export type RangeKey = '24h' | '7d'

export function rangeData(crop: CropId, field: FieldId, range: RangeKey): Reading[] {
  const s = getSeries(crop, field)
  if (range === '24h') return s.slice(-24)
  return s.filter((_, i) => (s.length - 1 - i) % 3 === 0)
}

export function rangeTicks(data: Reading[], range: RangeKey): number[] {
  return data
    .filter((d) => {
      const h = Number(new Date(d.t).toLocaleString('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }))
      return range === '24h' ? h % 4 === 0 : h === 0
    })
    .map((d) => d.t)
}

export const tickFormatter = (range: RangeKey) => (t: number) => (range === '24h' ? fmtHour(t) : fmtDay(t))
export const tooltipLabel = (t: number) => `${fmtDay(t)}, ${fmtHour(t)} IST`
