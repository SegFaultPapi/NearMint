"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CreditCard,
  BarChart3
} from "lucide-react"

export function LoanDashboardWidget() {
  // Mock data for the widget
  const stats = {
    totalBorrowed: 1250000,
    activeLoans: 156,
    averageInterestRate: 5.2,
    liquidationRate: 2.3
  }

  const recentLoans = [
    { id: "VESU-001", amount: 2500, status: "active", daysRemaining: 15 },
    { id: "VESU-002", amount: 1800, status: "active", daysRemaining: 8 },
    { id: "VESU-003", amount: 3200, status: "completed", daysRemaining: 0 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">VESU Loans</h2>
          <p className="text-gray-400">Manage your NFT collateral loans</p>
        </div>
        <Button 
          onClick={() => window.location.href = '/dashboard/pawn'}
          className="bg-orange-500 text-white hover:bg-orange-600 gap-2"
        >
          <Zap className="h-4 w-4" />
          Get Loan
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-black/40 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Borrowed</p>
              <p className="text-xl font-bold text-white">
                ${(stats.totalBorrowed / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-black/40 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Loans</p>
              <p className="text-xl font-bold text-white">{stats.activeLoans}</p>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-black/40 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
              <TrendingUp className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Average Rate</p>
              <p className="text-xl font-bold text-white">{stats.averageInterestRate}% APR</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/dashboard/loans'}
            className="border-white/10 text-white hover:bg-white/10"
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {recentLoans.map((loan) => (
            <div key={loan.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20">
                  <CreditCard className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">{loan.id}</p>
                  <p className="text-sm text-gray-400">${loan.amount.toLocaleString()} USDC</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={
                  loan.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  loan.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }>
                  {loan.status === 'active' ? 'Active' : 
                   loan.status === 'completed' ? 'Completed' : 'Pending'}
                </Badge>
                {loan.status === 'active' && (
                  <p className="text-xs text-gray-400 mt-1">{loan.daysRemaining} days remaining</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
              <Zap className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Quick Loan</h3>
              <p className="text-sm text-gray-400">Get instant liquidity</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/dashboard/pawn'}
            className="w-full bg-orange-500 text-white hover:bg-orange-600"
          >
            Request Loan
          </Button>
        </Card>

        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Manage Loans</h3>
              <p className="text-sm text-gray-400">View and pay active loans</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/dashboard/loans'}
            variant="outline"
            className="w-full border-white/10 text-white hover:bg-white/10"
          >
            View Loans
          </Button>
        </Card>
      </div>
    </div>
  )
}
