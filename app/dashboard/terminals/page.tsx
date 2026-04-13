'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Building2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface Terminal {
  _id?: string
  name: string
  location: string
  lat: number
  lng: number
  facilities: string[]
}

const empty: Terminal = { name: '', location: '', lat: 0, lng: 0, facilities: [] }

const inputCls = 'w-full h-10 px-3.5 bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm font-light placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:bg-blue-600/5 transition'
const labelCls = 'block text-xs font-medium tracking-wider uppercase text-slate-400 mb-1.5'

export default function TerminalsPage() {
  const { token } = useAuth()
  const [terminals, setTerminals] = useState<Terminal[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<Terminal>(empty)

  useEffect(() => { fetchTerminals() }, [token])

  const authHeaders = { 
    'Content-Type': 'application/json', 
    Authorization: `Bearer ${token}` 
  }

  const fetchTerminals = async () => {
    try {
      const res = await fetch('/api/terminals', { 
        headers: { 
          Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) { 
        console.error('Failed to fetch terminals:', data); 
        setTerminals([]); 
        return }
      setTerminals(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/terminals', { 
        method: 'POST', 
        headers: authHeaders, 
        body: JSON.stringify(formData) })
      if (res.ok) { 
        setFormData(empty); 
        setFormOpen(false); 
        fetchTerminals() }
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id: string) => {
    try { await fetch(`/api/terminals/${id}`, { 
      method: 'DELETE', headers: { 
        Authorization: `Bearer ${token}` } }); 
        fetchTerminals() }
    catch (e) { console.error(e) }
  }


  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-1">Terminals</h1>
          <p className="text-sm font-light text-slate-500">Manage your bus terminals and pickup points</p>
        </div>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="cursor-pointer flex items-center gap-2 h-9 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Terminal
        </button>
      </div>

      {/* Form */}
      {formOpen && (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-100 mb-5">Create New Terminal</h2>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Terminal Name</label>
                <input className={inputCls} placeholder="e.g., Manila Central Terminal" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Location</label>
                <input className={inputCls} placeholder="e.g., Quezon City, Metro Manila" value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Latitude</label>
                <input className={inputCls} type="number" step="0.0001" placeholder="e.g., 14.5951" value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })} />
              </div>
              <div>
                <label className={labelCls}>Longitude</label>
                <input className={inputCls} type="number" step="0.0001" placeholder="e.g., 121.0273" value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })} />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="cursor-pointer h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition">
                Save Terminal
              </button>
              <button type="button" onClick={() => setFormOpen(false)}
                className=" cursor-pointer h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition">
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
      ) : terminals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border border-white/5 rounded-xl">
          <Building2 className="w-10 h-10 text-slate-700 mb-3" />
          <p className="text-sm text-slate-500">No terminals yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {terminals.map((terminal) => (
            <div key={terminal._id}
              className="group bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl px-5 py-4 hover:border-white/12 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-100 mb-0.5">{terminal.name}</p>
                  <p className="text-xs text-slate-500 mb-1">{terminal.location}</p>
                  {terminal.lat && terminal.lng && (
                    <p className="text-xs font-mono text-slate-600">
                      {terminal.lat.toFixed(4)}, {terminal.lng.toFixed(4)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => terminal._id && handleDelete(terminal._id)}
                  className=" cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}