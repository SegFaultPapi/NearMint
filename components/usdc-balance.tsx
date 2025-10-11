"use client"

import { useGetTokenBalance } from "@chipi-stack/nextjs"
import { useAuth } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

interface UsdcBalanceProps {
  walletPublicKey: string
  className?: string
}

export function UsdcBalance({ walletPublicKey, className = "" }: UsdcBalanceProps) {
  const { getToken } = useAuth()
  
  const { data: usdcBalance, isLoading, error } = useGetTokenBalance({
    params: {
      chain: "STARKNET",
      chainToken: "USDC",
      walletPublicKey,
    },
    getBearerToken: getToken,
  })

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-muted-foreground">Cargando balance...</span>
      </div>
    )
  }

  if (error) {
    return (
      <p className={`text-destructive ${className}`}>
        Error al cargar balance
      </p>
    )
  }

  const balance = Number(usdcBalance?.balance || 0)

  return (
    <p className={className}>
      ${balance.toFixed(2)}
    </p>
  )
}

