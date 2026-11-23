import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

type Tone = 'success' | 'error' | 'info'
interface Toast { id: number; message: string; tone: Tone }
interface ToastApi { push: (message: string, tone?: Tone) => void }

const Ctx = createContext<ToastApi>({ push: () => undefined })
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((message: string, tone: Tone = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t.slice(-3), { id, message, tone }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800)
  }, [])
  const api = useMemo(() => ({ push }), [push])
  const icon = { success: CheckCircle2, error: AlertTriangle, info: Info }
  const color = { success: 'text-brand', error: 'text-danger', info: 'text-info' }
  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[60] flex flex-col gap-2 sm:w-96" role="status" aria-live="polite">
        {toasts.map((t) => {
          const Icon = icon[t.tone]
          return (
            <div key={t.id} className="toast-in card flex items-start gap-3 p-3 shadow-lg">
              <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${color[t.tone]}`} aria-hidden />
              <p className="text-sm flex-1">{t.message}</p>
              <button aria-label="Dismiss notification" className="text-muted hover:text-ink" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}>
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}
