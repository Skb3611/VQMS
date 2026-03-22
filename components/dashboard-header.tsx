"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { LogOut } from "lucide-react"
import { CreateShopForm } from "./create-shop-form"

interface DashboardHeaderProps {
  title: string
  userRole?: "user" | "business"
}

export function DashboardHeader({
  title,
  userRole = "user",
}: DashboardHeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  )
}
