"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth, useUser } from "@clerk/nextjs"
import { useGetWallet } from "@chipi-stack/nextjs"

export function useWalletWithAuth() {
  const { isLoaded, user } = useUser()
  const { getToken, isLoaded: isUserLoaded } = useAuth()
  const { getWalletAsync } = useGetWallet()
  
  const query = useQuery({
    queryKey: ["wallet"],
    enabled: isLoaded && isUserLoaded && !!user?.id,
    queryFn: async () => {
      const token = await getToken()
      if (!token || !user?.id) throw new Error("Missing auth data")
      
      const wallet = await getWalletAsync({
        externalUserId: user.id,
        bearerToken: token,
      })
      
      if (!wallet) throw new Error("Wallet not found")
      return wallet
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  })

  return {
    wallet: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
