"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Coins, TrendingUp, Store, Wallet, Settings, LogOut, Sparkles, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useWallet } from "@/contexts/wallet-context"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tokenize", href: "/dashboard/tokenize", icon: Scan },
  { name: "Get Loan", href: "/dashboard/pawn", icon: Coins },
  { name: "Active Loans", href: "/dashboard/loans", icon: TrendingUp },
  { name: "Marketplace", href: "/dashboard/marketplace", icon: Store },
  { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()
  const { address, disconnect } = useWallet()

  const handleSignOut = async () => {
    disconnect() // Desconectar wallet primero
    await signOut() // Luego cerrar sesión de Clerk
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">NearMint</span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                    isActive && "text-orange-400",
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <Separator className="my-4 bg-white/10" />

        {/* Settings */}
        <Link
          href="/dashboard/settings"
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            pathname === "/dashboard/settings"
              ? "bg-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/20"
              : "text-gray-400 hover:bg-white/5 hover:text-white",
          )}
        >
          <Settings className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          Settings
        </Link>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
            <span className="text-sm font-bold text-white">
              {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName || user?.emailAddresses[0]?.emailAddress.split('@')[0]}
            </p>
            <p className="text-xs text-gray-400">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "No wallet"}</p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start gap-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
