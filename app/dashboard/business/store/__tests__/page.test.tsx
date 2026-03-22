import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StoreInfoPage } from '../page'
import { TooltipProvider } from '@/components/ui/tooltip'

describe('StoreInfoPage', () => {
  const onShopCreated = vi.fn()

  it('renders empty state when no store exists', () => {
    render(
      <TooltipProvider>
        <StoreInfoPage store={null} onShopCreated={onShopCreated} />
      </TooltipProvider>
    )
    expect(screen.getByText(/no store created/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create shop/i })).toBeInTheDocument()
  })

  it('renders store information when store exists', () => {
    const mockStore = {
      id: 1,
      name: 'Test Coffee Shop',
      desc: 'Best coffee in town',
      userId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      queue: {
        id: 10,
        storeId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }

    render(
      <TooltipProvider>
        <StoreInfoPage store={mockStore} onShopCreated={onShopCreated} />
      </TooltipProvider>
    )
    expect(screen.getByText(/store information/i)).toBeInTheDocument()
    expect(screen.getByText('Test Coffee Shop')).toBeInTheDocument()
    expect(screen.getByText('Best coffee in town')).toBeInTheDocument()
    expect(screen.getByText('STORE-1')).toBeInTheDocument()
  })
})
