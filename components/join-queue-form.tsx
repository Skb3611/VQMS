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
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface JoinQueueFormProps {
  storeName?: string
  storeId?: number
  onJoined?: () => void
}

export function JoinQueueForm({ storeName = '', storeId, onJoined }: JoinQueueFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tokenInfo, setTokenInfo] = useState<{ number: number; position: number } | null>(null)
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const router = useRouter()

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {}
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/user/join-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, name: name.trim(), phone: phone.trim() }),
      })

      let data
      try {
        data = await res.json()
      } catch (parseErr) {
        throw new Error('Server returned an invalid response. Please try again.')
      }

      if (!res.ok) {
        throw new Error(data.message || `Error ${res.status}: Failed to join queue`)
      }

      setTokenInfo({ number: data.token.tokenNumber, position: data.position })
      setSubmitted(true)
      toast.success('Joined queue successfully!')
      
      if (onJoined) onJoined()
      
      setTimeout(() => {
        setOpen(false)
        setSubmitted(false)
        setName('')
        setPhone('')
        setTokenInfo(null)
        setErrors({})
        router.push('/dashboard/user/tokens')
      }, 3000)
    } catch (err: any) {
      console.error('Join Queue Error:', err)
      toast.error(err.message || 'An unexpected error occurred while joining the queue')
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
        <Button className="w-full">Join Queue</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Queue</DialogTitle>
          <DialogDescription>
            {storeName && `Join the queue at ${storeName}`}
          </DialogDescription>
        </DialogHeader>

        {submitted && tokenInfo ? (
          <div className="space-y-4 py-8">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">Successfully Joined!</p>
              <p className="text-sm text-muted-foreground">Your token number is:</p>
              <p className="text-4xl font-bold text-primary">#{tokenInfo.number}</p>
              <p className="text-sm text-muted-foreground">You are #{tokenInfo.position} in queue</p>
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
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors({ ...errors, name: undefined })
                }}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs font-medium text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number (10 digits)"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (errors.phone) setErrors({ ...errors, phone: undefined })
                }}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-xs font-medium text-destructive">{errors.phone}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                'Get Token'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
