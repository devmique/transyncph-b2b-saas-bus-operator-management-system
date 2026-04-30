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
            <div className="space-y-1">
              <div className="text-sm font-semibold text-slate-900">🚌 {bus.vehicleNumber ?? 'Bus'}</div>
              {bus.companyName && (
                <div className="text-xs text-slate-700 font-medium">{bus.companyName}</div>
              )}

              <div className="text-xs text-emerald-600 font-semibold mt-1">● Live</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}