'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Clock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authHeaders } from '@/lib/apiHelpers'

interface Schedule {
  _id?: string
  routeNumber: string
  departureTime: string
  arrivalTime: string
  driverName: string
  vehicleNumber: string
  status: 'active' | 'inactive'
}

const empty: Schedule = {
  routeNumber: '', departureTime: '', arrivalTime: '',
  driverName: '', vehicleNumber: '', status: 'active',
}

const inputCls = 'w-full h-10 px-3.5 bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm font-light placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:bg-blue-600/5 transition'
const labelCls = 'block text-xs font-medium tracking-wider uppercase text-slate-400 mb-1.5'

export default function SchedulesPage() {
  const { token } = useAuth()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Schedule>(empty)

  useEffect(() => { fetchSchedules() }, [token]) 

 
  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedules', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (!res.ok) {
        console.error('Failed to fetch schedules:', data)
        setSchedules([])
        return
      }

      setSchedules(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await fetch('/api/schedules', {
          method: 'PUT',
          headers: authHeaders(token),
          body: JSON.stringify({ id: editingId, ...formData }),
        })
        setEditingId(null)
      } else {
        await fetch('/api/schedules', {
          method: 'POST',
          headers: authHeaders(token),
          body: JSON.stringify(formData),
        })
      }
      setFormData(empty); setFormOpen(false); fetchSchedules()
    } catch (e) { console.error(e) }
  }

  const handleEdit = (s: Schedule) => {
    setFormData(s); setEditingId(s._id || null); setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/schedules?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchSchedules()
    } catch (e) { console.error(e) }
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-1">Schedules</h1>
          <p className="text-sm font-light text-slate-500">Manage your bus schedules and assignments</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setFormData(empty); setFormOpen(!formOpen) }}
          className="cursor-pointer flex items-center gap-2 h-9 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {/* Form */}
      {formOpen && (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-100 mb-5">
            {editingId ? 'Edit Schedule' : 'Create New Schedule'}
          </h2>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Route Number</label>
                <input className={inputCls} placeholder="e.g., RT-001" value={formData.routeNumber}
                  onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Driver Name</label>
                <input className={inputCls} placeholder="e.g., Juan Dela Cruz" value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })} required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Departure Time</label>
                <input className={inputCls} type="time" value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Arrival Time</label>
                <input className={inputCls} type="time" value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })} required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Vehicle Number</label>
                <input className={inputCls} placeholder="e.g., TSP-001" value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Status</label>
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
              <button type="submit" className="cursor-pointer h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition">
                {editingId ? 'Update Schedule' : 'Save Schedule'}
              </button>
              <button type="button" onClick={() => setFormOpen(false)}
                className="cursor-pointer h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-900/40 border border-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border border-white/5 rounded-xl">
          <Clock className="w-10 h-10 text-slate-700 mb-3" />
          <p className="text-sm text-slate-500">No schedules yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div key={schedule._id}
              className="group bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl px-5 py-4 hover:border-white/12 transition">
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
                    {schedule.departureTime}
                    <span className="text-slate-600 mx-2">→</span>
                    {schedule.arrivalTime}
                  </p>
                  <p className="text-xs text-slate-500">
                    {schedule.driverName} · {schedule.vehicleNumber}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(schedule)}
                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/10 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => schedule._id && handleDelete(schedule._id)}
                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}