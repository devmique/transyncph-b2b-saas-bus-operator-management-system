'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bus } from 'lucide-react'
import DemoModal from '@/components/demo-modal'

/**
 * Standalone /demo route — useful for direct links, social shares, etc.
 * Renders the DemoModal immediately on mount via `autoOpen` pattern,
 * and redirects home when the user closes it.
 */
export default function DemoPage() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      {/* Simple nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-500 transition">
              <Bus className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              Tran<span className="text-blue-500">Sync</span> PH
            </span>
          </Link>

          <Link href="/" className="text-sm text-slate-400 hover:text-white transition">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Background filler so the page doesn't look empty behind the modal */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-700 text-sm select-none">Loading demo…</p>
      </div>

      {/* Modal — auto-open; closing navigates home */}
      <DemoModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          window.location.href = '/'
        }}
      />
    </main>
  )
}
