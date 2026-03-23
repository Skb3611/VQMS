"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { Loader2, RefreshCcw } from "lucide-react"

type Token = {
  id: number
  tokenNumber: number
  status: "WAITING" | "CALLED" | "COMPLETED"
  createdAt: string
  user: {
    name: string
  }
}

type QueueStats = {
  completedToday: number
  waitingCount: number
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "WAITING":
      return "bg-gray-500"
    case "CALLED":
      return "bg-blue-500"
    case "COMPLETED":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

export default function QueueManagementPage() {
  const [currentlyServing, setCurrentlyServing] = useState<Token | null>(null)
  const [allActiveTokens, setAllActiveTokens] = useState<Token[]>([])
  const [stats, setStats] = useState<QueueStats>({ completedToday: 0, waitingCount: 0 })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchQueueData = useCallback(async () => {
    try {
      const res = await fetch("/api/business/queue")
      if (!res.ok) throw new Error("Failed to fetch queue data")
      const data = await res.json()
      setCurrentlyServing(data.currentlyServing)
      setAllActiveTokens(data.allActiveTokens)
      setStats(data.stats)
    } catch (err) {
      console.error(err)
      toast.error("Could not load queue data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQueueData()
    const interval = setInterval(fetchQueueData, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [fetchQueueData])

  const handleAction = async (action: string, tokenId?: number) => {
    setActionLoading(true)
    try {
      const res = await fetch("/api/business/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, tokenId }),
      })

      let data
      try {
        data = await res.json()
      } catch (parseErr) {
        throw new Error("Server returned an invalid response.")
      }

      if (!res.ok) {
        throw new Error(data.message || `Error ${res.status}: Action failed`)
      }
      
      toast.success(data.message)
      await fetchQueueData()
    } catch (err: any) {
      console.error("Queue Action Error:", err)
      toast.error(err.message || `Failed to perform ${action.toLowerCase()}`)
    } finally {
      setActionLoading(false)
    }
  }

  const getTimeInQueue = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / 60000)
    return `${diffInMinutes} min`
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              size="lg"
              className="flex-1 px-8 text-base font-semibold"
              onClick={() => handleAction("CALL_NEXT")}
              disabled={actionLoading || stats.waitingCount === 0}
            >
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Call Next
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="flex-1"
              onClick={() => currentlyServing && handleAction("SKIP", currentlyServing.id)}
              disabled={actionLoading || !currentlyServing}
            >
              Skip
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchQueueData} disabled={loading} className="self-end sm:self-auto">
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Currently Serving Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Currently Serving</CardTitle>
            <CardDescription>Active service information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg border bg-background p-8 text-center shadow-sm">
                <p className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Current Token
                </p>
                {currentlyServing ? (
                  <>
                    <p className="mb-2 text-7xl font-black text-primary">
                      #{currentlyServing.tokenNumber}
                    </p>
                    <p className="text-xl font-medium text-muted-foreground mb-4">
                      {currentlyServing.user.name}
                    </p>
                    <Button 
                      variant="default" 
                      onClick={() => handleAction("COMPLETE", currentlyServing.id)}
                      disabled={actionLoading}
                    >
                      Mark as Completed
                    </Button>
                  </>
                ) : (
                  <p className="text-2xl font-semibold text-muted-foreground py-4">
                    No active token
                  </p>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                  {stats.waitingCount} tokens waiting in line
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-none bg-blue-500/10">
                  <CardContent className="pt-6">
                    <p className="mb-1 text-xs font-medium text-blue-600 uppercase tracking-tight">
                      Waiting Now
                    </p>
                    <p className="text-3xl font-bold text-blue-700">{stats.waitingCount}</p>
                  </CardContent>
                </Card>
                <Card className="border-none bg-green-500/10">
                  <CardContent className="pt-6">
                    <p className="mb-1 text-xs font-medium text-green-600 uppercase tracking-tight">
                      Served Today
                    </p>
                    <p className="text-3xl font-bold text-green-700">{stats.completedToday}</p>
                  </CardContent>
                </Card>
                <Card className="border-none bg-orange-500/10">
                  <CardContent className="pt-6">
                    <p className="mb-1 text-xs font-medium text-orange-600 uppercase tracking-tight">
                      Avg Wait
                    </p>
                    <p className="text-3xl font-bold text-orange-700">-- min</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queue Table - Desktop */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle>Queue Details</CardTitle>
            <CardDescription>All active tokens in your queue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[100px]">Token #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allActiveTokens.length > 0 ? (
                    allActiveTokens.map((token) => (
                      <TableRow key={token.id} className={token.status === "CALLED" ? "bg-primary/5 font-medium" : ""}>
                        <TableCell className="text-lg font-bold">
                          #{token.tokenNumber}
                        </TableCell>
                        <TableCell>{token.user.name}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(token.status)} text-white`}
                            variant="secondary"
                          >
                            {token.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {getTimeInQueue(token.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {token.status === "WAITING" && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleAction("SKIP", token.id)}
                                disabled={actionLoading}
                              >
                                Skip
                              </Button>
                            )}
                            {token.status === "CALLED" && (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleAction("COMPLETE", token.id)}
                                disabled={actionLoading}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No active tokens in the queue
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Queue List - Mobile */}
        <div className="md:hidden space-y-4">
          <h3 className="font-bold text-lg px-1">Queue Details</h3>
          {allActiveTokens.length > 0 ? (
            allActiveTokens.map((token) => (
              <Card key={token.id} className={token.status === "CALLED" ? "border-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-2xl font-black text-primary">#{token.tokenNumber}</p>
                      <p className="font-medium">{token.user.name}</p>
                    </div>
                    <Badge className={`${getStatusColor(token.status)} text-white`}>
                      {token.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Wait: {getTimeInQueue(token.createdAt)}
                    </p>
                    <div className="flex gap-2">
                      {token.status === "WAITING" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAction("SKIP", token.id)}
                          disabled={actionLoading}
                        >
                          Skip
                        </Button>
                      )}
                      {token.status === "CALLED" && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleAction("COMPLETE", token.id)}
                          disabled={actionLoading}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              No active tokens in the queue
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

