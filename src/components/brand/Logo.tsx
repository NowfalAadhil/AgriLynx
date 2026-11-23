interface Props { size?: number; withText?: boolean; subtitle?: boolean; tone?: 'light' | 'dark' }

/** AgriLynx mark: a leaf (agriculture) whose veins connect to network nodes (IoT / intelligence). */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="AgriLynx logo" className="shrink-0">
      <rect width="40" height="40" rx="10" fill="#2D6A4F" />
      <path d="M9 31C9 19 16 11 29 10c0 13-7 21-20 21z" fill="#E8F3EA" />
      <path d="M9 31c5-6 9-11 14-16" stroke="#2D6A4F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M16 24l4.5 1M20 19.5l5 .5" stroke="#2D6A4F" strokeWidth="1.4" strokeLinecap="round" />
      <g stroke="#65A879" strokeWidth="1.5" strokeLinecap="round">
        <path d="M29 10l3.5-4.5M29 10l5.5 2.5" />
      </g>
      <circle cx="29" cy="10" r="2.6" fill="#65A879" />
      <circle cx="32.8" cy="5.4" r="1.9" fill="#E8F3EA" />
      <circle cx="35" cy="12.6" r="1.9" fill="#E8F3EA" />
    </svg>
  )
}

export function Logo({ size = 36, withText = true, subtitle = true, tone = 'light' }: Props) {
  const main = tone === 'light' ? 'text-white' : 'text-forest'
  const sub = tone === 'light' ? 'text-white/65' : 'text-muted'
  return (
    <div className="flex items-center gap-3 min-w-0">
      <LogoMark size={size} />
      {withText && (
        <div className="min-w-0 leading-tight">
          <div className={`font-semibold text-[17px] tracking-tight ${main}`}>AgriLynx</div>
          {subtitle && <div className={`text-[11px] ${sub} truncate`}>Smart Agriculture Intelligence</div>}
        </div>
      )}
    </div>
  )
}
