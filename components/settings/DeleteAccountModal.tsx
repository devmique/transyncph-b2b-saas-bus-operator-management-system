'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authHeaders } from '@/lib/apiHelpers'

interface DeleteAccountModalProps {
  token: string
  companyName: string
  onClose: () => void
  onDeleted: () => void
}

const CONFIRM_PHRASE = 'delete my account'

export default function DeleteAccountModal({
  token,
  companyName,
  onClose,
  onDeleted,
}: DeleteAccountModalProps) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-slate-100 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <DialogTitle className="text-base font-semibold text-slate-100 text-center">
            Delete Account
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400 text-sm leading-relaxed">
            This will permanently delete{' '}
            <span className="text-slate-200 font-medium">{companyName}</span>'s account, all
            routes, schedules, and team data. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Label className="text-xs font-medium tracking-wider uppercase text-slate-500 mb-1.5 block">
            Type{' '}
            <span className="text-red-400 font-mono normal-case tracking-normal">
              "{CONFIRM_PHRASE}"
            </span>{' '}
            to confirm
          </Label>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={CONFIRM_PHRASE}
            className="bg-red-500/5 border-red-500/20 text-slate-200 placeholder:text-slate-600 focus-visible:ring-red-500/10 focus-visible:border-red-500/40"
          />
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
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
            onClick={handleDelete}
            disabled={input !== CONFIRM_PHRASE || loading}
            className="cursor-pointer bg-red-600/80 hover:bg-red-600 text-white disabled:opacity-40"
          >
            {loading ? 'Deleting…' : 'Delete Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}