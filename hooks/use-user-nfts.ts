"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { useWallet } from "@/contexts/wallet-context"
import { useNearMintNFT } from "./use-nearmint-nft"

export interface UserNFT {
  id: string
  tokenId: string
  name: string
  category: string
  value: string
  image: string
  status: "available" | "pawned"
  rarity: string
  acquired: string
  appreciation: string
  tokenized: boolean
  transactionHash?: string
  description?: string
  condition?: string
}

export function useUserNFTs() {
  const { user, isLoaded } = useUser()
  const { address } = useWallet()
  const { getNextTokenId, contractAddress } = useNearMintNFT()
  const [nfts, setNfts] = useState<UserNFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalValue, setTotalValue] = useState(0)

  // Obtener NFTs desde Clerk metadata
  const fetchNFTs = useCallback(async () => {
    if (!isLoaded || !user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      // Obtener NFTs del metadata del usuario
      const userMetadata = user.unsafeMetadata as any
      const storedNFTs = userMetadata?.nfts || []
      
      console.log('📦 NFTs en Clerk metadata:', storedNFTs)
      
      // Filtrar solo NFTs del contrato actual y de la wallet actual
      const userNFTs = storedNFTs.filter((nft: any) => 
        nft.contractAddress === contractAddress &&
        nft.ownerAddress === address
      )
      
      setNfts(userNFTs)
      
      // Calcular valor total
      const total = userNFTs.reduce((sum: number, nft: UserNFT) => {
        const value = parseFloat(nft.value.replace(/[$,]/g, ''))
        return sum + (isNaN(value) ? 0 : value)
      }, 0)
      setTotalValue(total)
      
    } catch (error) {
      console.error('❌ Error fetching NFTs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoaded, user, contractAddress, address])

  // Agregar un NFT nuevo
  const addNFT = useCallback(async (nft: Omit<UserNFT, 'id'>) => {
    if (!user) return

    try {
      const newNFT = {
        ...nft,
        id: `${Date.now()}`,
        contractAddress,
        ownerAddress: address,
      }

      const userMetadata = user.unsafeMetadata as any
      const existingNFTs = userMetadata?.nfts || []
      
      const updatedNFTs = [...existingNFTs, newNFT]
      
      // Actualizar metadata en Clerk
      await user.update({
        unsafeMetadata: {
          ...userMetadata,
          nfts: updatedNFTs,
        },
      })
      
      console.log('✅ NFT agregado a Clerk metadata:', newNFT)
      
      // Refrescar lista
      await fetchNFTs()
      
      return newNFT
    } catch (error) {
      console.error('❌ Error adding NFT:', error)
      throw error
    }
  }, [user, contractAddress, address, fetchNFTs])

  // Actualizar status de un NFT
  const updateNFTStatus = useCallback(async (tokenId: string, status: "available" | "pawned") => {
    if (!user) return

    try {
      const userMetadata = user.unsafeMetadata as any
      const existingNFTs = userMetadata?.nfts || []
      
      const updatedNFTs = existingNFTs.map((nft: UserNFT) =>
        nft.tokenId === tokenId ? { ...nft, status } : nft
      )
      
      await user.update({
        unsafeMetadata: {
          ...userMetadata,
          nfts: updatedNFTs,
        },
      })
      
      console.log(`✅ NFT ${tokenId} actualizado a status: ${status}`)
      
      // Refrescar lista
      await fetchNFTs()
    } catch (error) {
      console.error('❌ Error updating NFT status:', error)
      throw error
    }
  }, [user, fetchNFTs])

  // Eliminar un NFT (cuando se vende, por ejemplo)
  const removeNFT = useCallback(async (tokenId: string) => {
    if (!user) return

    try {
      const userMetadata = user.unsafeMetadata as any
      const existingNFTs = userMetadata?.nfts || []
      
      const updatedNFTs = existingNFTs.filter((nft: UserNFT) => nft.tokenId !== tokenId)
      
      await user.update({
        unsafeMetadata: {
          ...userMetadata,
          nfts: updatedNFTs,
        },
      })
      
      console.log(`✅ NFT ${tokenId} eliminado`)
      
      // Refrescar lista
      await fetchNFTs()
    } catch (error) {
      console.error('❌ Error removing NFT:', error)
      throw error
    }
  }, [user, fetchNFTs])

  // Cargar NFTs al montar el componente
  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  return {
    nfts,
    isLoading,
    totalValue,
    addNFT,
    updateNFTStatus,
    removeNFT,
    refetch: fetchNFTs,
  }
}

