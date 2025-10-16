"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  TrendingUp,
  Wallet,
  Package,
  DollarSign,
  ArrowUpRight,
  Search,
  Filter,
  Plus,
  Sparkles,
  Calendar,
  Zap,
  Loader2,
  ExternalLink,
} from "lucide-react"
import Image from "next/image"
import { useUserNFTs } from "@/hooks/use-user-nfts"
import Link from "next/link"

export default function DashboardPage() {
  const [filter, setFilter] = useState("all")
  const { nfts, isLoading, totalValue } = useUserNFTs()

  const filteredCollectibles = filter === "all" ? nfts : nfts.filter((item) => item.status === filter)
  const tokenizedCount = nfts.filter(item => item.tokenized).length
  const availableCount = nfts.filter(item => item.status === "available").length
  
  // Calcular total disponible
  const availableValue = nfts
    .filter(item => item.status === "available")
    .reduce((sum, nft) => {
      const value = parseFloat(nft.value.replace(/[$,]/g, ''))
      return sum + (isNaN(value) ? 0 : value)
    }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-orange-950/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your portfolio overview</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Value */}
        <Card className="group relative overflow-hidden border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-orange-500/10 blur-3xl transition-all duration-300 group-hover:bg-orange-500/20" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20">
                <DollarSign className="h-6 w-6 text-orange-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                12.5%
              </Badge>
            </div>
            <p className="mb-1 text-sm text-gray-400">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-white">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                `$${totalValue.toLocaleString()}`
              )}
            </p>
          </div>
        </Card>

        {/* Available Credit */}
        <Card className="group relative overflow-hidden border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-cyan-500/10 blur-3xl transition-all duration-300 group-hover:bg-cyan-500/20" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20">
                <Wallet className="h-6 w-6 text-cyan-400" />
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">Available</Badge>
            </div>
            <p className="mb-1 text-sm text-gray-400">Available Credit</p>
            <p className="text-3xl font-bold text-white">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                `$${Math.floor(availableValue * 0.75).toLocaleString()}`
              )}
            </p>
          </div>
        </Card>

        {/* Active Loans */}
        <Card className="group relative overflow-hidden border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-purple-500/10 blur-3xl transition-all duration-300 group-hover:bg-purple-500/20" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">3 Active</Badge>
            </div>
            <p className="mb-1 text-sm text-gray-400">Active Loans</p>
            <p className="text-3xl font-bold text-white">$6,130</p>
          </div>
        </Card>

        {/* Tokenized NFTs */}
        <Card className="group relative overflow-hidden border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-green-500/10 blur-3xl transition-all duration-300 group-hover:bg-green-500/20" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                <ArrowUpRight className="mr-1 h-3 w-3" />{tokenizedCount} NFTs
              </Badge>
            </div>
            <p className="mb-1 text-sm text-gray-400">Tokenized NFTs</p>
            <p className="text-3xl font-bold text-white">{tokenizedCount}</p>
          </div>
        </Card>
      </div>


      {/* Main Content */}
      <div className="space-y-6">
        {/* Collection Header */}
        <div>
          <h2 className="mb-2 text-3xl font-bold text-white">My Collection</h2>
          <p className="text-gray-400">Manage your physical collectibles</p>
        </div>

          {/* Collection Stats */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-gray-400">Total Items</p>
                <Sparkles className="h-5 w-5 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : nfts.length}
              </p>
            </Card>

            <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-gray-400">Total Value</p>
                <DollarSign className="h-5 w-5 text-cyan-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  `$${totalValue.toLocaleString()}`
                )}
              </p>
            </Card>

            <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-gray-400">Available</p>
                <Badge className="bg-green-500/20 text-green-400">{availableCount}</Badge>
              </div>
              <p className="text-3xl font-bold text-white">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  `$${availableValue.toLocaleString()}`
                )}
              </p>
            </Card>

            <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-gray-400">Tokenized</p>
                <Zap className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">{tokenizedCount}</p>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
                <TabsList className="bg-white/5">
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="available">Available</TabsTrigger>
                  <TabsTrigger value="pawned">Pawned</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search collection..."
                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500"
                  />
                </div>
                <Button variant="outline" className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </Card>

          {/* Collection Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-orange-500" />
                <p className="mt-4 text-gray-400">Cargando NFTs...</p>
              </div>
            </div>
          ) : filteredCollectibles.length === 0 ? (
            <Card className="border-white/10 bg-black/40 p-12 backdrop-blur-xl">
              <div className="text-center">
                <Sparkles className="mx-auto h-16 w-16 text-orange-500/50" />
                <h3 className="mt-4 text-2xl font-bold text-white">No tienes NFTs aún</h3>
                <p className="mt-2 text-gray-400">
                  {filter === "all" 
                    ? "Comienza tokenizando tu primer coleccionable"
                    : `No tienes NFTs con el filtro "${filter}"`
                  }
                </p>
                <Link href="/dashboard/tokenize">
                  <Button className="mt-6 bg-orange-500 text-white hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Tokenizar Coleccionable
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {filteredCollectibles.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-orange-500/10 to-cyan-500/10">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute right-3 top-3 flex gap-2">
                    <Badge
                      className={item.status === "available" ? "bg-green-500/90 text-white" : "bg-yellow-500/90 text-white"}
                    >
                      {item.status === "available" ? "Available" : "Pawned"}
                    </Badge>
                    <Badge className="bg-purple-500/90 text-white">{item.rarity}</Badge>
                    {item.tokenized && (
                      <Badge className="bg-blue-500/90 text-white">
                        <Zap className="w-3 h-3 mr-1" />
                        NFT #{item.tokenId}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="mb-1 text-lg font-bold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.category}</p>
                  </div>

                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Current Value</p>
                      <p className="text-xl font-bold text-white">{item.value}</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">{item.appreciation}</Badge>
                  </div>

                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Acquired {item.acquired}</span>
                  </div>

                  <div className="flex gap-2">
                    {item.status === "available" ? (
                      <>
                        <Button className="flex-1 bg-orange-500 text-white hover:bg-orange-600 text-sm">Get Loan</Button>
                        {item.tokenized && item.transactionHash ? (
                          <Button
                            variant="outline"
                            className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/10 text-sm"
                            onClick={() => window.open(`https://voyager.online/tx/${item.transactionHash}`, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver en Voyager
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/10 text-sm"
                          >
                            Detalles
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button className="flex-1 bg-cyan-500 text-white hover:bg-cyan-600 text-sm">Repay Loan</Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/10 text-sm"
                        >
                          Details
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}