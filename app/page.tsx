'use client'

import Link from 'next/link'
import { MapPin, Clock, TrendingUp, Users, Zap, CheckCircle2, Bus} from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen text-slate-100">

      {/* ── NAVIGATION ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
           
            <div className="cursor-pointer w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <Bus />
              </svg>
            </div>
          
            <span className="font-bold text-base tracking-tight text-white hidden sm:block">
              Route<span className="text-blue-500">Sync</span> PH
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/map" className="text-sm text-slate-400 hover:text-white transition">
              Route Finder
            </Link>
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition">
              Log in
            </Link>
            <Link
              href="/register"
              className="h-9 px-4 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition"
            >
              Get Started
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <div>
              <span className="inline-block text-blue-500 text-xs font-mono font-medium tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded mb-6">
                Operator Dashboard
              </span>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-slate-100 mb-6">
                Streamline your<br />
                <span className="text-blue-500">bus operations.</span>
              </h1>
              <p className="text-lg font-light text-slate-400 leading-relaxed mb-8 max-w-md">
                Manage routes, schedules, and terminals from one powerful platform.
                Reduce costs and improve service reliability across the Philippines.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  href="/register"
                  className="h-11 px-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition"
                >
                  Start Free Trial
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <button className="h-11 px-6 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                  </svg>
                  Watch Demo
                </button>
              </div>
              <p className="text-xs text-slate-600">
                No credit card required · 14-day free trial · Cancel anytime
              </p>
            </div>

            {/* Dashboard mockup */}
            <div className="bg-slate-900/70 backdrop-blur-sm border border-white/8 rounded-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
                <div className="text-xs font-mono text-slate-600">dashboard.routesync.ph</div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Active Routes', val: '47' },
                  { label: 'On Schedule', val: '94%' },
                  { label: 'Alerts', val: '2' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-slate-800/60 border border-white/5 rounded-lg p-3">
                    <div className="text-xs text-slate-500 mb-1">{label}</div>
                    <div className="text-xl font-bold text-slate-100 tracking-tight">{val}</div>
                  </div>
                ))}
              </div>
              <div
                className="rounded-lg h-44 flex items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(255,255,255,0.04) 19px,rgba(255,255,255,0.04) 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(255,255,255,0.04) 19px,rgba(255,255,255,0.04) 20px)',
                  }}
                />
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 176" preserveAspectRatio="none">
                  <path d="M20,140 Q100,40 200,80 T380,50" stroke="#2563eb" strokeWidth="2" fill="none" strokeDasharray="4 3" opacity="0.6" />
                  <path d="M20,100 Q120,160 220,100 T390,120" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.4" />
                  <circle cx="200" cy="80" r="5" fill="#2563eb" opacity="0.9" />
                  <circle cx="200" cy="80" r="10" fill="#2563eb" opacity="0.2" />
                  <circle cx="100" cy="80" r="3" fill="#60a5fa" opacity="0.7" />
                  <circle cx="320" cy="60" r="3" fill="#60a5fa" opacity="0.7" />
                </svg>
                <span className="relative text-xs text-slate-500 font-mono">Live Route Map</span>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { name: 'Batangas – Manila', status: 'On time', color: 'text-emerald-400' },
                  { name: 'Lipa – Tagaytay', status: 'Delayed 8 min', color: 'text-amber-400' },
                ].map(({ name, status, color }) => (
                  <div key={name} className="flex items-center justify-between bg-slate-800/40 border border-white/5 rounded-lg px-3 py-2">
                    <span className="text-xs text-slate-300">{name}</span>
                    <span className={`text-xs font-medium ${color}`}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="border-t border-white/5 py-24 bg-slate-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-500 text-xs font-mono font-medium tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded mb-4">
              Features
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-slate-100 mb-4">
              Built for operators, loved by commuters
            </h2>
            <p className="text-slate-500 font-light max-w-xl mx-auto">
              Everything you need to run efficient, profitable transport operations across the Philippines.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: MapPin, title: 'Route Management', description: 'Create, edit, and optimize routes with an interactive map editor and real-time traffic awareness.' },
              { icon: Clock, title: 'Smart Scheduling', description: 'Automated scheduling that minimizes idle time and keeps your fleet moving efficiently.' },
              { icon: Users, title: 'Driver Management', description: 'Track assignments, hours, and performance metrics for every driver in your fleet.' },
              { icon: TrendingUp, title: 'Analytics Dashboard', description: 'Real-time insights into operations, on-time rates, and revenue performance.' },
              { icon: MapPin, title: 'Public Terminal Map', description: 'A commuter-facing map so passengers can find routes, terminals, and schedules easily.' },
              { icon: Zap, title: 'Live Notifications', description: 'Instant alerts for delays, incidents, and operational changes pushed to your team.' },
            ].map(({ icon: Icon, title, description }, i) => (
              <div
                key={i}
                className="group bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl p-7 hover:border-blue-600/40 hover:bg-slate-900/80 transition"
              >
                <div className="w-10 h-10 bg-blue-600/10 border border-blue-600/20 rounded-lg flex items-center justify-center mb-5 group-hover:bg-blue-600/20 transition">
                  <Icon className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm font-light text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-500 text-xs font-mono font-medium tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded mb-4">
              Pricing
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-slate-100 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 font-light">
              Choose the plan that fits your operation size.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: 'Starter', price: '₱4,999', period: '/month',
                description: 'Perfect for small operators',
                features: ['Up to 10 vehicles', 'Basic route management', '5 team members', 'Email support'],
                cta: 'Get Started', highlighted: false,
              },
              {
                name: 'Professional', price: '₱12,999', period: '/month',
                description: 'For growing bus companies',
                features: ['Up to 50 vehicles', 'Advanced analytics', '25 team members', 'Priority support', 'API access'],
                cta: 'Get Started', highlighted: true,
              },
              {
                name: 'Enterprise', price: 'Custom', period: 'pricing',
                description: 'For large operations',
                features: ['Unlimited vehicles', 'Custom features', 'Dedicated support', 'SLA guarantee', 'On-premise option'],
                cta: 'Contact Sales', highlighted: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col rounded-xl p-8 border transition backdrop-blur-sm ${
                  plan.highlighted
                    ? 'bg-blue-600/10 border-blue-600/50 shadow-xl shadow-blue-900/20'
                    : 'bg-slate-900/60 border-white/8'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-100 mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-500">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-100 tracking-tight">{plan.price}</span>
                  <span className="text-sm text-slate-500 ml-1.5">{plan.period}</span>
                </div>
                <Link
                  href={plan.name !== 'Enterprise' ? '/register' : '/contact'}
                  className={`h-10 flex items-center justify-center text-sm font-semibold rounded-lg transition mb-7 ${
                    plan.highlighted
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300'
                  }`}
                >
                  {plan.cta}
                </Link>
                <ul className="space-y-3 mt-auto">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.highlighted ? 'text-blue-400' : 'text-slate-600'}`} />
                      <span className="text-sm text-slate-400 font-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-100 mb-4">
            Ready to transform your operations?
          </h2>
          <p className="text-slate-500 font-light mb-8 text-lg">
            Join transport operators across the Philippines who trust RouteSync PH to run their network.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 h-12 px-8 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition"
          >
            Start Your Free Trial Today
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-slate-950/80 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
         
            <div className="cursor-pointer w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <Bus/>
              </svg>
            </div>
        
            <span className="text-sm font-bold text-slate-400">
              Route<span className="text-blue-500">Sync</span> PH
            </span>
          </div>
          <p className="text-xs text-slate-600">© 2025 RouteSync PH. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-slate-600">
            <Link href="/privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate.400 transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}