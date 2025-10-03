"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, Copy } from "lucide-react"

const transactions = [
  {
    id: "1",
    type: "deposit",
    amount: 5000,
    date: "2024-04-01",
    status: "completed",
    description: "Wallet deposit",
  },
  {
    id: "2",
    type: "loan",
    amount: -2500,
    date: "2024-03-28",
    status: "completed",
    description: "Loan disbursement - Charizard",
  },
  {
    id: "3",
    type: "repayment",
    amount: 1750,
    date: "2024-03-25",
    status: "completed",
    description: "Loan repayment",
  },
  {
    id: "4",
    type: "purchase",
    amount: -4200,
    date: "2024-03-20",
    status: "completed",
    description: "Marketplace purchase",
  },
]

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-purple-950/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Wallet</h1>
        <p className="text-gray-400">Manage your funds and transaction history</p>
      </div>

      {/* Balance Card */}
      <Card className="mb-8 overflow-hidden border-white/10 bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-xl">
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm text-gray-300">Total Balance</p>
              <p className="text-5xl font-bold text-white">$18,450</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-purple-600">
              <Wallet className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2 rounded-lg bg-black/40 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
              <span className="text-xs font-bold text-white">0x</span>
            </div>
            <span className="flex-1 font-mono text-white">0x742d35a8c9f1b2e4d6a8f3c5e7b9d1a4f6c8e2a9</span>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 transition-all duration-200 hover:scale-105">
              <ArrowDownLeft className="h-5 w-5" />
              Deposit
            </Button>
            <Button className="flex-1 gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-105">
              <ArrowUpRight className="h-5 w-5" />
              Withdraw
            </Button>
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <h2 className="mb-6 text-2xl font-bold text-white">Transaction History</h2>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  tx.type === "deposit"
                    ? "bg-green-500/20"
                    : tx.type === "repayment"
                      ? "bg-cyan-500/20"
                      : "bg-orange-500/20"
                }`}
              >
                {tx.type === "deposit" || tx.type === "repayment" ? (
                  <ArrowDownLeft className={`h-6 w-6 ${tx.type === "deposit" ? "text-green-400" : "text-cyan-400"}`} />
                ) : (
                  <ArrowUpRight className="h-6 w-6 text-orange-400" />
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-white">{tx.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-3 w-3" />
                  {tx.date}
                </div>
              </div>

              <div className="text-right">
                <p className={`text-xl font-bold ${tx.amount > 0 ? "text-green-400" : "text-orange-400"}`}>
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}
                </p>
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
