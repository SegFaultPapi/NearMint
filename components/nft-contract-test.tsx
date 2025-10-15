"use client"

import { useState } from "react"
import { useNearMintNFT, useContractInfo } from "@/hooks/use-nearmint-nft"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export function NFTContractTest() {
  const { address, isConnected } = useWallet()
  const { mintNFT, isLoading, error, contractAddress } = useNearMintNFT()
  const { nextTokenId, owner, fetchContractInfo, isLoading: contractInfoLoading } = useContractInfo()
  
  const [mintResult, setMintResult] = useState<{
    tokenId?: string
    transactionHash?: string
    error?: string
  } | null>(null)

  const handleMintTest = async () => {
    if (!isConnected || !address) {
      alert("Conecta tu wallet primero")
      return
    }

    try {
      const result = await mintNFT(address)
      setMintResult(result)
    } catch (err) {
      console.error("Error en mint test:", err)
      setMintResult({ error: "Error al mintear NFT" })
    }
  }

  const handleFetchContractInfo = async () => {
    await fetchContractInfo()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Contrato NFT NearMint - Mainnet
          </CardTitle>
          <CardDescription>
            Prueba de integración con el contrato NFT desplegado en Starknet Mainnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Información del Contrato</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Address:</span>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                    {contractAddress}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Network:</span>
                  <Badge variant="outline" className="ml-2">
                    {process.env.NEXT_PUBLIC_STARKNET_NETWORK || 'mainnet'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Estado de la Wallet</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Conectada:</span>
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? "Sí" : "No"}
                  </Badge>
                </div>
                {address && (
                  <div>
                    <span className="text-sm font-medium">Address:</span>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                      {address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Contrato</CardTitle>
          <CardDescription>
            Obtener información en tiempo real del contrato NFT
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleFetchContractInfo}
            disabled={contractInfoLoading}
            className="w-full"
          >
            {contractInfoLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Obteniendo información...
              </>
            ) : (
              "Obtener Información del Contrato"
            )}
          </Button>
          
          {(nextTokenId || owner) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Próximo Token ID:</span>
                <p className="text-lg font-mono bg-blue-50 p-2 rounded">
                  {nextTokenId || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Owner:</span>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                  {owner || "N/A"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prueba de Mint</CardTitle>
          <CardDescription>
            Probar la función de minteo de NFTs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleMintTest}
            disabled={!isConnected || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minteando NFT...
              </>
            ) : (
              "Mintear NFT de Prueba"
            )}
          </Button>
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
          
          {mintResult && (
            <div className="space-y-3">
              {mintResult.error ? (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">{mintResult.error}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700">NFT minteado exitosamente!</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <span className="text-sm font-medium">Token ID:</span>
                      <p className="text-lg font-mono bg-blue-50 p-2 rounded">
                        {mintResult.tokenId}
                      </p>
                    </div>
                    
                    {mintResult.transactionHash && (
                      <div>
                        <span className="text-sm font-medium">Transaction Hash:</span>
                        <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                          {mintResult.transactionHash}
                        </p>
                        <a 
                          href={`https://starkscan.co/tx/${mintResult.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-1 block"
                        >
                          Ver en Starkscan →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
