'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Play } from 'lucide-react'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // true  → video loaded fine, hide placeholder
  // false → video missing/errored, show placeholder
  const [videoReady, setVideoReady] = useState(false)

  // Reset ready-state each time the modal opens so it re-checks
  useEffect(() => {
    if (isOpen) setVideoReady(false)
  }, [isOpen])

  // Pause video and restore scroll when modal closes
  useEffect(() => {
    if (!isOpen) {
      videoRef.current?.pause()
      document.body.style.overflow = ''
    } else {
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      style={{ background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)' }}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-4xl"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'modalIn 0.22s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium transition z-10"
          aria-label="Close demo"
        >
          <X className="w-4 h-4" />
          Close
        </button>

        {/* Glow border */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-blue-600/50 via-blue-400/10 to-transparent shadow-2xl shadow-blue-900/40">

          {/* Player shell */}
          <div className="rounded-2xl overflow-hidden bg-slate-900">

            {/* Traffic-light bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-slate-950/60">
              <button
                onClick={onClose}
                className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-400 transition cursor-pointer"
                aria-label="Close"
              />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs font-mono text-slate-600">demo.mp4</span>
            </div>

            {/* Video area */}
            <div className="relative aspect-video bg-slate-950">

              {/* Actual video — always in the DOM so events fire */}
              <video
                ref={videoRef}
                id="demo-video"
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="/demo-poster.jpg"
                // Hide until ready so it doesn't flash a black bar over the placeholder
                style={{ display: videoReady ? 'block' : 'none' }}
                onLoadedMetadata={() => setVideoReady(true)}
                onCanPlay={() => setVideoReady(true)}
                onError={() => setVideoReady(false)}
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Placeholder — only visible when video isn't ready */}
              {!videoReady && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 select-none"
                  style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%)' }}
                >
                  {/* Grid texture */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px),' +
                        'repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px)',
                    }}
                  />
                  {/* Pulse ring + play icon */}
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-20 h-20 rounded-full bg-blue-600/20 animate-ping" />
                    <div className="relative z-10 w-16 h-16 rounded-full bg-blue-600/20 border border-blue-600/40 flex items-center justify-center backdrop-blur">
                      <Play className="w-7 h-7 text-blue-400 translate-x-0.5" />
                    </div>
                  </div>
                  <p className="relative text-slate-500 text-sm font-light text-center px-6">
                    Video coming soon — add&nbsp;
                    <code className="text-slate-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">public/demo.mp4</code>
                    &nbsp;to enable playback.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="mt-3 text-center text-xs text-slate-600">
          TranSync PH — Full Product Walkthrough &nbsp;·&nbsp; Press&nbsp;
          <kbd className="bg-white/5 border border-white/10 rounded px-1 py-0.5 font-mono text-[10px] text-slate-500">Esc</kbd>
          &nbsp;to close
        </p>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  )
}
