import { BookOpen, Bug, Bell, ChevronsLeft, ChevronsRight, LayoutDashboard, Network, RotateCcw, Sprout, Sun, X, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Logo, LogoMark } from '../components/brand/Logo'
import { useApp } from '../context/AppContext'

export const NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/monitoring', label: 'Farm Monitoring', icon: Sun },
  { to: '/crops', label: 'Crop Intelligence', icon: Sprout },
  { to: '/pest-analysis', label: 'Pest Analysis', icon: Bug },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/architecture', label: 'System Architecture', icon: Network },
  { to: '/about', label: 'About AgriLynx', icon: BookOpen },
]

interface Props { mobileOpen: boolean; onClose: () => void; onReset: () => void }

export function Sidebar({ mobileOpen, onClose, onReset }: Props) {
  const { collapsed, setCollapsed, alerts } = useApp()
  const active = alerts.filter((a) => a.status === 'active').length

  const body = (compact: boolean, mobile: boolean) => (
    <div className="flex h-full flex-col bg-forest text-white">
      <div className={`flex items-center ${compact ? 'justify-center' : 'justify-between'} px-4 h-16 border-b border-white/10`}>
        {compact ? <LogoMark size={34} /> : <Logo />}
        {mobile && <button aria-label="Close menu" onClick={onClose} className="p-2 -mr-2 text-white/70 hover:text-white"><X className="h-5 w-5" /></button>}
      </div>
      <nav aria-label="Main" className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose} title={compact ? label : undefined}
            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 min-h-[44px] text-sm font-medium transition-colors ${compact ? 'justify-center' : ''} ${isActive ? 'bg-white/12 text-white ring-1 ring-white/15' : 'text-white/70 hover:bg-white/8 hover:text-white'}`}>
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
            {!compact && <span className="truncate">{label}</span>}
            {!compact && to === '/alerts' && active > 0 && <span className="ml-auto rounded-full bg-danger px-2 py-0.5 text-[11px] font-semibold">{active}</span>}
            {compact && <span className="sr-only">{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <button onClick={onReset} title="Reset demo" className={`flex w-full items-center gap-3 rounded-lg px-3 min-h-[40px] text-sm text-white/70 hover:bg-white/8 hover:text-white ${compact ? 'justify-center' : ''}`}>
          <RotateCcw className="h-4 w-4 shrink-0" />{!compact && 'Reset demo'}<span className="sr-only">{compact ? 'Reset demo' : ''}</span>
        </button>
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className={`flex w-full items-center gap-3 rounded-lg px-3 min-h-[40px] text-sm text-white/70 hover:bg-white/8 hover:text-white ${compact ? 'justify-center' : ''}`}>
            {compact ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" />Collapse</>}
          </button>
        )}
        {!compact && <p className="px-3 pt-2 text-[11px] leading-snug text-white/50">Prototype · simulated data</p>}
      </div>
    </div>
  )

  return (
    <>
      <aside className={`hidden lg:block fixed inset-y-0 left-0 z-30 transition-[width] duration-200 ${collapsed ? 'w-[72px]' : 'w-64'}`}>{body(collapsed, false)}</aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-forest/50" onClick={onClose} aria-hidden />
          <aside className="relative w-72 max-w-[85vw] h-full shadow-xl">{body(false, true)}</aside>
        </div>
      )}
    </>
  )
}
