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