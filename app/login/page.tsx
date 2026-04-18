'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Bus, Eye, EyeOff } from 'lucide-react'
import InputField from '@/components/ui/InputField'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-2.5">
          <Link href="/">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Bus className="w-5 h-5 text-white" />
            </div>
          </Link>
          <span className="text-white font-bold text-lg tracking-tight">
            Tran<span className="text-blue-500">Sync</span> PH
          </span>
        </div>

        <div className="relative z-10">
          <span className="inline-block text-blue-500 text-xs font-mono font-medium tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded mb-6">
            Operator Dashboard
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-100 mb-5">
            Welcome back.<br />
            <span className="text-blue-500">Your routes await.</span>
          </h1>
          <p className="text-sm font-light text-slate-500 leading-relaxed max-w-sm">
            Sign in to manage your transport network — update schedules,
            monitor routes, and keep commuters informed in real time.
          </p>
        </div>

        <div className="relative z-10 flex gap-8 border-t border-white/5 pt-6">
          {[
            { num: '120+', label: 'Routes tracked' },
            { num: '17', label: 'Regions covered' },
            { num: 'Live', label: 'Map updates' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold text-slate-100 tracking-tight">{num}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex items-center justify-center px-6 py-12 bg-slate-900/60 backdrop-blur-sm lg:border-l border-white/5">
        <div className="w-full max-w-md">

          {/* Mobile wordmark */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <Link href="/">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bus className="w-4 h-4 text-white" />
              </div>
            </Link>
            <span className="text-white font-bold text-base tracking-tight">
              Route<span className="text-blue-500">Sync</span> PH
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">Sign in</h2>
            <p className="text-sm font-light text-slate-500">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-5">
              <svg className="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@company.com.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

           
            <InputField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="current-password"
              labelSuffix={
                <Link
                  href="/forgot-password"
                  className="text-xs text-slate-500 hover:text-blue-500 transition"
                >
                  Forgot password?
                </Link>
              }
              inputSuffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={loading}
                  className="text-slate-500 hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50 rounded-r-lg transition disabled:opacity-50 cursor-pointer w-full h-full flex items-center justify-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                           >
               {loading ? (
                 <>
                   <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                   </svg>
                   Signing in…
                 </>
               ) : (
                 <>
                   Sign in
                   <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                     <line x1="5" y1="12" x2="19" y2="12" />
                     <polyline points="12 5 19 12 12 19" />
                   </svg>
                 </>
               )}
             </Button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-500 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}