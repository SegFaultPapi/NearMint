"use client"

import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // El middleware de Clerk ya protege estas rutas
  // No necesitamos validación adicional aquí
  
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
