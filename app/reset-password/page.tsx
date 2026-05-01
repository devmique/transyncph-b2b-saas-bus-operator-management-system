import { Suspense } from 'react'
import ResetPasswordPage from '@/components/ResetPasswordPage'

export default function Page() {
  return (
    <Suspense fallback={
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  }>
      <ResetPasswordPage />
    </Suspense>
  )
}
