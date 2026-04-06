'use client'

import { useAuth } from '@/context/AuthContext'

export default function SettingsPage() {
  const { operator } = useAuth()

  const sectionCls = 'bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl p-6'
  const rowLabelCls = 'text-xs font-medium tracking-wider uppercase text-slate-500 mb-1'
  const rowValueCls = 'text-sm text-slate-200'
  const ghostBtn = 'h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition text-left'
  const outlineBtn = 'h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-1">Settings</h1>
        <p className="text-sm font-light text-slate-500">Manage your account and subscription</p>
      </div>

      <div className="space-y-4 max-w-2xl">

        {/* Company info */}
        <div className={sectionCls}>
          <h2 className="text-sm font-semibold text-slate-100 mb-5">Company Information</h2>
          <div className="space-y-4 mb-5">
            <div>
              <p className={rowLabelCls}>Company Name</p>
              <p className={rowValueCls}>{operator?.companyName ?? '—'}</p>
            </div>
            <div>
              <p className={rowLabelCls}>Email Address</p>
              <p className={rowValueCls}>{operator?.email ?? '—'}</p>
            </div>
          </div>
          <button className={outlineBtn}>Edit Profile</button>
        </div>

        {/* Subscription */}
        <div className={sectionCls}>
          <h2 className="text-sm font-semibold text-slate-100 mb-5">Subscription</h2>
          <div className="space-y-4 mb-5">
            <div>
              <p className={rowLabelCls}>Current Plan</p>
              <div className="flex items-center gap-2.5 mt-1">
                <span className={rowValueCls}>Professional</span>
                <span className="text-xs font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                  ₱12,999/mo
                </span>
              </div>
            </div>
            <div>
              <p className={rowLabelCls}>Renewal Date</p>
              <p className={rowValueCls}>May 4, 2025</p>
            </div>
          </div>
          <button className={outlineBtn}>Manage Subscription</button>
        </div>

        {/* Security */}
        <div className={sectionCls}>
          <h2 className="text-sm font-semibold text-slate-100 mb-4">Security</h2>
          <div className="space-y-2">
            <button className={`${ghostBtn} w-full`}>Change Password</button>
            <button className={`${ghostBtn} w-full`}>Two-Factor Authentication</button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h2>
          <p className="text-xs text-red-500/70 font-light mb-4">
            Deleting your account is permanent and cannot be undone.
          </p>
          <button className="h-9 px-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-sm font-semibold rounded-lg transition">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}