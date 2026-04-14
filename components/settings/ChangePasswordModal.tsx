'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import InputField from '@/components/ui/InputField'
import { authHeaders } from '@/lib/apiHelpers'

interface ChangePasswordModalProps {
  token: string
  onClose: () => void
  onSaved: () => void
}

export default function ChangePasswordModal({
  token,
  onClose,
  onSaved,
}: ChangePasswordModalProps) {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
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
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-slate-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-100">
            Change Password
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <InputField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={handleChange}
          />
          <InputField
            label="New Password"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
          />
          <InputField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-slate-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white"
          >
            {loading ? 'Updating…' : 'Update Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}