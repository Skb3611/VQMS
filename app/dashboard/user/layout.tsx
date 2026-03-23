'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { LayoutDashboard, Store, Ticket } from 'lucide-react'

const sidebarItems = [
  { label: 'Queue Status', href: '/dashboard/user/status', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Tokens', href: '/dashboard/user/tokens', icon: <Ticket className="w-4 h-4" /> },
  { label: 'Browse Stores', href: '/dashboard/user/stores', icon: <Store className="w-4 h-4" /> },
]

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="User Dashboard" userRole="user" />
        {children}
      </div>
    </div>
  )
}
