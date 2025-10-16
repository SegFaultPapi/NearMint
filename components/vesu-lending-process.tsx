"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle2, 
  Clock, 
  Shield, 
  DollarSign, 
  ExternalLink, 
  AlertCircle,
  Loader2,
  Zap
} from "lucide-react"
import { useVESULending, VESULoanRequest, VESULoanResponse } from "@/hooks/use-vesu-lending"
import { toast } from "sonner"

interface VESULendingProcessProps {
  selectedNFT: any
  loanAmount: number
  loanTerm: number
  onLoanSuccess: (loanResponse: VESULoanResponse) => void
}

export function VESULendingProcess({ selectedNFT, loanAmount, loanTerm, onLoanSuccess }: VESULendingProcessProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loanResponse, setLoanResponse] = useState<VESULoanResponse | null>(null)
  const { requestLoan, isProcessing, error } = useVESULending()

  const steps = [
    { id: 0, title: "Risk Assessment", description: "VESU analyzes your NFT collateral" },
    { id: 1, title: "Loan Approval", description: "Your loan request is being reviewed" },
    { id: 2, title: "Smart Contract", description: "NFT locked as collateral on blockchain" },
    { id: 3, title: "USDC Transfer", description: "Funds transferred to your wallet" },
    { id: 4, title: "Complete", description: "Loan active and ready to use" }
  ]

  const handleStartLoan = async () => {
    if (!selectedNFT) return

    try {
      const loanRequest: VESULoanRequest = {
        nftId: selectedNFT.id,
        nftName: selectedNFT.name,
        nftValue: parseFloat(selectedNFT.value.replace(/[$,]/g, '')),
        loanAmount,
        loanTerm,
        interestRate: 5.2,
        collateralRatio: 0.7
      }

      const response = await requestLoan(loanRequest)
      setLoanResponse(response)
      onLoanSuccess(response)
      
      toast.success("Loan approved! USDC transferred to your wallet", {
        description: `Transaction: ${response.transactionHash?.slice(0, 10)}...`
      })
    } catch (err) {
      toast.error("Loan request failed", {
        description: error || "Please try again later"
      })
    }
  }

  const simulateProcess = () => {
    setCurrentStep(0)
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval)
          handleStartLoan()
          return prev
        }
        return prev + 1
      })
    }, 1500)
  }

  if (loanResponse) {
    return (
      <Card className="border-green-500/20 bg-green-500/10 p-6 backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-white">Loan Approved!</h3>
          <p className="mb-6 text-gray-400">Your NFT is now locked as collateral with VESU</p>

          <div className="mb-6 space-y-3 rounded-lg bg-white/5 p-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Loan ID:</span>
              <span className="font-mono text-white text-sm">{loanResponse.loanId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">USDC Received:</span>
              <span className="font-bold text-green-400">${loanResponse.usdcAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Repayment:</span>
              <span className="font-bold text-white">${loanResponse.repaymentAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Daily Payment:</span>
              <span className="font-bold text-orange-400">${loanResponse.dailyPayment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Due Date:</span>
              <span className="text-white">{new Date(loanResponse.dueDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => window.open(`https://starkscan.co/tx/${loanResponse.transactionHash}`, '_blank')}
              variant="outline"
              className="flex-1 border-white/10 text-white hover:bg-white/10"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Transaction
            </Button>
            <Button
              onClick={() => window.location.href = '/dashboard/loans'}
              className="flex-1 bg-green-500 text-white hover:bg-green-600"
            >
              Manage Loan
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-purple-600">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">VESU Lending Process</h3>
          <p className="text-sm text-gray-400">Secure blockchain-based lending</p>
        </div>
      </div>

      {isProcessing ? (
        <div className="space-y-4">
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Processing Loan Request</span>
              <span className="text-sm font-semibold text-white">
                {Math.round((currentStep / (steps.length - 1)) * 100)}%
              </span>
            </div>
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 rounded-lg p-3 transition-all ${
                  index <= currentStep
                    ? "bg-orange-500/10 border border-orange-500/20"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  index < currentStep
                    ? "bg-green-500"
                    : index === currentStep
                    ? "bg-orange-500"
                    : "bg-gray-500"
                }`}>
                  {index < currentStep ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : index === currentStep ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Clock className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${
                    index <= currentStep ? "text-white" : "text-gray-400"
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-sm ${
                    index <= currentStep ? "text-gray-300" : "text-gray-500"
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="font-semibold text-blue-400">How VESU Works</span>
            </div>
            <ul className="text-sm text-blue-300 space-y-1">
              <li>• Your NFT is locked in a smart contract as collateral</li>
              <li>• You receive USDC instantly to your wallet</li>
              <li>• Repay daily to unlock your NFT</li>
              <li>• Low liquidation risk with 80% threshold</li>
            </ul>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-white/5 p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-gray-400">Loan Amount</span>
              </div>
              <p className="text-lg font-bold text-white">${loanAmount.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-gray-400">Term</span>
              </div>
              <p className="text-lg font-bold text-white">{loanTerm} Days</p>
            </div>
          </div>

          <Button
            onClick={simulateProcess}
            disabled={isProcessing}
            className="w-full gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-105 hover:shadow-orange-500/50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Get USDC Loan with VESU
              </>
            )}
          </Button>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm font-semibold text-red-400">Error</span>
              </div>
              <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
