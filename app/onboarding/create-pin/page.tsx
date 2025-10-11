"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@clerk/nextjs"
import { useCreateWallet } from "@chipi-stack/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, Shield, Sparkles } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"

export default function CreatePinPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const { createWalletAsync, data, isLoading, error } = useCreateWallet()
  const { setWalletAddress, hasWallet } = useWallet()

  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [step, setStep] = useState<"setup" | "creating" | "success">("setup")
  const [shouldCheckWallet, setShouldCheckWallet] = useState(false)

  // Activar la verificación de wallet después de 500ms para evitar redirect inmediato
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldCheckWallet(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Si el usuario ya completó la configuración, redirigir al dashboard
  // Solo después de que haya pasado el tiempo inicial
  useEffect(() => {
    if (isLoaded && shouldCheckWallet && hasWallet && step === "setup") {
      router.push("/dashboard")
    }
  }, [isLoaded, shouldCheckWallet, hasWallet, step, router])

  // Si no hay usuario autenticado, redirigir a sign-in
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in")
    }
  }, [isLoaded, user, router])

  const handlePinChange = (value: string, setter: (value: string) => void) => {
    // Solo permitir números y máximo 4 dígitos
    if (value === "" || (/^\d+$/.test(value) && value.length <= 4)) {
      setter(value)
      setPinError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPinError("")

    // Validaciones
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setPinError("El PIN debe tener exactamente 4 dígitos")
      return
    }

    if (pin !== confirmPin) {
      setPinError("Los PINs no coinciden")
      return
    }

    if (!user?.id) {
      setPinError("Error de autenticación. Por favor, inicia sesión nuevamente")
      return
    }

    try {
      setStep("creating")

      // Obtener el token de Clerk
      const bearerToken = await getToken()

      if (!bearerToken) {
        setPinError("No se pudo obtener el token de autenticación")
        setStep("setup")
        return
      }

      // Configurar seguridad con ChipiSDK
      const wallet = await createWalletAsync({
        params: {
          encryptKey: pin,
          externalUserId: user.id, // ID de Clerk
        },
        bearerToken,
      })

      // Guardar la configuración en el contexto
      if (wallet?.wallet?.publicKey) {
        setWalletAddress(wallet.wallet.publicKey)
        setStep("success")

        // Redirigir al dashboard después de 3 segundos
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      }
    } catch (err) {
      console.error("Error al configurar la seguridad:", err)
      setPinError(err instanceof Error ? err.message : "Error al completar la configuración")
      setStep("setup")
    }
  }

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed top-1/2 left-1/3 w-2 h-2 bg-success rounded-full animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        {step === "setup" && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 animate-bounce">
                  <Shield className="text-primary-foreground w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-3">
                ¡Bienvenido, {user.firstName || "Usuario"}! 🎉
              </h1>
              <p className="text-muted-foreground text-lg mb-2">
                Último paso: configura tu PIN de seguridad
              </p>
              <p className="text-muted-foreground text-sm">
                Lo necesitarás para autorizar tus transacciones
              </p>
            </div>

            {/* Info Card */}
            <div className="glass-effect rounded-2xl p-6 mb-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-2">Medida de Seguridad</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Tu PIN protegerá todas tus transacciones en NearMint. Solo tú podrás autorizar 
                    operaciones con tus coleccionables.
                    <strong className="text-foreground"> Simple, seguro y privado.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-foreground font-medium text-base">
                  Crea tu PIN de 4 dígitos
                </Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value, setPin)}
                  placeholder="••••"
                  maxLength={4}
                  className="glass-effect border-white/10 text-foreground text-center text-3xl tracking-[1rem] focus:border-primary/50 focus:ring-2 focus:ring-primary/20 h-16 rounded-xl"
                  required
                  autoComplete="off"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPin" className="text-foreground font-medium text-base">
                  Confirma tu PIN
                </Label>
                <Input
                  id="confirmPin"
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  value={confirmPin}
                  onChange={(e) => handlePinChange(e.target.value, setConfirmPin)}
                  placeholder="••••"
                  maxLength={4}
                  className="glass-effect border-white/10 text-foreground text-center text-3xl tracking-[1rem] focus:border-primary/50 focus:ring-2 focus:ring-primary/20 h-16 rounded-xl"
                  required
                  autoComplete="off"
                />
              </div>

              {pinError && (
                <div className="glass-effect border border-destructive/50 rounded-xl p-4 bg-destructive/10 animate-in fade-in slide-in-from-top-2">
                  <p className="text-destructive text-sm font-medium">{pinError}</p>
                </div>
              )}

              {error && (
                <div className="glass-effect border border-destructive/50 rounded-xl p-4 bg-destructive/10 animate-in fade-in slide-in-from-top-2">
                  <p className="text-destructive text-sm font-medium">
                    Error: {error.message || "No se pudo completar la configuración"}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || pin.length !== 4 || confirmPin.length !== 4}
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground h-14 text-lg font-semibold shadow-xl shadow-primary/50 hover:shadow-2xl hover:shadow-primary/60 transition-smooth hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Configurando Seguridad...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Confirmar y Continuar
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground mt-6">
              🔒 Tu PIN es confidencial. Guárdalo en un lugar seguro y no lo compartas con nadie.
            </p>
          </>
        )}

        {step === "creating" && (
          <div className="text-center space-y-6 py-12">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Configurando tu Cuenta</h2>
              <p className="text-muted-foreground">
                Estamos preparando todo de forma segura...
              </p>
            </div>
            <div className="glass-effect rounded-xl p-4 border border-white/10 max-w-xs mx-auto">
              <p className="text-xs text-muted-foreground">
                Esto puede tomar unos segundos. No cierres esta ventana.
              </p>
            </div>
          </div>
        )}

        {step === "success" && data && (
          <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">¡Todo Listo! 🎉</h2>
              <p className="text-muted-foreground mb-6">
                Tu cuenta ha sido configurada exitosamente
              </p>
            </div>

            <div className="glass-effect rounded-xl p-6 border border-success/20 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-medium">PIN de seguridad configurado</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-medium">Cuenta protegida</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-medium">Lista para transacciones</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirigiendo al dashboard...
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Ya puedes empezar a tokenizar tus coleccionables
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

