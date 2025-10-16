"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Percent,
  Shield,
  Zap,
  Info
} from "lucide-react"

interface LoanCalculatorProps {
  nftValue: number
  nftName: string
  nftCategory: string
  onCalculate: (calculation: LoanCalculation) => void
}

export interface LoanCalculation {
  loanAmount: number
  interestRate: number
  loanTerm: number
  monthlyPayment: number
  totalRepayment: number
  collateralRatio: number
  riskLevel: 'low' | 'medium' | 'high'
  approvalProbability: number
}

export function LoanCalculator({ nftValue, nftName, nftCategory, onCalculate }: LoanCalculatorProps) {
  // Ensure nftValue is valid
  const validNftValue = Math.max(100, nftValue || 100)
  
  const [loanAmount, setLoanAmount] = useState(Math.max(100, validNftValue * 0.5))
  const [loanTerm, setLoanTerm] = useState(30)
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null)

  // Calculate dynamic interest rate based on NFT value and category
  const calculateInterestRate = (value: number, category: string, amount: number, term: number) => {
    let baseRate = 5.0 // Base rate 5%

    // Adjust based on NFT value
    if (value >= 10000) {
      baseRate -= 0.5 // Premium NFTs get better rates
    } else if (value >= 5000) {
      baseRate -= 0.2
    } else if (value < 1000) {
      baseRate += 1.0 // Lower value NFTs have higher risk
    }

    // Adjust based on category
    const categoryRates: { [key: string]: number } = {
      'pokemon': -0.3, // Pokemon cards are highly liquid
      'baseball': -0.2, // Baseball cards are stable
      'magic': -0.1, // Magic cards are popular
      'comics': 0.0, // Comics are moderate
      'other': 0.2 // Other categories have higher risk
    }
    baseRate += categoryRates[category] || 0.2

    // Adjust based on loan amount relative to NFT value
    const loanRatio = amount / value
    if (loanRatio > 0.7) {
      baseRate += 0.5 // Higher rates for higher loan-to-value ratios
    } else if (loanRatio < 0.3) {
      baseRate -= 0.3 // Lower rates for conservative loans
    }

    // Adjust based on loan term
    if (term > 60) {
      baseRate += 0.5 // Longer terms have higher rates
    } else if (term < 15) {
      baseRate -= 0.2 // Shorter terms get better rates
    }

    return Math.max(2.0, Math.min(12.0, baseRate)) // Clamp between 2% and 12%
  }

  // Calculate risk level
  const calculateRiskLevel = (value: number, amount: number, category: string): 'low' | 'medium' | 'high' => {
    const loanRatio = amount / value
    let riskScore = 0

    // Loan-to-value ratio risk
    if (loanRatio > 0.7) riskScore += 3
    else if (loanRatio > 0.5) riskScore += 1

    // Value risk
    if (value < 1000) riskScore += 2
    else if (value > 10000) riskScore -= 1

    // Category risk
    const categoryRisk: { [key: string]: number } = {
      'pokemon': -1,
      'baseball': -1,
      'magic': 0,
      'comics': 1,
      'other': 2
    }
    riskScore += categoryRisk[category] || 2

    if (riskScore <= 1) return 'low'
    if (riskScore <= 3) return 'medium'
    return 'high'
  }

  // Calculate approval probability
  const calculateApprovalProbability = (value: number, amount: number, category: string, term: number): number => {
    let probability = 85 // Base approval rate

    const loanRatio = amount / value
    if (loanRatio > 0.8) probability -= 20
    else if (loanRatio > 0.6) probability -= 10

    if (value < 500) probability -= 15
    else if (value > 5000) probability += 10

    const categoryBonus: { [key: string]: number } = {
      'pokemon': 10,
      'baseball': 5,
      'magic': 0,
      'comics': -5,
      'other': -10
    }
    probability += categoryBonus[category] || -10

    if (term > 90) probability -= 10
    else if (term < 15) probability -= 5

    return Math.max(30, Math.min(95, probability))
  }

  // Calculate loan details
  const calculateLoan = () => {
    // Ensure loanAmount is valid
    const validLoanAmount = Math.max(100, Math.min(maxLoan, loanAmount))
    
    const interestRate = calculateInterestRate(validNftValue, nftCategory, validLoanAmount, loanTerm)
    const monthlyPayment = (validLoanAmount * (1 + interestRate / 100)) / loanTerm
    const totalRepayment = validLoanAmount * (1 + interestRate / 100)
    const collateralRatio = validLoanAmount / validNftValue
    const riskLevel = calculateRiskLevel(validNftValue, validLoanAmount, nftCategory)
    const approvalProbability = calculateApprovalProbability(validNftValue, validLoanAmount, nftCategory, loanTerm)

    const newCalculation: LoanCalculation = {
      loanAmount: validLoanAmount,
      interestRate,
      loanTerm,
      monthlyPayment,
      totalRepayment,
      collateralRatio,
      riskLevel,
      approvalProbability
    }

    setCalculation(newCalculation)
    onCalculate(newCalculation)
  }

  useEffect(() => {
    calculateLoan()
  }, [loanAmount, loanTerm, validNftValue, nftCategory])

  const maxLoan = Math.max(100, validNftValue * 0.8) // Maximum 80% of NFT value, minimum $100

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'high': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
          <Calculator className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Loan Calculator</h2>
          <p className="text-gray-400">Calculate your loan with dynamic rates</p>
        </div>
      </div>

      {/* NFT Info */}
      <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="mb-2 font-semibold text-white">{nftName}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Category: {nftCategory}</span>
          <span className="text-white font-semibold">Value: ${validNftValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Loan Amount */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <Label className="text-lg font-semibold text-white">Loan Amount</Label>
          <Badge className="bg-cyan-500/20 text-cyan-400">Max: ${maxLoan.toLocaleString()}</Badge>
        </div>
        <div className="mb-4">
          <Slider
            value={[Math.max(100, Math.min(maxLoan, loanAmount))]}
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
              value={isNaN(loanAmount) ? '' : loanAmount}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (!isNaN(value) && value >= 0) {
                  setLoanAmount(value)
                }
              }}
              className="border-white/10 bg-white/5 text-white"
            />
          </div>
        </div>
        <p className="flex items-center gap-2 text-sm text-gray-400">
          <Info className="h-4 w-4" />
          You can borrow up to 80% of your collectible's value
        </p>
      </div>

      {/* Loan Term */}
      <div className="mb-6">
        <Label className="mb-4 block text-lg font-semibold text-white">Loan Term</Label>
        <div className="grid gap-3 md:grid-cols-4">
          {[15, 30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => setLoanTerm(days)}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                loanTerm === days
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-white/10 bg-white/5 hover:border-orange-500/50"
              }`}
            >
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="text-center">
                <p className="font-semibold text-white">{days} Days</p>
                <p className="text-xs text-gray-400">
                  {calculation ? `$${calculation.monthlyPayment.toFixed(0)}/day` : 'Calculating...'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Calculation Results */}
      {calculation && (
        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">Calculation Results</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Interest Rate:</span>
                <span className="text-white font-semibold">{calculation.interestRate.toFixed(2)}% APR</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Daily Payment:</span>
                <span className="text-orange-400 font-semibold">${calculation.monthlyPayment.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Repayment:</span>
                <span className="text-white font-semibold">${calculation.totalRepayment.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Collateral Ratio:</span>
                <span className="text-white font-semibold">{(calculation.collateralRatio * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Risk Level:</span>
                <Badge className={getRiskBadgeColor(calculation.riskLevel)}>
                  {calculation.riskLevel === 'low' ? 'Low' : 
                   calculation.riskLevel === 'medium' ? 'Medium' : 'High'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Approval Probability:</span>
                <span className={`font-semibold ${calculation.approvalProbability >= 80 ? 'text-green-400' : 
                  calculation.approvalProbability >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {calculation.approvalProbability.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Risk Indicators */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <Shield className={`h-5 w-5 ${getRiskColor(calculation.riskLevel)}`} />
              <div>
                <p className="text-sm font-semibold text-white">Security</p>
                <p className="text-xs text-gray-400">
                  {calculation.riskLevel === 'low' ? 'Excellent' : 
                   calculation.riskLevel === 'medium' ? 'Good' : 'Moderate'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm font-semibold text-white">Liquidity</p>
                <p className="text-xs text-gray-400">
                  {nftCategory === 'pokemon' ? 'High' : 
                   nftCategory === 'baseball' ? 'High' : 'Medium'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <Zap className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm font-semibold text-white">Speed</p>
                <p className="text-xs text-gray-400">Approval in minutes</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
