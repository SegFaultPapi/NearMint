"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Scan, CheckCircle2, AlertCircle, Camera, FileText } from "lucide-react"
import Image from "next/image"
import { useNearMintNFT } from "@/hooks/use-nearmint-nft"
import { useWallet } from "@/contexts/wallet-context"
import { PinDialog } from "@/components/pin-dialog"
import { toast } from "sonner"

export default function TokenizePage() {
  const [step, setStep] = useState(1)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [reverseImage, setReverseImage] = useState<string>("")
  const [itemDetails, setItemDetails] = useState({
    name: "",
    category: "",
    year: "",
    condition: "",
    estimatedValue: "",
    description: "",
  })
  const [isTokenizing, setIsTokenizing] = useState(false)
  const [tokenizationResult, setTokenizationResult] = useState<any>(null)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [pendingTokenization, setPendingTokenization] = useState<{
    metadata: any
  } | null>(null)
  
  // Hooks para tokenización real
  const { address, isConnected } = useWallet()
  const { mintNFT, isLoading: mintLoading, error: mintError } = useNearMintNFT()

  // Función para manejar la tokenización con PIN
  const handlePinSubmit = async (pin: string) => {
    if (!pendingTokenization) return

    setIsTokenizing(true)
    setShowPinDialog(false)

    try {
      // Llamar al contrato real con PIN
      // NOTA: mint() automáticamente mintea al caller (la wallet conectada)
      const result = await mintNFT(pendingTokenization.metadata, pin)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setTokenizationResult({
        tokenId: result.tokenId,
        transactionHash: result.transactionHash,
        metadata: pendingTokenization.metadata
      })
      
      toast.success(`NFT creado exitosamente! Token ID: ${result.tokenId}`)
      setPendingTokenization(null)
      
    } catch (error) {
      console.error('Error tokenizing:', error)
      toast.error(`Error al tokenizar: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      setPendingTokenization(null)
    } finally {
      setIsTokenizing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-cyan-950/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Tokenize Collectible</h1>
        <p className="text-gray-400">Transform your physical collectibles into digital assets</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Upload Photos" },
            { num: 2, label: "Item Details" },
            { num: 3, label: "Verification" },
          ].map((s, idx) => (
            <div key={s.num} className="flex flex-1 items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    step >= s.num
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-white/20 bg-white/5 text-gray-400"
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                </div>
                <span className={`text-sm font-medium ${step >= s.num ? "text-white" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`mx-4 h-0.5 flex-1 transition-all duration-300 ${
                    step > s.num ? "bg-orange-500" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Upload Photos */}
      {step === 1 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-black/40 p-8 backdrop-blur-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">Upload Photos</h2>

            {/* Front Photo Upload */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-white">Front Photo</h3>
              <div className="rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center transition-all duration-300 hover:border-orange-500/50 hover:bg-white/10">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20">
                  <Camera className="h-6 w-6 text-orange-400" />
                </div>
                <h4 className="mb-2 text-sm font-semibold text-white">Upload front photo</h4>
                <p className="mb-4 text-xs text-gray-400">Support for JPG, PNG up to 10MB</p>
                <Button className="bg-orange-500 text-white hover:bg-orange-600">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
            </div>

            {/* Reverse Photo Upload */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-white">Reverse Photo</h3>
              <div className="rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center transition-all duration-300 hover:border-orange-500/50 hover:bg-white/10">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20">
                  <Camera className="h-6 w-6 text-orange-400" />
                </div>
                <h4 className="mb-2 text-sm font-semibold text-white">Upload reverse photo</h4>
                <p className="mb-4 text-xs text-gray-400">Support for JPG, PNG up to 10MB</p>
                <Button className="bg-orange-500 text-white hover:bg-orange-600">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
            </div>

            {/* Preview Grid */}
            {(uploadedImages.length > 0 || reverseImage) && (
              <div className="grid grid-cols-2 gap-4">
                {uploadedImages.length > 0 && (
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image src={uploadedImages[0] || "/placeholder.svg"} alt="Front" fill className="object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">Front</div>
                  </div>
                )}
                {reverseImage && (
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image src={reverseImage || "/placeholder.svg"} alt="Reverse" fill className="object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">Reverse</div>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card className="border-white/10 bg-black/40 p-8 backdrop-blur-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">Photo Guidelines</h2>

            <div className="space-y-4">
              <div className="flex gap-4 rounded-lg bg-white/5 p-4">
                <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-400" />
                <div>
                  <h3 className="mb-1 font-semibold text-white">Clear, Well-Lit Photos</h3>
                  <p className="text-sm text-gray-400">Take photos in good lighting conditions</p>
                </div>
              </div>

              <div className="flex gap-4 rounded-lg bg-white/5 p-4">
                <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-400" />
                <div>
                  <h3 className="mb-1 font-semibold text-white">Multiple Angles</h3>
                  <p className="text-sm text-gray-400">Front, back, and detail shots recommended</p>
                </div>
              </div>

              <div className="flex gap-4 rounded-lg bg-white/5 p-4">
                <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-400" />
                <div>
                  <h3 className="mb-1 font-semibold text-white">Show Condition</h3>
                  <p className="text-sm text-gray-400">Capture any wear, damage, or unique features</p>
                </div>
              </div>

              <div className="flex gap-4 rounded-lg bg-white/5 p-4">
                <AlertCircle className="h-6 w-6 flex-shrink-0 text-orange-400" />
                <div>
                  <h3 className="mb-1 font-semibold text-white">Authentication</h3>
                  <p className="text-sm text-gray-400">Include certificates or grading labels if available</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="mt-6 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
            >
              Continue to Details
            </Button>
          </Card>
        </div>
      )}

      {/* Step 2: Item Details */}
      {step === 2 && (
        <Card className="mx-auto max-w-3xl border-white/10 bg-black/40 p-8 backdrop-blur-xl">
          <h2 className="mb-6 text-2xl font-bold text-white">Item Details</h2>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-white">
                  Item Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Charizard 1st Edition"
                  className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  value={itemDetails.name}
                  onChange={(e) => setItemDetails(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-white">
                  Category
                </Label>
                <Select value={itemDetails.category} onValueChange={(value) => setItemDetails(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pokemon">Pokemon Cards</SelectItem>
                    <SelectItem value="baseball">Baseball Cards</SelectItem>
                    <SelectItem value="magic">Magic: The Gathering</SelectItem>
                    <SelectItem value="comics">Comics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="year" className="text-white">
                  Year
                </Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g., 1999"
                  className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  value={itemDetails.year}
                  onChange={(e) => setItemDetails(prev => ({ ...prev, year: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="condition" className="text-white">
                  Condition
                </Label>
                <Select value={itemDetails.condition} onValueChange={(value) => setItemDetails(prev => ({ ...prev, condition: value }))}>
                  <SelectTrigger className="border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mint">Mint</SelectItem>
                    <SelectItem value="near-mint">Near Mint</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="estimated-value" className="text-white">
                Estimated Value (USD)
              </Label>
              <Input
                id="estimated-value"
                type="number"
                placeholder="e.g., 5000"
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                value={itemDetails.estimatedValue}
                onChange={(e) => setItemDetails(prev => ({ ...prev, estimatedValue: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the item..."
                rows={4}
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                value={itemDetails.description}
                onChange={(e) => setItemDetails(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 flex-shrink-0 text-cyan-400" />
                <div>
                  <h3 className="mb-1 font-semibold text-white">Authentication Documents</h3>
                  <p className="mb-3 text-sm text-gray-400">
                    Upload grading certificates, receipts, or provenance documents
                  </p>
                  <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
              >
                Continue to Verification
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Verification */}
      {step === 3 && (
        <Card className="mx-auto max-w-3xl border-white/10 bg-black/40 p-8 backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20">
              <Scan className="h-10 w-10 animate-pulse text-cyan-400" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white">Verifying Your Item</h2>
            <p className="mb-8 text-gray-400">Our AI is analyzing your photos and details...</p>

            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                <span className="text-white">Image Quality Check</span>
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                <span className="text-white">Authenticity Verification</span>
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                <span className="text-white">Market Value Analysis</span>
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
            </div>

            {/* Wallet Status */}
            {!isConnected && (
              <div className="mb-8 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div>
                    <h3 className="font-semibold text-red-400">Wallet No Conectada</h3>
                    <p className="text-sm text-red-300">Conecta tu wallet para poder tokenizar el coleccionable</p>
                  </div>
                </div>
              </div>
            )}

            {/* Item Summary */}
            <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-6 text-left">
              <h3 className="mb-4 text-xl font-semibold text-white">Item Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <p className="text-white font-medium">{itemDetails.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Category:</span>
                  <p className="text-white font-medium">{itemDetails.category}</p>
                </div>
                <div>
                  <span className="text-gray-400">Year:</span>
                  <p className="text-white font-medium">{itemDetails.year}</p>
                </div>
                <div>
                  <span className="text-gray-400">Condition:</span>
                  <p className="text-white font-medium">{itemDetails.condition}</p>
                </div>
                <div>
                  <span className="text-gray-400">Estimated Value:</span>
                  <p className="text-white font-medium">${itemDetails.estimatedValue}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Back to Details
              </Button>
              <Button
                onClick={() => {
                  if (!isConnected || !address) {
                    toast.error("Conecta tu wallet primero")
                    return
                  }

                  // Generar metadata del NFT
                  const nftMetadata = {
                    name: itemDetails.name,
                    description: itemDetails.description,
                    category: itemDetails.category,
                    condition: itemDetails.condition,
                    estimatedValue: itemDetails.estimatedValue,
                    year: itemDetails.year,
                    tokenizedDate: new Date().toISOString().split('T')[0]
                  }
                  
                  // Guardar datos pendientes y mostrar diálogo de PIN
                  setPendingTokenization({
                    metadata: nftMetadata
                  })
                  setShowPinDialog(true)
                }}
                disabled={isTokenizing || mintLoading || !isConnected}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
              >
                {isTokenizing || mintLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Tokenizing...
                  </>
                ) : (
                  "Tokenize Collectible"
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tokenization Success Modal */}
      {tokenizationResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white">¡Tokenización Exitosa!</h2>
              <p className="mb-8 text-gray-400">Tu coleccionable ha sido convertido en NFT digital</p>

              {/* NFT Information */}
              <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-6 text-left">
                <h3 className="mb-4 text-xl font-semibold text-white">Información del NFT</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Token ID:</span>
                    <p className="text-white font-medium">#{tokenizationResult.tokenId}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Nombre:</span>
                    <p className="text-white font-medium">{tokenizationResult.metadata.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Categoría:</span>
                    <p className="text-white font-medium">{tokenizationResult.metadata.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Condición:</span>
                    <p className="text-white font-medium">{tokenizationResult.metadata.condition}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Valor Estimado:</span>
                    <p className="text-white font-medium">${tokenizationResult.metadata.estimatedValue}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Transaction Hash:</span>
                    <p className="text-white font-mono text-xs break-all">{tokenizationResult.transactionHash}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Contract Address:</span>
                    <p className="text-white font-mono text-xs break-all">0x04b820da27ba5d3746c42b3a2b5d30aac509e2c683c4c27b175ca61df97ac98d</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => {
                    setTokenizationResult(null)
                    setStep(1)
                    setItemDetails({
                      name: "",
                      category: "",
                      year: "",
                      condition: "",
                      estimatedValue: "",
                      description: "",
                    })
                    setUploadedImages([])
                    setReverseImage("")
                  }}
                  variant="outline"
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  Tokenizar Otro
                </Button>
                <Button
                  onClick={() => window.open(`https://starkscan.co/tx/${tokenizationResult.transactionHash}`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ver Transacción
                </Button>
                <Button
                  onClick={() => window.open('https://starkscan.co/contract/0x04b820da27ba5d3746c42b3a2b5d30aac509e2c683c4c27b175ca61df97ac98d', '_blank')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Ver Contrato
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Diálogo de PIN */}
      <PinDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        onSubmit={handlePinSubmit}
        title="Confirmar Tokenización"
        description="Ingresa tu PIN de 4 dígitos para autorizar la creación del NFT"
      />
    </div>
  )
}
