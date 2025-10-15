"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface PinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (pin: string) => Promise<void>
  title?: string
  description?: string
}

export function PinDialog({
  open,
  onOpenChange,
  onSubmit,
  title = "Confirmar PIN",
  description = "Ingresa tu PIN de 4 dígitos para confirmar la transacción",
}: PinDialogProps) {
  const [pin, setPin] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (pin.length !== 4) {
      setError("El PIN debe tener 4 dígitos")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(pin)
      // Limpiar y cerrar
      setPin("")
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar la transacción")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setPin("")
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pin">PIN de Seguridad</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  setPin(value)
                  setError(null)
                }}
                placeholder="••••"
                className="text-center text-2xl tracking-widest"
                autoFocus
                disabled={isSubmitting}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pin.length !== 4 || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

