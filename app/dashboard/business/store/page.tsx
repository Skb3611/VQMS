'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LayoutDashboard, Store, BarChart3 } from 'lucide-react'
import { CreateShopForm } from '@/components/create-shop-form'

const sidebarItems = [
  { label: 'Queue Management', href: '/dashboard/business/queue', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Store Info', href: '/dashboard/business/store', icon: <Store className="w-4 h-4" /> },
  { label: 'Analytics', href: '/dashboard/business/analytics', icon: <BarChart3 className="w-4 h-4" /> },
]

export default function StoreInfoPage() {
  const storeName = 'Central Coffee Hub'

  const handleShopCreated = (name: string) => {
    console.log('Shop created:', name)
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Business Dashboard" userRole="business" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Your store profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground">Store Name</label>
                        <p className="text-xl font-semibold mt-1">{storeName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Status</label>
                        <Badge className="bg-green-500 text-white mt-2">Active</Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground">Store ID</label>
                        <p className="text-lg font-mono mt-1">STORE-12345</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Join Code</label>
                        <p className="text-lg font-mono mt-1">ABC123</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Store Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Operating Hours</p>
                          <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Service Type</p>
                          <p className="text-sm text-muted-foreground">Food & Beverage</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Queue Limit</p>
                          <p className="text-sm text-muted-foreground">Max 50 customers</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <CreateShopForm onShopCreated={handleShopCreated} />
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
