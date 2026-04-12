'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bus, Eye, EyeOff } from 'lucide-react'
export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    region: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          city: formData.city,
          region: formData.region,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full h-11 px-3.5 bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm font-light placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:bg-blue-600/5 transition disabled:opacity-50'

  const labelClass =
    'block text-xs font-medium tracking-wider uppercase text-slate-400 mb-1.5'

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        {/* Wordmark */}
        <div className="relative z-10 flex items-center gap-2.5">
        <Link href="/">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <Bus />
            </svg>
          </div>
          </Link>
          <span className="text-white font-bold text-lg tracking-tight">
            Route<span className="text-blue-500">Sync</span> PH
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <span className="inline-block text-blue-500 text-xs font-mono font-medium tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded mb-6">
            Operator Dashboard
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-100 mb-5">
            Manage your routes.<br />
            <span className="text-blue-500">Move the Philippines.</span>
          </h1>
          <p className="text-sm font-light text-slate-500 leading-relaxed max-w-sm">
            A unified dashboard for transport operators — schedule routes,
            publish announcements, and give commuters real-time clarity.
          </p>
        </div>

        {/* Stats */}
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

          {/* Mobile-only wordmark */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
          <Link href="/">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <Bus />
              </svg>
      
            </div>
              </Link>
            <span className="text-white font-bold text-base tracking-tight">
              Route<span className="text-blue-500">Sync</span> PH
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">
              Create your account
            </h2>
            <p className="text-sm font-light text-slate-500">
              Register your transport company to get started
            </p>
          </div>

          {/* Progress bars */}
          <div className="flex gap-1.5 mb-8">
            <div className="h-0.5 flex-1 rounded-full bg-blue-600" />
            <div className="h-0.5 flex-1 rounded-full bg-blue-600" />
            <div className="h-0.5 flex-1 rounded-full bg-white/10" />
          </div>

          {/* Error */}
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
              <label htmlFor="companyName" className={labelClass}>Company Name</label>
              <input id="companyName" name="companyName" placeholder="e.g. Batangas Star Bus Lines" value={formData.companyName} onChange={handleChange} required disabled={loading} className={inputClass} />
            </div>

            <div>
              <label htmlFor="name" className={labelClass}>Contact Person</label>
              <input id="name" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} disabled={loading} className={inputClass} />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email Address</label>
              <input id="email" name="email" type="email" placeholder="you@company.com.ph" value={formData.email} onChange={handleChange} required disabled={loading} className={inputClass} />
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>Phone Number</label>
              <input id="phone" name="phone" type="tel" placeholder="+63 9XX XXX XXXX" value={formData.phone} onChange={handleChange} disabled={loading} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="city" className={labelClass}>City</label>
                <input id="city" name="city" placeholder="Lipa City" value={formData.city} onChange={handleChange} disabled={loading} className={inputClass} />
              </div>
              <div>
                <label htmlFor="region" className={labelClass}>Region</label>
                <input id="region" name="region" placeholder="Region IV-A" value={formData.region} onChange={handleChange} disabled={loading} className={inputClass} />
              </div>
            </div>

            <div className="border-t border-white/5 !my-2" />

            <div>
              <label htmlFor="password" className={labelClass}>Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={`${inputClass} pr-11`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={loading}
                  className=" cursor-pointer absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-slate-500 hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50 rounded-r-lg transition disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={`${inputClass} pr-11`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  disabled={loading}
                  className=" cursor-pointer absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-slate-500 hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50 rounded-r-lg transition disabled:opacity-50"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}