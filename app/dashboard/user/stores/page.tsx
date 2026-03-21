'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard, Store, Ticket } from 'lucide-react'
import { JoinQueueForm } from '@/components/join-queue-form'

const sidebarItems = [
  { label: 'Queue Status', href: '/dashboard/user/status', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Tokens', href: '/dashboard/user/tokens', icon: <Ticket className="w-4 h-4" /> },
  { label: 'Browse Stores', href: '/dashboard/user/stores', icon: <Store className="w-4 h-4" /> },
]

const mockStores = [
  { id: 1, name: 'Central Coffee Hub', description: 'Premium coffee and pastries', queue: 5 },
  { id: 2, name: 'Quick Bites Deli', description: 'Fast casual food service', queue: 3 },
  { id: 3, name: 'Bakery Express', description: 'Fresh baked goods daily', queue: 8 },
  { id: 4, name: 'Juice Bar', description: 'Fresh juices and smoothies', queue: 2 },
]

export default function BrowseStoresPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="User Dashboard" userRole="user" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Stores</CardTitle>
                <CardDescription>Browse and join queues at different stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockStores.map((store) => (
                    <Card key={store.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base">{store.name}</CardTitle>
                        <CardDescription className="text-xs">{store.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Queue Length</p>
                            <p className="text-2xl font-bold">{store.queue}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Est. Wait</p>
                            <p className="text-lg font-semibold">{store.queue * 3}m</p>
                          </div>
                        </div>
                        <JoinQueueForm storeName={store.name} storeId={store.id} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
