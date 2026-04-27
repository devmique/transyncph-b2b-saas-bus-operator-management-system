'use client'

import { Marker, Popup } from 'react-leaflet'
import { LiveBus } from '@/types'
import { busIcon } from './icons'

export default function LiveBusMarkers({ liveBuses }: { liveBuses: LiveBus[] }) {
  return (
    <>
      {liveBuses.map((bus) => (
        <Marker
          key={bus.scheduleId}
          position={[bus.lat, bus.lng]}
          icon={busIcon(bus.vehicleNumber)}
        >
          <Popup>
            <div className="text-sm font-medium">🚌 {bus.vehicleNumber ?? 'Bus'}</div>
            {bus.routeNumber && (
              <div className="text-xs text-slate-500">Route {bus.routeNumber}</div>
            )}
            <div className="text-xs text-emerald-600 font-semibold mt-0.5">● Live</div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}