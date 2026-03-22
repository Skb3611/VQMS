import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '../route'
import prisma from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

describe('Business Queue Management API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 404 if user or store not found', async () => {
      ;(currentUser as any).mockResolvedValueOnce({ id: 'user_123' })
      ;(prisma.user.findUnique as any).mockResolvedValueOnce(null)

      const res = await GET(new Request('http://localhost:3000/api/business/queue'))
      expect(res.status).toBe(404)
    })

    it('returns queue data and statistics', async () => {
      const mockStore = {
        id: 1,
        queue: {
          id: 10,
          tokens: [
            { id: 200, tokenNumber: 5, status: 'CALLED', user: { name: 'John' } },
            { id: 201, tokenNumber: 6, status: 'WAITING', user: { name: 'Jane' } },
          ],
        },
      }

      ;(currentUser as any).mockResolvedValueOnce({ id: 'user_123' })
      ;(prisma.user.findUnique as any).mockResolvedValueOnce({ store: mockStore })
      ;(prisma.token.count as any).mockResolvedValueOnce(5) // completed today

      const res = await GET(new Request('http://localhost:3000/api/business/queue'))
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.currentlyServing.id).toBe(200)
      expect(data.waitingTokens).toHaveLength(1)
      expect(data.stats.completedToday).toBe(5)
    })
  })

  describe('POST', () => {
    it('handles CALL_NEXT action correctly', async () => {
      const mockStore = { id: 1, queue: { id: 10 } }
      const mockNextToken = { id: 201, tokenNumber: 6, status: 'WAITING' }

      ;(currentUser as any).mockResolvedValueOnce({ id: 'user_123' })
      ;(prisma.user.findUnique as any).mockResolvedValueOnce({ store: mockStore })
      ;(prisma.token.findFirst as any).mockResolvedValueOnce(mockNextToken)
      ;(prisma.token.update as any).mockResolvedValueOnce({ ...mockNextToken, status: 'CALLED' })

      const req = new Request('http://localhost:3000/api/business/queue', {
        method: 'POST',
        body: JSON.stringify({ action: 'CALL_NEXT' }),
      })

      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.message).toBe('Called next token')
      expect(prisma.token.updateMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { queueId: 10, status: 'CALLED' }
      }))
    })

    it('handles COMPLETE action correctly', async () => {
      const mockStore = { id: 1, queue: { id: 10 } }

      ;(currentUser as any).mockResolvedValueOnce({ id: 'user_123' })
      ;(prisma.user.findUnique as any).mockResolvedValueOnce({ store: mockStore })
      ;(prisma.token.update as any).mockResolvedValueOnce({ id: 200, status: 'COMPLETED' })

      const req = new Request('http://localhost:3000/api/business/queue', {
        method: 'POST',
        body: JSON.stringify({ action: 'COMPLETE', tokenId: 200 }),
      })

      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.message).toBe('Token completed')
    })
  })
})
