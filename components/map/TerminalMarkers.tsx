'use client'

import { Marker, Popup } from 'react-leaflet'
import { Terminal } from '@/types'
import { terminalIcon } from './icons'

interface Props {
  terminals: Terminal[]
  onSelectTerminal: (terminal: Terminal) => void
}

export default function TerminalMarkers({ terminals, onSelectTerminal }: Props) {
  return (
    <>
      {terminals.map((terminal) => (
        <Marker
          key={terminal._id}
          position={[terminal.lat, terminal.lng]}
          icon={terminalIcon}
          eventHandlers={{ click: () => onSelectTerminal(terminal) }}
        >
          <Popup>
            <div className="text-sm font-medium">{terminal.name}</div>
            <div className="text-xs text-slate-500">{terminal.location}</div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}