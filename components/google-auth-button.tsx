"use client"

import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

interface GoogleAuthButtonProps {
  onClick: () => void
  loading?: boolean
  text?: string
  disabled?: boolean
}

export function GoogleAuthButton({
  onClick,
  loading = false,
  text = "Continue with Google",
  disabled = false,
}: GoogleAuthButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={loading || disabled} className="w-full">
      <Chrome className="mr-2 h-4 w-4" />
      {loading ? "Connecting..." : text}
    </Button>
  )
}
