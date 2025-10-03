"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { useWallet } from "@/contexts/wallet-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isConnected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }
  // </CHANGE>

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
