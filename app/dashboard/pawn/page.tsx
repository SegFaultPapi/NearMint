"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DollarSign, Calendar, TrendingUp, Shield, Zap, CheckCircle2, Info, ArrowRight } from "lucide-react"
import Image from "next/image"

const availableItems = [
  {
    id: "1",
    name: "Charizard 1st Edition",
    category: "Pokemon",
    value: 5200,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Black Lotus Alpha",
    category: "Magic",
    value: 12000,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Pikachu Illustrator",
    category: "Pokemon",
    value: 3800,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "Babe Ruth Rookie",
    category: "Baseball",
    value: 6200,
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function PawnPage() {
  const [selectedItem, setSelectedItem] = useState(availableItems[0])
  const [loanAmount, setLoanAmount] = useState(2600)
  const [loanTerm, setLoanTerm] = useState("30")

  const maxLoan = selectedItem.value * 0.7
  const interestRate = 5
  const monthlyPayment = (loanAmount * (1 + interestRate / 100)) / Number.parseInt(loanTerm)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-orange-950/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Get Instant Loan</h1>
        <p className="text-gray-400">Unlock liquidity from your collectibles without selling them</p>
      </div>

      {/* Benefits */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-black/40 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
              <Zap className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Instant Approval</p>
              <p className="text-sm text-gray-400">Get funds in minutes</p>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-black/40 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Secure Storage</p>
              <p className="text-sm text-gray-400">Fort Knox level security</p>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-black/40 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Low Interest</p>
              <p className="text-sm text-gray-400">Starting at 5% APR</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Item Selection */}
        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl lg:col-span-2">
          <h2 className="mb-6 text-2xl font-bold text-white">Select Collectible</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {availableItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`group cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                  selectedItem.id === item.id
                    ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20"
                    : "border-white/10 bg-white/5 hover:border-orange-500/50"
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-orange-500/10 to-cyan-500/10">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {selectedItem.id === item.id && (
                    <div className="absolute right-3 top-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-white">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">{item.category}</p>
                    <p className="font-semibold text-orange-400">${item.value.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loan Configuration */}
          <div className="mt-8 space-y-6">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <Label className="text-lg font-semibold text-white">Loan Amount</Label>
                <Badge className="bg-cyan-500/20 text-cyan-400">Max: ${maxLoan.toLocaleString()}</Badge>
              </div>
              <div className="mb-4">
                <Slider
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  max={maxLoan}
                  min={100}
                  step={100}
                  className="mb-2"
                />
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
              </div>
              <p className="flex items-center gap-2 text-sm text-gray-400">
                <Info className="h-4 w-4" />
                You can borrow up to 70% of your collectible's value
              </p>
            </div>

            <div>
              <Label className="mb-4 block text-lg font-semibold text-white">Loan Term</Label>
              <RadioGroup value={loanTerm} onValueChange={setLoanTerm}>
                <div className="grid gap-3 md:grid-cols-3">
                  {["15", "30", "60"].map((days) => (
                    <label
                      key={days}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                        loanTerm === days
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-white/10 bg-white/5 hover:border-orange-500/50"
                      }`}
                    >
                      <RadioGroupItem value={days} />
                      <div>
                        <p className="font-semibold text-white">{days} Days</p>
                        <p className="text-sm text-gray-400">${monthlyPayment.toFixed(0)}/day</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        </Card>

        {/* Right Column - Loan Summary */}
        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <h2 className="mb-6 text-2xl font-bold text-white">Loan Summary</h2>

          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Collectible Value</span>
              <span className="font-semibold text-white">${selectedItem.value.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Loan Amount</span>
              <span className="text-xl font-bold text-orange-400">${loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Interest Rate</span>
              <span className="font-semibold text-white">{interestRate}% APR</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Loan Term</span>
              <span className="font-semibold text-white">{loanTerm} Days</span>
            </div>

            <div className="my-4 h-px bg-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Repayment</span>
              <span className="text-xl font-bold text-white">
                ${(loanAmount * (1 + interestRate / 100)).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-400" />
              <p className="font-semibold text-cyan-400">Payment Schedule</p>
            </div>
            <p className="text-sm text-gray-300">
              Daily payment of ${monthlyPayment.toFixed(2)} for {loanTerm} days
            </p>
          </div>

          <Button className="w-full gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-105 hover:shadow-orange-500/50">
            Get Loan Now
            <ArrowRight className="h-5 w-5" />
          </Button>

          <div className="mt-4 rounded-lg bg-white/5 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <Shield className="h-4 w-4 text-green-400" />
              Your collectible is protected
            </p>
            <p className="text-xs text-gray-400">
              Stored in climate-controlled, insured facilities with 24/7 security monitoring
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
