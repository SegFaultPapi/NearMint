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
  setWalletAddress: (address: string) => void
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
    
    // Verificar si el localStorage pertenece al usuario actual
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
    
    // Si hay dirección y está marcada como conectada
    if (storedAddress && storedConnected === "true") {
      // Si no hay userId guardado (usuarios antiguos), guardarlo ahora
      if (!storedUserId && user?.id) {
        console.log('💾 Actualizando localStorage con userId')
        localStorage.setItem("chipi_wallet_user_id", user.id)
      }
      
      console.log('✅ Cargando wallet guardada')
      setAddress(storedAddress)
      setIsConnected(true)
      setHasWallet(true)
      return
    }

    // Si no hay datos, el usuario no tiene wallet
    console.log('❌ No se encontró wallet')
    setAddress(null)
    setIsConnected(false)
    setHasWallet(false)

    // TODO: Aquí puedes hacer una llamada a tu API para verificar si el usuario tiene una wallet en ChipiSDK
    // Ejemplo:
    // const response = await fetch(`/api/wallet/check?userId=${user?.id}`)
    // const { hasWallet, address } = await response.json()
    // if (hasWallet) {
    //   setAddress(address)
    //   setHasWallet(true)
    //   setIsConnected(true)
    // }
  }

  const connect = () => {
    // Esta función ahora es más simple - solo marca como conectado
    // La creación real de la wallet se hace con CreateWalletDialog
    if (address) {
      setIsConnected(true)
      localStorage.setItem("chipi_wallet_connected", "true")
      if (user?.id) {
        localStorage.setItem("chipi_wallet_user_id", user.id)
      }
    }
  }

  const setWalletAddress = (newAddress: string) => {
    setAddress(newAddress)
    setIsConnected(true)
    setHasWallet(true)
    localStorage.setItem("chipi_wallet_address", newAddress)
    localStorage.setItem("chipi_wallet_connected", "true")
    if (user?.id) {
      localStorage.setItem("chipi_wallet_user_id", user.id)
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
