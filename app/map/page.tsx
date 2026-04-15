'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Search, ArrowLeft, Navigation, Clock, Bus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import InputField from '@/components/ui/InputField'
import { Terminal, Route } from '@/types'


export default function MapPage() {
  const [terminals, setTerminals] = useState<Terminal[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([])
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [terminalsRes, routesRes] = await Promise.all([
        fetch('/api/public/terminals'),
        fetch('/api/public/routes'),
      ])

      const terminalsData = await terminalsRes.json()
      const routesData = await routesRes.json()

      const safeTerminals = Array.isArray(terminalsData) ? terminalsData : []
      const safeRoutes = Array.isArray(routesData) ? routesData : []
      if (!terminalsRes.ok || !routesRes.ok) {
        console.error('Public map data API error', {
          terminalsStatus: terminalsRes.status,
          routesStatus: routesRes.status,
          terminalsError: Array.isArray(terminalsData) ? null : terminalsData,
          routesError: Array.isArray(routesData) ? null : routesData,
        })
      }
      setTerminals(safeTerminals)
      setRoutes(safeRoutes)
      setFilteredRoutes(safeRoutes)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setTerminals([])
      setRoutes([])
      setFilteredRoutes([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setFilteredRoutes(routes)
      return
    }

    const filtered = routes.filter(
      (route) =>
        route.routeNumber.toLowerCase().includes(query.toLowerCase()) ||
        route.startPoint.toLowerCase().includes(query.toLowerCase()) ||
        route.endPoint.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredRoutes(filtered)
  }

  return (
    <div className="min-h-screen text-slate-100">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>


          <Button
            asChild
            size="sm"
            className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* ── SEARCH HERO ── */}
      <section className="border-b border-white/5 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-blue-500 text-xs font-mono font-medium tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded mb-4">
            Route Finder
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-100 mb-6">
            Find your route
          </h1>
          <InputField
            label="Search Routes"
            name="routeSearch"
            placeholder="Search by route number, starting point, or destination..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="relative"
            inputSuffix={<Search className="w-4 h-4 text-slate-500 pointer-events-none" />}
          />
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── LEFT: ROUTES LIST ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-100">
                Available Routes
                {filteredRoutes.length > 0 && (
                  <span className="ml-2 text-xs font-mono text-slate-500">({filteredRoutes.length})</span>
                )}
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-slate-900/60 border border-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border border-white/5 rounded-xl">
                <MapPin className="w-10 h-10 text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">No routes found. Try a different search.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRoutes.map((route) => (
                  <div
                    key={route._id}
                    className="group bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl px-5 py-4 hover:border-blue-600/40 hover:bg-slate-900/80 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl font-bold text-blue-500 tracking-tight">
                            {route.routeNumber}
                          </span>
                          <span className="text-xs font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                            {route.distance} km
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 font-medium mb-1.5">
                          {route.startPoint}
                          <span className="text-slate-600 mx-2">→</span>
                          {route.endPoint}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {route.estimatedTime}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0 group-hover:bg-blue-600/10 group-hover:border-blue-600/20 transition">
                        <Navigation className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: TERMINALS + MAP ── */}
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-5">Terminals</h2>

            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-900/60 border border-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 mb-6">
                {terminals.map((terminal) => (
                  <button
                    key={terminal._id}
                    onClick={() => setSelectedTerminal(terminal)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition flex items-start gap-3 ${
                      selectedTerminal?._id === terminal._id
                        ? 'bg-blue-600/10 border-blue-600/40'
                        : 'bg-slate-900/60 border-white/8 hover:border-blue-600/30 hover:bg-slate-900/80'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${
                      selectedTerminal?._id === terminal._id ? 'text-blue-400' : 'text-slate-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        selectedTerminal?._id === terminal._id ? 'text-blue-300' : 'text-slate-300'
                      }`}>
                        {terminal.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{terminal.location}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Map preview card */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl overflow-hidden">
              <div
                className="w-full h-56 relative flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
              >
                {/* Inner grid */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(255,255,255,0.04) 19px,rgba(255,255,255,0.04) 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(255,255,255,0.04) 19px,rgba(255,255,255,0.04) 20px)',
                  }}
                />
                {/* Decorative SVG route lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 224" preserveAspectRatio="none">
                  <path d="M10,180 Q80,60 150,100 T290,40" stroke="#2563eb" strokeWidth="1.5" fill="none" strokeDasharray="4 3" opacity="0.5" />
                  <path d="M10,130 Q90,190 170,130 T295,150" stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.3" />
                  {selectedTerminal ? (
                    <>
                      <circle cx="150" cy="100" r="6" fill="#2563eb" opacity="0.9" />
                      <circle cx="150" cy="100" r="12" fill="#2563eb" opacity="0.15" />
                    </>
                  ) : (
                    <>
                      <circle cx="80" cy="110" r="3" fill="#60a5fa" opacity="0.6" />
                      <circle cx="150" cy="100" r="3" fill="#60a5fa" opacity="0.6" />
                      <circle cx="230" cy="65" r="3" fill="#60a5fa" opacity="0.6" />
                    </>
                  )}
                </svg>
                {/* Label */}
                <div className="relative text-center">
                  <MapPin className="w-5 h-5 text-blue-500 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedTerminal ? selectedTerminal.name : 'Select a terminal'}
                  </p>
                  {selectedTerminal && (
                    <p className="text-xs text-slate-600 mt-0.5">{selectedTerminal.location}</p>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 border-t border-white/5">
                <p className="text-xs text-slate-600 font-mono">
                  {selectedTerminal
                    ? `${selectedTerminal.lat.toFixed(4)}, ${selectedTerminal.lng.toFixed(4)}`
                    : 'Live map · Leaflet.js'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="border-t border-white/5 py-16 mt-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 mb-3">
            Are you a bus operator?
          </h2>
          <p className="text-slate-500 font-light mb-8">
            Join RouteSync PH and reach more commuters with our digital route management platform.
          </p>
          <Button asChild className="h-11 px-7 bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/register">
              Start Your Free Trial
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </Button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-slate-950/80 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
          
            <div className="cursor-pointer w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <Bus/>
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-400">
              Route<span className="text-blue-500">Sync</span> PH
            </span>
          </div>
          <p className="text-xs text-slate-600">© 2025 RouteSync PH. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-slate-600">
            <Link href="/privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}