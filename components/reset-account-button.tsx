"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ResetAccountButtonProps {
  className?: string
  variant?: "ghost" | "default" | "outline" | "destructive" | "secondary" | "link"
}

export function ResetAccountButton({ className, variant = "ghost" }: ResetAccountButtonProps) {
  const router = useRouter()
  const { user } = useUser()
  const [resetting, setResetting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleResetAccount = async () => {
    setResetting(true)
    try {
      const res = await fetch("/api/user/reset", {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Failed to reset account")
      }

      // Reload Clerk user session to reflect publicMetadata changes
      await user?.reload()

      toast.success("Account reset successfully")
      setIsDialogOpen(false)
      // Redirect to onboarding page
      router.push("/onboarding")
    } catch (err) {
      console.error("Reset error:", err)
      toast.error("Failed to reset account. Please try again.")
    } finally {
      setResetting(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            "w-full justify-start gap-3 px-3 text-destructive hover:text-destructive hover:bg-destructive/10",
            className
          )}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="font-medium">Reset Account</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action will permanently delete all your data, including your
            role, store, tokens, and history. You will be redirected to the
            onboarding page to start fresh.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={resetting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleResetAccount}
            disabled={resetting}
          >
            {resetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Account"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
