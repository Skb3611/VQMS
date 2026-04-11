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
import { StoreIcon, Trash2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export type PrismaStore = Store & {
  queue: Queue
  openTime?: string
  closeTime?: string
  workingDays?: string[]
  address?: string
  place?: string
  category?: string
  maxQueueSize?: number
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
  const [deleting, setDeleting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const handleDeleteStore = async () => {
    setDeleting(true)
    try {
      const res = await fetch("/api/business/store", {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete store")
      }

      toast.success("Store deleted successfully")
      setIsDialogOpen(false)
      // We can't use onShopCreated(null) because of the type, 
      // so we trigger a refresh and the parent component will re-fetch
      router.refresh()
      window.location.reload() // Force reload to show empty state
    } catch (err) {
      console.error("Delete error:", err)
      toast.error("Failed to delete store. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto h-full max-w-6xl space-y-6">
        {store ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Your store profile</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Store
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your
                        store, its queue, and all associated tokens.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={deleting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteStore}
                        disabled={deleting}
                      >
                        {deleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Store"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <CreateShopForm
                  initialData={store}
                  onShopCreated={onShopCreated}
                  trigger={
                    <Button variant="outline" size="sm">
                      Edit Store Profile
                    </Button>
                  }
                />
              </div>
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
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Address
                      </label>
                      <p className="mt-1 text-muted-foreground">{store.address || "No address provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Place / City
                      </label>
                      <p className="mt-1 text-muted-foreground">{store.place || "No place provided"}</p>
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
                          {store.openTime || "09:00"} - {store.closeTime || "18:00"}
                        </p>
                      </div>
                      <CreateShopForm
                        initialData={store}
                        onShopCreated={onShopCreated}
                        trigger={
                          <Button variant="outline" size="sm">
                            Edit Hours
                          </Button>
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">Working Days</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {store.workingDays?.length ? (
                            store.workingDays.map((day) => (
                              <Badge key={day} variant="secondary" className="text-[10px] px-1 h-4">
                                {day.substring(0, 3)}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No working days set</p>
                          )}
                        </div>
                      </div>
                      <CreateShopForm
                        initialData={store}
                        onShopCreated={onShopCreated}
                        trigger={
                          <Button variant="outline" size="sm">
                            Edit Days
                          </Button>
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">Service Category</p>
                        <p className="text-sm text-muted-foreground">
                          {store.category || "General"}
                        </p>
                      </div>
                      <CreateShopForm
                        initialData={store}
                        onShopCreated={onShopCreated}
                        trigger={
                          <Button variant="outline" size="sm">
                            Edit Category
                          </Button>
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">Queue Limit</p>
                        <p className="text-sm text-muted-foreground">
                          Max {store.maxQueueSize || 50} customers
                        </p>
                      </div>
                      <CreateShopForm
                        initialData={store}
                        onShopCreated={onShopCreated}
                        trigger={
                          <Button variant="outline" size="sm">
                            Edit Limit
                          </Button>
                        }
                      />
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
