"use client"

import { useState } from "react"
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
import { Loader2, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { toast } from "sonner"

interface CreateShopFormProps {
  onShopCreated?: (shop: PrismaStore) => void
}

export function CreateShopForm({ onShopCreated }: CreateShopFormProps) {
  const [open, setOpen] = useState(false)
  const [shopName, setShopName] = useState("")
  const [description, setDescription] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; desc?: string }>({})
  const router = useRouter()

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
      const res = await fetch("/api/business/store", {
        method: "POST",
        body: JSON.stringify({ name: shopName.trim(), desc: description.trim() }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to create shop")
      }

      if (data?.store) {
        setSubmitted(true)
        toast.success("Shop created successfully!")
        if (onShopCreated) {
          onShopCreated(data.store)
        }
        setTimeout(() => {
          setOpen(false)
          setSubmitted(false)
          setShopName("")
          setDescription("")
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
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) {
        setErrors({})
        setSubmitted(false)
      }
    }}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setOpen(true)}>
             Create Shop <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create a new shop</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Shop</DialogTitle>
          <DialogDescription>
            Set up your shop and start managing queues
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="space-y-4 py-8">
            <div className="space-y-2 text-center">
              <p className="text-lg font-semibold">
                Shop Created Successfully!
              </p>
              <p className="text-sm text-muted-foreground">Your shop</p>
              <p className="text-2xl font-bold text-primary">{shopName}</p>
              <p className="text-sm text-muted-foreground">
                is now active and ready to manage queues
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Shop"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
