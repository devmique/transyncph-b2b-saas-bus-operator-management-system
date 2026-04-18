// components/Map.tsx
'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Terminal } from '@/types'

// Fix default marker icons broken by webpack
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// Fly to selected terminal when it changes
function FlyTo({ terminal }: { terminal: Terminal | null }) {
  const map = useMap()
  useEffect(() => {
    if (terminal) {
      map.flyTo([terminal.lat, terminal.lng], 15, { duration: 1.2 })
    }
  }, [terminal, map])
  return null
}

interface MapProps {
  terminals: Terminal[]
  selectedTerminal: Terminal | null
  onSelectTerminal: (terminal: Terminal) => void
}

export default function Map({ terminals, selectedTerminal, onSelectTerminal }: MapProps) {
  // Center on Philippines
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