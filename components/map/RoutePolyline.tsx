'use client'

import { useState, useEffect } from 'react'
import { Polyline, Popup } from 'react-leaflet'
import { Route } from '@/types'

const routeCache = new Map<string, [number, number][]>()

function RoutedPolyline({ route }: { route: Route }) {
  const [positions, setPositions] = useState<[number, number][]>([])

  const start = route.startTerminal
  const end   = route.endTerminal

  useEffect(() => {
    if (!start || !end) return

    const cacheKey = `${start.lat},${start.lng}-${end.lat},${end.lng}`

    if (routeCache.has(cacheKey)) {
      setPositions(routeCache.get(cacheKey)!)
      return
    }

    setPositions([[start.lat, start.lng], [end.lat, end.lng]])

    fetch(
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start.lng},${start.lat};${end.lng},${end.lat}` +
      `?overview=full&geometries=geojson`
    )
      .then(r => r.json())
      .then(data => {
        const coords = data.routes?.[0]?.geometry?.coordinates
        if (!coords) return
        const latlngs: [number, number][] = coords.map(([lng, lat]: [number, number]) => [lat, lng])
        routeCache.set(cacheKey, latlngs)
        setPositions(latlngs)
      })
      .catch(() => {})
  }, [start?.lat, start?.lng, end?.lat, end?.lng])

  if (!start || !end || positions.length === 0) return null

  return (
    <Polyline positions={positions} pathOptions={{ color: '#3b82f6', weight: 3, opacity: 0.7 }}>
      <Popup>
        <div className="text-sm font-medium">{route.routeNumber}</div>
        <div className="text-xs text-slate-500">{route.startPoint} → {route.endPoint}</div>
      </Popup>
    </Polyline>
  )
}

export default function RoutePolylines({ routes }: { routes: Route[] }) {
  return (
    <>
      {routes.map((route) => (
        <RoutedPolyline key={route._id} route={route} />
      ))}
    </>
  )
}