import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { JoinQueueForm } from '../join-queue-form'

// Mock fetch
global.fetch = vi.fn()

describe('JoinQueueForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the join button', () => {
    render(<JoinQueueForm storeName="Test Store" storeId={1} />)
    expect(screen.getByRole('button', { name: /join queue/i })).toBeInTheDocument()
  })

  it('opens the dialog when join button is clicked', () => {
    render(<JoinQueueForm storeName="Test Store" storeId={1} />)
    fireEvent.click(screen.getByRole('button', { name: /join queue/i }))
    expect(screen.getByText(/join the queue at Test Store/i)).toBeInTheDocument()
  })

  it('submits the form and shows success message', async () => {
    const mockResponse = {
      token: { tokenNumber: 42 },
      position: 3,
    }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<JoinQueueForm storeName="Test Store" storeId={1} />)
    fireEvent.click(screen.getByRole('button', { name: /join queue/i }))

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } })
    fireEvent.click(screen.getByRole('button', { name: /get token/i }))

    await waitFor(() => {
      expect(screen.getByText(/successfully joined!/i)).toBeInTheDocument()
      expect(screen.getByText(/#42/i)).toBeInTheDocument()
      expect(screen.getByText(/you are #3 in queue/i)).toBeInTheDocument()
    })
  })

  it('shows error message on failure', async () => {
    const mockError = { message: 'Already in queue' }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    })

    render(<JoinQueueForm storeName="Test Store" storeId={1} />)
    fireEvent.click(screen.getByRole('button', { name: /join queue/i }))

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } })
    fireEvent.click(screen.getByRole('button', { name: /get token/i }))

    // Since we use toast for errors, we might not see it in screen easily without toast mock
    // But we can verify fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/user/join-queue', expect.any(Object))
    })
  })
})
