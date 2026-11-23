const tz = 'Asia/Kolkata'

export function fmtDateTime(iso: string | number): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: tz,
  })
}
export function fmtFull(iso: string | number): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: tz,
  }) + ' IST'
}
export function fmtHour(t: number): string {
  return new Date(t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz })
}
export function fmtDay(t: number): string {
  return new Date(t).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', timeZone: tz })
}
export function relativeTo(iso: string | number, now: number): string {
  const diff = Math.max(0, now - new Date(iso).getTime())
  const h = Math.round(diff / 3600000)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}
export function fmtNumber(n: number, decimals = 0): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}
