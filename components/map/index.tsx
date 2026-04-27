'use client'

import { MapContainer, TileLayer } from 'react-leaflet'
import { Terminal, Route, LiveBus } from '@/types'
import FlyTo from './FlyTo'
import TerminalMarkers from './TerminalMarkers'
import RoutePolylines from './RoutePolyline'
import LiveBusMarkers from './LiveBusMarkers'

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
  liveBuses = [],
}: MapProps) {
  return (
    <MapContainer
      center={[12.8797, 121.7740]}
      zoom={6}
      className="w-full h-full rounded-xl"
      style={{ background: '#0f172a' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <FlyTo terminal={selectedTerminal} />
      <RoutePolylines routes={routes} />
      <TerminalMarkers terminals={terminals} onSelectTerminal={onSelectTerminal} />
      <LiveBusMarkers liveBuses={liveBuses} />
    </MapContainer>
  )
}