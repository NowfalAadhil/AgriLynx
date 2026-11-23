import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { DEFAULT_THRESHOLDS } from '../data/thresholds'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type {
  ActivityItem, AlertState, AlertStatus, AnalysisRecord, CropId, FarmAlert, FieldId, Range, ThresholdMetric, Thresholds,
} from '../types'
import { SEEDED_ALERTS, SEVERITY_RANK, analysisAlerts, generateSensorAlerts } from '../utils/alerts'

export type ManagedAlert = FarmAlert & { status: AlertStatus; statusAt: string | null }

interface AppState {
  crop: CropId
  field: FieldId
  setCrop: (c: CropId) => void
  setField: (f: FieldId) => void
  thresholds: Record<CropId, Thresholds>
  setThreshold: (crop: CropId, metric: ThresholdMetric, range: Range) => void
  resetThresholds: (crop: CropId) => void
  alerts: ManagedAlert[]
  setAlertStatus: (id: string, status: AlertStatus) => void
  resetAlerts: () => void
  analyses: AnalysisRecord[]
  addAnalysis: (a: AnalysisRecord) => void
  removeAnalysis: (id: string) => void
  clearAnalyses: () => void
  checked: (crop: CropId, field: FieldId, item: string) => boolean
  toggleChecked: (crop: CropId, field: FieldId, item: string) => void
  resetChecklist: (crop: CropId, field: FieldId) => void
  activity: ActivityItem[]
  log: (text: string, kind: ActivityItem['kind']) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  resetAll: () => void
}

const Ctx = createContext<AppState | null>(null)

export function useApp(): AppState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside AppProvider')
  return v
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [crop, setCrop, resetCrop] = useLocalStorage<CropId>('crop', 'tomato')
  const [field, setField, resetField] = useLocalStorage<FieldId>('field', 'A')
  const [thresholds, setThresholds, resetTh] = useLocalStorage('thresholds', DEFAULT_THRESHOLDS)
  const [alertStates, setAlertStates, resetAlertStates] = useLocalStorage<Record<string, AlertState>>('alertStates', {})
  const [analyses, setAnalyses, resetAnalyses] = useLocalStorage<AnalysisRecord[]>('analyses', [])
  const [checks, setChecks, resetChecks] = useLocalStorage<Record<string, boolean>>('checklist', {})
  const [activity, setActivity, resetActivity] = useLocalStorage<ActivityItem[]>('activity', [])
  const [collapsed, setCollapsed] = useLocalStorage('sidebarCollapsed', false)

  const log = useCallback((text: string, kind: ActivityItem['kind']) => {
    setActivity((a) => [{ id: `${Date.now()}-${Math.random()}`, at: new Date().toISOString(), text, kind }, ...a].slice(0, 30))
  }, [setActivity])

  const setThreshold = useCallback((c: CropId, m: ThresholdMetric, range: Range) => {
    setThresholds((t) => ({ ...t, [c]: { ...t[c], [m]: range } }))
  }, [setThresholds])

  const resetThresholds = useCallback((c: CropId) => {
    setThresholds((t) => ({ ...t, [c]: DEFAULT_THRESHOLDS[c] }))
  }, [setThresholds])

  const alerts = useMemo<ManagedAlert[]>(() => {
    const all = [...generateSensorAlerts(thresholds), ...SEEDED_ALERTS, ...analysisAlerts(analyses)]
    return all
      .map((a) => ({ ...a, status: alertStates[a.id]?.status ?? 'active', statusAt: alertStates[a.id]?.at ?? null }) as ManagedAlert)
      .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || b.timestamp.localeCompare(a.timestamp))
  }, [thresholds, alertStates, analyses])

  const setAlertStatus = useCallback((id: string, status: AlertStatus) => {
    setAlertStates((s) => ({ ...s, [id]: { status, at: new Date().toISOString() } }))
  }, [setAlertStates])

  const checkKey = (c: CropId, f: FieldId, i: string) => `${c}:${f}:${i}`
  const checked = useCallback((c: CropId, f: FieldId, i: string) => !!checks[checkKey(c, f, i)], [checks])
  const toggleChecked = useCallback((c: CropId, f: FieldId, i: string) => {
    setChecks((s) => ({ ...s, [checkKey(c, f, i)]: !s[checkKey(c, f, i)] }))
  }, [setChecks])
  const resetChecklist = useCallback((c: CropId, f: FieldId) => {
    setChecks((s) => Object.fromEntries(Object.entries(s).filter(([k]) => !k.startsWith(`${c}:${f}:`))))
  }, [setChecks])

  const value: AppState = {
    crop, field, setCrop, setField,
    thresholds, setThreshold, resetThresholds,
    alerts, setAlertStatus, resetAlerts: resetAlertStates,
    analyses,
    addAnalysis: (a) => setAnalyses((l) => [a, ...l].slice(0, 10)),
    removeAnalysis: (id) => setAnalyses((l) => l.filter((x) => x.id !== id)),
    clearAnalyses: resetAnalyses,
    checked, toggleChecked, resetChecklist,
    activity, log,
    collapsed, setCollapsed,
    resetAll: () => { resetCrop(); resetField(); resetTh(); resetAlertStates(); resetAnalyses(); resetChecks(); resetActivity() },
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
