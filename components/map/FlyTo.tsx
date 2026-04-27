'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { Terminal } from '@/types'

export default function FlyTo({ terminal }: { terminal: Terminal | null }) {
  const map = useMap()
  useEffect(() => {
    if (terminal) map.flyTo([terminal.lat, terminal.lng], 15, { duration: 1.2 })
  }, [terminal, map])
  return null
}