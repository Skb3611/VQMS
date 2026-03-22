'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard, Store, Ticket, Loader2 } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

const sidebarItems = [
  { label: 'Queue Status', href: '/dashboard/user/status', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Tokens', href: '/dashboard/user/tokens', icon: <Ticket className="w-4 h-4" /> },
  { label: 'Browse Stores', href: '/dashboard/user/stores', icon: <Store className="w-4 h-4" /> },
]

type ActiveToken = {
  tokenNumber: number
  status: string
  position: number
  queue: {
    store: {
      name: string
    }
    _count: {
      tokens: number
    }
  }
}

export default function QueueStatusPage() {
  const [activeToken, setActiveToken] = useState<ActiveToken | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/user/tokens')
      const data = await res.json()
      setActiveToken(data.activeToken)
    } catch (err) {
      console.error('Error fetching status:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 10000)
    return () => clearInterval(interval)
  }, [fetchStatus])

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
              <CardHeader>
                <CardTitle>Current Queue Status</CardTitle>
                <CardDescription>
                  {activeToken ? `Status for ${activeToken.queue.store.name}` : 'Real-time queue information'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeToken ? (
                  <div className="space-y-6">
                    <div className="border rounded-lg p-6 bg-muted/50 text-center">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Your Status</p>
                        <div className="space-y-1">
                          <p className="text-6xl font-black text-primary">#{activeToken.tokenNumber}</p>
                          <p className="text-xl font-semibold text-muted-foreground">
                            {activeToken.status === 'CALLED' ? 'IT IS YOUR TURN!' : `Position: ${activeToken.position}`}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-muted-foreground/10">
                          <p className="text-sm text-muted-foreground">
                            Queue Length: <span className="font-bold text-foreground">{activeToken.queue?._count?.tokens} tokens</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-none bg-blue-500/10">
                        <CardContent className="pt-6">
                          <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Est. Wait Time</p>
                          <p className="text-3xl font-bold text-blue-700">{activeToken.position * 3} min</p>
                        </CardContent>
                      </Card>
                      <Card className="border-none bg-green-500/10">
                        <CardContent className="pt-6">
                          <p className="text-xs font-semibold text-green-600 uppercase mb-2">Status</p>
                          <p className="text-3xl font-bold text-green-700">{activeToken.status}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-none bg-orange-500/10">
                        <CardContent className="pt-6">
                          <p className="text-xs font-semibold text-orange-600 uppercase mb-2">People Ahead</p>
                          <p className="text-3xl font-bold text-orange-700">{Math.max(0, activeToken.position - 1)}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg border-dashed">
                    <p className="text-muted-foreground">You are not currently in any queue.</p>
                    <Button 
                      variant="link" 
                      onClick={() => window.location.href='/dashboard/user/stores'}
                      className="mt-2"
                    >
                      Join a queue to see status
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
