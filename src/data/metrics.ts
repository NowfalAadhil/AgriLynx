import type { MetricId, ThresholdMetric } from '../types'

export interface MetricMeta {
  id: MetricId
  label: string
  unit: string
  decimals: number
  /** hard bounds accepted by the threshold editor */
  bounds: { min: number; max: number }
  step: number
  color: string
}

export const METRICS: Record<MetricId, MetricMeta> = {
  temperature: { id: 'temperature', label: 'Temperature', unit: '°C', decimals: 1, bounds: { min: 0, max: 50 }, step: 0.5, color: '#B8693A' },
  humidity: { id: 'humidity', label: 'Air Humidity', unit: '%', decimals: 0, bounds: { min: 0, max: 100 }, step: 1, color: '#5687C5' },
  soil: { id: 'soil', label: 'Soil Moisture', unit: '%', decimals: 0, bounds: { min: 0, max: 100 }, step: 1, color: '#2D6A4F' },
  light: { id: 'light', label: 'Light Intensity', unit: 'lux', decimals: 0, bounds: { min: 0, max: 120000 }, step: 1000, color: '#9A7B1F' },
}

export const THRESHOLD_METRICS: ThresholdMetric[] = ['temperature', 'humidity', 'soil']
