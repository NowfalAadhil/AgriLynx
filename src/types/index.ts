export type CropId = 'tomato' | 'rice' | 'cotton' | 'groundnut'
export type FieldId = 'A' | 'B' | 'C'
export type MetricId = 'temperature' | 'humidity' | 'soil' | 'light'
export type ThresholdMetric = Exclude<MetricId, 'light'>

export interface Range { min: number; max: number }
export type Thresholds = Record<ThresholdMetric, Range>

export type ThresholdStatus = 'normal' | 'watch' | 'low' | 'high'
export type Severity = 'critical' | 'warning' | 'info'
export type AlertStatus = 'active' | 'acknowledged' | 'resolved'
export type AlertType = 'soil' | 'temperature' | 'humidity' | 'condition' | 'pest'
export type ConditionLabel = 'Stable' | 'Watch' | 'Stressed'

export interface Reading {
  t: number
  temperature: number
  humidity: number
  soil: number
  light: number
}

export interface Evaluation {
  status: ThresholdStatus
  severity: Severity | null
  /** distance beyond the violated bound, as a fraction of the range width */
  deviation: number
}

export interface Crop {
  id: CropId
  name: string
  scientific: string
  stages: string[]
  summary: string
  environment: string[]
  soilMoisture: string[]
  stress: string[]
  insights: string[]
  monitoring: string[]
}

export interface Field {
  id: FieldId
  name: string
  areaHa: number
  note: string
}

export interface FarmAlert {
  id: string
  type: AlertType
  severity: Severity
  title: string
  description: string
  crop: CropId | 'other'
  field: FieldId | null
  timestamp: string
  recommendedAction: string
  source: 'sensor-rule' | 'condition-rule' | 'demo-schedule' | 'demo-analysis'
  reading?: string
}

export interface AlertState { status: AlertStatus; at: string }

export type DemoSeverity = 'low' | 'moderate' | 'high'

export interface ImageStats {
  width: number
  height: number
  brightness: number
  greenShare: number
  warmShare: number
}

export interface AnalysisRecord {
  id: string
  createdAt: string
  crop: CropId | 'other'
  fileName: string
  fileSizeKb: number
  thumbnail: string
  scenarioId: string
  observation: string
  concern: string
  severity: DemoSeverity
  steps: string[]
  stats: ImageStats
  qualityNotes: string[]
}

export interface ActivityItem {
  id: string
  at: string
  text: string
  kind: 'alert' | 'analysis' | 'threshold' | 'checklist' | 'system'
}
