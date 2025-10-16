"use client"

import { useState, useEffect } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { useGetWallet } from "@chipi-stack/nextjs"

export function useWalletWithAuth() {
  const { isLoaded, user } = useUser()
  const { getToken, isLoaded: isUserLoaded } = useAuth()
  const { fetchWallet } = useGetWallet() // Usar fetchWallet en lugar de getWalletAsync
  
  const [wallet, setWallet] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadWallet = async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      setError(null)

      if (!isLoaded || !isUserLoaded || !user?.id) {
        throw new Error("User not loaded")
      }

      const token = await getToken()
      if (!token) {
        throw new Error("No auth token")
      }

      console.log('🔍 Fetching wallet for user:', user.id)
      
      const walletData = await fetchWallet({
        params: {
          externalUserId: user.id,
        },
        getBearerToken: async () => token,
      })
      
      console.log('📦 Wallet data received:', walletData)
      
      if (!walletData) {
        throw new Error("Wallet not found")
      }
      
      setWallet(walletData)
    } catch (err) {
      console.error('❌ Error fetching wallet:', err)
      setIsError(true)
      setError(err instanceof Error ? err : new Error("Unknown error"))
      setWallet(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded && isUserLoaded && user?.id) {
      loadWallet()
    } else {
      setIsLoading(false)
      setWallet(null)
    }
  }, [isLoaded, isUserLoaded, user?.id])

  return {
    wallet,
    isLoading,
    isError,
    error,
    refetch: loadWallet,
  }
}
