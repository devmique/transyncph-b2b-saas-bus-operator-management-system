'use client'

import { useEffect, useState } from 'react'
import { Bus, Users, MapPin, TrendingUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { safeDateToMs, formatTimeAgo, formatPHPCompact } from '@/utils/format'
import { ActivityItem, AnyDoc } from '@/types'


export default function DashboardPage() {
  const { token } = useAuth()

  const [loading, setLoading] = useState(true)

  const [statsValues, setStatsValues] = useState({
    activeRoutes: '—',
    totalVehicles: '—',
    teamMembers: '—',
    monthlyRevenue: '—',
  })

  const [quickStatsValues, setQuickStatsValues] = useState({
    onTimeRate: '—',
    fleetUtilization: '—',
    avgPassengersPerBus: '—',
  })

  const [activity, setActivity] = useState<ActivityItem[]>([])

  const statMeta = [
      {
        key: 'activeRoutes',
        label: 'Active Routes',
        icon: MapPin,
        accent: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
      },
      {
        key: 'totalVehicles',
        label: 'Total Vehicles',
        icon: Bus,
        accent: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
      },
      {
        key: 'teamMembers',
        label: 'Team Members',
        icon: Users,
        accent: 'text-violet-400',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
      },
      {
        key: 'monthlyRevenue',
        label: 'Monthly Revenue',
        icon: TrendingUp,
        accent: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
      },
    ]
   
  

  const quickMeta = [
      { key: 'onTimeRate', label: 'On-time Rate', accent: 'text-emerald-400' },
      { key: 'fleetUtilization', label: 'Fleet Utilization', accent: 'text-blue-400' },
      { key: 'avgPassengersPerBus', label: 'Avg Passengers/Bus', accent: 'text-violet-400' },
    ]
   

  useEffect(() => {
    if (!token) return

    let cancelled = false

    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const headers = { Authorization: `Bearer ${token}` }

        const fetchJson = async (url: string) => {
          const res = await fetch(url, { headers })
          return res.ok ? res.json() : null
        }

        const [announcementsRaw, routesRaw, schedulesRaw, terminalsRaw] = await Promise.all([
          fetchJson('/api/announcements'),
          fetchJson('/api/routes'),
          fetchJson('/api/schedules'),
          fetchJson('/api/terminals'),
        ])

        const announcements: AnyDoc[] = Array.isArray(announcementsRaw) ? announcementsRaw : []
        const routes: AnyDoc[] = Array.isArray(routesRaw) ? routesRaw : []
        const schedules: AnyDoc[] = Array.isArray(schedulesRaw) ? schedulesRaw : []
        const terminals: AnyDoc[] = Array.isArray(terminalsRaw) ? terminalsRaw : []

        // ---- Recent Activity feed ----
        const candidates: ActivityItem[] = []

        for (const a of announcements) {
          const tsMs = safeDateToMs(a.updatedAt ?? a.createdAt)
          if (tsMs === null) continue

          const title = String(a.title ?? 'Untitled')
          const type = a.type ? ` (${String(a.type)})` : ''

          candidates.push({
            key: `ann-${String(a._id ?? title)}-${tsMs}`,
            label: `Announcement: ${title}${type}`,
            time: formatTimeAgo(tsMs),
            tsMs,
          })
        }

        for (const r of routes) {
          const tsMs = safeDateToMs(r.updatedAt ?? r.createdAt)
          if (tsMs === null) continue

          const routeNumber = String(r.routeNumber ?? '—')

          candidates.push({
            key: `route-${String(r._id ?? routeNumber)}-${tsMs}`,
            label: `Route updated: ${routeNumber}`,
            time: formatTimeAgo(tsMs),
            tsMs,
          })
        }

        for (const s of schedules) {
          const tsMs = safeDateToMs(s.updatedAt ?? s.createdAt)
          if (tsMs === null) continue

          const routeNumber = String(s.routeNumber ?? '—')
          const dep = s.departureTime ? String(s.departureTime) : ''
          const arr = s.arrivalTime ? String(s.arrivalTime) : ''
          const when = dep && arr ? ` (${dep}→${arr})` : ''

          candidates.push({
            key: `schedule-${String(s._id ?? `${routeNumber}-${tsMs}`)}-${tsMs}`,
            label: `Schedule updated: ${routeNumber}${when}`,
            time: formatTimeAgo(tsMs),
            tsMs,
          })
        }

        for (const t of terminals) {
          const tsMs = safeDateToMs(t.updatedAt ?? t.createdAt)
          if (tsMs === null) continue

          const name = String(t.name ?? 'Terminal')

          candidates.push({
            key: `terminal-${String(t._id ?? name)}-${tsMs}`,
            label: `Terminal updated: ${name}`,
            time: formatTimeAgo(tsMs),
            tsMs,
          })
        }

        candidates.sort((a, b) => b.tsMs - a.tsMs)
        const recent = candidates.slice(0, 5)

        // ---- Stats from real data ----
        const activeSchedules = schedules.filter((s) => s?.status === 'active')
        const activeRouteNumbers = new Set(
          activeSchedules.map((s) => String(s.routeNumber ?? '')).filter(Boolean),
        )

        const allVehicleNumbers = new Set(schedules.map((s) => String(s.vehicleNumber ?? '')).filter(Boolean))
        const activeVehicleNumbers = new Set(
          activeSchedules.map((s) => String(s.vehicleNumber ?? '')).filter(Boolean),
        )

        const allDrivers = new Set(schedules.map((s) => String(s.driverName ?? '')).filter(Boolean))

        const totalSchedules = schedules.length
        const onTimeRate = totalSchedules ? (activeSchedules.length / totalSchedules) * 100 : 0

        const fleetUtilization = allVehicleNumbers.size
          ? (activeVehicleNumbers.size / allVehicleNumbers.size) * 100
          : 0

        // Best-effort monthly revenue: sum `fare` on active routes if present.
        const activeRoutes = routes.filter((r) => activeRouteNumbers.has(String(r.routeNumber ?? '')))
        const fareNumbers = activeRoutes
          .map((r) => r.fare)
          .filter((v) => typeof v === 'number' && Number.isFinite(v)) as number[]

        const monthlyRevenue = fareNumbers.length > 0 ? formatPHPCompact(fareNumbers.reduce((sum, v) => sum + v, 0)) : 'N/A'

        if (!cancelled) {
          setStatsValues({
            activeRoutes: String(activeRouteNumbers.size),
            totalVehicles: String(allVehicleNumbers.size),
            teamMembers: String(allDrivers.size),
            monthlyRevenue,
          })

          setQuickStatsValues({
            onTimeRate: `${onTimeRate.toFixed(1)}%`,
            fleetUtilization: `${fleetUtilization.toFixed(1)}%`,
            avgPassengersPerBus: '—',
          })

          setActivity(recent)
        }
      } catch {
        // Keep dashboard usable if one request fails.
        if (!cancelled) setActivity([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDashboardData()

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-1">Welcome back</h1>
        <p className="text-sm font-light text-slate-500">Here&apos;s an overview of your bus operations.</p>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statMeta.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl px-5 py-5 flex items-center justify-between hover:border-white/12 transition"
          >
            <div>
              <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wider font-medium">{stat.label}</p>
              {loading ? (
                <div className="h-9 w-24 bg-white/5 rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-slate-100 tracking-tight">{(statsValues as any)[stat.key]}</p>
              )}
            </div>
            <div
              className={`w-11 h-11 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center shrink-0`}
            >
              <stat.icon className={`w-5 h-5 ${stat.accent}`} />
            </div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-100 mb-4">Recent Activity</h3>

          {loading ? (
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 shrink-0" />
                    <div className="h-4 w-56 bg-white/5 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <div className="text-sm text-slate-500 py-2">No activity yet.</div>
          ) : (
            <div className="space-y-1">
              {activity.map((item, i) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between py-2.5 ${
                    i < activity.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 shrink-0" />
                    <p className="text-sm text-slate-300">{item.label}</p>
                  </div>
                  <p className="text-xs text-slate-600 shrink-0 ml-4">{item.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-100 mb-4">Quick Stats</h3>
          <div className="space-y-1">
            {quickMeta.map((item, i) => (
              <div
                key={item.key}
                className={`flex items-center justify-between py-2.5 ${
                  i < quickMeta.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <p className="text-sm text-slate-500">{item.label}</p>
                {loading ? (
                  <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                ) : (
                  <p className={`text-sm font-bold ${item.accent}`}>{(quickStatsValues as any)[item.key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}