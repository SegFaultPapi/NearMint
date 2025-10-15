"use client"

import { useState, useCallback } from "react"
import { useCallAnyContract } from "@chipi-stack/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useWallet } from "@/contexts/wallet-context"

// Dirección del contrato NearMint NFT desplegado en mainnet
const NEARMINT_NFT_CONTRACT = "0x04b820da27ba5d3746c42b3a2b5d30aac509e2c683c4c27b175ca61df97ac98d"

interface MintResult {
  tokenId?: string
  transactionHash?: string
  error?: string
}

interface MintBatchResult {
  tokenIds?: string[]
  transactionHash?: string
  error?: string
}

export function useNearMintNFT() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { callAnyContractAsync } = useCallAnyContract()
  const { address, isConnected } = useWallet()
  const { getToken } = useAuth()

  // Mint un NFT individual
  const mintNFT = useCallback(async (to: string, metadata?: any): Promise<MintResult> => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('🎨 Minting NFT to:', to)
      console.log('📋 Contract Address:', NEARMINT_NFT_CONTRACT)
      console.log('📝 Metadata:', metadata)
      
      if (!isConnected || !address) {
        throw new Error("Wallet no conectada")
      }
      
      const bearerToken = await getToken()
      if (!bearerToken) {
        throw new Error("No se pudo obtener el token de autenticación")
      }
      
      // Por ahora, simular la llamada al contrato hasta que tengamos la configuración correcta
      console.log('⚠️ Simulando llamada al contrato - configuración pendiente')
      
      // Simular delay para mostrar el proceso
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generar un tokenId simulado
      const tokenId = Math.floor(Math.random() * 10000).toString()
      const transactionHash = `0x${Math.random().toString(16).substr(2, 40)}`
      
      return {
        tokenId,
        transactionHash,
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear NFT"
      console.error('❌ Error minting NFT:', err)
      setError(errorMessage)
      
      return {
        error: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }, [callAnyContractAsync, address, isConnected, getToken])

  // Mint múltiples NFTs (batch)
  const mintBatchNFTs = useCallback(async (to: string, quantity: number): Promise<MintBatchResult> => {
    setIsLoading(true)
    setError(null)

    try {
      console.log(`🎨 Minting ${quantity} NFTs to:`, to)
      console.log('📋 Contract Address:', NEARMINT_NFT_CONTRACT)
      
      if (!isConnected || !address) {
        throw new Error("Wallet no conectada")
      }
      
      // Por ahora, simular la llamada al contrato
      console.log('⚠️ Simulando llamada batch al contrato - configuración pendiente')
      
      // Simular delay para mostrar el proceso
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generar tokenIds simulados
      const tokenIds = Array.from({ length: quantity }, (_, i) => 
        (Math.floor(Math.random() * 10000) + i).toString()
      )
      const transactionHash = `0x${Math.random().toString(16).substr(2, 40)}`
      
      return {
        tokenIds,
        transactionHash,
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear NFTs en lote"
      console.error('❌ Error minting batch NFTs:', err)
      setError(errorMessage)
      
      return {
        error: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }, [address, isConnected])

  // Obtener el siguiente token ID disponible
  const getNextTokenId = useCallback(async (): Promise<string | null> => {
    try {
      // Por ahora retornar un ID simulado
      return Math.floor(Math.random() * 10000).toString()
    } catch (err) {
      console.error('❌ Error getting next token ID:', err)
      return null
    }
  }, [])

  // Obtener el owner del contrato
  const getOwner = useCallback(async (): Promise<string | null> => {
    try {
      // Por ahora retornar la dirección del contrato como owner
      return NEARMINT_NFT_CONTRACT
    } catch (err) {
      console.error('❌ Error getting owner:', err)
      return null
    }
  }, [])

  return {
    // Funciones
    mintNFT,
    mintBatchNFTs,
    getNextTokenId,
    getOwner,
    
    // Estado
    isLoading,
    error,
    
    // Constantes
    contractAddress: NEARMINT_NFT_CONTRACT,
  }
}

// Hook para obtener información del contrato
export function useContractInfo() {
  const { getNextTokenId, getOwner, contractAddress } = useNearMintNFT()
  const [nextTokenId, setNextTokenId] = useState<string | null>(null)
  const [owner, setOwner] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchContractInfo = useCallback(async () => {
    setIsLoading(true)
    
    try {
      const [tokenId, contractOwner] = await Promise.all([
        getNextTokenId(),
        getOwner(),
      ])
      
      setNextTokenId(tokenId)
      setOwner(contractOwner)
    } catch (err) {
      console.error('❌ Error fetching contract info:', err)
    } finally {
      setIsLoading(false)
    }
  }, [getNextTokenId, getOwner])

  return {
    contractAddress,
    nextTokenId,
    owner,
    isLoading,
    fetchContractInfo,
  }
}