'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, MapPin } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authHeaders } from '@/lib/apiHelpers'
import { Route } from '@/types'

const empty: Route = { routeNumber: '', startPoint: '', endPoint: '', distance: 0, estimatedTime: '' }

const inputCls = 'w-full h-10 px-3.5 bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm font-light placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:bg-blue-600/5 transition'
const labelCls = 'block text-xs font-medium tracking-wider uppercase text-slate-400 mb-1.5'

export default function RoutesPage() {
  const { token } = useAuth()
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<Route>(empty)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    fetchRoutes()
  }, [token])

  const fetchRoutes = async () => {
    try {
      const res = await fetch('/api/routes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) {
        console.error('Failed to fetch routes:', data)
        setRoutes([])
        return
      }
      setRoutes(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setFormData(empty)
        setFormOpen(false)
        fetchRoutes()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    try {
      await fetch(`/api/routes?id=${deletingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchRoutes()
    } catch (e) {
      console.error(e)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-1">Routes</h1>
          <p className="text-sm font-light text-slate-500">Manage your bus routes and stops</p>
        </div>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="cursor-pointer flex items-center gap-2 h-9 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Route
        </button>
      </div>

      {/* Form */}
      {formOpen && (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-100 mb-5">Create New Route</h2>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Route Number</label>
                <input className={inputCls} placeholder="e.g., RT-001" value={formData.routeNumber}
                  onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Distance (km)</label>
                <input className={inputCls} type="number" placeholder="e.g., 45.5" value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })} required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Start Point</label>
                <input className={inputCls} placeholder="e.g., Manila Terminal" value={formData.startPoint}
                  onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>End Point</label>
                <input className={inputCls} placeholder="e.g., Tagaytay Terminal" value={formData.endPoint}
                  onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className={labelCls}>Estimated Time</label>
              <input className={inputCls} placeholder="e.g., 2 hours 30 minutes" value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })} required />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="cursor-pointer h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition">
                Save Route
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
      ) : routes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border border-white/5 rounded-xl">
          <MapPin className="w-10 h-10 text-slate-700 mb-3" />
          <p className="text-sm text-slate-500">No routes yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {routes.map((route) => (
            <div key={route._id}
              className="group bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl px-5 py-4 hover:border-white/12 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-base font-bold text-blue-400 tracking-tight">{route.routeNumber}</span>
                    <span className="text-xs font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                      {route.distance} km
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 font-medium mb-1">
                    {route.startPoint}
                    <span className="text-slate-600 mx-2">→</span>
                    {route.endPoint}
                  </p>
                  <p className="text-xs text-slate-500">Est. {route.estimatedTime}</p>
                </div>
                <button
                  onClick={() => route._id && handleDelete(route._id)}
                  className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-100 text-center mb-2">Delete Route</h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              Are you sure you want to delete route{' '}
              <span className="text-slate-200 font-medium">
                {routes.find(r => r._id === deletingId)?.routeNumber ?? 'this route'}
              </span>?
              This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="cursor-pointer flex-1 h-9 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="cursor-pointer flex-1 h-9 bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}