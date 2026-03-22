import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  useUser: vi.fn(() => ({
    isSignedIn: true,
    user: {
      id: 'user_123',
      fullName: 'Test User',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
      publicMetadata: {},
    },
  })),
  useAuth: vi.fn(() => ({
    isLoaded: true,
    userId: 'user_123',
    sessionId: 'session_123',
    getToken: vi.fn(),
  })),
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => Promise.resolve({ userId: 'user_123' })),
  currentUser: vi.fn(() => Promise.resolve({ id: 'user_123' })),
  clerkClient: vi.fn(),
}))

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    store: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    queue: {
      create: vi.fn(),
    },
    token: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))
