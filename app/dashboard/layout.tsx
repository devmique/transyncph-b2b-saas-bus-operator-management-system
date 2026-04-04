'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  MapPin,
  Clock,
  Building2,
  Megaphone,
  Settings,
  LogOut,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Routes', href: '/dashboard/routes', icon: MapPin },
    { name: 'Schedules', href: '/dashboard/schedules', icon: Clock },
    { name: 'Terminals', href: '/dashboard/terminals', icon: Building2 },
    { name: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-border">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">TranSync PH</h2>
          <p className="text-sm text-muted-foreground">{user.companyName}</p>
        </div>

        <nav className="space-y-2 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary/10 transition text-foreground hover:text-primary"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            onClick={logout}
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
