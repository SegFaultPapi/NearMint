"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  hasWallet: boolean
  connect: () => void
  disconnect: () => void
  setWalletAddress: (address: string) => Promise<void>
  checkWalletStatus: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [hasWallet, setHasWallet] = useState(false)
  const router = useRouter()
  const { user, isLoaded } = useUser()

  // Check localStorage and user metadata on mount
  useEffect(() => {
    if (isLoaded && user) {
      checkWalletStatus()
    } else if (isLoaded && !user) {
      // Si no hay usuario, limpiar el estado
      setAddress(null)
      setIsConnected(false)
      setHasWallet(false)
    }
  }, [isLoaded, user])

  const checkWalletStatus = async () => {
    console.log('🔍 Verificando estado de wallet para usuario:', user?.id)
    
    // Primero verificar Clerk metadata
    const clerkMetadata = user?.unsafeMetadata as { hasWallet?: boolean; walletAddress?: string } | undefined
    console.log('📋 Clerk metadata:', clerkMetadata)
    
    // Verificar localStorage
    const storedUserId = localStorage.getItem("chipi_wallet_user_id")
    const storedAddress = localStorage.getItem("chipi_wallet_address")
    const storedConnected = localStorage.getItem("chipi_wallet_connected")
    
    console.log('📦 Datos en localStorage:', {
      storedUserId,
      storedAddress: storedAddress ? `${storedAddress.slice(0, 10)}...` : null,
      storedConnected,
      currentUserId: user?.id
    })
    
    // Si hay datos pero son de otro usuario, limpiarlos
    if (storedUserId && storedUserId !== user?.id) {
      console.log('🧹 Limpiando datos de otro usuario')
      localStorage.removeItem("chipi_wallet_address")
      localStorage.removeItem("chipi_wallet_connected")
      localStorage.removeItem("chipi_wallet_user_id")
      setAddress(null)
      setIsConnected(false)
      setHasWallet(false)
      return
    }
    
    // Si hay dirección en localStorage y está conectada
    if (storedAddress && storedConnected === "true" && storedUserId === user?.id) {
      console.log('✅ Wallet encontrada en localStorage')
      setAddress(storedAddress)
      setIsConnected(true)
      setHasWallet(true)
      return
    }
    
    // Si no hay en localStorage pero sí en Clerk metadata
    if (clerkMetadata?.hasWallet && clerkMetadata?.walletAddress) {
      console.log('♻️ Recuperando wallet desde Clerk metadata')
      const recoveredAddress = clerkMetadata.walletAddress
      
      // Restaurar en localStorage
      localStorage.setItem("chipi_wallet_address", recoveredAddress)
      localStorage.setItem("chipi_wallet_connected", "true")
      localStorage.setItem("chipi_wallet_user_id", user?.id || "")
      
      setAddress(recoveredAddress)
      setIsConnected(true)
      setHasWallet(true)
      return
    }
    
    // Si no hay wallet en ningún lado
    console.log('❌ No se encontró wallet para el usuario')
    setAddress(null)
    setIsConnected(false)
    setHasWallet(false)
  }

  const connect = () => {
    // Redirigir al onboarding para crear wallet
    router.push("/onboarding/create-pin")
  }

  const setWalletAddress = async (newAddress: string) => {
    setAddress(newAddress)
    setIsConnected(true)
    setHasWallet(true)
    localStorage.setItem("chipi_wallet_address", newAddress)
    localStorage.setItem("chipi_wallet_connected", "true")
    if (user?.id) {
      localStorage.setItem("chipi_wallet_user_id", user.id)
    }
    
    // También actualizar Clerk metadata si es posible
    if (user) {
      try {
        await user.update({
          unsafeMetadata: {
            hasWallet: true,
            walletAddress: newAddress,
            walletUpdatedAt: new Date().toISOString(),
          }
        })
        console.log('✅ Wallet guardada en Clerk metadata desde contexto')
      } catch (error) {
        console.error('❌ Error al actualizar Clerk metadata:', error)
        // No interrumpir el flujo si falla
      }
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    setHasWallet(false)
    localStorage.removeItem("chipi_wallet_address")
    localStorage.removeItem("chipi_wallet_connected")
    localStorage.removeItem("chipi_wallet_user_id")
    router.push("/")
  }

  return (
    <WalletContext.Provider 
      value={{ 
        isConnected, 
        address, 
        hasWallet,
        connect, 
        disconnect,
        setWalletAddress,
        checkWalletStatus
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
