
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
import { OperatorProfile } from '@/types'

interface EditProfileModalProps {
  profile: OperatorProfile
  token: string
  onClose: () => void
  onSaved: (updated: OperatorProfile) => void
}

export default function EditProfileModal({
  profile,
  token,
  onClose,
  onSaved,
}: EditProfileModalProps) {
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
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-slate-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-100">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
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
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-slate-100 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white"
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}