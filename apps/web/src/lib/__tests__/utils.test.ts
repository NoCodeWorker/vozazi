/**
 * Unit Tests for VOZAZI Utility Functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatDate,
  formatDuration,
  formatFileSize,
  truncate,
  generateId
} from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-03-15')
      const formatted = formatDate(date)
      
      expect(formatted).toMatch(/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$/)
    })

    it('formats today date correctly', () => {
      const today = new Date()
      const formatted = formatDate(today)
      
      expect(formatted).toMatch(/\d{4}$/)
    })
  })

  describe('formatDuration', () => {
    it('formats seconds correctly', () => {
      expect(formatDuration(0)).toBe('0:00')
      expect(formatDuration(5)).toBe('0:05')
      expect(formatDuration(60)).toBe('1:00')
      expect(formatDuration(125)).toBe('2:05')
      expect(formatDuration(3661)).toBe('61:01')
    })

    it('pads seconds with leading zero', () => {
      expect(formatDuration(65)).toBe('1:05')
      expect(formatDuration(121)).toBe('2:01')
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1)).toBe('1 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1073741824)).toBe('1 GB')
    })

    it('formats decimal values correctly', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1572864)).toBe('1.5 MB')
    })

    it('handles large numbers correctly', () => {
      expect(formatFileSize(5000000000)).toBe('4.66 GB')
    })
  })

  describe('truncate', () => {
    it('truncates long strings', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncate(longText, 20)).toBe('This is a very long ...')
    })

    it('does not truncate short strings', () => {
      const shortText = 'Short text'
      expect(truncate(shortText, 100)).toBe('Short text')
    })

    it('handles exact length strings', () => {
      const text = 'Exactly 10'
      expect(truncate(text, 10)).toBe('Exactly 10')
    })

    it('handles empty strings', () => {
      expect(truncate('', 10)).toBe('')
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).not.toBe(id2)
    })

    it('generates string IDs', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
    })

    it('generates non-empty IDs', () => {
      const id = generateId()
      expect(id.length).toBeGreaterThan(0)
    })
  })
})
