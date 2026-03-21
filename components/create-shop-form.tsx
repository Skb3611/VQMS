'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface CreateShopFormProps {
  onShopCreated?: (name: string) => void
}

export function CreateShopForm({ onShopCreated }: CreateShopFormProps) {
  const [open, setOpen] = useState(false)
  const [shopName, setShopName] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (shopName.trim()) {
      setSubmitted(true)
      setTimeout(() => {
        onShopCreated?.(shopName)
        setOpen(false)
        setShopName('')
        setDescription('')
        setSubmitted(false)
      }, 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Shop</Button>
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
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">Shop Created Successfully!</p>
              <p className="text-sm text-muted-foreground">Your shop</p>
              <p className="text-2xl font-bold text-primary">{shopName}</p>
              <p className="text-sm text-muted-foreground">is now active and ready to manage queues</p>
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
                onChange={(e) => setShopName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what your shop offers"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />
            </div>
            <Button type="submit" className="w-full">
              Create Shop
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
