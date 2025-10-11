"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, Copy, ExternalLink, Shield, AlertCircle, RefreshCw, DollarSign } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { useUser } from "@clerk/nextjs"
import { UsdcBalance } from "@/components/usdc-balance"

export default function WalletPage() {
  const { address, isConnected, hasWallet, checkWalletStatus } = useWallet()
  const { user } = useUser()
  const [copied, setCopied] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Actualizar timestamp cuando se conecta
  React.useEffect(() => {
    if (hasWallet && address) {
      setLastUpdated(new Date())
    }
  }, [hasWallet, address])

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRefresh = async () => {
    await checkWalletStatus()
    setLastUpdated(new Date())
  }

  const truncateAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`
  }

  const formatLastUpdated = () => {
    if (!lastUpdated) return "Nunca"
    const now = new Date()
    const diff = now.getTime() - lastUpdated.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return "Hace un momento"
    if (minutes === 1) return "Hace 1 minuto"
    if (minutes < 60) return `Hace ${minutes} minutos`
    
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return "Hace 1 hora"
    if (hours < 24) return `Hace ${hours} horas`
    
    return lastUpdated.toLocaleDateString('es-ES')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-purple-950/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Mi Cuenta</h1>
        <p className="text-gray-400">Información de tu cuenta y transacciones</p>
      </div>

      {/* Wallet Status Card */}
      <Card className="mb-8 overflow-hidden border-white/10 bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-xl">
        <div className="p-8">
          {/* Header con Estado */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-sm text-gray-300">Estado de tu Cuenta</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRefresh}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  title="Actualizar"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-3xl font-bold text-white">
                  {hasWallet ? "Configurada" : "Sin Configurar"}
                </p>
                <Badge 
                  className={`${
                    isConnected 
                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                      : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                  } border`}
                >
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Activa
                    </>
                  ) : (
                    <>
                      <Clock className="mr-1 h-3 w-3" />
                      Última actualización: {formatLastUpdated()}
                    </>
                  )}
                </Badge>
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex-shrink-0">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Mostrar información si tiene wallet, independientemente del estado de conexión */}
          {hasWallet && address ? (
            <>
              {/* Dirección de Wallet */}
              <div className="mb-6">
                <p className="mb-2 text-xs text-gray-400 font-medium">Dirección de Cuenta</p>
                <div className="flex items-center gap-2 rounded-lg bg-black/40 p-4 border border-white/10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0">
                    <span className="text-xs font-bold text-white">0x</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-white text-sm hidden md:block break-all">{address}</p>
                    <p className="font-mono text-white text-sm md:hidden">{truncateAddress(address)}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-gray-400 hover:text-white flex-shrink-0"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-gray-400 hover:text-white flex-shrink-0"
                    onClick={() => window.open(`https://starkscan.co/contract/${address}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Balance Total */}
              <div className="mb-6 rounded-xl bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-cyan-500/20 backdrop-blur-sm p-6 border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-300 font-medium">Balance Total</p>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                    <DollarSign className="h-3 w-3 text-green-400" />
                    <span className="text-xs font-semibold text-green-400">USDC</span>
                  </div>
                </div>
                <UsdcBalance 
                  walletPublicKey={address} 
                  className="text-5xl font-bold text-white"
                />
                <p className="text-xs text-gray-400 mt-2">Red: Starknet</p>
              </div>

              {/* Usuario Info */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="glass-effect rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Usuario</p>
                  <p className="text-white font-medium">{user?.firstName || user?.emailAddresses[0]?.emailAddress || "Usuario"}</p>
                </div>
                <div className="glass-effect rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Red</p>
                  <p className="text-white font-medium">Starknet</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 transition-all duration-200 hover:scale-105"
                  disabled
                >
                  <ArrowDownLeft className="h-5 w-5" />
                  Depositar
                </Button>
                <Button 
                  className="flex-1 gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-105"
                  disabled
                >
                  <ArrowUpRight className="h-5 w-5" />
                  Retirar
                </Button>
              </div>
              <p className="text-xs text-center text-gray-500 mt-3">
                Las transacciones estarán disponibles próximamente
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-400" />
              </div>
              <p className="text-white font-semibold mb-2">No tienes una cuenta configurada</p>
              <p className="text-gray-400 text-sm mb-4">
                Necesitas completar la configuración de seguridad
              </p>
              <Button 
                onClick={() => window.location.href = '/onboarding/create-pin'}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
              >
                <Shield className="mr-2 h-4 w-4" />
                Configurar Ahora
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Transaction History - Siempre mostrar si tiene wallet */}
      {hasWallet && address ? (
        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Historial de Transacciones</h2>
            {!isConnected && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 border">
                <Clock className="mr-1 h-3 w-3" />
                Última actualización: {formatLastUpdated()}
              </Badge>
            )}
          </div>

          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">Aún no tienes transacciones</p>
            <p className="text-gray-500 text-sm mb-4">
              Tus transacciones aparecerán aquí cuando empieces a usar NearMint
            </p>
            {!isConnected && (
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar Estado
              </Button>
            )}
          </div>
        </Card>
      ) : null}
    </div>
  )
}
