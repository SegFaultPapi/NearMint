"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Scan, CheckCircle2, AlertCircle, Camera, FileText, CreditCard } from "lucide-react"
import Image from "next/image"
import { useNearMintNFT } from "@/hooks/use-nearmint-nft"
import { useWallet } from "@/contexts/wallet-context"
import { PinDialog } from "@/components/pin-dialog"
import { toast } from "sonner"
import { useUserNFTs } from "@/hooks/use-user-nfts"
import { IPFSUploader } from "@/components/ipfs-uploader"
import { UploadResult } from "@/hooks/use-ipfs-upload"
import { PayWithChipiButton } from "@/components/pay-with-chipi-button"
import { useAuth } from "@clerk/nextjs"
import { useTransfer } from "@chipi-stack/nextjs"
import { useWalletWithAuth } from "@/hooks/use-wallet-with-auth"

export default function TokenizePage() {
  const [step, setStep] = useState(1)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [ipfsImages, setIpfsImages] = useState<UploadResult[]>([])
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
  const [isPayingWithWallet, setIsPayingWithWallet] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  
  // Función para pagar con wallet conectada
  const handlePayWithWallet = async () => {
    if (!isConnected || !address) {
      toast.error("Wallet not connected. Connect your wallet first.")
      return
    }

    if (!chipiWallet) {
      toast.error("Chipi wallet not available. Try reloading the page.")
      return
    }

    try {
      setIsPayingWithWallet(true)
      
      // Obtener token de autenticación
      const bearerToken = await getToken()
      if (!bearerToken) {
        throw new Error("Could not get authentication token")
      }

      // Solicitar PIN de la wallet
      const encryptKey = prompt("Enter your wallet PIN to authorize payment:") || ""
      if (!encryptKey) {
        throw new Error("PIN requerido para autorizar el pago")
      }

      const merchantWallet = process.env.NEXT_PUBLIC_MERCHANT_WALLET || "0x4bcc79ce30cc5185b854e6d49f1629c632ec030a3ee41613ce4c464cb8d8d2f"
      
      console.log('💳 Starting payment with wallet:', {
        userWallet: address,
        merchantWallet,
        amount: 0.01,
        token: 'USDC',
        chipiWallet: chipiWallet
      })

      // Mostrar mensaje de verificación de balance
      toast.info("Verifying USDC balance...", { position: "bottom-center" })

      // Perform transfer using ChipiPay SDK with properly structured wallet
      const txHash = await transferAsync({
        params: {
          amount: "0.01",
          encryptKey,
          wallet: chipiWallet, // Use Chipi wallet properly structured
          token: "USDC" as any,
          recipient: merchantWallet,
        },
        bearerToken: bearerToken,
      })

      console.log('✅ Payment successful:', txHash)
      
      toast.success("Payment successful! ✨", { 
        position: "bottom-center",
        description: `Transacción: ${txHash.slice(0, 10)}...`
      })

      setPaymentCompleted(true)

    } catch (error: any) {
      console.error('❌ Error en pago:', error)
      
      let errorMessage = "Unknown payment error"
      
      // Manejar errores específicos de Starknet/Chipi
      if (error.message?.includes("u256_sub Overflow") || error.message?.includes("Overflow")) {
        errorMessage = "Insufficient USDC funds in your wallet"
      } else if (error.message?.includes("multicall-failed")) {
        errorMessage = "Multicall transaction error. Check your USDC balance"
      } else if (error.message?.includes("ENTRYPOINT_FAILED")) {
        errorMessage = "Transaction entry point error"
      } else if (error.message?.includes("insufficient")) {
        errorMessage = "Insufficient funds in your wallet"
      } else if (error.message?.includes("rejected")) {
        errorMessage = "Transaction rejected by user"
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error. Try again"
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(`Error en el pago: ${errorMessage}`, { position: "bottom-center" })
      
      // Mostrar información adicional para debugging
      console.log('🔍 Error details:', {
        errorType: error.type,
        contractAddress: error.contractAddress,
        revertError: error.revertError
      })
      
    } finally {
      setIsPayingWithWallet(false)
    }
  }
  
  // Hooks for real tokenization
  const { address, isConnected } = useWallet()
  const { mintNFT, isLoading: mintLoading, error: mintError } = useNearMintNFT()
  const { addNFT } = useUserNFTs()
  const { getToken } = useAuth()
  const { transferAsync } = useTransfer()
  const { wallet: chipiWallet, isLoading: walletLoading, isError, error, refetch } = useWalletWithAuth()

  // Handle IPFS image upload
  const handleIPFSUploadComplete = (results: UploadResult[]) => {
    setIpfsImages(results)
    
    // Also update local URLs for preview
    const localUrls = results
      .filter(result => result.success && result.ipfsUrl)
      .map(result => result.ipfsUrl!)
    
    setUploadedImages(localUrls)
    
    toast.success(`${results.filter(r => r.success).length} images uploaded to IPFS successfully`)
  }

  // Function to handle tokenization with PIN
  const handlePinSubmit = async (pin: string) => {
    if (!pendingTokenization) return

    setIsTokenizing(true)
    setShowPinDialog(false)

    try {
      // Call real contract with PIN
      // NOTE: mint() automatically mints to caller (connected wallet)
      const result = await mintNFT(pendingTokenization.metadata, pin)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setTokenizationResult({
        tokenId: result.tokenId,
        transactionHash: result.transactionHash,
        metadata: pendingTokenization.metadata
      })
      
      // Save NFT in Clerk metadata
      try {
        // Use IPFS image if available, otherwise use placeholder
        const imageUrl = ipfsImages.length > 0 && ipfsImages[0].success 
          ? ipfsImages[0].ipfsUrl!
          : uploadedImages[0] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800"

        await addNFT({
          tokenId: result.tokenId!,
          name: itemDetails.name,
          category: itemDetails.category,
          value: itemDetails.estimatedValue,
          image: imageUrl,
          status: "available",
          rarity: itemDetails.condition === "Near Mint" ? "Legendary" : itemDetails.condition === "Mint" ? "Mythic" : "Rare",
          acquired: new Date().toISOString().split('T')[0],
          appreciation: "+0%",
          tokenized: true,
          transactionHash: result.transactionHash,
          description: itemDetails.description,
          condition: itemDetails.condition,
        })
        console.log('✅ NFT saved in Clerk metadata')
      } catch (metadataError) {
        console.error('❌ Error saving in Clerk metadata:', metadataError)
        // Don't fail mint if saving metadata fails
      }
      
      toast.success(`NFT created successfully! Token ID: ${result.tokenId}`)
      setPendingTokenization(null)
      
    } catch (error) {
      console.error('Error tokenizing:', error)
      toast.error(`Error tokenizing: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
            { num: 3, label: "Custody & Payment" },
            { num: 4, label: "Verification" },
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
              {idx < 3 && (
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
            <h2 className="mb-6 text-2xl font-bold text-white">Upload Images</h2>
            <p className="mb-6 text-gray-400">
              Images are stored in a decentralized way to ensure 
              permanence and accessibility of your NFT.
            </p>
            
            <IPFSUploader 
              onUploadComplete={handleIPFSUploadComplete}
              maxFiles={3}
              maxSize={10}
              className="text-white"
            />

            {/* Preview Grid */}
            {(uploadedImages.length > 0 || reverseImage) && (
              <div className="mt-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Preview</h3>
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
                Continue to Custody
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Custody & Payment */}
      {step === 3 && (
        <Card className="mx-auto max-w-4xl border-white/10 bg-black/40 p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20">
              <CreditCard className="h-10 w-10 text-blue-400" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white">Secure Custody & Payment</h2>
            <p className="text-gray-400">
              Send your collectible to our secure vaults and pay the custody membership
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Payment */}
            <div className="space-y-6">
              <Card className="border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-xl font-semibold text-white">💳 Custody Membership</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Monthly Custody</span>
                    <span className="text-white font-semibold">$25.00 USDC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Processing</span>
                    <span className="text-white font-semibold">$5.00 USDC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Professional Grading</span>
                    <span className="text-white font-semibold">$15.00 USDC</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">Total</span>
                      <span className="text-xl font-bold text-orange-400">$0.01 USDC</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {!isConnected ? (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <div>
                          <h4 className="font-semibold text-red-400">Wallet Not Connected</h4>
                          <p className="text-sm text-red-300">Connect your wallet to proceed with payment</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Debug Info - Commented out but kept for future debugging needs
                      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                        <h4 className="font-semibold text-yellow-400 mb-2">🔍 Debug Info</h4>
                        <div className="text-xs text-yellow-300 space-y-1">
                          <p>isConnected: {isConnected ? '✅' : '❌'}</p>
                          <p>address: {address ? `${address.slice(0, 10)}...` : 'null'}</p>
                          <p>walletLoading: {walletLoading ? '⏳' : '✅'}</p>
                          <p>chipiWallet: {chipiWallet ? '✅' : '❌'}</p>
                          <p>isError: {isError ? '❌' : '✅'}</p>
                          {error && <p>error: {error.message}</p>}
                          <div className="mt-2 pt-2 border-t border-yellow-500/20">
                            <div className="text-yellow-400 font-semibold">💡 Error Solution:</div>
                            <div className="text-xs text-yellow-200 mt-1">
                              The "u256_sub Overflow" error indicates insufficient USDC funds.
                              <br />• Verify you have at least $0.01 USDC in your wallet
                              <br />• The multicall-failed error also suggests balance issues
                            </div>
                          </div>
                        </div>
                      </div>
                      */}

                      {/* Button 1: Pay with ChipiPay (Direct Link) */}
                      <Button
                        onClick={() => {
                          const merchantWallet = process.env.NEXT_PUBLIC_MERCHANT_WALLET || "0x4bcc79ce30cc5185b854e6d49f1629c632ec030a3ee41613ce4c464cb8d8d2f"
                          const chipiPayUrl = `https://pay.chipipay.com?starknetWallet=${merchantWallet}&usdAmount=0.01`
                          window.open(chipiPayUrl, '_blank')
                        }}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={paymentCompleted}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay with ChipiPay (Direct Link)
                      </Button>
                      
                      {/* Button 2: Pay with Connected Wallet */}
                      <Button
                        onClick={handlePayWithWallet}
                        disabled={paymentCompleted || isPayingWithWallet || walletLoading || !chipiWallet}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        {isPayingWithWallet ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Processing Payment...
                          </>
                        ) : walletLoading ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Loading Wallet...
                          </>
                        ) : !chipiWallet ? (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Wallet Not Available
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay with Connected Wallet
                          </>
                        )}
                      </Button>
                      
                      {/* Botón para reintentar carga de wallet */}
                      {isError && (
                        <Button
                          onClick={() => refetch()}
                          variant="outline"
                          className="w-full border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                        >
                          🔄 Retry Wallet Load
                        </Button>
                      )}
                      {!paymentCompleted && (
                        <Button
                          onClick={() => {
                            setPaymentCompleted(true)
                            toast.success("Payment marked as completed! (Testing)")
                          }}
                          variant="outline"
                          className="w-full border-green-500/20 text-green-400 hover:bg-green-500/10"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Payment as Completed (Testing)
                        </Button>
                      )}

                      {paymentCompleted && (
                        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                            <div>
                              <h4 className="font-semibold text-green-400">Payment Confirmed</h4>
                              <p className="text-sm text-green-300">Your custody membership is active</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-xl font-semibold text-white">📋 Item Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Item:</span>
                    <span className="text-white">{itemDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{itemDetails.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated Value:</span>
                    <span className="text-white">${itemDetails.estimatedValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Condition:</span>
                    <span className="text-white">{itemDetails.condition}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Custody Information */}
            <div className="space-y-6">
              <Card className="border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-xl font-semibold text-white">📦 Ship to Secure Vault</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                      <span className="text-sm font-bold text-green-400">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Secure Packaging</h4>
                      <p className="text-sm text-gray-400">Wrap your collectible in protective materials</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                      <span className="text-sm font-bold text-green-400">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Certified Shipping</h4>
                      <p className="text-sm text-gray-400">Use insured shipping service with tracking</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                      <span className="text-sm font-bold text-green-400">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Secure Storage</h4>
                      <p className="text-sm text-gray-400">Stored in climate-controlled and insured vault</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-xl font-semibold text-white">🏛️ Shipping Address</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-white font-medium">NearMint Vault Services</p>
                  <p className="text-gray-400">123 Blockchain Street</p>
                  <p className="text-gray-400">Crypto City, CC 12345</p>
                  <p className="text-gray-400">United States</p>
                  <div className="mt-3 rounded-lg bg-blue-500/10 p-3">
                    <p className="text-xs text-blue-400 font-medium">📋 Shipping reference:</p>
                    <p className="text-xs text-blue-300 font-mono">NM-{itemDetails.name.slice(0, 8).toUpperCase()}-{Date.now().toString().slice(-6)}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Back to Details
            </Button>
            <Button
              onClick={() => setStep(4)}
              disabled={!paymentCompleted}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Verification
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Verification */}
      {step === 4 && (
        <Card className="mx-auto max-w-3xl border-white/10 bg-black/40 p-8 backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20">
              <Scan className="h-10 w-10 animate-pulse text-cyan-400" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white">Verifying Your Item</h2>
            <p className="mb-8 text-gray-400">Our AI is analyzing your photos and details...</p>

            {/* NFT Image Preview */}
            {uploadedImages.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold text-white">NFT Preview</h3>
                <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-lg">
                  <Image 
                    src={uploadedImages[0] || "/placeholder.svg"} 
                    alt="NFT Preview" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>
            )}

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
                    <h3 className="font-semibold text-red-400">Wallet Not Connected</h3>
                    <p className="text-sm text-red-300">Connect your wallet to tokenize the collectible</p>
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
                onClick={() => setStep(3)}
                variant="outline"
                className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Back to Custody
              </Button>
              <Button
                onClick={() => {
                  if (!isConnected || !address) {
                    toast.error("Connect your wallet first")
                    return
                  }

                  // Generate NFT metadata
                  const nftMetadata = {
                    name: itemDetails.name,
                    description: itemDetails.description,
                    category: itemDetails.category,
                    condition: itemDetails.condition,
                    estimatedValue: itemDetails.estimatedValue,
                    year: itemDetails.year,
                    tokenizedDate: new Date().toISOString().split('T')[0]
                  }
                  
                  // Save pending data and show PIN dialog
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
              <h2 className="mb-4 text-3xl font-bold text-white">Tokenization Successful!</h2>
              <p className="mb-8 text-gray-400">Your collectible has been converted to a digital NFT</p>

              {/* NFT Information */}
              <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-6 text-left">
                <h3 className="mb-4 text-xl font-semibold text-white">NFT Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Token ID:</span>
                    <p className="text-white font-medium">#{tokenizationResult.tokenId}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="text-white font-medium">{tokenizationResult.metadata.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <p className="text-white font-medium">{tokenizationResult.metadata.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Condition:</span>
                    <p className="text-white font-medium">{tokenizationResult.metadata.condition}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Estimated Value:</span>
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
                  Tokenize Another
                </Button>
                <Button
                  onClick={() => window.open(`https://starkscan.co/tx/${tokenizationResult.transactionHash}`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Transaction
                </Button>
                <Button
                  onClick={() => window.open('https://starkscan.co/contract/0x04b820da27ba5d3746c42b3a2b5d30aac509e2c683c4c27b175ca61df97ac98d', '_blank')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  View Contract
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
        title="Confirm Tokenization"
        description="Enter your 4-digit PIN to authorize NFT creation"
      />
    </div>
  )
}
