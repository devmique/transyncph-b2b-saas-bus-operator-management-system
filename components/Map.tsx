'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Terminal, Route, LiveBus } from '@/types'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// ── live bus icon (pulsing blue dot with bus label) ─────────────────────────
const busIcon = (vehicleNumber?: string) =>
  L.divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    html: `
      <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
        <!-- pulse ring -->
        <span style="
          position:absolute;inset:0;border-radius:50%;
          background:rgba(59,130,246,0.25);
          animation:bus-pulse 1.6s ease-out infinite;
        "></span>
        <!-- solid dot -->
        <div style="
          width:26px;height:26px;border-radius:50%;
          background:#2563eb;border:2.5px solid #93c5fd;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 0 3px rgba(37,99,235,0.3);
          font-size:10px;font-weight:700;color:#fff;
          font-family:monospace;letter-spacing:-0.5px;
          line-height:1;z-index:1;
        ">${vehicleNumber ? vehicleNumber.slice(-3) : '🚌'}</div>
      </div>
      <style>
        @keyframes bus-pulse {
          0%   { transform:scale(0.8); opacity:0.8; }
          100% { transform:scale(2.2); opacity:0; }
        }
      </style>
    `,
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
  liveBuses?: LiveBus[]        
}

export default function Map({
  terminals,
  routes = [],
  selectedTerminal,
  onSelectTerminal,
  liveBuses = [],                // 👈 default to empty array
}: MapProps) {
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

      {/* ── ROUTE POLYLINES (unchanged) ── */}
      {routes.map((route) => {
        const start = route.startTerminal
        const end   = route.endTerminal
        if (!start || !end) return null
        return (
          <Polyline
            key={route._id}
            positions={[[start.lat, start.lng], [end.lat, end.lng]]}
            pathOptions={{ color: '#3b82f6', weight: 3, opacity: 0.7, dashArray: '6 4' }}
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

      {/* ── TERMINAL MARKERS (unchanged) ── */}
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

      {/* ── LIVE BUS MARKERS ── */}
      {liveBuses.map((bus) => (
        <Marker
          key={bus.scheduleId}
          position={[bus.lat, bus.lng]}
          icon={busIcon(bus.vehicleNumber)}
        >
          <Popup>
            <div className="text-sm font-medium">
              🚌 {bus.vehicleNumber ?? 'Bus'}
            </div>
            {bus.routeNumber && (
              <div className="text-xs text-slate-500">Route {bus.routeNumber}</div>
            )}
            <div className="text-xs text-emerald-600 font-semibold mt-0.5">● Live</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}