"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ListCheck } from "lucide-react"

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

  return (
    <aside className="sticky top-0 h-screen w-64 overflow-y-auto border-r bg-background">
      <div className="p-6">
        <Link href={"/"}>
          <div className="mb-8 flex items-center gap-2">
            <ListCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">QueueFlow</h1>
          </div>
        </Link>
        <nav className="space-y-2">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className="w-full justify-start gap-2"
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
