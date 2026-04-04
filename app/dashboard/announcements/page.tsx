'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

interface Announcement {
  _id?: string
  title: string
  message: string
  type: 'info' | 'warning' | 'alert'
  affectedRoutes: string[]
  createdAt?: Date
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<Announcement>({
    title: '',
    message: '',
    type: 'info',
    affectedRoutes: [],
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements')
      const data = await res.json()
      setAnnouncements(data)
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({
          title: '',
          message: '',
          type: 'info',
          affectedRoutes: [],
        })
        setFormOpen(false)
        fetchAnnouncements()
      }
    } catch (error) {
      console.error('Failed to create announcement:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' })
      fetchAnnouncements()
    } catch (error) {
      console.error('Failed to delete announcement:', error)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Announcements</h1>
          <p className="text-muted-foreground">Notify commuters about updates and delays</p>
        </div>
        <Button
          onClick={() => setFormOpen(!formOpen)}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {formOpen && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Create New Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Route 5 Temporary Reroute"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                placeholder="Detailed message for commuters..."
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'info' | 'warning' | 'alert',
                    })
                  }
                  className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Affected Routes (comma-separated)
                </label>
                <Input
                  value={formData.affectedRoutes.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      affectedRoutes: e.target.value
                        .split(',')
                        .map((r) => r.trim()),
                    })
                  }
                  placeholder="e.g., RT-001, RT-002"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                Create Announcement
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
        <p className="text-muted-foreground">Loading announcements...</p>
      ) : (
        <div className="grid gap-4">
          {announcements.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No announcements yet. Create one to get started!</p>
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {announcement.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${getTypeColor(
                          announcement.type
                        )}`}
                      >
                        {announcement.type}
                      </span>
                    </div>
                    <p className="text-foreground mb-2">{announcement.message}</p>
                    {announcement.affectedRoutes && announcement.affectedRoutes.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Affected routes: {announcement.affectedRoutes.join(', ')}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => announcement._id && handleDelete(announcement._id)}
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
