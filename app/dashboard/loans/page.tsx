"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Clock, TrendingUp, AlertCircle, CheckCircle2, Calendar, ArrowRight, Info } from "lucide-react"
import Image from "next/image"

const activeLoans = [
  {
    id: "1",
    item: "Charizard 1st Edition",
    image: "/placeholder.svg?height=150&width=150",
    loanAmount: 2500,
    totalDue: 2625,
    paid: 1750,
    dueDate: "2024-04-15",
    daysLeft: 15,
    status: "active",
    interestRate: 5,
  },
  {
    id: "2",
    item: "Mickey Mantle 1952",
    image: "/placeholder.svg?height=150&width=150",
    loanAmount: 3200,
    totalDue: 3360,
    paid: 2520,
    dueDate: "2024-04-08",
    daysLeft: 8,
    status: "warning",
    interestRate: 5,
  },
  {
    id: "3",
    item: "Black Lotus Alpha",
    image: "/placeholder.svg?height=150&width=150",
    loanAmount: 430,
    totalDue: 451.5,
    paid: 150,
    dueDate: "2024-04-22",
    daysLeft: 22,
    status: "active",
    interestRate: 5,
  },
]

const completedLoans = [
  {
    id: "4",
    item: "Pikachu Illustrator",
    image: "/placeholder.svg?height=150&width=150",
    loanAmount: 1800,
    totalPaid: 1890,
    completedDate: "2024-03-20",
    status: "completed",
  },
  {
    id: "5",
    item: "Babe Ruth Rookie",
    image: "/placeholder.svg?height=150&width=150",
    loanAmount: 2400,
    totalPaid: 2520,
    completedDate: "2024-03-10",
    status: "completed",
  },
]

export default function LoansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-purple-950/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Active Loans</h1>
        <p className="text-gray-400">Manage your loan repayments and track progress</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-400">Total Borrowed</p>
            <DollarSign className="h-5 w-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white">$6,130</p>
        </Card>

        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-400">Total Due</p>
            <TrendingUp className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">$6,436</p>
        </Card>

        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-400">Paid So Far</p>
            <CheckCircle2 className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">$4,420</p>
        </Card>

        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-400">Remaining</p>
            <Clock className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">$2,016</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-black/40 backdrop-blur-xl">
          <TabsTrigger value="active">Active Loans ({activeLoans.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedLoans.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activeLoans.map((loan) => {
            const progress = (loan.paid / loan.totalDue) * 100
            const remaining = loan.totalDue - loan.paid

            return (
              <Card
                key={loan.id}
                className="overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20"
              >
                <div className="grid gap-6 p-6 lg:grid-cols-3">
                  {/* Left - Item Info */}
                  <div className="flex gap-4">
                    <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                      <Image src={loan.image || "/placeholder.svg"} alt={loan.item} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="mb-2 text-xl font-bold text-white">{loan.item}</h3>
                        <Badge
                          className={
                            loan.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }
                        >
                          {loan.status === "active" ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              On Track
                            </>
                          ) : (
                            <>
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Due Soon
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Due: {loan.dueDate}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {loan.daysLeft} days left
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Middle - Progress */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-gray-400">Repayment Progress</span>
                        <span className="text-sm font-semibold text-white">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="mb-4 h-3" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 rounded-lg bg-white/5 p-4">
                      <div>
                        <p className="mb-1 text-xs text-gray-400">Borrowed</p>
                        <p className="font-semibold text-white">${loan.loanAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-gray-400">Paid</p>
                        <p className="font-semibold text-green-400">${loan.paid.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-gray-400">Remaining</p>
                        <p className="font-semibold text-orange-400">${remaining.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex flex-col justify-between">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <p className="mb-1 text-sm text-gray-400">Total Due</p>
                      <p className="mb-3 text-2xl font-bold text-white">${loan.totalDue.toLocaleString()}</p>
                      <p className="flex items-center gap-2 text-xs text-gray-400">
                        <Info className="h-3 w-3" />
                        {loan.interestRate}% APR included
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-105 hover:shadow-orange-500/50">
                        Make Payment
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-white/10 text-white hover:bg-white/10 bg-transparent"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedLoans.map((loan) => (
            <Card
              key={loan.id}
              className="overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 hover:border-green-500/50"
            >
              <div className="flex items-center gap-6 p-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                  <Image src={loan.image || "/placeholder.svg"} alt={loan.item} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{loan.item}</h3>
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span>Borrowed: ${loan.loanAmount.toLocaleString()}</span>
                    <span>Paid: ${loan.totalPaid.toLocaleString()}</span>
                    <span>Completed: {loan.completedDate}</span>
                  </div>
                </div>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 bg-transparent">
                  View Receipt
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
