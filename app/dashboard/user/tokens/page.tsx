'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LayoutDashboard, Store, Ticket } from 'lucide-react'

const sidebarItems = [
  { label: 'Queue Status', href: '/dashboard/user/status', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Tokens', href: '/dashboard/user/tokens', icon: <Ticket className="w-4 h-4" /> },
  { label: 'Browse Stores', href: '/dashboard/user/stores', icon: <Store className="w-4 h-4" /> },
]

const mockToken = {
  number: 42,
  status: 'WAITING',
  position: 3,
  store: 'Central Coffee Hub',
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'WAITING':
      return 'bg-gray-500'
    case 'CALLED':
      return 'bg-blue-500'
    case 'COMPLETED':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

export default function MyTokensPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="User Dashboard" userRole="user" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Active Token</CardTitle>
                <CardDescription>Your current queue position</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-6 bg-muted/50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Token Number</p>
                        <p className="text-4xl font-bold text-primary">#{mockToken.number}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Status</p>
                        <Badge className={`${getStatusColor(mockToken.status)} text-white`}>
                          {mockToken.status}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Position in Queue</p>
                        <p className="text-4xl font-bold">#{mockToken.position}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Store</p>
                        <p className="font-semibold">{mockToken.store}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Cancel Token</Button>
                    <Button className="flex-1">Refresh Status</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Previous Tokens</CardTitle>
                <CardDescription>History of completed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { token: 40, store: 'Central Coffee Hub', status: 'COMPLETED', time: '2 hours ago' },
                    { token: 38, store: 'Quick Bites Deli', status: 'COMPLETED', time: '1 day ago' },
                    { token: 35, store: 'Bakery Express', status: 'COMPLETED', time: '3 days ago' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border rounded-lg p-4">
                      <div>
                        <p className="font-semibold">Token #{item.token}</p>
                        <p className="text-sm text-muted-foreground">{item.store}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-500 text-white">{item.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                      </div>
                    </div>
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
