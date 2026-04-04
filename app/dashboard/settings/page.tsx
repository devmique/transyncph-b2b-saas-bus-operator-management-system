'use client'

import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your account settings</p>

      <div className="grid gap-6 max-w-2xl">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Company Name
              </label>
              <p className="text-foreground">{user?.companyName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <p className="text-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" className="mt-4">
              Edit Profile
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Subscription</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Current Plan
              </label>
              <p className="text-foreground font-medium">Professional - ₱12,999/month</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Renewal Date
              </label>
              <p className="text-foreground">May 4, 2024</p>
            </div>
            <Button variant="outline" className="mt-4">
              Manage Subscription
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Security</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Two-Factor Authentication
            </Button>
          </div>
        </Card>

        <Card className="p-6 border-red-200 bg-red-50">
          <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
          <p className="text-red-800 text-sm mb-4">
            Deleting your account is permanent and cannot be undone.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </Card>
      </div>
    </div>
  )
}
