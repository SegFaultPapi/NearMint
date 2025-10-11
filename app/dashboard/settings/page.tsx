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

// Tipos para las configuraciones
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

// Configuraciones por defecto
const defaultSettings: UserSettings = {
  notifications: {
    loanReminders: true,
    marketplaceUpdates: true,
    priceAlerts: false,
    emailNotifications: true,
  },
  preferences: {
    language: "es",
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

  // Cargar configuraciones desde Clerk metadata
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
      console.error('Error al guardar configuraciones:', error)
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
        <h1 className="mb-2 text-4xl font-bold text-white">Configuración</h1>
        <p className="text-gray-400">Gestiona tus preferencias y seguridad de cuenta</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Settings */}
        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
              <User className="h-5 w-5 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Información de Perfil</h2>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Nombre</Label>
                <Input 
                  value={user?.firstName || "Usuario"} 
                  className="border-white/10 bg-white/5 text-white"
                  readOnly
                />
              </div>
              <div>
                <Label className="text-white">Apellido</Label>
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
                Para cambiar tu email, gestiona tu cuenta en Clerk
              </p>
            </div>
            
            <div>
              <Label className="text-white">ID de Usuario</Label>
              <Input
                value={user?.id || ""}
                className="border-white/10 bg-white/5 font-mono text-white text-sm"
                readOnly
              />
            </div>
            
            <div>
              <Label className="text-white">Dirección de Cuenta</Label>
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
                  <p className="text-sm text-orange-400">No tienes una cuenta configurada</p>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6 bg-white/10" />

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
              <Bell className="h-5 w-5 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Notificaciones</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div>
                <p className="font-semibold text-white">Recordatorios de Préstamos</p>
                <p className="text-sm text-gray-400">Notificaciones antes de que venzan los pagos</p>
              </div>
              <Switch 
                checked={settings.notifications.loanReminders}
                onCheckedChange={(checked) => updateNotification('loanReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div>
                <p className="font-semibold text-white">Actualizaciones del Marketplace</p>
                <p className="text-sm text-gray-400">Nuevos artículos que coincidan con tus intereses</p>
              </div>
              <Switch 
                checked={settings.notifications.marketplaceUpdates}
                onCheckedChange={(checked) => updateNotification('marketplaceUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div>
                <p className="font-semibold text-white">Alertas de Precio</p>
                <p className="text-sm text-gray-400">Cuando el valor de tus coleccionables cambie significativamente</p>
              </div>
              <Switch 
                checked={settings.notifications.priceAlerts}
                onCheckedChange={(checked) => updateNotification('priceAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div>
                <p className="font-semibold text-white">Notificaciones por Email</p>
                <p className="text-sm text-gray-400">Recibir resumen diario de actividad</p>
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
            <h2 className="text-2xl font-bold text-white">Preferencias</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Idioma</Label>
              <Select value={settings.preferences.language} onValueChange={(value) => updatePreference('language', value)}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-2 block">Moneda</Label>
              <Select value={settings.preferences.currency} onValueChange={(value) => updatePreference('currency', value)}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                  <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                  <SelectItem value="BRL">BRL - Real Brasileño</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-2 block">Tema</Label>
              <Select value={settings.preferences.theme} onValueChange={(value) => updatePreference('theme', value)}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
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
                <>Guardando...</>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Guardado
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Cambios
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
              <h3 className="text-xl font-bold text-white">Seguridad</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Estado de Cuenta</span>
                <span className="text-sm font-semibold text-green-400">
                  {hasWallet ? "Protegida" : "Sin Proteger"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Autenticación</span>
                <span className="text-sm font-semibold text-white">Clerk</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Cuenta Creada</span>
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
              <h3 className="text-xl font-bold text-white">Cuenta Digital</h3>
            </div>
            {hasWallet && address ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400 mb-1">Dirección</p>
                  <p className="text-xs font-mono text-white break-all">{truncateAddress(address)}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400 mb-1">Red</p>
                  <p className="text-sm font-semibold text-white">Starknet</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/dashboard/wallet'}
                  className="w-full border-white/10 text-white hover:bg-white/10 bg-transparent"
                >
                  Ver Detalles
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400 mb-3">No configurada</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/onboarding/create-pin'}
                  className="w-full border-white/10 text-white hover:bg-white/10 bg-transparent"
                >
                  Configurar Ahora
                </Button>
              </div>
            )}
          </Card>

          <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                <Globe className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Resumen</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Idioma</span>
                <span className="text-sm font-semibold text-white">
                  {settings.preferences.language === 'es' ? 'Español' : 
                   settings.preferences.language === 'en' ? 'English' : 'Português'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Moneda</span>
                <span className="text-sm font-semibold text-white">{settings.preferences.currency}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-gray-400">Notificaciones</span>
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
