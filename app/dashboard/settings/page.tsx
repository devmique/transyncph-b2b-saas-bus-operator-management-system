'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

// ---------- types ----------
interface OperatorProfile {
  name: string
  email: string
  companyName: string
  phone: string
  city: string
  region: string
  tier: string
  status: string
}

// ---------- helpers ----------
function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// ---------- InputField ----------
function InputField({
  label,
  name,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}) {
  return (
    <div>
      <label className="text-xs font-medium tracking-wider uppercase text-slate-500 mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition"
      />
    </div>
  )
}

// ---------- Toast ----------
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl animate-fade-in-up
        ${type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
    >
      {type === 'success' ? (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
    </div>
  )
}

// ---------- Modal Shell ----------
function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  const backdropRef = useRef<HTMLDivElement>(null)

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ---------- Edit Profile Modal ----------
function EditProfileModal({
  profile,
  token,
  onClose,
  onSaved,
}: {
  profile: OperatorProfile
  token: string
  onClose: () => void
  onSaved: (updated: OperatorProfile) => void
}) {
  const [form, setForm] = useState<OperatorProfile>(profile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.companyName) {
      setError('Name, email, and company name are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/operator/profile', {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          companyName: form.companyName,
          phone: form.phone,
          city: form.city,
          region: form.region,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update profile')
      onSaved({ ...form })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell title="Edit Profile" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} />
          <InputField label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} />
        </div>
        <InputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} />
        <InputField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="City" name="city" value={form.city} onChange={handleChange} />
          <InputField label="Region" name="region" value={form.region} onChange={handleChange} />
        </div>
      </div>
      {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="cursor-pointer h-9 px-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition"
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </ModalShell>
  )
}

// ---------- Change Password Modal ----------
function ChangePasswordModal({
  token,
  onClose,
  onSaved,
}: {
  token: string
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/operator/change-password', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to change password')
      onSaved()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell title="Change Password" onClose={onClose}>
      <div className="space-y-4">
        <InputField label="Current Password" name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} />
        <InputField label="New Password" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} />
        <InputField label="Confirm New Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
      </div>
      {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="cursor-pointer h-9 px-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition"
        >
          {loading ? 'Updating…' : 'Update Password'}
        </button>
      </div>
    </ModalShell>
  )
}

// ---------- Delete Account Modal ----------
function DeleteAccountModal({
  token,
  companyName,
  onClose,
  onDeleted,
}: {
  token: string
  companyName: string
  onClose: () => void
  onDeleted: () => void
}) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const confirmPhrase = 'delete my account'

  async function handleDelete() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/operator/delete-account', {
        method: 'DELETE',
        headers: authHeaders(token),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete account')
      onDeleted()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <ModalShell title="Delete Account" onClose={onClose}>
      <div className="mb-5">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-center text-sm text-slate-400 leading-relaxed">
          This will permanently delete{' '}
          <span className="text-slate-200 font-medium">{companyName}</span>'s account, all routes,
          schedules, and team data. This cannot be undone.
        </p>
      </div>
      <div>
        <label className="text-xs font-medium tracking-wider uppercase text-slate-500 mb-1.5 block">
          Type{' '}
          <span className="text-red-400 font-mono normal-case tracking-normal">"{confirmPhrase}"</span>{' '}
          to confirm
        </label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={confirmPhrase}
          className="w-full h-9 px-3 bg-red-500/5 border border-red-500/20 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/10 transition"
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="cursor-pointer h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition">
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={input !== confirmPhrase || loading}
          className="cursor-pointer h-9 px-5 bg-red-600/80 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition"
        >
          {loading ? 'Deleting…' : 'Delete Account'}
        </button>
      </div>
    </ModalShell>
  )
}

