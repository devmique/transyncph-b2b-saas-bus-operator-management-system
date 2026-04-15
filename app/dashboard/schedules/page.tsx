'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Clock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authHeaders } from '@/lib/apiHelpers'
import { Schedule } from '@/types'
import { Button } from '@/components/ui/button'
import InputField from '@/components/ui/InputField'

const empty: Schedule = {
  routeNumber: '', departureTime: '', arrivalTime: '',
  driverName: '', vehicleNumber: '', status: 'active',
}

export default function SchedulesPage() {
  const { token } = useAuth()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Schedule>(empty)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { if (token) fetchSchedules() }, [token])

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedules', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setSchedules(res.ok && Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/schedules', {
        method: editingId ? 'PUT' : 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(editingId ? { id: editingId, ...formData } : formData),
      })
      setFormData(empty); setEditingId(null); setFormOpen(false); fetchSchedules()
    } catch (e) { console.error(e) }
  }

  const handleEdit = (s: Schedule) => {
    setFormData(s); setEditingId(s._id || null); setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    try {
      await fetch(`/api/schedules?id=${deletingId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      fetchSchedules()
    } catch (e) { console.error(e) }
    finally { setDeletingId(null) }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-1">Schedules</h1>
          <p className="text-sm font-light text-slate-500">Manage your bus schedules and assignments</p>
        </div>
        <Button
          onClick={() => { setEditingId(null); setFormData(empty); setFormOpen(!formOpen) }}
          className="bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold h-9 px-4 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </Button>
      </div>

      {formOpen && (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-100 mb-5">
            {editingId ? 'Edit Schedule' : 'Create New Schedule'}
          </h2>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Route Number"
                name="routeNumber"
                placeholder="e.g., RT-001"
                value={formData.routeNumber}
                onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
                required
              />
              <InputField
                label="Driver Name"
                name="driverName"
                placeholder="e.g., Juan Dela Cruz"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Departure Time"
                name="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                required
              />
              <InputField
                label="Arrival Time"
                name="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Vehicle Number"
                name="vehicleNumber"
                placeholder="e.g., TSP-001"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                required
              />
              <div>
                <label className="block text-xs font-medium tracking-wider uppercase text-slate-400 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full h-10 px-3.5 bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-600 transition"
                >
                  <option value="active" className="bg-slate-900">Active</option>
                  <option value="inactive" className="bg-slate-900">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold h-9 px-4 cursor-pointer">
                {editingId ? 'Update Schedule' : 'Save Schedule'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}
                className="h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium cursor-pointer">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-900/40 border border-white/5 rounded-xl animate-pulse" />)}
        </div>
      ) : schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border border-white/5 rounded-xl">
          <Clock className="w-10 h-10 text-slate-700 mb-3" />
          <p className="text-sm text-slate-500">No schedules yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div key={schedule._id} className="group bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl px-5 py-4 hover:border-white/12 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-base font-bold text-blue-400 tracking-tight">{schedule.routeNumber}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded border ${
                      schedule.status === 'active'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-slate-500'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 font-medium mb-1">
                    {schedule.departureTime}<span className="text-slate-600 mx-2">→</span>{schedule.arrivalTime}
                  </p>
                  <p className="text-xs text-slate-500">{schedule.driverName} · {schedule.vehicleNumber}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" onClick={() => handleEdit(schedule)}
                    className="w-8 h-8 p-0 text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/10 cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" onClick={() => schedule._id && setDeletingId(schedule._id)}
                    className="w-8 h-8 p-0 text-slate-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-100 text-center mb-2">Delete Schedule</h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              Are you sure you want to delete the schedule for{' '}
              <span className="text-slate-200 font-medium">
                {schedules.find(s => s._id === deletingId)?.routeNumber ?? 'this schedule'}
              </span>? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDeletingId(null)}
                className="flex-1 h-9 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium cursor-pointer">
                Cancel
              </Button>
              <Button onClick={confirmDelete}
                className="flex-1 h-9 bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold cursor-pointer">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}