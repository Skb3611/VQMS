import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'
import prisma from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

describe('Join Queue API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 if user is not authenticated', async () => {
    ;(currentUser as any).mockResolvedValueOnce(null)
    const req = new Request('http://localhost:3000/api/user/join-queue', {
      method: 'POST',
      body: JSON.stringify({ storeId: 1 }),
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 if user already has an active token', async () => {
    ;(currentUser as any).mockResolvedValueOnce({ id: 'user_123' })
    ;(prisma.user.findUnique as any).mockResolvedValueOnce({ id: 1 })
    ;(prisma.token.findFirst as any).mockResolvedValueOnce({ id: 100, status: 'WAITING' })

    const req = new Request('http://localhost:3000/api/user/join-queue', {
      method: 'POST',
      body: JSON.stringify({ storeId: 1 }),
    })

    const res = await POST(req)
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.message).toBe('You already have an active token.')
  })

  it('successfully joins a queue and returns token info', async () => {
    const mockUser = { id: 1, clerkId: 'user_123' }
    const mockStore = { id: 1, queue: { id: 10 } }
    const mockToken = { id: 200, tokenNumber: 5, status: 'WAITING' }

    ;(currentUser as any).mockResolvedValueOnce({ id: 'user_123' })
    ;(prisma.user.findUnique as any).mockResolvedValueOnce(mockUser)
    ;(prisma.token.findFirst as any).mockResolvedValueOnce(null) // No active token
    ;(prisma.store.findUnique as any).mockResolvedValueOnce(mockStore)
    ;(prisma.token.findFirst as any).mockResolvedValueOnce({ tokenNumber: 4 }) // last token
    ;(prisma.token.create as any).mockResolvedValueOnce(mockToken)
    ;(prisma.token.count as any).mockResolvedValueOnce(3) // position

    const req = new Request('http://localhost:3000/api/user/join-queue', {
      method: 'POST',
      body: JSON.stringify({ storeId: 1 }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.message).toBe('Successfully joined queue')
    expect(data.token.tokenNumber).toBe(5)
    expect(data.position).toBe(3)
  })
})
