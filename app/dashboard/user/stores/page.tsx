'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard, Store, Ticket, Loader2 } from 'lucide-react'
import { JoinQueueForm } from '@/components/join-queue-form'
import { useEffect, useState, useCallback } from 'react'

const sidebarItems = [
  { label: 'Queue Status', href: '/dashboard/user/status', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Tokens', href: '/dashboard/user/tokens', icon: <Ticket className="w-4 h-4" /> },
  { label: 'Browse Stores', href: '/dashboard/user/stores', icon: <Store className="w-4 h-4" /> },
]

type StoreData = {
  id: number
  name: string
  description: string | null
  queueLength: number
}

export default function BrowseStoresPage() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStores = useCallback(async () => {
    try {
      const res = await fetch('/api/user/stores')
      const data = await res.json()
      setStores(data.stores)
    } catch (err) {
      console.error('Error fetching stores:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Stores</CardTitle>
            <CardDescription>Browse and join queues at different stores</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : stores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stores.map((store) => (
                  <Card key={store.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-base">{store.name}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2">
                        {store.description || 'No description available'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Queue Length</p>
                          <p className="text-2xl font-bold">{store.queueLength}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Est. Wait</p>
                          <p className="text-lg font-semibold">{store.queueLength * 3}m</p>
                        </div>
                      </div>
                      <JoinQueueForm 
                        storeName={store.name} 
                        storeId={store.id} 
                        onJoined={fetchStores}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No stores available at the moment.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
