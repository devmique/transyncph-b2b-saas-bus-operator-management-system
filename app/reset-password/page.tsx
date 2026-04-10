'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Bus, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  // Guard: if no token/email in URL, the link is broken
  const invalidLink = !token || !email

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Passwords match', met: password.length > 0 && password === confirm },
  ]

  const allMet = requirements.every((r) => r.met)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!allMet) {
      setError('Please meet all password requirements.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }

      setDone(true)
      setTimeout(() => router.push('/login'), 2500)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full h-11 px-3.5 bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm font-light placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:bg-blue-600/5 transition disabled:opacity-50'

  const labelClass =
    'block text-xs font-medium tracking-wider uppercase text-slate-400 mb-1.5'

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {done ? (
          /* ── SUCCESS STATE ── */
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full mb-5">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">Password updated</h2>
            <p className="text-sm font-light text-slate-500">Redirecting you to sign in…</p>
          </div>
        ) : invalidLink ? (
          /* ── INVALID / MISSING LINK STATE ── */
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full mb-5">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">Invalid reset link</h2>
            <p className="text-sm font-light text-slate-500 mb-6">
              This link is broken or has already been used.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          /* ── RESET FORM ── */
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">Set new password</h2>
              <p className="text-sm font-light text-slate-500">
                Choose a strong password for your account.
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
                {/* Expired token: offer a fresh link */}
                {error.toLowerCase().includes('expired') && (
                  <Link href="/forgot-password" className="ml-auto text-xs text-blue-500 hover:underline shrink-0">
                    Request new link
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* New password */}
              <div>
                <label htmlFor="password" className={labelClass}>New Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className={`${inputClass} pr-11`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={loading}
                    className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-slate-500 hover:text-slate-300 focus:outline-none rounded-r-lg transition disabled:opacity-50 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirm" className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    disabled={loading}
                    className={`${inputClass} pr-11`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    disabled={loading}
                    className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-slate-500 hover:text-slate-300 focus:outline-none rounded-r-lg transition disabled:opacity-50 cursor-pointer"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />}
                  </button>
                </div>
              </div>

              {/* Live requirements checklist */}
              {password.length > 0 && (
                <ul className="space-y-1.5 pt-1">
                  {requirements.map(({ label, met }) => (
                    <li key={label} className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${met ? 'bg-green-500/15' : 'bg-white/5'}`}>
                        <svg
                          className={`w-2.5 h-2.5 transition-colors ${met ? 'text-green-400' : 'text-slate-600'}`}
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="2 6 5 9 10 3" />
                        </svg>
                      </span>
                      <span className={`text-xs transition-colors ${met ? 'text-slate-400' : 'text-slate-600'}`}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="submit"
                disabled={loading || !allMet}
                className="w-full h-11 mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                    </svg>
                    Updating…
                  </>
                ) : (
                  <>
                    Update password
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}