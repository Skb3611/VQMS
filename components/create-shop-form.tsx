"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PrismaStore } from "@/app/dashboard/business/store/page"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Edit2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { toast } from "sonner"

interface CreateShopFormProps {
  onShopCreated?: (shop: PrismaStore) => void
  initialData?: PrismaStore | null
  trigger?: React.ReactNode
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

export function CreateShopForm({ onShopCreated, initialData, trigger }: CreateShopFormProps) {
  const [open, setOpen] = useState(false)
  const [shopName, setShopName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.desc || "")
  const [address, setAddress] = useState(initialData?.address || "")
  const [category, setCategory] = useState(initialData?.category || "General")
  const [maxQueueSize, setMaxQueueSize] = useState(initialData?.maxQueueSize || 50)
  const [openTime, setOpenTime] = useState(initialData?.openTime || "09:00")
  const [closeTime, setCloseTime] = useState(initialData?.closeTime || "18:00")
  const [workingDays, setWorkingDays] = useState<string[]>(
    initialData?.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  )
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; desc?: string }>({})
  const router = useRouter()

  useEffect(() => {
    if (initialData) {
      setShopName(initialData.name)
      setDescription(initialData.desc || "")
      setAddress(initialData.address || "")
      setCategory(initialData.category || "General")
      setMaxQueueSize(initialData.maxQueueSize || 50)
      setOpenTime(initialData.openTime || "09:00")
      setCloseTime(initialData.closeTime || "18:00")
      setWorkingDays(initialData.workingDays || [])
    }
  }, [initialData])

  const toggleDay = (day: string) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const validate = () => {
    const newErrors: { name?: string; desc?: string } = {}
    if (!shopName.trim()) {
      newErrors.name = "Shop name is required"
    } else if (shopName.trim().length < 3) {
      newErrors.name = "Shop name must be at least 3 characters"
    }

    if (description.length > 500) {
      newErrors.desc = "Description cannot exceed 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const method = initialData ? "PATCH" : "POST"
      const res = await fetch("/api/business/store", {
        method,
        body: JSON.stringify({
          name: shopName.trim(),
          desc: description.trim(),
          address: address.trim(),
          category,
          maxQueueSize: Number(maxQueueSize),
          openTime,
          closeTime,
          workingDays,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${initialData ? "update" : "create"} shop`)
      }

      if (data?.store) {
        setSubmitted(true)
        toast.success(`Shop ${initialData ? "updated" : "created"} successfully!`)
        if (onShopCreated) {
          onShopCreated(data.store)
        }
        setTimeout(() => {
          setOpen(false)
          setSubmitted(false)
          if (!initialData) {
            setShopName("")
            setDescription("")
            setAddress("")
            setCategory("General")
            setMaxQueueSize(50)
          }
          setErrors({})
        }, 2000)
        router.refresh()
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) {
          setErrors({})
          setSubmitted(false)
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setOpen(true)}>
                {initialData ? "Edit Store" : "Create Shop"} {initialData ? <Edit2 className="ml-2 h-4 w-4" /> : <Plus className="ml-2 h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{initialData ? "Edit your store info" : "Create a new shop"}</TooltipContent>
          </Tooltip>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Store Information" : "Create a New Shop"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update your store details and operating hours" : "Set up your shop and start managing queues"}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="space-y-4 py-8 text-center">
            <p className="text-lg font-semibold">
              Shop {initialData ? "Updated" : "Created"} Successfully!
            </p>
            <p className="text-2xl font-bold text-primary">{shopName}</p>
            <p className="text-sm text-muted-foreground">
              Your changes have been saved.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shop-name">Shop Name</Label>
                <Input
                  id="shop-name"
                  placeholder="Enter your shop name"
                  value={shopName}
                  onChange={(e) => {
                    setShopName(e.target.value)
                    if (errors.name) setErrors({ ...errors, name: undefined })
                  }}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-xs font-medium text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Service Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g. Healthcare, Food"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-queue">Max Queue Size</Label>
                  <Input
                    id="max-queue"
                    type="number"
                    min="1"
                    max="1000"
                    value={maxQueueSize}
                    onChange={(e) => setMaxQueueSize(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Store Address</Label>
                <Input
                  id="address"
                  placeholder="Enter shop address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your shop offers"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (errors.desc) setErrors({ ...errors, desc: undefined })
                  }}
                  className={`resize-none ${errors.desc ? "border-destructive" : ""}`}
                />
                {errors.desc && (
                  <p className="text-xs font-medium text-destructive">{errors.desc}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="open-time">Opening Time</Label>
                  <Input
                    id="open-time"
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="close-time">Closing Time</Label>
                  <Input
                    id="close-time"
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Working Days</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <Button
                      key={day}
                      type="button"
                      variant={workingDays.includes(day) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDay(day)}
                      className="text-xs h-8 px-2"
                    >
                      {day.substring(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || workingDays.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : (
                initialData ? "Save Changes" : "Create Shop"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
