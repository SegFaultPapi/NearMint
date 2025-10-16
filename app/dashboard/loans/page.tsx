"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  CreditCard,
  BarChart3,
  RefreshCw
} from "lucide-react"
import { useUserNFTs } from "@/hooks/use-user-nfts"
import { useVESULending } from "@/hooks/use-vesu-lending"
import { VESULoanResponse } from "@/hooks/use-vesu-lending"
import { toast } from "sonner"

// Mock active loans data
const mockActiveLoans: VESULoanResponse[] = [
  {
    loanId: "VESU-1703123456-abc123def",
    status: "active",
    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    usdcAmount: 2500,
    repaymentAmount: 2625,
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    dailyPayment: 131.25,
    collateralNftId: "nft-1",
    liquidationThreshold: 2000
  },
  {
    loanId: "VESU-1703123457-def456ghi",
    status: "active",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    usdcAmount: 1800,
    repaymentAmount: 1890,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    dailyPayment: 189,
    collateralNftId: "nft-2",
    liquidationThreshold: 1440
  }
]

export default function LoansPage() {
  const { nfts } = useUserNFTs()
  const { repayLoan, checkLiquidationRisk, isProcessing } = useVESULending()
  
  const [activeLoans, setActiveLoans] = useState<VESULoanResponse[]>(mockActiveLoans)
  const [repaymentAmount, setRepaymentAmount] = useState<{ [key: string]: number }>({})
  const [liquidationRisks, setLiquidationRisks] = useState<{ [key: string]: any }>({})

  // Check liquidation risks on component mount
  useEffect(() => {
    const checkRisks = async () => {
      for (const loan of activeLoans) {
        try {
          const risk = await checkLiquidationRisk(loan.loanId)
          setLiquidationRisks(prev => ({
            ...prev,
            [loan.loanId]: risk
          }))
        } catch (error) {
          console.error('Error checking liquidation risk:', error)
        }
      }
    }
    checkRisks()
  }, [activeLoans, checkLiquidationRisk])

  const handleRepayment = async (loanId: string) => {
    const amount = repaymentAmount[loanId] || 0
    if (amount <= 0) {
      toast.error("Por favor ingresa un monto válido")
      return
    }

    try {
      const result = await repayLoan(loanId, amount)
      if (result.success) {
        toast.success("Pago procesado exitosamente", {
          description: `Transacción: ${result.transactionHash.slice(0, 10)}...`
        })
        
        // Update loan status or remove if fully paid
        setActiveLoans(prev => prev.filter(loan => loan.loanId !== loanId))
        setRepaymentAmount(prev => ({ ...prev, [loanId]: 0 }))
      }
    } catch (error) {
      toast.error("Error procesando el pago")
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-500/20 text-green-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'high': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getDaysRemaining = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const getProgressPercentage = (loan: VESULoanResponse) => {
    const totalDays = 30 // Assuming 30-day term
    const daysRemaining = getDaysRemaining(loan.dueDate)
    return ((totalDays - daysRemaining) / totalDays) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-orange-950/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Loan Management</h1>
        <p className="text-gray-400">Manage your active loans and make payments</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Borrowed</p>
              <p className="text-xl font-bold text-white">
                ${activeLoans.reduce((sum, loan) => sum + loan.usdcAmount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
              <CreditCard className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending Payments</p>
              <p className="text-xl font-bold text-white">
                ${activeLoans.reduce((sum, loan) => sum + loan.dailyPayment, 0).toFixed(0)}/day
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Loans</p>
              <p className="text-xl font-bold text-white">{activeLoans.length}</p>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
              <BarChart3 className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Average Risk</p>
              <p className="text-xl font-bold text-white">
                {Object.keys(liquidationRisks).length > 0 
                  ? Object.values(liquidationRisks).reduce((acc: any, risk: any) => {
                      const riskValues = { low: 1, medium: 2, high: 3 }
                      return acc + riskValues[risk.riskLevel]
                    }, 0) / Object.keys(liquidationRisks).length < 2 ? 'Low' : 'Medium'
                  : 'Calculating...'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Loans */}
      {activeLoans.length === 0 ? (
        <Card className="border-white/10 bg-black/40 p-12 backdrop-blur-xl text-center">
          <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Active Loans</h3>
          <p className="text-gray-400 mb-6">
            When you get a loan with VESU, it will appear here for you to manage.
          </p>
          <Button 
            onClick={() => window.location.href = '/dashboard/pawn'}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Get Loan
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {activeLoans.map((loan) => {
            const collateralNFT = nfts.find(nft => nft.id === loan.collateralNftId)
            const daysRemaining = getDaysRemaining(loan.dueDate)
            const progressPercentage = getProgressPercentage(loan)
            const risk = liquidationRisks[loan.loanId]

            return (
              <Card key={loan.loanId} className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Loan Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">Loan {loan.loanId.slice(-8)}</h3>
                        <p className="text-gray-400">Collateral: {collateralNFT?.name || 'NFT not found'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                        {risk && (
                          <Badge className={getRiskBadgeColor(risk.riskLevel)}>
                            Risk {risk.riskLevel}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Loan Progress</span>
                        <span className="text-white">{progressPercentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Start</span>
                        <span>{daysRemaining} days remaining</span>
                      </div>
                    </div>

                    {/* Loan Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Original Amount:</span>
                        <span className="text-white font-semibold">${loan.usdcAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Amount to Pay:</span>
                        <span className="text-white font-semibold">${loan.repaymentAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Daily Payment:</span>
                        <span className="text-orange-400 font-semibold">${loan.dailyPayment.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Due Date:</span>
                        <span className="text-white font-semibold">
                          {new Date(loan.dueDate).toLocaleDateString('en-US')}
                        </span>
                      </div>
                    </div>

                    {/* Risk Warning */}
                    {risk && risk.riskLevel === 'high' && (
                      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                          <div>
                            <h4 className="font-semibold text-red-400">High Liquidation Risk</h4>
                            <p className="text-sm text-red-300">
                              Consider making an additional payment to reduce the risk
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Section */}
                  <div className="space-y-4">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <h4 className="mb-3 font-semibold text-white">Make Payment</h4>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-400">Amount (USDC)</Label>
                          <Input
                            type="number"
                            value={repaymentAmount[loan.loanId] || ''}
                            onChange={(e) => setRepaymentAmount(prev => ({
                              ...prev,
                              [loan.loanId]: Number(e.target.value)
                            }))}
                            placeholder="0.00"
                            className="border-white/10 bg-white/5 text-white"
                          />
                        </div>
                        <Button
                          onClick={() => handleRepayment(loan.loanId)}
                          disabled={isProcessing || !repaymentAmount[loan.loanId]}
                          className="w-full bg-orange-500 text-white hover:bg-orange-600"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Pay
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/10 text-white hover:bg-white/10"
                        onClick={() => {
                          setRepaymentAmount(prev => ({
                            ...prev,
                            [loan.loanId]: loan.dailyPayment
                          }))
                        }}
                      >
                        Daily Payment (${loan.dailyPayment.toFixed(2)})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/10 text-white hover:bg-white/10"
                        onClick={() => {
                          setRepaymentAmount(prev => ({
                            ...prev,
                            [loan.loanId]: loan.repaymentAmount
                          }))
                        }}
                      >
                        Full Payment (${loan.repaymentAmount.toLocaleString()})
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}