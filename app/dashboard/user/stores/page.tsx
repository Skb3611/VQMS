'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard, Store, Ticket, Loader2 } from 'lucide-react'
import { JoinQueueForm } from '@/components/join-queue-form'
import { useEffect, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Search, MapPin } from 'lucide-react'

const sidebarItems = [
  { label: 'Queue Status', href: '/dashboard/user/status', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Tokens', href: '/dashboard/user/tokens', icon: <Ticket className="w-4 h-4" /> },
  { label: 'Browse Stores', href: '/dashboard/user/stores', icon: <Store className="w-4 h-4" /> },
]

type StoreData = {
  id: number
  name: string
  description: string | null
  place: string | null
  queueLength: number
}

export default function BrowseStoresPage() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchPlace, setSearchPlace] = useState('')

  const fetchStores = useCallback(async () => {
    try {
      const url = searchPlace 
        ? `/api/user/stores?place=${encodeURIComponent(searchPlace)}` 
        : '/api/user/stores'
      const res = await fetch(url)
      const data = await res.json()
      setStores(data.stores)
    } catch (err) {
      console.error('Error fetching stores:', err)
    } finally {
      setLoading(false)
    }
  }, [searchPlace])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStores()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchStores])

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Available Stores</CardTitle>
                <CardDescription>Browse and join queues at different stores</CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by place..."
                  className="pl-9"
                  value={searchPlace}
                  onChange={(e) => setSearchPlace(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : stores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stores.map((store) => (
                  <Card key={store.id} className="hover:shadow-lg transition-shadow flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-base">{store.name}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2">
                        {store.description || 'No description available'}
                      </CardDescription>
                      {store.place && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-muted-foreground">{store.place}</span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4 mt-auto">
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
                {searchPlace ? `No stores found in "${searchPlace}"` : "No stores available at the moment."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
