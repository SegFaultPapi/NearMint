"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"
import Image from "next/image"

const collectibles = [
  {
    id: "1",
    name: "Charizard 1st Edition",
    category: "Pokemon",
    value: "$5,200",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    status: "available",
    rarity: "Legendary",
    acquired: "2024-01-15",
    appreciation: "+15%",
  },
  {
    id: "2",
    name: "Mickey Mantle 1952",
    category: "Baseball",
    value: "$8,500",
    image: "https://images.unsplash.com/photo-1611794520505-b841584a95dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    status: "pawned",
    rarity: "Rare",
    acquired: "2023-11-20",
    appreciation: "+22%",
  },
  {
    id: "3",
    name: "Black Lotus Alpha",
    category: "Magic",
    value: "$12,000",
    image: "https://images.unsplash.com/photo-1609162310240-84de2dae2337?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    status: "available",
    rarity: "Mythic",
    acquired: "2024-02-10",
    appreciation: "+8%",
  },
  {
    id: "4",
    name: "Pikachu Illustrator",
    category: "Pokemon",
    value: "$3,800",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    status: "available",
    rarity: "Legendary",
    acquired: "2024-03-05",
    appreciation: "+12%",
  },
  {
    id: "5",
    name: "Babe Ruth Rookie",
    category: "Baseball",
    value: "$6,200",
    image: "https://images.unsplash.com/photo-1549993585-5fb3ab12b2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    status: "available",
    rarity: "Rare",
    acquired: "2023-12-18",
    appreciation: "+18%",
  },
  {
    id: "6",
    name: "Mox Sapphire",
    category: "Magic",
    value: "$4,500",
    image: "https://images.unsplash.com/photo-1611794520505-b841584a95dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    status: "pawned",
    rarity: "Rare",
    acquired: "2024-01-28",
    appreciation: "+10%",
  },
]

export default function DashboardPage() {
  const [filter, setFilter] = useState("all")

  const filteredCollectibles = filter === "all" ? collectibles : collectibles.filter((item) => item.status === filter)

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
            <p className="text-3xl font-bold text-white">$24,580</p>
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
            <p className="text-3xl font-bold text-white">$18,450</p>
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

        {/* Collection Items */}
        <Card className="group relative overflow-hidden border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-green-500/10 blur-3xl transition-all duration-300 group-hover:bg-green-500/20" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                <Package className="h-6 w-6 text-green-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                <ArrowUpRight className="mr-1 h-3 w-3" />5 New
              </Badge>
            </div>
            <p className="mb-1 text-sm text-gray-400">Collection Items</p>
            <p className="text-3xl font-bold text-white">47</p>
          </div>
        </Card>
      </div>

      {/* Collection Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-white">My Collection</h2>
          <p className="text-gray-400">Manage and tokenize your physical collectibles</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-105 hover:shadow-orange-500/50">
          <Plus className="h-5 w-5" />
          Add Item
        </Button>
      </div>

      {/* Collection Stats */}
      <div className="mb-6 grid gap-6 md:grid-cols-4">
        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-400">Total Items</p>
            <Sparkles className="h-5 w-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white">{collectibles.length}</p>
        </Card>

        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-400">Total Value</p>
            <DollarSign className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">$40,200</p>
        </Card>

        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-400">Available</p>
            <Badge className="bg-green-500/20 text-green-400">4</Badge>
          </div>
          <p className="text-3xl font-bold text-white">$27,700</p>
        </Card>

        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-400">Avg. Growth</p>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">+14.2%</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6 border-white/10 bg-black/40 p-6 backdrop-blur-xl">
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="mb-1 text-xl font-bold text-white">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.category}</p>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Current Value</p>
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400">{item.appreciation}</Badge>
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Acquired {item.acquired}</span>
              </div>

              <div className="flex gap-2">
                {item.status === "available" ? (
                  <>
                    <Button className="flex-1 bg-orange-500 text-white hover:bg-orange-600">Get Loan</Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/10"
                    >
                      Details
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="flex-1 bg-cyan-500 text-white hover:bg-cyan-600">Repay Loan</Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/10"
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
    </div>
  )
}
