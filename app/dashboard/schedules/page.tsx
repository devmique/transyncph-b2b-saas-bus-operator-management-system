'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, Edit2 } from 'lucide-react'

interface Schedule {
  _id?: string
  routeNumber: string
  departureTime: string
  arrivalTime: string
  driverName: string
  vehicleNumber: string
  status: 'active' | 'inactive'
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Schedule>({
    routeNumber: '',
    departureTime: '',
    arrivalTime: '',
    driverName: '',
    vehicleNumber: '',
    status: 'active',
  })

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedules')
      const data = await res.json()
      setSchedules(data)
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await fetch('/api/schedules', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...formData }),
        })
        setEditingId(null)
      } else {
        await fetch('/api/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      }
      setFormData({
        routeNumber: '',
        departureTime: '',
        arrivalTime: '',
        driverName: '',
        vehicleNumber: '',
        status: 'active',
      })
      setFormOpen(false)
      fetchSchedules()
    } catch (error) {
      console.error('Failed to save schedule:', error)
    }
  }

  const handleEdit = (schedule: Schedule) => {
    setFormData(schedule)
    setEditingId(schedule._id || null)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/schedules?id=${id}`, { method: 'DELETE' })
      fetchSchedules()
    } catch (error) {
      console.error('Failed to delete schedule:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Schedules</h1>
          <p className="text-muted-foreground">Manage your bus schedules and assignments</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setFormData({
              routeNumber: '',
              departureTime: '',
              arrivalTime: '',
              driverName: '',
              vehicleNumber: '',
              status: 'active',
            })
            setFormOpen(!formOpen)
          }}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      {formOpen && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {editingId ? 'Edit Schedule' : 'Create New Schedule'}
          </h2>
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
                  Driver Name
                </label>
                <Input
                  value={formData.driverName}
                  onChange={(e) =>
                    setFormData({ ...formData, driverName: e.target.value })
                  }
                  required
                  placeholder="e.g., Juan Dela Cruz"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Departure Time
                </label>
                <Input
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) =>
                    setFormData({ ...formData, departureTime: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Arrival Time
                </label>
                <Input
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) =>
                    setFormData({ ...formData, arrivalTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Vehicle Number
              </label>
              <Input
                value={formData.vehicleNumber}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleNumber: e.target.value })
                }
                required
                placeholder="e.g., TSP-001"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                {editingId ? 'Update Schedule' : 'Save Schedule'}
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
        <p className="text-muted-foreground">Loading schedules...</p>
      ) : (
        <div className="grid gap-4">
          {schedules.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No schedules yet. Create one to get started!</p>
            </Card>
          ) : (
            schedules.map((schedule) => (
              <Card key={schedule._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-bold text-lg text-primary">{schedule.routeNumber}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          schedule.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {schedule.status}
                      </span>
                    </div>
                    <p className="text-foreground font-medium">
                      {schedule.departureTime} - {schedule.arrivalTime}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Driver: {schedule.driverName} | Vehicle: {schedule.vehicleNumber}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(schedule)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => schedule._id && handleDelete(schedule._id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
