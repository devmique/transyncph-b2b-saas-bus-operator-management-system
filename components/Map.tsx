'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Terminal, Route } from '@/types'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

function FlyTo({ terminal }: { terminal: Terminal | null }) {
  const map = useMap()
  useEffect(() => {
    if (terminal) map.flyTo([terminal.lat, terminal.lng], 15, { duration: 1.2 })
  }, [terminal, map])
  return null
}

interface MapProps {
  terminals: Terminal[]
  routes?: Route[]
  selectedTerminal: Terminal | null
  onSelectTerminal: (terminal: Terminal) => void
}

export default function Map({ terminals, routes = [], selectedTerminal, onSelectTerminal }: MapProps) {
  const defaultCenter: [number, number] = [12.8797, 121.7740]

  return (
    <MapContainer
      center={defaultCenter}
      zoom={6}
      className="w-full h-full rounded-xl"
      style={{ background: '#0f172a' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <FlyTo terminal={selectedTerminal} />

      {/* ── ROUTE POLYLINES ── */}
      {routes.map((route) => {
        const start = route.startTerminal
        const end   = route.endTerminal
        if (!start || !end) return null
        return (
          <Polyline
            key={route._id}
            positions={[
              [start.lat, start.lng],
              [end.lat,   end.lng],
            ]}
            pathOptions={{
              color: '#3b82f6',
              weight: 3,
              opacity: 0.7,
              dashArray: '6 4',
            }}
          >
            <Popup>
              <div className="text-sm font-medium">{route.routeNumber}</div>
              <div className="text-xs text-slate-500">
                {route.startPoint} → {route.endPoint}
              </div>
            </Popup>
          </Polyline>
        )
      })}

      {/* ── TERMINAL MARKERS ── */}
      {terminals.map((terminal) => (
        <Marker
          key={terminal._id}
          position={[terminal.lat, terminal.lng]}
          icon={icon}
          eventHandlers={{ click: () => onSelectTerminal(terminal) }}
        >
          <Popup>
            <div className="text-sm font-medium">{terminal.name}</div>
            <div className="text-xs text-slate-500">{terminal.location}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}