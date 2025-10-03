"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const router = useRouter()

  // Check localStorage on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem("wallet_address")
    const storedConnected = localStorage.getItem("wallet_connected")
    if (storedAddress && storedConnected === "true") {
      setAddress(storedAddress)
      setIsConnected(true)
    }
  }, [])

  const connect = () => {
    // Generate a simulated wallet address
    const simulatedAddress = `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`
    setAddress(simulatedAddress)
    setIsConnected(true)
    localStorage.setItem("wallet_address", simulatedAddress)
    localStorage.setItem("wallet_connected", "true")
    // Redirect to dashboard
    router.push("/dashboard")
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    localStorage.removeItem("wallet_address")
    localStorage.removeItem("wallet_connected")
    router.push("/")
  }

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>{children}</WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
