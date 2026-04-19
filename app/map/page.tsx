'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Search, ArrowLeft, Clock, Bus, Building2, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import InputField from '@/components/ui/InputField'
import { Terminal, Route } from '@/types'
import dynamic from 'next/dynamic'
const Map = dynamic(() => import('@/components/Map'), { ssr: false })

export default function MapPage() {
  const [terminals, setTerminals] = useState<Terminal[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([])
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null)
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [terminalSearch, setTerminalSearch] = useState('')
  const [terminalPage, setTerminalPage] = useState(1)

  const ROUTES_PER_PAGE = 3
  const TERMINALS_PER_PAGE = 5

  const filteredTerminals = terminals.filter((t) =>
    t.name.toLowerCase().includes(terminalSearch.toLowerCase()) ||
    t.location.toLowerCase().includes(terminalSearch.toLowerCase())
  )
  const totalTerminalPages = Math.ceil(filteredTerminals.length / TERMINALS_PER_PAGE)
  const paginatedTerminals = filteredTerminals.slice(
    (terminalPage - 1) * TERMINALS_PER_PAGE,
    terminalPage * TERMINALS_PER_PAGE
  )
  
  const totalPages = Math.ceil(filteredRoutes.length / ROUTES_PER_PAGE)
  const paginatedRoutes = filteredRoutes.slice(
    (currentPage - 1) * ROUTES_PER_PAGE,
    currentPage * ROUTES_PER_PAGE
  )

  useEffect(() => { fetchData() }, [])

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
    setCurrentPage(1)
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
    
  const toggleExpand = (id: string) =>
    setExpandedRouteId((prev) => (prev === id ? null : id))

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
          <Button asChild size="sm" className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs">
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
          <h1 className="text-4xl font-bold tracking-tight text-slate-100 mb-6">Find your route</h1>
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

        {/* ── GRID: routes + terminals ── */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── LEFT: ROUTES ── */}
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
              <>
                <div className="space-y-3">
                  {paginatedRoutes.map((route) => {
                    const isExpanded = expandedRouteId === route._id
                    const schedules = route.schedules ?? []
                    // lowest fare across all active schedules
                    const minFare = schedules.length > 0
                      ? Math.min(...schedules.map((s) => s.fare))
                      : null

                    return (
                      <div
                        key={route._id}
                        className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl overflow-hidden hover:border-blue-600/30 transition"
                      >
                        {/* ── ROUTE HEADER (always visible) ── */}
                        <button
                          onClick={() => route._id && toggleExpand(route._id)}
                          className="w-full text-left px-5 py-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              {/* Route number + distance + company */}
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className="text-base font-bold text-blue-500 tracking-tight">
                                  {route.routeNumber}
                                </span>
                                <span className="text-xs font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                  {route.distance} km
                                </span>
                                {route.companyName && (
                                  <span className="flex items-center gap-1 text-xs text-slate-500">
                                    <Building2 className="w-3 h-3" />
                                    {route.companyName}
                                  </span>
                                )}
                              </div>

                              {/* Origin → Destination */}
                              <p className="text-sm text-slate-300 font-medium mb-1.5">
                                {route.startPoint}
                                <span className="text-slate-600 mx-2">→</span>
                                {route.endPoint}
                              </p>

                              {/* Est. time + starting fare */}
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {route.estimatedTime}
                                </span>
                                {minFare !== null && (
                                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                                    <Ticket className="w-3 h-3" />
                                    Starts at ₱{minFare}
                                  </span>
                                )}
                                <span className="text-slate-600">
                                  {schedules.length} trip{schedules.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>

                            {/* Expand chevron */}
                            <div className="shrink-0 mt-1">
                              <svg
                                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </div>
                          </div>
                        </button>

                        {/* ── SCHEDULES (expanded) ── */}
                        {isExpanded && (
                          <div className="border-t border-white/5 px-5 pb-4 pt-3 space-y-2">
                            <p className="text-xs font-medium tracking-wider uppercase text-slate-500 mb-3">
                              Available Trips
                            </p>
                            {schedules.length === 0 ? (
                              <p className="text-xs text-slate-600">No active trips for this route.</p>
                            ) : (
                              schedules.map((sched) => (
                                <div
                                  key={sched._id}
                                  className="flex items-center justify-between gap-4 bg-white/3 border border-white/5 rounded-lg px-4 py-2.5"
                                >
                                  {/* Times */}
                                  <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    {sched.departureTime}
                                    <span className="text-slate-600">→</span>
                                    {sched.arrivalTime}
                                  </div>

                                  {/* Vehicle + fare + status */}
                                  <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <span className="text-xs text-slate-500 font-mono">
                                      {sched.vehicleNumber}
                                    </span>
                                    <span className="text-xs font-semibold text-emerald-400">
                                      ₱{sched.fare}
                                    </span>
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                      {sched.status}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-500">
                      Page {currentPage} of {totalPages} · {filteredRoutes.length} routes
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-8 px-3 text-xs bg-white/5 border border-white/10 text-slate-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 px-3 text-xs bg-white/5 border border-white/10 text-slate-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

         {/* ── RIGHT: TERMINALS ── */}
        <div>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Terminals</h2>
                  
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search terminals..."
              value={terminalSearch}
              onChange={(e) => { setTerminalSearch(e.target.value); setTerminalPage(1) }}
              className="w-full pl-8 pr-3 h-9 bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-600 transition"
            />
          </div>
                  
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-900/60 border border-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredTerminals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 bg-slate-900/40 border border-white/5 rounded-xl">
              <MapPin className="w-6 h-6 text-slate-700 mb-2" />
              <p className="text-xs text-slate-500">No terminals found.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {paginatedTerminals.map((terminal) => (
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

              {totalTerminalPages > 1 && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-slate-500">{terminalPage}/{totalTerminalPages}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTerminalPage((p) => Math.max(1, p - 1))}
                      disabled={terminalPage === 1}
                      className="h-7 px-2.5 text-xs bg-white/5 border border-white/10 text-slate-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setTerminalPage((p) => Math.min(totalTerminalPages, p + 1))}
                      disabled={terminalPage === totalTerminalPages}
                      className="h-7 px-2.5 text-xs bg-white/5 border border-white/10 text-slate-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        </div>

        {/* ── MAP: full width below grid ── */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Live Map
            {selectedTerminal && (
              <span className="ml-2 text-xs font-mono text-slate-500">· {selectedTerminal.name}</span>
            )}
          </h2>
          <div className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl overflow-hidden h-[560px]">
            <Map
              terminals={terminals}
              selectedTerminal={selectedTerminal}
              onSelectTerminal={setSelectedTerminal}
            />
          </div>
        </div>

      </div> {/* end main content */}

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
                <Bus />
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