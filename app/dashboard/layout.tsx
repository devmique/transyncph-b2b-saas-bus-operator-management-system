'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  Menu,
  X,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { operator, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!operator) {
      router.push('/login')
    }
  }, [operator, router])

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (!operator) return null

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Routes', href: '/dashboard/routes', icon: MapPin },
    { name: 'Schedules', href: '/dashboard/schedules', icon: Clock },
    { name: 'Terminals', href: '/dashboard/terminals', icon: Building2 },
    { name: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5 mb-3">
        <Link href="/">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 cursor-pointer">
            <Bus className="w-4 h-4 text-white" />
            </div>
            </Link>
          <span className="font-bold text-sm tracking-tight text-white">
            Tran<span className="text-blue-500">Sync</span> PH
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
          className="cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen text-slate-100 flex">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-60 md:flex md:flex-col bg-slate-900/80 backdrop-blur-md border-r border-white/5 z-40">
        <SidebarContent />
      </aside>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-slate-900 border-r border-white/5 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 min-h-screen md:ml-60">

        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-white/5 bg-slate-950/70 backdrop-blur-md flex items-center px-4 md:px-8 gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile logo (shown when sidebar is hidden) */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center cursor-pointer">
              <Bus className="w-3.5 h-3.5 text-white" />
            </div>
            </Link>
            <span className="font-bold text-xs tracking-tight text-white">
              Route<span className="text-blue-500">Sync</span> PH
            </span>
          </div>

          <p className="text-xs font-mono text-slate-600 ml-auto md:ml-0">
            {navigation.find((n) => n.href === pathname)?.name ?? 'Dashboard'}
          </p>
        </header>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}