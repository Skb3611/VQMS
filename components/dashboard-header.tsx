"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { LogOut, Menu, ListCheck } from "lucide-react"
import { CreateShopForm } from "./create-shop-form"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  title: string
  userRole?: "user" | "business"
  sidebarItems?: { label: string; href: string; icon: React.ReactNode }[]
}

export function DashboardHeader({
  title,
  userRole = "user",
  sidebarItems = [],
}: DashboardHeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[300px] flex flex-col p-0 gap-0">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-left">
                    <div className="flex items-center gap-2">
                      <ListCheck className="h-6 w-6 text-primary" />
                      <span className="font-bold">QueueFlow</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-1">
                    {sidebarItems.map((item) => (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        onClick={() => setOpen(false)}
                      >
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
              </SheetContent>
            </Sheet>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-foreground truncate">{title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  )
}
