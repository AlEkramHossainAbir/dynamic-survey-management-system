/**
 * Unit tests for utility functions
 */

import { cn } from './utils'

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge multiple class names', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', false && 'hidden', true && 'visible')
      expect(result).toBe('base visible')
    })

    it('should merge Tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4')
      // Should use px-4 instead of px-2 due to tailwind-merge
      expect(result).toBe('py-1 px-4')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'end')
      expect(result).toBe('base end')
    })

    it('should handle empty strings', () => {
      const result = cn('base', '', 'end')
      expect(result).toBe('base end')
    })

    it('should handle array of classes', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle object with boolean values', () => {
      const result = cn({
        'active': true,
        'disabled': false,
        'visible': true
      })
      expect(result).toBe('active visible')
    })

    it('should resolve conflicting Tailwind classes', () => {
      const result = cn('text-red-500 text-blue-500')
      // Should keep only the last conflicting class
      expect(result).toBe('text-blue-500')
    })

    it('should handle complex Tailwind utilities', () => {
      const result = cn(
        'bg-primary text-white',
        'hover:bg-primary/90',
        'disabled:opacity-50'
      )
      expect(result).toContain('bg-primary')
      expect(result).toContain('text-white')
      expect(result).toContain('hover:bg-primary/90')
      expect(result).toContain('disabled:opacity-50')
    })
  })
})
