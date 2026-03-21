'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LayoutDashboard, Store, BarChart3 } from 'lucide-react'

const sidebarItems = [
  { label: 'Queue Management', href: '/dashboard/business/queue', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Store Info', href: '/dashboard/business/store', icon: <Store className="w-4 h-4" /> },
  { label: 'Analytics', href: '/dashboard/business/analytics', icon: <BarChart3 className="w-4 h-4" /> },
]

const mockTokens = [
  { id: 1, number: 40, status: 'SERVING', createdAt: '10:30 AM' },
  { id: 2, number: 41, status: 'WAITING', createdAt: '10:35 AM' },
  { id: 3, number: 42, status: 'WAITING', createdAt: '10:40 AM' },
  { id: 4, number: 43, status: 'WAITING', createdAt: '10:45 AM' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'WAITING':
      return 'bg-gray-500'
    case 'CALLED':
      return 'bg-blue-500'
    case 'SERVING':
      return 'bg-green-500'
    case 'COMPLETED':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

export default function QueueManagementPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Business Dashboard" userRole="business" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Call Next Button - Prominent */}
            <div className="flex gap-3">
              <Button size="lg" className="text-base font-semibold px-8 flex-1 md:flex-none">
                Call Next
              </Button>
              <Button size="lg" variant="outline" className="flex-1 md:flex-none">
                Skip
              </Button>
              <Button size="lg" variant="secondary" className="flex-1 md:flex-none">
                Pause Queue
              </Button>
            </div>

            {/* Currently Serving Card */}
            <Card>
              <CardHeader>
                <CardTitle>Currently Serving</CardTitle>
                <CardDescription>Active service information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-8 bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Current Token</p>
                    <p className="text-6xl font-bold text-primary mb-3">Token #40</p>
                    <p className="text-muted-foreground">Waiting tokens: 6</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-none bg-blue-50 dark:bg-blue-950/20">
                      <CardContent className="pt-6">
                        <p className="text-xs text-muted-foreground mb-2">Avg Service Time</p>
                        <p className="text-2xl font-bold">8 min</p>
                      </CardContent>
                    </Card>
                    <Card className="border-none bg-green-50 dark:bg-green-950/20">
                      <CardContent className="pt-6">
                        <p className="text-xs text-muted-foreground mb-2">Tokens Served</p>
                        <p className="text-2xl font-bold">39</p>
                      </CardContent>
                    </Card>
                    <Card className="border-none bg-orange-50 dark:bg-orange-950/20">
                      <CardContent className="pt-6">
                        <p className="text-xs text-muted-foreground mb-2">Efficiency</p>
                        <p className="text-2xl font-bold">94%</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Queue Table */}
            <Card>
              <CardHeader>
                <CardTitle>Queue Details</CardTitle>
                <CardDescription>All active tokens in your queue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead>Token #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time in Queue</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTokens.map((token) => (
                        <TableRow key={token.id}>
                          <TableCell className="font-bold text-lg">#{token.number}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(token.status)} text-white`}>
                              {token.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {token.status === 'WAITING' ? '12 min' : '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {token.createdAt}
                          </TableCell>
                          <TableCell className="text-right">
                            {token.status === 'WAITING' && (
                              <Button variant="outline" size="sm">
                                Remove
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
