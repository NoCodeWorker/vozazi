/**
 * Value Objects for VOZAZI Domain
 * 
 * Objetos de valor inmutables y auto-validados.
 */

import { z } from 'zod'

// ============================================================================
// Email Value Object
// ============================================================================

export class Email {
  private constructor(public readonly value: string) {
    if (!Email.isValid(value)) {
      throw new Error(`Invalid email: ${value}`)
    }
  }

  static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static create(email: string): Email {
    return new Email(email.toLowerCase().trim())
  }

  toString(): string {
    return this.value
  }
}

// ============================================================================
// Time Range Value Object
// ============================================================================

export class TimeRange {
  private constructor(
    public readonly start: number,
    public readonly end: number
  ) {
    if (start >= end) {
      throw new Error('Start time must be before end time')
    }
  }

  static create(start: number, end: number): TimeRange {
    return new TimeRange(start, end)
  }

  get duration(): number {
    return this.end - this.start
  }

  contains(timestamp: number): boolean {
    return timestamp >= this.start && timestamp <= this.end
  }

  overlaps(other: TimeRange): boolean {
    return this.start < other.end && other.start < this.end
  }

  toString(): string {
    return `${this.start}-${this.end}`
  }
}

// ============================================================================
// Percentage Value Object
// ============================================================================

export class Percentage {
  private constructor(public readonly value: number) {
    if (value < 0 || value > 100) {
      throw new Error(`Percentage must be between 0 and 100: ${value}`)
    }
  }

  static create(value: number): Percentage {
    return new Percentage(Math.max(0, Math.min(100, value)))
  }

  static fromRatio(ratio: number): Percentage {
    return new Percentage(ratio * 100)
  }

  toRatio(): number {
    return this.value / 100
  }

  toString(): string {
    return `${this.value.toFixed(1)}%`
  }
}

// ============================================================================
// Audio Buffer Value Object
// ============================================================================

export class AudioBuffer {
  private constructor(
    public readonly data: Float32Array,
    public readonly sampleRate: number
  ) {}

  static create(data: Float32Array, sampleRate: number): AudioBuffer {
    if (sampleRate <= 0) {
      throw new Error('Sample rate must be positive')
    }
    return new AudioBuffer(new Float32Array(data), sampleRate)
  }

  get duration(): number {
    return this.data.length / this.sampleRate
  }

  get length(): number {
    return this.data.length
  }

  getRMS(): number {
    let sum = 0
    for (let i = 0; i < this.data.length; i++) {
      sum += this.data[i] * this.data[i]
    }
    return Math.sqrt(sum / this.data.length)
  }

  getPeak(): number {
    let peak = 0
    for (let i = 0; i < this.data.length; i++) {
      peak = Math.max(peak, Math.abs(this.data[i]))
    }
    return peak
  }

  slice(start: number, end: number): AudioBuffer {
    const sliced = this.data.slice(start, end)
    return AudioBuffer.create(sliced, this.sampleRate)
  }
}

// ============================================================================
// Frequency Value Object
// ============================================================================

export class Frequency {
  private static readonly A4 = 440
  private static readonly NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

  private constructor(public readonly hz: number) {
    if (hz <= 0) {
      throw new Error('Frequency must be positive')
    }
  }

  static create(hz: number): Frequency {
    return new Frequency(hz)
  }

  static fromNote(note: string): Frequency {
    const match = note.match(/^([A-G])([b#])?(\d)$/)
    if (!match) {
      throw new Error(`Invalid note format: ${note}`)
    }

    const [, noteName, accidental, octave] = match
    const noteIndex = this.NOTE_NAMES.indexOf(noteName + (accidental || ''))
    const midiNumber = 12 * (parseInt(octave) + 1) + noteIndex
    const frequency = this.A4 * Math.pow(2, (midiNumber - 69) / 12)

    return new Frequency(frequency)
  }

  toNote(): { note: string; cents: number } {
    const midiNumber = 69 + 12 * Math.log2(this.hz / this.A4)
    const noteIndex = Math.round(midiNumber) % 12
    const octave = Math.floor(midiNumber / 12) - 1
    const cents = Math.round((midiNumber - Math.round(midiNumber)) * 100)

    return {
      note: `${this.NOTE_NAMES[noteIndex]}${octave}`,
      cents
    }
  }

  toString(): string {
    return `${this.hz.toFixed(2)} Hz`
  }
}

// ============================================================================
// Money Value Object
// ============================================================================

export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string = 'USD'
  ) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative')
    }
  }

  static create(amount: number, currency: string = 'USD'): Money {
    return new Money(Math.round(amount * 100) / 100, currency)
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies')
    }
    return Money.create(this.amount + other.amount, this.currency)
  }

  multiply(factor: number): Money {
    return Money.create(this.amount * factor, this.currency)
  }

  toString(): string {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' }
    const symbol = symbols[this.currency] || this.currency
    return `${symbol}${this.amount.toFixed(2)}`
  }
}

// ============================================================================
// Date Range Value Object
// ============================================================================

export class DateRange {
  private constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {
    if (start >= end) {
      throw new Error('Start date must be before end date')
    }
  }

  static create(start: Date, end: Date): DateRange {
    return new DateRange(start, end)
  }

  static fromTimestamps(start: number, end: number): DateRange {
    return new DateRange(new Date(start * 1000), new Date(end * 1000))
  }

  contains(date: Date): boolean {
    return date >= this.start && date <= this.end
  }

  overlaps(other: DateRange): boolean {
    return this.start < other.end && other.start < this.end
  }

  get days(): number {
    return Math.floor((this.end.getTime() - this.start.getTime()) / (1000 * 60 * 60 * 24))
  }

  toString(): string {
    return `${this.start.toISOString()} - ${this.end.toISOString()}`
  }
}
