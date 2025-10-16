"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Users, AlertTriangle, Percent, Loader2 } from "lucide-react"
import { useVESULending, VESULendingStats } from "@/hooks/use-vesu-lending"

export function VESULendingStats() {
  const [stats, setStats] = useState<VESULendingStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { getLendingStats } = useVESULending()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const lendingStats = await getLendingStats()
        setStats(lendingStats)
      } catch (error) {
        console.error('Failed to fetch VESU stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [getLendingStats])

  if (isLoading) {
    return (
      <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2 text-gray-400">Loading VESU stats...</span>
        </div>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-8 w-8 text-orange-500" />
          <p className="mt-2 text-gray-400">Failed to load VESU statistics</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-purple-600">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">VESU Lending Platform</h3>
          <p className="text-sm text-gray-400">Powered by blockchain technology</p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Live
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-gray-400">Total Borrowed</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${(stats.totalBorrowed / 1000000).toFixed(1)}M
          </p>
        </div>

        <div className="rounded-lg bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-400">Total Repaid</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${(stats.totalRepaid / 1000000).toFixed(1)}M
          </p>
        </div>

        <div className="rounded-lg bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-gray-400">Active Loans</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.activeLoans}</p>
        </div>

        <div className="rounded-lg bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-400">Avg Interest Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.averageInterestRate}%</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-400">Liquidation Rate</span>
        </div>
        <p className="text-sm text-yellow-300 mt-1">
          Only {stats.liquidationRate}% of loans are liquidated, ensuring asset safety
        </p>
      </div>
    </Card>
  )
}
