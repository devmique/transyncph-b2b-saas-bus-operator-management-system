export function safeDateToMs(value: unknown): number | null {
    if (!value) return null
    const date = value instanceof Date ? value : new Date(String(value))
    const ms = date.getTime()
    return Number.isFinite(ms) ? ms : null
  }
  
  export function formatTimeAgo(tsMs: number): string {
    const diffMs = Date.now() - tsMs
    if (diffMs < 0) return 'just now'
  
    const diffSec = Math.floor(diffMs / 1000)
    if (diffSec < 60) return `${diffSec <= 1 ? '1 second' : `${diffSec} seconds`} ago`
  
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} min ago`
  
    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`
  
    const diffDay = Math.floor(diffHr / 24)
    if (diffDay < 14) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`
  
    return new Date(tsMs).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }
  
  export function formatPHPCompact(value: number): string {
    try {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value)
    } catch {
      return `₱${Math.round(value).toLocaleString('en-PH')}`
    }
  }

// "14:30" → "02:30 PM"
export function to12Hour(time24: string): string {
  if (!time24) return ''
  const [hStr, mStr] = time24.split(':')
  let h = parseInt(hStr, 10)
  const m = mStr ?? '00'
  const period = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${String(h).padStart(2, '0')}:${m} ${period}`
}

// "02:30 PM" → "14:30" (for the time input value)
export function to24Hour(time12: string): string {
  if (!time12) return ''
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return time12 // already 24h or raw input
  let h = parseInt(match[1], 10)
  const m = match[2]
  const period = match[3].toUpperCase()
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${m}`
}