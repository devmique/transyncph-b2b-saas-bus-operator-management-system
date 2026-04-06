'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  Clock,
  Building2,
  Megaphone,
  Settings,
  LogOut,
  Bus,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { operator, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!operator) {
      router.push('/login')
    }
  }, [operator, router])

  if (!operator) return null

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Routes', href: '/dashboard/routes', icon: MapPin },
    { name: 'Schedules', href: '/dashboard/schedules', icon: Clock },
    { name: 'Terminals', href: '/dashboard/terminals', icon: Building2 },
    { name: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen text-slate-100 flex">

      {/* ── SIDEBAR ── */}
      <aside className="fixed inset-y-0 left-0 w-60 flex flex-col bg-slate-900/80 backdrop-blur-md border-r border-white/5 z-40">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <Bus className="w-4 h-4" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              Route<span className="text-blue-500">Sync</span> PH
            </span>
          </div>
          <div className="bg-white/5 border border-white/8 rounded-lg px-3 py-2">
            <p className="text-xs text-slate-500 mb-0.5">Operator</p>
            <p className="text-sm font-medium text-slate-200 truncate">{operator.companyName}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-blue-600/15 border border-blue-600/30 text-blue-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-400' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="ml-60 flex-1 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-white/5 bg-slate-950/70 backdrop-blur-md flex items-center px-8">
          <p className="text-xs font-mono text-slate-600">
            {navigation.find((n) => n.href === pathname)?.name ?? 'Dashboard'}
          </p>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}