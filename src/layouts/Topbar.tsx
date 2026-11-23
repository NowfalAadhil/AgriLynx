import { Bell, Menu } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CROPS } from '../data/crops'
import { FARM_NAME, FIELDS } from '../data/fields'
import { NAV } from './Sidebar'

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation()
  const { alerts, crop, field } = useApp()
  const active = alerts.filter((a) => a.status === 'active').length
  const page = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))?.label ?? 'AgriLynx'
  return (
    <header className="sticky top-0 z-20 h-16 bg-page/90 backdrop-blur border-b border-line flex items-center gap-3 px-4 sm:px-6">
      <button className="lg:hidden btn-ghost !px-2" aria-label="Open menu" onClick={onMenu}><Menu className="h-5 w-5" /></button>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-forest truncate">{page}</div>
        <div className="text-xs text-muted truncate">{FARM_NAME} · {FIELDS[field].name} · {CROPS[crop].name}</div>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-warn/50 bg-warn-soft px-2 py-1 text-[11px] font-semibold tracking-wide text-warn-ink">PROTOTYPE · SIMULATED DATA</span>
        <Link to="/alerts" className="relative btn-secondary !px-2.5" aria-label={`Alerts: ${active} active`}>
          <Bell className="h-5 w-5" />
          {active > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[20px] rounded-full bg-danger px-1 text-center text-[11px] font-semibold leading-5 text-white">{active}</span>}
        </Link>
      </div>
    </header>
  )
}