// ---------- Main Page ----------
export default function SettingsPage() {
  const { token, operator, logout } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<OperatorProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [modal, setModal] = useState<'editProfile' | 'changePassword' | 'deleteAccount' | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Fetch full profile (includes phone, city, region not stored in AuthContext)
  useEffect(() => {
    if (!token) return
    async function fetchProfile() {
      try {
        const res = await fetch('/api/operator/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setProfile(data.operator)
      } catch {
        showToast('Failed to load profile', 'error')
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchProfile()
  }, [token])

  function handleProfileSaved(updated: OperatorProfile) {
    setProfile(updated)
    // Keep localStorage in sync for the fields AuthContext caches
    const stored = localStorage.getItem('operator')
    if (stored) {
      const parsed = JSON.parse(stored)
      localStorage.setItem('operator', JSON.stringify({
        ...parsed,
        name: updated.name,
        email: updated.email,
        companyName: updated.companyName,
      }))
    }
    setModal(null)
    showToast('Profile updated successfully', 'success')
  }

  function handlePasswordSaved() {
    setModal(null)
    showToast('Password changed successfully', 'success')
  }

  function handleDeleted() {
    logout()
    router.push('/login')
  }

  const sectionCls = 'bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-xl p-6'
  const rowLabelCls = 'text-xs font-medium tracking-wider uppercase text-slate-500 mb-1'
  const rowValueCls = 'text-sm text-slate-200'
  const outlineBtn = 'h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition'

  return (
    <>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-1">Settings</h1>
          <p className="text-sm font-light text-slate-500">Manage your account and subscription</p>
        </div>

        <div className="space-y-4 max-w-2xl">

          {/* Company / Profile info */}
          <div className={sectionCls}>
            <h2 className="text-sm font-semibold text-slate-100 mb-5">Company Information</h2>
            {loadingProfile ? (
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-5 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-3 w-20 bg-white/5 rounded mb-2" />
                    <div className="h-4 w-36 bg-white/8 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-5">
                <div>
                  <p className={rowLabelCls}>Full Name</p>
                  <p className={rowValueCls}>{profile?.name ?? '—'}</p>
                </div>
                <div>
                  <p className={rowLabelCls}>Company Name</p>
                  <p className={rowValueCls}>{profile?.companyName ?? '—'}</p>
                </div>
                <div>
                  <p className={rowLabelCls}>Email Address</p>
                  <p className={rowValueCls}>{profile?.email ?? '—'}</p>
                </div>
                <div>
                  <p className={rowLabelCls}>Phone Number</p>
                  <p className={rowValueCls}>{profile?.phone ?? '—'}</p>
                </div>
                <div>
                  <p className={rowLabelCls}>City</p>
                  <p className={rowValueCls}>{profile?.city ?? '—'}</p>
                </div>
                <div>
                  <p className={rowLabelCls}>Region</p>
                  <p className={rowValueCls}>{profile?.region ?? '—'}</p>
                </div>
              </div>
            )}
            <button className={outlineBtn} onClick={() => setModal('editProfile')}>
              Edit Profile
            </button>
          </div>

          {/* Subscription — stub */}
          <div className={sectionCls}>
            <h2 className="text-sm font-semibold text-slate-100 mb-5">Subscription</h2>
            <div className="space-y-4 mb-5">
              <div>
                <p className={rowLabelCls}>Current Plan</p>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className={rowValueCls}>
                    {(profile?.tier ?? operator?.tier ?? 'basic')
                      .charAt(0).toUpperCase() +
                      (profile?.tier ?? operator?.tier ?? 'basic').slice(1)}
                  </span>
                  <span className="text-xs font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                    Free during beta
                  </span>
                </div>
              </div>
              <div>
                <p className={rowLabelCls}>Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span className={rowValueCls}>
                    {profile?.status
                      ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1)
                      : 'Active'}
                  </span>
                </div>
              </div>
            </div>
            <button
              disabled
              title="Coming soon"
              className="h-9 px-4 bg-white/5 border border-white/10 text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed"
            >
              Manage Subscription
            </button>
          </div>

          {/* Security */}
          <div className={sectionCls}>
            <h2 className="text-sm font-semibold text-slate-100 mb-4">Security</h2>
            <div className="space-y-2">
              <button
                className={`${outlineBtn} w-full text-left`}
                onClick={() => setModal('changePassword')}
              >
                Change Password
              </button>
              <button
                disabled
                title="Coming soon"
                className={`${outlineBtn} w-full text-left opacity-50 cursor-not-allowed flex items-center justify-between`}
              >
                <span>Two-Factor Authentication</span>
                <span className="text-xs font-mono bg-white/5 border border-white/10 text-slate-500 px-1.5 py-0.5 rounded">
                  Soon
                </span>
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h2>
            <p className="text-xs text-red-500/70 font-light mb-4">
              Deleting your account is permanent and cannot be undone. All routes, schedules, and
              team members will be removed.
            </p>
            <button
              onClick={() => setModal('deleteAccount')}
              className="cursor-pointer h-9 px-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-sm font-semibold rounded-lg transition"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === 'editProfile' && profile && token && (
        <EditProfileModal
          profile={profile}
          token={token}
          onClose={() => setModal(null)}
          onSaved={handleProfileSaved}
        />
      )}
      {modal === 'changePassword' && token && (
        <ChangePasswordModal
          token={token}
          onClose={() => setModal(null)}
          onSaved={handlePasswordSaved}
        />
      )}
      {modal === 'deleteAccount' && token && (
        <DeleteAccountModal
          token={token}
          companyName={profile?.companyName ?? operator?.companyName ?? 'your'}
          onClose={() => setModal(null)}
          onDeleted={handleDeleted}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.2s ease-out; }
        .animate-scale-in   { animation: scale-in 0.15s ease-out; }
      `}</style>
    </>
  )
}