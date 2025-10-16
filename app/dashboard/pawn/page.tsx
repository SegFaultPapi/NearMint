"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DollarSign, Calendar, TrendingUp, Shield, Zap, CheckCircle2, Info, ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { useUserNFTs } from "@/hooks/use-user-nfts"
import { VESULendingStats } from "@/components/vesu-lending-stats"
import { VESULendingProcess } from "@/components/vesu-lending-process"
import { LoanCalculator, LoanCalculation } from "@/components/loan-calculator"
import { VESULoanResponse } from "@/hooks/use-vesu-lending"

export default function PawnPage() {
  const { nfts, isLoading } = useUserNFTs()
  
  // Filter only available NFTs for loans
  const availableItems = nfts.filter(nft => nft.status === "available")
  
  const [selectedItem, setSelectedItem] = useState(availableItems[0] || null)
  const [loanAmount, setLoanAmount] = useState(2600)
  const [loanTerm, setLoanTerm] = useState("30")
  const [showVESUProcess, setShowVESUProcess] = useState(false)
  const [activeLoan, setActiveLoan] = useState<VESULoanResponse | null>(null)
  const [loanCalculation, setLoanCalculation] = useState<LoanCalculation | null>(null)

  // Update selected item when availableItems changes
  useEffect(() => {
    if (availableItems.length > 0 && !selectedItem) {
      setSelectedItem(availableItems[0])
    }
  }, [availableItems, selectedItem])

  const maxLoan = selectedItem ? parseFloat(selectedItem.value.replace(/[$,]/g, '')) * 0.7 : 0
  const interestRate = 5
  const monthlyPayment = selectedItem ? (loanAmount * (1 + interestRate / 100)) / Number.parseInt(loanTerm) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-orange-950/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Get Instant Loan</h1>
        <p className="text-gray-400">Unlock liquidity from your collectibles without selling them</p>
      </div>

      {/* VESU Stats */}
      <div className="mb-8">
        <VESULendingStats />
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

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-orange-500" />
                <p className="mt-4 text-gray-400">Loading your collectibles...</p>
              </div>
            </div>
          ) : availableItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Available Collectibles</h3>
              <p className="text-gray-400 mb-4">
                You need to have collectibles with "Available" status to get a loan
              </p>
              <Button 
                onClick={() => window.location.href = '/dashboard/tokenize'}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                Tokenize Collectible
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`group cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                    selectedItem?.id === item.id
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
                    {selectedItem?.id === item.id && (
                      <div className="absolute right-2 top-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="mb-1 text-sm font-semibold text-white">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">{item.category}</p>
                      <p className="text-sm font-semibold text-orange-400">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loan Calculator */}
          {selectedItem && (
            <div className="mt-8">
              <LoanCalculator
                nftValue={Math.max(100, parseFloat(selectedItem.value.replace(/[$,]/g, '')) || 100)}
                nftName={selectedItem.name}
                nftCategory={selectedItem.category}
                onCalculate={(calculation) => {
                  setLoanCalculation(calculation)
                  setLoanAmount(calculation.loanAmount)
                  setLoanTerm(calculation.loanTerm.toString())
                }}
              />
            </div>
          )}
        </Card>

        {/* Right Column - Loan Summary */}
        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <h2 className="mb-6 text-2xl font-bold text-white">Loan Summary</h2>

          {selectedItem && loanCalculation ? (
            <>
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Collectible Value</span>
                  <span className="font-semibold text-white">{selectedItem.value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Loan Amount</span>
                  <span className="text-xl font-bold text-orange-400">${loanCalculation.loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Interest Rate</span>
                  <span className="font-semibold text-white">{loanCalculation.interestRate.toFixed(2)}% APR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Loan Term</span>
                  <span className="font-semibold text-white">{loanCalculation.loanTerm} Days</span>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Repayment</span>
                  <span className="text-xl font-bold text-white">
                    ${loanCalculation.totalRepayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Collateral Ratio</span>
                  <span className="font-semibold text-white">{(loanCalculation.collateralRatio * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="mb-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                  <p className="font-semibold text-cyan-400">Payment Schedule</p>
                </div>
                <p className="text-sm text-gray-300">
                  Daily payment of ${loanCalculation.monthlyPayment.toFixed(2)} for {loanCalculation.loanTerm} days
                </p>
              </div>

              {/* Risk and Approval Info */}
              <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Risk Level</span>
                  <Badge className={
                    loanCalculation.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                    loanCalculation.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }>
                    {loanCalculation.riskLevel === 'low' ? 'Low' : 
                     loanCalculation.riskLevel === 'medium' ? 'Medium' : 'High'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Approval Probability</span>
                  <span className={`font-semibold ${
                    loanCalculation.approvalProbability >= 80 ? 'text-green-400' : 
                    loanCalculation.approvalProbability >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {loanCalculation.approvalProbability.toFixed(0)}%
                  </span>
                </div>
              </div>

              <Button 
                onClick={() => setShowVESUProcess(true)}
                disabled={!loanCalculation || loanCalculation.approvalProbability < 50}
                className="w-full gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-105 hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loanCalculation && loanCalculation.approvalProbability < 50 ? 
                  'Very Low Approval Probability' : 
                  'Get Loan with VESU'
                }
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
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Select a Collectible</h3>
              <p className="text-gray-400 text-sm">
                Choose a collectible from your available items to see loan details
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* VESU Lending Process Modal */}
      {showVESUProcess && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <VESULendingProcess
              selectedNFT={selectedItem}
              loanAmount={loanAmount}
              loanTerm={Number.parseInt(loanTerm)}
              onLoanSuccess={(loanResponse) => {
                setActiveLoan(loanResponse)
                setShowVESUProcess(false)
              }}
            />
          </div>
        </div>
      )}

      {/* Active Loan Status */}
      {activeLoan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white">Loan Approved!</h2>
              <p className="mb-8 text-gray-400">Your VESU loan has been processed successfully</p>

              {/* Loan Information */}
              <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-6 text-left">
                <h3 className="mb-4 text-xl font-semibold text-white">Loan Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Loan ID:</span>
                    <p className="text-white font-medium">{activeLoan.loanId}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount:</span>
                    <p className="text-white font-medium">${activeLoan.usdcAmount.toLocaleString()} USDC</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Due Date:</span>
                    <p className="text-white font-medium">{new Date(activeLoan.dueDate).toLocaleDateString('en-US')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Daily Payment:</span>
                    <p className="text-white font-medium">${activeLoan.dailyPayment.toFixed(2)} USDC</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Collateral:</span>
                    <p className="text-white font-medium">{selectedItem?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Liquidation Threshold:</span>
                    <p className="text-white font-medium">${activeLoan.liquidationThreshold.toLocaleString()}</p>
                  </div>
                </div>
                
                {activeLoan.transactionHash && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="text-gray-400 text-sm">Transaction Hash:</span>
                    <p className="text-white font-mono text-xs break-all">{activeLoan.transactionHash}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => {
                    setActiveLoan(null)
                    setShowVESUProcess(false)
                  }}
                  variant="outline"
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  Close
                </Button>
                <Button
                  onClick={() => window.open(`https://starkscan.co/tx/${activeLoan.transactionHash}`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Transaction
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
