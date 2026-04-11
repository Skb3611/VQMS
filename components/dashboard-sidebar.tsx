"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ListCheck, RefreshCw, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface DashboardSidebarProps {
  items: SidebarItem[]
}

export function DashboardSidebar({ items }: DashboardSidebarProps) {
  const pathname = usePathname()
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
    <aside className="hidden md:flex sticky top-0 h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <ListCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">QueueFlow</h1>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 px-3",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="font-medium">Reset Account</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action will permanently delete all your data, including your
                role, store, tokens, and history. You will be redirected to the
                onboarding page to start fresh.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
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
      </div>
    </aside>
  )
}
