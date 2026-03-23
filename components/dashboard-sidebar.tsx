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
    </aside>
  )
}
