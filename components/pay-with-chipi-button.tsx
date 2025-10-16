"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, ExternalLink } from "lucide-react"

interface PayWithChipiButtonProps {
  amountUsd: number
  label?: string
  onPaymentSuccess?: () => void
  disabled?: boolean
}

export function PayWithChipiButton({
  amountUsd,
  label = "Pay with ChipiPay",
  onPaymentSuccess,
  disabled = false
}: PayWithChipiButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const pay = async () => {
    if (isProcessing || disabled) return

    try {
      setIsProcessing(true)
      
      // Usar la dirección del merchant wallet o la por defecto
      const merchantWallet = process.env.NEXT_PUBLIC_MERCHANT_WALLET || "0x4bcc79ce30cc5185b854e6d49f1629c632ec030a3ee41613ce4c464cb8d8d2f"
      
      // Crear URL de ChipiPay
      const chipiPayUrl = `https://pay.chipipay.com?starknetWallet=${merchantWallet}&usdAmount=${amountUsd}`
      
      console.log('💳 Abriendo ChipiPay:', chipiPayUrl)
      
      // Abrir ChipiPay en nueva ventana
      const paymentWindow = window.open(chipiPayUrl, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes')
      
      if (!paymentWindow) {
        throw new Error("No se pudo abrir la ventana de pago. Verifica que los popups estén habilitados.")
      }

      // Simular éxito después de un tiempo (en producción esto se manejaría con webhooks)
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess()
        }
      }, 2000)

    } catch (error) {
      console.error('❌ Error en pago:', error)
      alert(error instanceof Error ? error.message : "Error al abrir el pago")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button 
      onClick={pay} 
      disabled={disabled || isProcessing}
      className="bg-blue-500 hover:bg-blue-600 text-white"
    >
      {isProcessing ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Abriendo ChipiPay...
        </>
      ) : (
        <>
          <ExternalLink className="mr-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}
