'use client'

import { Bus, Users, MapPin, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      label: 'Active Routes',
      value: '12',
      icon: MapPin,
      accent: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Total Vehicles',
      value: '45',
      icon: Bus,
      accent: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Team Members',
      value: '28',
      icon: Users,
      accent: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
    },
    {
      label: 'Monthly Revenue',
      value: '₱850K',
      icon: TrendingUp,
      accent: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
  ]

  const activity = [
    { label: 'Route 5 schedule updated', time: '2 hours ago' },
    { label: 'New driver assigned', time: '5 hours ago' },
    { label: 'Terminal 2 announcement', time: '1 day ago' },
  ]

  const quickStats = [
    { label: 'On-time Rate', value: '94.2%', accent: 'text-emerald-400' },
    { label: 'Fleet Utilization', value: '87.5%', accent: 'text-blue-400' },
    { label: 'Avg Passengers/Bus', value: '42 pax', accent: 'text-violet-400' },
  ]

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-1">Welcome back</h1>
        <p className="text-sm font-light text-slate-500">Here&apos;s an overview of your bus operations.</p>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl px-5 py-5 flex items-center justify-between hover:border-white/12 transition"
          >
            <div>
              <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wider font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-100 tracking-tight">{stat.value}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center shrink-0`}>
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
          <div className="space-y-1">
            {activity.map((item, i) => (
              <div
                key={i}
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
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-100 mb-4">Quick Stats</h3>
          <div className="space-y-1">
            {quickStats.map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-2.5 ${
                  i < quickStats.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className={`text-sm font-bold ${item.accent}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}