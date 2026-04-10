"use client"
import { usePathname } from 'next/navigation'
export default function FixedBackground() {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')
  const isMap = pathname?.startsWith('/map')
  const isResetPaasswordPages =
  pathname === '/forgot-password' ||
  pathname === '/reset-password'

  if (isDashboard || isMap || isResetPaasswordPages ) {
    return (
      <div className="fixed inset-0 -z-10 bg-slate-950 pointer-events-none" />
    )
  }

    return (
      <div className="fixed inset-0 -z-10 bg-slate-950 pointer-events-none">
        {/* Grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.03) 39px,rgba(255,255,255,0.03) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.03) 39px,rgba(255,255,255,0.03) 40px)',
          }}
        />
        {/* Top-left glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: 640,
            height: 640,
            background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
            top: -160,
            left: -160,
          }}
        />
        {/* Bottom-right glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: 480,
            height: 480,
            background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
            bottom: -120,
            right: -100,
          }}
        />
      </div>
    )
  }