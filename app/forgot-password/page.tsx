'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bus, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }

      setSent(true)
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


        {sent ? (
          /* ── SUCCESS STATE ── */
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600/10 border border-blue-600/20 rounded-full mb-5">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">Check your inbox</h2>
            <p className="text-sm font-light text-slate-500 mb-1">We sent a password reset link to</p>
            <p className="text-sm font-medium text-slate-300 mb-6">{email}</p>
            <p className="text-xs text-slate-600 mb-8 leading-relaxed">
              Didn&apos;t receive it? Check your spam folder, or{' '}
              <button
                onClick={() => setSent(false)}
                className="text-blue-500 hover:underline focus:outline-none"
              >
                try again
              </button>
              .
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </div>
        ) : (
          /* ── FORM STATE ── */
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">Forgot password?</h2>
              <p className="text-sm font-light text-slate-500">
                Enter your email and we&apos;ll send you a reset link.
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
              <div>
                <label htmlFor="email" className={labelClass}>Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="cursor-pointer w-full h-11 mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                    </svg>
                    Sending link…
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}