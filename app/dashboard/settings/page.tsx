"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Shield, Wallet, Globe, Copy, CheckCircle2, ExternalLink, Save } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useWallet } from "@/contexts/wallet-context"

// Types for settings
interface UserSettings {
  notifications: {
    loanReminders: boolean
    marketplaceUpdates: boolean
    priceAlerts: boolean
    emailNotifications: boolean
  }
  preferences: {
    language: string
    currency: string
    theme: string
  }
}

// Default settings
const defaultSettings: UserSettings = {
  notifications: {
    loanReminders: true,
    marketplaceUpdates: true,
    priceAlerts: false,
    emailNotifications: true,
  },
  preferences: {
    language: "en",
    currency: "USD",
    theme: "dark",
  },
}

export default function SettingsPage() {
  const { user } = useUser()
  const { address, hasWallet } = useWallet()
  const [copied, setCopied] = useState(false)
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load settings from Clerk metadata
  useEffect(() => {
    if (user?.unsafeMetadata?.settings) {
      setSettings(user.unsafeMetadata.settings as UserSettings)
    }
  }, [user])

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSaveSettings = async () => {
    if (!user) return
    
    setIsSaving(true)
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          settings,
        }
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateNotification = (key: keyof UserSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const updatePreference = (key: keyof UserSettings['preferences'], value: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  const truncateAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-orange-950/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your preferences and account security</p>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">First Name</Label>
                <Input 
                  value={user?.firstName || "User"} 
                  className="border-white/10 bg-white/5 text-white"
                  readOnly
                />
              </div>
              <div>
                <Label className="text-white">Last Name</Label>
                <Input 
                  value={user?.lastName || "-"} 
                  className="border-white/10 bg-white/5 text-white"
                  readOnly
                />
              </div>
            </div>
            
            <div>
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                value={user?.emailAddresses[0]?.emailAddress || ""}
                className="border-white/10 bg-white/5 text-white"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                To change your email, manage your account in Clerk
              </p>
            </div>
            
            <div>
              <Label className="text-white">User ID</Label>
              <Input
                value={user?.id || ""}
                className="border-white/10 bg-white/5 font-mono text-white text-sm"
                readOnly
              />
            </div>
            
            <div>
              <Label className="text-white">Account Address</Label>
              {hasWallet && address ? (
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={address}
                    className="border-white/10 bg-white/5 font-mono text-white text-xs flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://starkscan.co/contract/${address}`, '_blank')}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Shield className="h-4 w-4 text-orange-400" />
                  <p className="text-sm text-orange-400">You don't have an account configured</p>
                </div>
              )}
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
            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div>
                <p className="font-semibold text-white">Loan Reminders</p>
                <p className="text-sm text-gray-400">Notifications before payments are due</p>
              </div>
              <Switch 
                checked={settings.notifications.loanReminders}
                onCheckedChange={(checked) => updateNotification('loanReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div>
                <p className="font-semibold text-white">Marketplace Updates</p>
                <p className="text-sm text-gray-400">New items that match your interests</p>
              </div>
              <Switch 
                checked={settings.notifications.marketplaceUpdates}
                onCheckedChange={(checked) => updateNotification('marketplaceUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div>
                <p className="font-semibold text-white">Price Alerts</p>
                <p className="text-sm text-gray-400">When the value of your collectibles changes significantly</p>
              </div>
              <Switch 
                checked={settings.notifications.priceAlerts}
                onCheckedChange={(checked) => updateNotification('priceAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div>
                <p className="font-semibold text-white">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive daily activity summary</p>
              </div>
              <Switch 
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => updateNotification('emailNotifications', checked)}
              />
            </div>
          </div>

          <Separator className="my-6 bg-white/10" />

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
              <Globe className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Language</Label>
              <Select value={settings.preferences.language} onValueChange={(value) => updatePreference('language', value)}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-2 block">Currency</Label>
              <Select value={settings.preferences.currency} onValueChange={(value) => updatePreference('currency', value)}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="MXN">MXN - Mexican Peso</SelectItem>
                  <SelectItem value="COP">COP - Colombian Peso</SelectItem>
                  <SelectItem value="ARS">ARS - Argentine Peso</SelectItem>
                  <SelectItem value="BRL">BRL - Brazilian Real</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-2 block">Theme</Label>
              <Select value={settings.preferences.theme} onValueChange={(value) => updatePreference('theme', value)}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-orange-500 text-white hover:bg-orange-600 gap-2"
            >
              {isSaving ? (
                <>Saving...</>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Quick Info Cards */}
        <div className="space-y-6">
          <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                <Shield className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Security</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Account Status</span>
                <span className="text-sm font-semibold text-green-400">
                  {hasWallet ? "Protected" : "Unprotected"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Authentication</span>
                <span className="text-sm font-semibold text-white">Clerk</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Account Created</span>
                <span className="text-sm font-semibold text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : "-"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                <Wallet className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Digital Account</h3>
            </div>
            {hasWallet && address ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400 mb-1">Address</p>
                  <p className="text-xs font-mono text-white break-all">{truncateAddress(address)}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400 mb-1">Network</p>
                  <p className="text-sm font-semibold text-white">Starknet</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/dashboard/wallet'}
                  className="w-full border-white/10 text-white hover:bg-white/10 bg-transparent"
                >
                  View Details
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400 mb-3">Not configured</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/onboarding/create-pin'}
                  className="w-full border-white/10 text-white hover:bg-white/10 bg-transparent"
                >
                  Configure Now
                </Button>
              </div>
            )}
          </Card>

          <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                <Globe className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Language</span>
                <span className="text-sm font-semibold text-white">
                  {settings.preferences.language === 'en' ? 'English' : 
                   settings.preferences.language === 'es' ? 'Español' : 'Português'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Currency</span>
                <span className="text-sm font-semibold text-white">{settings.preferences.currency}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Notifications</span>
                <span className="text-sm font-semibold text-white">
                  {Object.values(settings.notifications).filter(Boolean).length} de 4
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
