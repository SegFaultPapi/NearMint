import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/contexts/wallet-context"
import { ClerkProvider } from "@clerk/nextjs"
import { ChipiProvider } from "@chipi-stack/nextjs"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "NearMint - The First Web3 Pawn Shop",
  description: "Turn your physical collectibles into liquid financial assets",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <ClerkProvider
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/onboarding/create-pin"
        appearance={{
          variables: {
            colorPrimary: 'hsl(20, 100%, 63%)',
            colorDanger: 'hsl(0, 84.2%, 60.2%)',
            colorSuccess: 'hsl(145, 100%, 47%)',
            colorWarning: 'hsl(20, 100%, 63%)',
            colorTextOnPrimaryBackground: 'hsl(0, 0%, 98%)',
            colorBackground: 'hsl(240, 10%, 3.9%)',
            colorInputBackground: 'rgba(255, 255, 255, 0.03)',
            colorInputText: 'hsl(0, 0%, 98%)',
            colorText: 'hsl(0, 0%, 98%)',
            colorTextSecondary: 'hsl(240, 5%, 64.9%)',
            borderRadius: '0.75rem',
          }
        }}
      >
        <ChipiProvider>
          <body>
            <WalletProvider>{children}</WalletProvider>
          </body>
        </ChipiProvider>
      </ClerkProvider>
    </html>
  )
}