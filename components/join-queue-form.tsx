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
import { Card } from '@/components/ui/card'

interface JoinQueueFormProps {
  storeName?: string
  storeId?: number
}

export function JoinQueueForm({ storeName = '', storeId }: JoinQueueFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && phone.trim()) {
      setSubmitted(true)
      setTimeout(() => {
        setOpen(false)
        setName('')
        setPhone('')
        setSubmitted(false)
      }, 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Join Queue</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Queue</DialogTitle>
          <DialogDescription>
            {storeName && `Join the queue at ${storeName}`}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="space-y-4 py-8">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">Successfully Joined!</p>
              <p className="text-sm text-muted-foreground">Your token number is:</p>
              <p className="text-4xl font-bold text-primary">42</p>
              <p className="text-sm text-muted-foreground">You are #{Math.floor(Math.random() * 10) + 1} in queue</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Get Token
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
