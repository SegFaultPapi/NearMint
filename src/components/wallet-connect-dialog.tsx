"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"

interface WalletConnectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: () => void
}

export function WalletConnectDialog({ open, onOpenChange, onConnect }: WalletConnectDialogProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate wallet connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onConnect()
    setIsConnecting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black/95 border-white/10 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a wallet to connect and access your NearMint dashboard
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full justify-start gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-14 text-base font-semibold shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-[1.02]"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                MetaMask
              </>
            )}
          </Button>
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full justify-start gap-3 bg-white/5 hover:bg-white/10 text-white h-14 text-base font-semibold border border-white/10 transition-all duration-200 hover:scale-[1.02]"
          >
            <Wallet className="h-5 w-5" />
            WalletConnect
          </Button>
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full justify-start gap-3 bg-white/5 hover:bg-white/10 text-white h-14 text-base font-semibold border border-white/10 transition-all duration-200 hover:scale-[1.02]"
          >
            <Wallet className="h-5 w-5" />
            Coinbase Wallet
          </Button>
        </div>
        <p className="text-xs text-center text-gray-500">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  )
}
