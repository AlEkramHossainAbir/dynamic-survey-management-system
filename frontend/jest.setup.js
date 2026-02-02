// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock localStorage with in-memory storage
const storage = new Map()

const localStorageMock = {
  getItem: jest.fn((key) => storage.get(key) || null),
  setItem: jest.fn((key, value) => storage.set(key, value)),
  removeItem: jest.fn((key) => storage.delete(key)),
  clear: jest.fn(() => storage.clear()),
}

global.localStorage = localStorageMock

// Reset mocks before each test
beforeEach(() => {
  storage.clear()
  jest.clearAllMocks()
})
