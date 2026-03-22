'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LayoutDashboard, Store, Ticket, Loader2, RefreshCcw } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'

const sidebarItems = [
  { label: 'Queue Status', href: '/dashboard/user/status', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Tokens', href: '/dashboard/user/tokens', icon: <Ticket className="w-4 h-4" /> },
  { label: 'Browse Stores', href: '/dashboard/user/stores', icon: <Store className="w-4 h-4" /> },
]

type TokenData = {
  id: number
  tokenNumber: number
  status: 'WAITING' | 'CALLED' | 'COMPLETED'
  createdAt: string
  position?: number
  queue: {
    store: {
      name: string
    }
  }
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
  const [activeToken, setActiveToken] = useState<TokenData | null>(null)
  const [historicalTokens, setHistoricalTokens] = useState<TokenData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchTokens = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const res = await fetch('/api/user/tokens')
      const data = await res.json()
      setActiveToken(data.activeToken)
      setHistoricalTokens(data.historicalTokens)
      if (isRefresh) toast.success('Status updated')
    } catch (err) {
      console.error('Error fetching tokens:', err)
      if (isRefresh) toast.error('Failed to refresh status')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchTokens()
    const interval = setInterval(() => fetchTokens(), 15000) // Poll every 15s
    return () => clearInterval(interval)
  }, [fetchTokens])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="User Dashboard" userRole="user" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Active Token</CardTitle>
                  <CardDescription>Your current queue position</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => fetchTokens(true)} 
                  disabled={refreshing}
                >
                  <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </CardHeader>
              <CardContent>
                {activeToken ? (
                  <div className="space-y-6">
                    <div className="border rounded-lg p-6 bg-muted/50">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Token Number</p>
                          <p className="text-4xl font-bold text-primary">#{activeToken.tokenNumber}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Status</p>
                          <Badge className={`${getStatusColor(activeToken.status)} text-white`}>
                            {activeToken.status}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Position in Queue</p>
                          <p className="text-4xl font-bold">
                            {activeToken.status === 'CALLED' ? 'NOW' : `#${activeToken.position}`}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Store</p>
                          <p className="font-semibold">{activeToken.queue.store.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" disabled>Cancel Token</Button>
                      <Button className="flex-1" onClick={() => fetchTokens(true)} disabled={refreshing}>
                        {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Refresh Status
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg border-dashed">
                    <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">You don't have any active tokens.</p>
                    <Button variant="link" onClick={() => window.location.href='/dashboard/user/stores'}>
                      Browse stores to join a queue
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Previous Tokens</CardTitle>
                <CardDescription>History of completed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {historicalTokens.length > 0 ? (
                  <div className="space-y-3">
                    {historicalTokens.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border rounded-lg p-4">
                        <div>
                          <p className="font-semibold">Token #{item.tokenNumber}</p>
                          <p className="text-sm text-muted-foreground">{item.queue.store.name}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500 text-white">{item.status}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground text-sm">No historical tokens found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
