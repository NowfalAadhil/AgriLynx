import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ConfirmDialog } from '../components/ui/primitives'
import { useApp } from '../context/AppContext'
import { useToast } from '../hooks/useToast'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  const { collapsed, resetAll } = useApp()
  const { push } = useToast()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:z-[70] focus:m-2 focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onReset={() => { setMobileOpen(false); setConfirm(true) }} />
      <div className={`transition-[padding] duration-200 ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}`}>
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main id="main" className="px-4 sm:px-6 py-6 max-w-[1280px] mx-auto"><Outlet /></main>
      </div>
      <ConfirmDialog
        open={confirm}
        title="Reset demo?"
        body="This clears your saved selections, thresholds, alert actions, checklist, analysis history and activity in this browser."
        confirmLabel="Reset demo"
        onCancel={() => setConfirm(false)}
        onConfirm={() => { resetAll(); setConfirm(false); push('Demo reset to its initial state.', 'info') }}
      />
    </div>
  )
}
