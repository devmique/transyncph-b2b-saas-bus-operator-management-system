'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

interface Terminal {
  _id?: string
  name: string
  location: string
  lat: number
  lng: number
  facilities: string[]
}

export default function TerminalsPage() {
  const [terminals, setTerminals] = useState<Terminal[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<Terminal>({
    name: '',
    location: '',
    lat: 0,
    lng: 0,
    facilities: [],
  })

  useEffect(() => {
    fetchTerminals()
  }, [])

  const fetchTerminals = async () => {
    try {
      const res = await fetch('/api/terminals')
      const data = await res.json()
      setTerminals(data)
    } catch (error) {
      console.error('Failed to fetch terminals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/terminals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({
          name: '',
          location: '',
          lat: 0,
          lng: 0,
          facilities: [],
        })
        setFormOpen(false)
        fetchTerminals()
      }
    } catch (error) {
      console.error('Failed to create terminal:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/terminals/${id}`, { method: 'DELETE' })
      fetchTerminals()
    } catch (error) {
      console.error('Failed to delete terminal:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Terminals</h1>
          <p className="text-muted-foreground">Manage your bus terminals and pickup points</p>
        </div>
        <Button
          onClick={() => setFormOpen(!formOpen)}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Terminal
        </Button>
      </div>

      {formOpen && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Create New Terminal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Terminal Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Manila Central Terminal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  placeholder="e.g., Quezon City, Metro Manila"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Latitude
                </label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.lat}
                  onChange={(e) =>
                    setFormData({ ...formData, lat: parseFloat(e.target.value) })
                  }
                  placeholder="e.g., 14.5951"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Longitude
                </label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.lng}
                  onChange={(e) =>
                    setFormData({ ...formData, lng: parseFloat(e.target.value) })
                  }
                  placeholder="e.g., 121.0273"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                Save Terminal
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
        <p className="text-muted-foreground">Loading terminals...</p>
      ) : (
        <div className="grid gap-4">
          {terminals.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No terminals yet. Create one to get started!</p>
            </Card>
          ) : (
            terminals.map((terminal) => (
              <Card key={terminal._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">{terminal.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{terminal.location}</p>
                    {terminal.lat && terminal.lng && (
                      <p className="text-xs text-muted-foreground">
                        Coordinates: {terminal.lat.toFixed(4)}, {terminal.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => terminal._id && handleDelete(terminal._id)}
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
