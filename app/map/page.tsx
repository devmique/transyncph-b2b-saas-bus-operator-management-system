'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { MapPin, Search, ArrowLeft, Navigation } from 'lucide-react'

interface Terminal {
  _id?: string
  name: string
  location: string
  lat: number
  lng: number
}

interface Route {
  _id?: string
  routeNumber: string
  startPoint: string
  endPoint: string
  distance: number
  estimatedTime: string
}

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
      
      setTerminals(terminalsData)
      setRoutes(routesData)
      setFilteredRoutes(routesData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-primary">TranSync PH - Route Finder</h1>
          <div className="w-20"></div>
        </div>
      </nav>

      {/* Search Section */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Find Your Route</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by route number, starting point, or destination..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 py-3 text-base"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Routes List */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Available Routes {filteredRoutes.length > 0 && `(${filteredRoutes.length})`}
            </h3>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </Card>
                ))}
              </div>
            ) : filteredRoutes.length === 0 ? (
              <Card className="p-8 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No routes found. Try a different search.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredRoutes.map((route) => (
                  <Card
                    key={route._id}
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold text-primary">
                            {route.routeNumber}
                          </span>
                          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                            {route.distance} km
                          </span>
                        </div>
                        <p className="text-foreground font-medium mb-1">
                          {route.startPoint} <span className="text-muted-foreground">→</span>{' '}
                          {route.endPoint}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Estimated time: {route.estimatedTime}
                        </p>
                      </div>
                      <Navigation className="w-5 h-5 text-primary flex-shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right: Terminals Map Preview */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Terminals</h3>
            
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {terminals.map((terminal) => (
                  <Card
                    key={terminal._id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedTerminal(terminal)}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-sm">
                          {terminal.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {terminal.location}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Map Preview */}
            <Card className="mt-8 p-4 bg-secondary/5 border-dashed">
              <div className="w-full h-64 bg-secondary/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    {selectedTerminal ? `${selectedTerminal.name}` : 'Map Preview'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Are you a bus operator?</h2>
          <p className="text-lg text-primary-foreground/80 mb-6">
            Join TranSync PH and reach more commuters with our digital route management platform.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white hover:bg-white/90 text-primary">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground text-sm">
            <p>&copy; 2024 TranSync PH. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
