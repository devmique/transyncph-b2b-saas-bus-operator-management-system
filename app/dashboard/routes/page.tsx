'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

interface Route {
  _id?: string
  routeNumber: string
  startPoint: string
  endPoint: string
  distance: number
  estimatedTime: string
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<Route>({
    routeNumber: '',
    startPoint: '',
    endPoint: '',
    distance: 0,
    estimatedTime: '',
  })

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      const res = await fetch('/api/routes')
      const data = await res.json()
      setRoutes(data)
    } catch (error) {
      console.error('Failed to fetch routes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({
          routeNumber: '',
          startPoint: '',
          endPoint: '',
          distance: 0,
          estimatedTime: '',
        })
        setFormOpen(false)
        fetchRoutes()
      }
    } catch (error) {
      console.error('Failed to create route:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/routes/${id}`, { method: 'DELETE' })
      fetchRoutes()
    } catch (error) {
      console.error('Failed to delete route:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Routes</h1>
          <p className="text-muted-foreground">Manage your bus routes and stops</p>
        </div>
        <Button
          onClick={() => setFormOpen(!formOpen)}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Route
        </Button>
      </div>

      {formOpen && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Create New Route</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Route Number
                </label>
                <Input
                  value={formData.routeNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, routeNumber: e.target.value })
                  }
                  required
                  placeholder="e.g., RT-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Distance (km)
                </label>
                <Input
                  type="number"
                  value={formData.distance}
                  onChange={(e) =>
                    setFormData({ ...formData, distance: parseFloat(e.target.value) })
                  }
                  required
                  placeholder="e.g., 45.5"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Point
                </label>
                <Input
                  value={formData.startPoint}
                  onChange={(e) =>
                    setFormData({ ...formData, startPoint: e.target.value })
                  }
                  required
                  placeholder="e.g., Manila Terminal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  End Point
                </label>
                <Input
                  value={formData.endPoint}
                  onChange={(e) =>
                    setFormData({ ...formData, endPoint: e.target.value })
                  }
                  required
                  placeholder="e.g., Tagaytay Terminal"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Estimated Time
              </label>
              <Input
                value={formData.estimatedTime}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedTime: e.target.value })
                }
                required
                placeholder="e.g., 2 hours 30 minutes"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                Save Route
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading routes...</p>
      ) : (
        <div className="grid gap-4">
          {routes.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No routes yet. Create one to get started!</p>
            </Card>
          ) : (
            routes.map((route) => (
              <Card key={route._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-bold text-lg text-primary">{route.routeNumber}</span>
                      <span className="text-sm bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                        {route.distance} km
                      </span>
                    </div>
                    <p className="text-foreground font-medium">
                      {route.startPoint} → {route.endPoint}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Est. Time: {route.estimatedTime}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => route._id && handleDelete(route._id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
