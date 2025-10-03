"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Wallet, Globe } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-orange-950/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and security</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Settings */}
        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
              <User className="h-5 w-5 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-white">Display Name</Label>
              <Input defaultValue="Collector Pro" className="border-white/10 bg-white/5 text-white" />
            </div>
            <div>
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                defaultValue="collector@nearmint.com"
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Wallet Address</Label>
              <Input
                readOnly
                value="0x742d35a8c9f1b2e4d6a8f3c5e7b9d1a4f6c8e2a9"
                className="border-white/10 bg-white/5 font-mono text-white"
              />
            </div>
          </div>

          <Separator className="my-6 bg-white/10" />

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
              <Bell className="h-5 w-5 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: "Loan Payment Reminders", description: "Get notified before payments are due" },
              { label: "Marketplace Updates", description: "New items matching your interests" },
              { label: "Price Alerts", description: "When collectible values change significantly" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                <div>
                  <p className="font-semibold text-white">{item.label}</p>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
                <Switch />
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button className="bg-orange-500 text-white hover:bg-orange-600">Save Changes</Button>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 bg-transparent">
              Cancel
            </Button>
          </div>
        </Card>

        {/* Quick Settings */}
        <div className="space-y-6">
          <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                <Shield className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Security</h3>
            </div>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 text-white hover:bg-white/10 bg-transparent"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 text-white hover:bg-white/10 bg-transparent"
              >
                Two-Factor Auth
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 text-white hover:bg-white/10 bg-transparent"
              >
                Connected Devices
              </Button>
            </div>
          </Card>

          <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                <Wallet className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Wallet</h3>
            </div>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 text-white hover:bg-white/10 bg-transparent"
              >
                Connect Wallet
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 text-white hover:bg-white/10 bg-transparent"
              >
                Payment Methods
              </Button>
            </div>
          </Card>

          <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                <Globe className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Preferences</h3>
            </div>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 text-white hover:bg-white/10 bg-transparent"
              >
                Language
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 text-white hover:bg-white/10 bg-transparent"
              >
                Currency
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
