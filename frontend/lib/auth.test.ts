/**
 * Unit tests for auth utility functions
 */

import { getToken, getUser, setAuth, clearAuth, isAuthenticated, hasRole, User } from './auth'

describe('Auth Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('getToken', () => {
    it('should return null when no token is stored', () => {
      expect(getToken()).toBeNull()
    })

    it('should return the stored token', () => {
      localStorage.setItem('token', 'test-token-123')
      expect(getToken()).toBe('test-token-123')
    })
  })

  describe('getUser', () => {
    it('should return null when no user is stored', () => {
      expect(getUser()).toBeNull()
    })

    it('should return the stored user object', () => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      }
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      const user = getUser()
      expect(user).toEqual(mockUser)
    })

    it('should return null when stored user data is invalid JSON', () => {
      localStorage.setItem('user', 'invalid-json{')
      expect(getUser()).toBeNull()
    })
  })

  describe('setAuth', () => {
    it('should store token and user in localStorage', () => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'officer'
      }
      const mockToken = 'jwt-token-abc'

      setAuth(mockToken, mockUser)

      // Verify data can be retrieved correctly
      expect(getToken()).toBe(mockToken)
      expect(getUser()).toEqual(mockUser)
    })
  })

  describe('clearAuth', () => {
    it('should remove token and user from localStorage', () => {
      // First set some data
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      }
      setAuth('test-token', mockUser)
      
      // Verify data exists
      expect(getToken()).toBe('test-token')
      expect(getUser()).toEqual(mockUser)
      
      clearAuth()
      
      // Verify data is cleared
      expect(getToken()).toBeNull()
      expect(getUser()).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return false when no token is present', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('should return true when token is present', () => {
      localStorage.setItem('token', 'test-token')
      expect(isAuthenticated()).toBe(true)
    })
  })

  describe('hasRole', () => {
    it('should return false when no user is stored', () => {
      expect(hasRole('admin')).toBe(false)
    })

    it('should return true when user has the specified role', () => {
      const mockUser: User = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      }
      localStorage.setItem('user', JSON.stringify(mockUser))

      expect(hasRole('admin')).toBe(true)
    })

    it('should return false when user has a different role', () => {
      const mockUser: User = {
        id: 2,
        name: 'Officer User',
        email: 'officer@example.com',
        role: 'officer'
      }
      localStorage.setItem('user', JSON.stringify(mockUser))

      expect(hasRole('admin')).toBe(false)
    })
  })
})
