"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { useNearMintNFT } from "@/hooks/use-nearmint-nft"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, AlertCircle, Package, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface TokenizationFormData {
  itemName: string
  description: string
  category: string
  condition: string
  estimatedValue: string
  quantity: number
}

interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
  external_url: string
}

export function TokenizationComponent() {
  const { address, isConnected } = useWallet()
  const { mintNFT, mintBatchNFTs, isLoading, error, contractAddress } = useNearMintNFT()
  
  const [formData, setFormData] = useState<TokenizationFormData>({
    itemName: "",
    description: "",
    category: "",
    condition: "",
    estimatedValue: "",
    quantity: 1,
  })
  
  const [mintResult, setMintResult] = useState<{
    tokenId?: string
    tokenIds?: string[]
    transactionHash?: string
    metadata?: NFTMetadata
    type: 'single' | 'batch' | null
  } | null>(null)

  const [step, setStep] = useState<'form' | 'minting' | 'success'>('form')

  // Generar metadata del NFT basado en los datos del formulario
  const generateNFTMetadata = (formData: TokenizationFormData): NFTMetadata => {
    return {
      name: formData.itemName,
      description: formData.description,
      image: `https://nearmint.io/metadata/${formData.itemName.toLowerCase().replace(/\s+/g, '-')}.png`,
      attributes: [
        {
          trait_type: "Category",
          value: formData.category
        },
        {
          trait_type: "Condition",
          value: formData.condition
        },
        {
          trait_type: "Estimated Value",
          value: formData.estimatedValue
        },
        {
          trait_type: "Tokenized Date",
          value: new Date().toISOString().split('T')[0]
        }
      ],
      external_url: `https://nearmint.io/nft/${formData.itemName.toLowerCase().replace(/\s+/g, '-')}`
    }
  }

  // Resetear estado cuando cambia la wallet
  useEffect(() => {
    if (!isConnected) {
      setMintResult(null)
      setStep('form')
    }
  }, [isConnected])

  const handleInputChange = (field: keyof TokenizationFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      toast.error("Conecta tu wallet primero")
      return
    }

    if (!formData.itemName.trim()) {
      toast.error("El nombre del artículo es requerido")
      return
    }

    setStep('minting')

    try {
      // Generar metadata del NFT
      const nftMetadata = generateNFTMetadata(formData)
      console.log('📝 Generated NFT metadata:', nftMetadata)
      
      let result
      
      if (formData.quantity === 1) {
        // Mint individual
        console.log('🚀 Starting individual mint...')
        result = await mintNFT(address, nftMetadata)
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        setMintResult({
          tokenId: result.tokenId,
          transactionHash: result.transactionHash,
          metadata: nftMetadata,
          type: 'single',
        })
        
        toast.success(`NFT creado exitosamente! Token ID: ${result.tokenId}`)
      } else {
        // Mint batch
        console.log('🚀 Starting batch mint...')
        result = await mintBatchNFTs(address, formData.quantity)
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        setMintResult({
          tokenIds: result.tokenIds,
          transactionHash: result.transactionHash,
          metadata: nftMetadata,
          type: 'batch',
        })
        
        toast.success(`${formData.quantity} NFTs creados exitosamente!`)
      }

      setStep('success')
      
    } catch (err) {
      console.error('Error en tokenización:', err)
      const errorMessage = err instanceof Error ? err.message : "Error al crear el NFT. Intenta nuevamente."
      toast.error(errorMessage)
      setStep('form')
    }
  }

  const resetForm = () => {
    setFormData({
      itemName: "",
      description: "",
      category: "",
      condition: "",
      estimatedValue: "",
      quantity: 1,
    })
    setMintResult(null)
    setStep('form')
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Tokenizar Coleccionable
          </CardTitle>
          <CardDescription>
            Convierte tu coleccionable físico en un NFT digital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Conecta tu wallet para comenzar a tokenizar tus coleccionables
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'minting') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            Tokenizando Coleccionable
          </CardTitle>
          <CardDescription>
            Creando tu NFT en Starknet Mainnet...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-800 dark:text-blue-200">
                  {formData.quantity === 1 ? 'Creando NFT individual...' : `Creando ${formData.quantity} NFTs en lote...`}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <p><strong>Artículo:</strong> {formData.itemName}</p>
                <p><strong>Cantidad:</strong> {formData.quantity} NFT{formData.quantity > 1 ? 's' : ''}</p>
                <p><strong>Red:</strong> Starknet Mainnet</p>
                <p><strong>Contrato:</strong> NearMint NFT</p>
              </div>
              
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  ⚡ Transacción gasless - No necesitas ETH para gas
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Por favor espera mientras procesamos tu transacción...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'success' && mintResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            ¡Tokenización Exitosa!
          </CardTitle>
          <CardDescription>
            Tu coleccionable ha sido convertido en NFT digital
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información del NFT */}
          {mintResult.metadata && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-4 text-lg flex items-center gap-2">
                <Package className="w-5 h-5" />
                Información del NFT
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Nombre:</span>
                    <p className="text-purple-800 dark:text-purple-200 font-medium">{mintResult.metadata.name}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Descripción:</span>
                    <p className="text-purple-800 dark:text-purple-200 text-sm">{mintResult.metadata.description}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Imagen:</span>
                    <p className="text-purple-800 dark:text-purple-200 text-sm font-mono break-all">{mintResult.metadata.image}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Atributos:</span>
                    <div className="space-y-1 mt-1">
                      {mintResult.metadata.attributes.map((attr, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-purple-600 dark:text-purple-400">{attr.trait_type}:</span>
                          <span className="text-purple-800 dark:text-purple-200 font-medium">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Información de la Transacción */}
          <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-4 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {mintResult.type === 'single' ? '🎉 NFT Creado Exitosamente' : '🎉 NFTs Creados Exitosamente'}
            </h3>
            
            <div className="space-y-4">
              {mintResult.type === 'single' && mintResult.tokenId && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Token ID:</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    #{mintResult.tokenId}
                  </Badge>
                </div>
              )}
              
              {mintResult.type === 'batch' && mintResult.tokenIds && (
                <div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Token IDs:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mintResult.tokenIds.map((tokenId, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        #{tokenId}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {mintResult.transactionHash && (
                <div className="pt-2 border-t border-green-200 dark:border-green-700">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Transaction Hash:</p>
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded font-mono text-xs break-all">
                    {mintResult.transactionHash}
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ⚡ Transacción gasless procesada exitosamente
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={resetForm} variant="outline" className="flex-1">
              Tokenizar Otro
            </Button>
            {mintResult.transactionHash && (
              <Button 
                onClick={() => window.open(`https://starkscan.co/tx/${mintResult.transactionHash}`, '_blank')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Ver Transacción
              </Button>
            )}
            <Button 
              onClick={() => window.open(`https://starkscan.co/contract/${contractAddress}`, '_blank')}
              variant="outline"
              className="flex-1"
            >
              Ver Contrato
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Tokenizar Coleccionable
        </CardTitle>
        <CardDescription>
          Convierte tu coleccionable físico en un NFT digital en Starknet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información del Artículo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Nombre del Artículo *</Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange('itemName', e.target.value)}
                  placeholder="ej. Funko Pop Batman #1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="ej. Juguetes, Comics, Trading Cards"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe tu coleccionable..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condición</Label>
                <Input
                  id="condition"
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  placeholder="ej. Nuevo, Excelente, Bueno"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Valor Estimado (USD)</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                  placeholder="ej. 50"
                />
              </div>
            </div>
          </div>

          {/* Cantidad */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad a Tokenizar</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange('quantity', Math.max(1, formData.quantity - 1))}
                disabled={formData.quantity <= 1}
              >
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                className="w-20 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange('quantity', Math.min(10, formData.quantity + 1))}
                disabled={formData.quantity >= 10}
              >
                +
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Máximo 10 NFTs por transacción
            </p>
          </div>

          {/* Información del Contrato */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Información del Contrato</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Red:</strong> Starknet Mainnet</p>
              <p><strong>Contrato:</strong> NearMint NFT</p>
              <p><strong>Dirección:</strong> {contractAddress}</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading || !formData.itemName.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {step === 'minting' ? 
                    (formData.quantity === 1 ? 'Creando NFT...' : `Creando ${formData.quantity} NFTs...`) : 
                    'Procesando...'
                  }
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Tokenizar Coleccionable
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
