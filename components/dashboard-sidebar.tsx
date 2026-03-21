'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ListCheck } from 'lucide-react'

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
    <aside className="w-64 border-r bg-background h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <ListCheck className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Queue System</h1>
        </div>
        <nav className="space-y-2">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'default' : 'ghost'}
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
