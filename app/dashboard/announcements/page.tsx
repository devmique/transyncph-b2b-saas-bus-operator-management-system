'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Megaphone } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authHeaders } from '@/lib/apiHelpers'

interface Announcement {
  _id?: string
  title: string
  message: string
  type: 'info' | 'warning' | 'alert'
  affectedRoutes: string[]
  createdAt?: Date
}

const empty: Announcement = { title: '', message: '', type: 'info', affectedRoutes: [] }

const inputCls = 'w-full h-10 px-3.5 bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm font-light placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:bg-blue-600/5 transition'
const labelCls = 'block text-xs font-medium tracking-wider uppercase text-slate-400 mb-1.5'

const typeMeta = {
  info:    { label: 'Info',    cls: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
  warning: { label: 'Warning', cls: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  alert:   { label: 'Alert',   cls: 'bg-red-500/10 border-red-500/20 text-red-400' },
}

export default function AnnouncementsPage() {
  const { token } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<Announcement>(empty)

  useEffect(() => { 
    if (!token) return
    fetchAnnouncements() }, [token])


  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements', { 
        headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) { 
        console.error('Failed to fetch announcements:', data); 
        setAnnouncements([]); 
        return }
      setAnnouncements(Array.isArray(data) ? data : [])
    } catch (e) { 
      console.error(e) 
    } 
      finally { setLoading(false) 

      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/announcements', { 
        method: 'POST', 
        headers: authHeaders(token), 
        body: JSON.stringify(formData) })
      if (res.ok) { 
        setFormData(empty); 
        setFormOpen(false); 
        fetchAnnouncements() }
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/announcements?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchAnnouncements()
    } catch (e) { console.error(e) }
  }
  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-1">Announcements</h1>
          <p className="text-sm font-light text-slate-500">Notify commuters about updates and delays</p>
        </div>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className=" cursor-pointer flex items-center gap-2 h-9 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Form */}
      {formOpen && (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-100 mb-5">Create New Announcement</h2>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className={labelCls}>Title</label>
              <input className={inputCls} placeholder="e.g., Route 5 Temporary Reroute" value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div>
              <label className={labelCls}>Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                placeholder="Detailed message for commuters…"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm font-light placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:bg-blue-600/5 transition resize-none"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Announcement['type'] })}
                  className="w-full h-10 px-3.5 bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-600 transition"
                >
                  <option value="info" className="bg-slate-900">Information</option>
                  <option value="warning" className="bg-slate-900">Warning</option>
                  <option value="alert" className="bg-slate-900">Alert</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Affected Routes (comma-separated)</label>
                <input className={inputCls} placeholder="e.g., RT-001, RT-002"
                  value={formData.affectedRoutes.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    affectedRoutes: e.target.value.split(',').map((r) => r.trim()),
                  })} />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition">
                Create Announcement
              </button>
              <button type="button" onClick={() => setFormOpen(false)}
                className="h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition">
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
            <div key={i} className="h-24 bg-slate-900/40 border border-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border border-white/5 rounded-xl">
          <Megaphone className="w-10 h-10 text-slate-700 mb-3" />
          <p className="text-sm text-slate-500">No announcements yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => {
            const meta = typeMeta[a.type]
            return (
              <div key={a._id}
                className="group bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl px-5 py-4 hover:border-white/12 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-sm font-semibold text-slate-100">{a.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded border ${meta.cls}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 font-light leading-relaxed mb-2">{a.message}</p>
                    {a.affectedRoutes && a.affectedRoutes.length > 0 && a.affectedRoutes[0] !== '' && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs text-slate-600">Affected:</span>
                        {a.affectedRoutes.map((r) => (
                          <span key={r} className="text-xs font-mono bg-white/5 border border-white/8 text-slate-400 px-1.5 py-0.5 rounded">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => a._id && handleDelete(a._id)}
                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}