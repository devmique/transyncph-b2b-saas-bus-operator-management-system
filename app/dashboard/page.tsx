'use client'

import { Card } from '@/components/ui/card'
import { Bus, Users, MapPin, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      label: 'Active Routes',
      value: '12',
      icon: MapPin,
      color: 'text-blue-600',
    },
    {
      label: 'Total Vehicles',
      value: '45',
      icon: Bus,
      color: 'text-green-600',
    },
    {
      label: 'Team Members',
      value: '28',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      label: 'Monthly Revenue',
      value: '₱850K',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold text-foreground mb-2">Welcome Back</h1>
      <p className="text-muted-foreground mb-8">Here&apos;s an overview of your bus operations.</p>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <stat.icon className={`w-10 h-10 ${stat.color} opacity-20`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <p className="text-sm">Route 5 schedule updated</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <p className="text-sm">New driver assigned</p>
              <p className="text-xs text-muted-foreground">5 hours ago</p>
            </div>
            <div className="flex justify-between items-center py-2">
              <p className="text-sm">Terminal 2 announcement</p>
              <p className="text-xs text-muted-foreground">1 day ago</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">On-time Rate</p>
              <p className="font-bold text-green-600">94.2%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Fleet Utilization</p>
              <p className="font-bold text-blue-600">87.5%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Avg Passengers/Bus</p>
              <p className="font-bold text-purple-600">42 pax</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
