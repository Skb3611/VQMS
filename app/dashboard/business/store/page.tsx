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
import { CreateShopForm } from "@/components/create-shop-form"
import { useEffect, useState } from "react"
import { Queue, Store } from "@/app/generated/prisma/client"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { StoreIcon } from "lucide-react"
export type PrismaStore = Store & {
  queue: Queue
}
export default function StorePage() {
  const [store, setStore] = useState<PrismaStore | null>(null)
  const [loading, setLoading] = useState(true)

  function onShopCreated(shop: PrismaStore) {
    setStore(shop)
  }

  const fetchStore = async () => {
    try {
      const res = await fetch("/api/business/store")
      const data = await res.json()
      return data
    } catch (err) {
      console.error("Error fetching store:", err)
      return null
    }
  }

  useEffect(() => {
    fetchStore().then((data) => {
      if (data && data.store) {
        setStore(data.store)
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto h-full max-w-6xl flex items-center justify-center">
          <p className="text-muted-foreground">Loading store information...</p>
        </div>
      </main>
    )
  }

  return <StoreInfoPage store={store} onShopCreated={onShopCreated} />
}

export function StoreInfoPage({
  store,
  onShopCreated,
}: {
  store: PrismaStore | null
  onShopCreated: (shop: PrismaStore) => void
}) {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto h-full max-w-6xl space-y-6">
        {store ? (
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Your store profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Store Name
                      </label>
                      <p className="mt-1 text-xl font-semibold">
                        {store.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Status
                      </label>
                      <Badge className="mt-2 bg-green-500 text-white">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Store ID
                      </label>
                      <p className="mt-1 font-mono text-lg">STORE-{store.id}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Description
                      </label>
                      <p className="mt-1 text-muted-foreground">{store.desc || "No description provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="mb-4 font-semibold">Store Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">Operating Hours</p>
                        <p className="text-sm text-muted-foreground">
                          Mon-Fri: 9AM-6PM
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">Service Type</p>
                        <p className="text-sm text-muted-foreground">
                          Food & Beverage
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">Queue Limit</p>
                        <p className="text-sm text-muted-foreground">
                          Max 50 customers
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <StoreIcon />
              </EmptyMedia>
              <EmptyTitle>No Store Created</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created a store yet. Get started by creating
                your business store.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
              <CreateShopForm onShopCreated={onShopCreated} />
            </EmptyContent>
          </Empty>
        )}
      </div>
    </main>
  )
}
