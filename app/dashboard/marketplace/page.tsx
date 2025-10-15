"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, TrendingUp, Flame, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"

const marketplaceItems = [
  {
    id: "1",
    name: "Charizard Base Set",
    category: "Pokemon",
    price: 4200,
    image: "/images/card-1.png",
    seller: "0x742d...3a9f",
    rarity: "Rare",
    trending: true,
    likes: 234,
  },
  {
    id: "2",
    name: "Babe Ruth 1933",
    category: "Baseball",
    price: 7800,
    image: "/images/card-2.png",
    seller: "0x8a3c...2b1e",
    rarity: "Legendary",
    trending: true,
    likes: 456,
  },
  {
    id: "3",
    name: "Mox Ruby",
    category: "Magic",
    price: 3500,
    image: "/images/card-3.jpg",
    seller: "0x5f2a...9c4d",
    rarity: "Rare",
    trending: false,
    likes: 189,
  },
  {
    id: "4",
    name: "Pikachu VMAX",
    category: "Pokemon",
    price: 1200,
    image: "/images/card-4.png",
    seller: "0x3d8b...7e2f",
    rarity: "Rare",
    trending: false,
    likes: 312,
  },
  {
    id: "5",
    name: "Mike Trout Rookie",
    category: "Baseball",
    price: 5600,
    image: "/images/card-5.png",
    seller: "0x9c1f...4a8b",
    rarity: "Rare",
    trending: true,
    likes: 278,
  },
  {
    id: "6",
    name: "Time Walk",
    category: "Magic",
    price: 9200,
    image: "/images/card-1.png",
    seller: "0x6e4d...1c9a",
    rarity: "Mythic",
    trending: false,
    likes: 523,
  },
]

export default function MarketplacePage() {
  const [category, setCategory] = useState("all")

  const filteredItems =
    category === "all" ? marketplaceItems : marketplaceItems.filter((item) => item.category.toLowerCase() === category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-cyan-950/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Marketplace</h1>
        <p className="text-gray-400">Discover and purchase tokenized collectibles</p>
      </div>

      {/* Featured Banner */}
      <Card className="mb-8 overflow-hidden border-white/10 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-6 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-purple-600">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1 text-2xl font-bold text-white">Hot Deals This Week</h2>
            <p className="text-gray-300">Exclusive tokenized collectibles with verified authenticity</p>
          </div>
          <Badge className="bg-orange-500 text-white">
            <TrendingUp className="mr-1 h-4 w-4" />
            Trending
          </Badge>
        </div>
      </Card>

      {/* Filters */}
      <Card className="mb-6 border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Tabs value={category} onValueChange={setCategory} className="w-full md:w-auto">
            <TabsList className="bg-white/5">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="pokemon">Pokemon</TabsTrigger>
              <TabsTrigger value="baseball">Baseball</TabsTrigger>
              <TabsTrigger value="magic">Magic</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search marketplace..."
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

      {/* Marketplace Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute left-3 top-3 flex gap-2">
                {item.trending && (
                  <Badge className="bg-orange-500/90 text-white">
                    <Flame className="mr-1 h-3 w-3" />
                    Hot
                  </Badge>
                )}
                <Badge className="bg-purple-500/90 text-white">{item.rarity}</Badge>
              </div>
              <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all duration-200 hover:bg-black/80 hover:scale-110">
                <Heart className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="mb-1 text-xl font-bold text-white">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.category}</p>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-cyan-400">${item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">{item.likes}</span>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-purple-600">
                  <span className="text-xs font-bold text-white">0x</span>
                </div>
                <span>Seller: {item.seller}</span>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105 hover:shadow-cyan-500/50">
                  <ShoppingCart className="h-4 w-4" />
                  Buy Now
                </Button>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 bg-transparent">
                  Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-8 flex justify-center">
        <Button variant="outline" className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10" size="lg">
          Load More Items
          <TrendingUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
