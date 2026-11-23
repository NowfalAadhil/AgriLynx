import type { CropId, FieldId, Reading } from '../types'
import { hashString, noise } from '../utils/hash'

/** Fixed "now" of the sample dataset — all demo readings are anchored to this instant. */
export const SAMPLE_NOW = Date.parse('2026-11-21T11:00:00+05:30')
export const SERIES_HOURS = 168

interface Target { temperature: number; humidity: number; soil: number; light: number }

/** The current (latest) sample reading for each crop / field. */
export const SAMPLE_TARGETS: Record<CropId, Record<FieldId, Target>> = {
  tomato: {
    A: { temperature: 30.2, humidity: 64, soil: 56, light: 41000 },
    B: { temperature: 31.4, humidity: 61, soil: 49, light: 43000 },
    C: { temperature: 33.4, humidity: 56, soil: 38, light: 44000 },
  },
  rice: {
    A: { temperature: 31.0, humidity: 78, soil: 82, light: 38000 },
    B: { temperature: 32.8, humidity: 91, soil: 74, light: 36000 },
    C: { temperature: 34.6, humidity: 76, soil: 63, light: 40000 },
  },
  cotton: {
    A: { temperature: 32.4, humidity: 52, soil: 44, light: 52000 },
    B: { temperature: 34.1, humidity: 48, soil: 36, light: 53000 },
    C: { temperature: 36.4, humidity: 42, soil: 24, light: 55000 },
  },
  groundnut: {
    A: { temperature: 30.8, humidity: 62, soil: 47, light: 46000 },
    B: { temperature: 33.2, humidity: 76, soil: 37, light: 44000 },
    C: { temperature: 34.8, humidity: 49, soil: 31, light: 48000 },
  },
}

const cache = new Map<string, Reading[]>()

function hourOfDay(t: number): number {
  // IST = UTC + 5.5h
  return (((t / 3600000) + 5.5) % 24 + 24) % 24
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * Deterministic 7-day hourly series. Same inputs always give the same output.
 * The final point equals SAMPLE_TARGETS exactly, so history and "current" agree.
 */
export function getSeries(crop: CropId, field: FieldId): Reading[] {
  const key = `${crop}-${field}`
  const hit = cache.get(key)
  if (hit) return hit

  const seed = hashString(key) % 1000
  const target = SAMPLE_TARGETS[crop][field]
  const fieldIdx = ['A', 'B', 'C'].indexOf(field)
  const dryRate = (crop === 'rice' ? 0.16 : 0.11) * (1 + fieldIdx * 0.15)
  const events = [18, 90, 140].map((e) => e + fieldIdx * 5)

  const rawTemp = (i: number, h: number) =>
    5.2 * Math.sin((2 * Math.PI * (h - 9)) / 24) + 0.6 * noise(i, seed) + 0.9 * Math.sin(i / 31)
  const rawHum = (i: number, h: number) =>
    -11 * Math.sin((2 * Math.PI * (h - 9)) / 24) + 1.8 * noise(i, seed + 7) + 2.5 * Math.sin(i / 43)
  const rawSoil = (i: number) => {
    const last = events.filter((e) => e <= i).pop() ?? -48
    return -dryRate * (i - last) + 0.35 * noise(i, seed + 13)
  }
  const cloud = (i: number) => 0.82 + 0.18 * (noise(Math.floor(i / 24), seed + 3) * 0.5 + 0.5) + 0.04 * noise(i, seed + 5)
  const shape = (h: number) => (h > 6 && h < 18 ? Math.sin((Math.PI * (h - 6)) / 12) : 0)

  const last = SERIES_HOURS - 1
  const hNow = hourOfDay(SAMPLE_NOW)
  const t0 = rawTemp(last, hNow)
  const h0 = rawHum(last, hNow)
  const s0 = rawSoil(last)
  const l0 = shape(hNow) * cloud(last)

  const out: Reading[] = []
  for (let i = 0; i < SERIES_HOURS; i++) {
    const t = SAMPLE_NOW - (last - i) * 3600000
    const h = hourOfDay(t)
    out.push({
      t,
      temperature: Math.round((target.temperature + rawTemp(i, h) - t0) * 10) / 10,
      humidity: Math.round(clamp(target.humidity + rawHum(i, h) - h0, 5, 99)),
      soil: Math.round(clamp(target.soil + rawSoil(i) - s0, 2, 99)),
      light: Math.round((target.light * (shape(h) * cloud(i))) / l0 / 100) * 100,
    })
  }
  // Guarantee exact agreement with the sample "current" reading.
  out[last] = { t: SAMPLE_NOW, ...target }
  cache.set(key, out)
  return out
}

export function latest(crop: CropId, field: FieldId): Reading {
  const s = getSeries(crop, field)
  return s[s.length - 1]
}
