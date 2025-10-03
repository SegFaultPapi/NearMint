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

export default function TokenizePage() {
  const [step, setStep] = useState(1)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

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
            { num: 4, label: "Complete" },
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
            <h2 className="mb-6 text-2xl font-bold text-white">Upload Photos</h2>

            {/* Upload Area */}
            <div className="mb-6 rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center transition-all duration-300 hover:border-orange-500/50 hover:bg-white/10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20">
                <Camera className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Upload or drag photos</h3>
              <p className="mb-4 text-sm text-gray-400">Support for JPG, PNG up to 10MB each</p>
              <Button className="bg-orange-500 text-white hover:bg-orange-600">
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
            </div>

            {/* Preview Grid */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-lg">
                    <Image src={img || "/placeholder.svg"} alt={`Upload ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
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
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-white">
                  Category
                </Label>
                <Select>
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
                />
              </div>

              <div>
                <Label htmlFor="condition" className="text-white">
                  Condition
                </Label>
                <Select>
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
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4 opacity-50">
                <span className="text-white">Market Value Analysis</span>
                <div className="h-5 w-5 rounded-full border-2 border-white/20" />
              </div>
            </div>

            <Button
              onClick={() => setStep(4)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
            >
              Complete Verification
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Complete */}
      {step === 4 && (
        <Card className="mx-auto max-w-3xl border-white/10 bg-black/40 p-8 backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white">Tokenization Complete!</h2>
            <p className="mb-8 text-gray-400">Your collectible has been successfully tokenized</p>

            <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-cyan-500/10 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-gray-400">Token ID</span>
                <Badge className="bg-orange-500/20 text-orange-400">NFT-2024-001</Badge>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-gray-400">Blockchain</span>
                <span className="text-white">NEAR Protocol</span>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-gray-400">Estimated Value</span>
                <span className="text-2xl font-bold text-white">$5,200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Available Credit</span>
                <span className="text-xl font-bold text-cyan-400">$3,900</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10">
                View in Collection
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
                Get Loan Now
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
