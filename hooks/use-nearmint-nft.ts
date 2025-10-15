"use client"

import { useState, useCallback } from "react"
import { useCallAnyContract, useGetWallet } from "@chipi-stack/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useWallet } from "@/contexts/wallet-context"

// Dirección del contrato NearMint NFT desplegado en mainnet
const NEARMINT_NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "0x06ffa01681125163ebdaae8c8ca2f49f42cccda6472f81e71cf31a56eb690701"

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
  const { fetchWallet } = useGetWallet()
  const { address, isConnected } = useWallet()
  const { getToken, userId } = useAuth()

  // Mint un NFT individual
  // NOTA: El contrato mint() automáticamente mintea al caller (la wallet conectada)
  // No se necesita especificar destinatario
  const mintNFT = useCallback(async (metadata?: any, pin?: string): Promise<MintResult> => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('🎨 Minting NFT to: caller (wallet conectada)')
      console.log('📋 Contract Address:', NEARMINT_NFT_CONTRACT)
      console.log('📝 Metadata:', metadata)
      
      if (!isConnected || !address) {
        throw new Error("Wallet no conectada")
      }
      
      const bearerToken = await getToken()
      if (!bearerToken) {
        throw new Error("No se pudo obtener el token de autenticación")
      }
      
      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario")
      }
      
      if (!pin) {
        throw new Error("PIN requerido para la transacción")
      }
      
      console.log('🔍 Obteniendo wallet data...')
      
      // Obtener la información completa de la wallet usando fetchWallet
      const walletData = await fetchWallet({
        params: {
          externalUserId: userId,
        },
        getBearerToken: async () => bearerToken,
      })
      
      console.log('🔍 walletData obtenida:', walletData)
      console.log('🔍 walletData keys:', Object.keys(walletData || {}))
      
      if (!walletData) {
        throw new Error("No se pudo obtener la información de la wallet")
      }
      
      console.log('🚀 Llamando función mint() del contrato...')
      console.log('🔍 El contrato mint() no recibe parámetros - mintea automáticamente al caller')
      
      // Llamada real al contrato usando callAnyContractAsync
      // NOTA: La función mint() del contrato NO recibe parámetros
      // Automáticamente mintea al caller (la wallet que ejecuta la transacción)
      const result = await callAnyContractAsync({
        params: {
          encryptKey: pin,
          wallet: walletData as any, // Usar walletData completo
          contractAddress: NEARMINT_NFT_CONTRACT,
          calls: [
            {
              contractAddress: NEARMINT_NFT_CONTRACT,
              entrypoint: 'mint',
              calldata: [], // ✅ Sin parámetros - el contrato mintea al caller
            }
          ],
        },
        bearerToken,
      })
      
      console.log('✅ Resultado de la transacción:', result)
      console.log('✅ Tipo de result:', typeof result)
      
      const resultData = result as any
      
      if (resultData.error) {
        throw new Error(resultData.error)
      }
      
      // Obtener el token ID del resultado
      const tokenId = resultData.data?.[0] || '1'
      const transactionHash = resultData.transactionHash
      
      return {
        tokenId: tokenId.toString(),
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
  }, [callAnyContractAsync, fetchWallet, address, isConnected, getToken, userId])

  // NOTA: El contrato desplegado NO tiene función mint_batch
  // Esta función retorna error directamente
  const mintBatchNFTs = useCallback(async (quantity: number, pin?: string): Promise<MintBatchResult> => {
    return {
      error: "La función mint_batch no está disponible en el contrato actual. Usa mint() individual."
    }
  }, [])

  // Obtener el siguiente token ID disponible
  const getNextTokenId = useCallback(async (): Promise<string | null> => {
    try {
      const bearerToken = await getToken()
      if (!bearerToken) {
        throw new Error("No se pudo obtener el token de autenticación")
      }
      
      const result = await callAnyContractAsync({
        params: {
          contractAddress: NEARMINT_NFT_CONTRACT,
          entrypoint: 'get_next_token_id',
          calldata: [],
        } as any,
        bearerToken,
      } as any)
      
      const resultData = result as any
      
      if (resultData.error) {
        throw new Error(resultData.error)
      }
      
      return resultData.data?.[0]?.toString() || null
    } catch (err) {
      console.error('❌ Error getting next token ID:', err)
      return null
    }
  }, [callAnyContractAsync, getToken])

  // Obtener el owner del contrato
  const getOwner = useCallback(async (): Promise<string | null> => {
    try {
      const bearerToken = await getToken()
      if (!bearerToken) {
        throw new Error("No se pudo obtener el token de autenticación")
      }
      
      const result = await callAnyContractAsync({
        params: {
          contractAddress: NEARMINT_NFT_CONTRACT,
          entrypoint: 'get_owner',
          calldata: [],
        } as any,
        bearerToken,
      } as any)
      
      const resultData = result as any
      
      if (resultData.error) {
        throw new Error(resultData.error)
      }
      
      return resultData.data?.[0] || null
    } catch (err) {
      console.error('❌ Error getting owner:', err)
      return null
    }
  }, [callAnyContractAsync, getToken])

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