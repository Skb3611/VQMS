'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard, Store, Ticket } from 'lucide-react'

const sidebarItems = [
  { label: 'Queue Status', href: '/dashboard/user/status', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Tokens', href: '/dashboard/user/tokens', icon: <Ticket className="w-4 h-4" /> },
  { label: 'Browse Stores', href: '/dashboard/user/stores', icon: <Store className="w-4 h-4" /> },
]

export default function QueueStatusPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="User Dashboard" userRole="user" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Queue Status</CardTitle>
                <CardDescription>Real-time queue information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-6 bg-muted/50">
                    <div className="text-center space-y-3">
                      <p className="text-sm text-muted-foreground">Now Serving</p>
                      <p className="text-5xl font-bold text-primary">Token #25</p>
                      <p className="text-sm text-muted-foreground">Queue Length: <span className="font-semibold">12 people</span></p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-none bg-blue-50 dark:bg-blue-950/20">
                      <CardContent className="pt-6">
                        <p className="text-xs text-muted-foreground mb-2">Avg Wait Time</p>
                        <p className="text-2xl font-bold">12 min</p>
                      </CardContent>
                    </Card>
                    <Card className="border-none bg-green-50 dark:bg-green-950/20">
                      <CardContent className="pt-6">
                        <p className="text-xs text-muted-foreground mb-2">Total Served</p>
                        <p className="text-2xl font-bold">245</p>
                      </CardContent>
                    </Card>
                    <Card className="border-none bg-orange-50 dark:bg-orange-950/20">
                      <CardContent className="pt-6">
                        <p className="text-xs text-muted-foreground mb-2">Open Slots</p>
                        <p className="text-2xl font-bold">3</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
