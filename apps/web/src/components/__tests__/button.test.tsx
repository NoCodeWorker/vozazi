/**
 * Component Tests for VOZAZI Button Component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@vozazi/ui'

describe('Button', () => {
  describe('Rendering', () => {
    it('renders button with text', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
    })

    it('renders button as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      
      const link = screen.getByRole('link', { name: /link button/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })

    it('applies custom className', () => {
      const { container } = render(
        <Button className="custom-class">Button</Button>
      )
      
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const

    variants.forEach((variant) => {
      it(`renders ${variant} variant`, () => {
        render(<Button variant={variant}>Button</Button>)
        
        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
      })
    })
  })

  describe('Sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const

    sizes.forEach((size) => {
      it(`renders ${size} size`, () => {
        render(<Button size={size}>Button</Button>)
        
        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
      })
    })

    it('renders icon button with correct dimensions', () => {
      const { container } = render(<Button size="icon">🔍</Button>)
      
      const button = container.firstChild as HTMLElement
      expect(button).toHaveClass('h-10', 'w-10')
    })
  })

  describe('Interactions', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('calls onClick handler with event', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({
        type: 'click'
      }))
    })

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      )
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Disabled State', () => {
    it('renders disabled button', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('applies disabled styles', () => {
      const { container } = render(<Button disabled>Disabled</Button>)
      
      expect(container.firstChild).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    })

    it('can be disabled via props', () => {
      const { rerender } = render(<Button>Enabled</Button>)
      
      expect(screen.getByRole('button')).not.toBeDisabled()
      
      rerender(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Button aria-label="Custom label">Button</Button>)
      
      const button = screen.getByRole('button', { name: /custom label/i })
      expect(button).toHaveAttribute('aria-label', 'Custom label')
    })

    it('has type="button" by default', () => {
      render(<Button>Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('can have custom type', () => {
      render(<Button type="submit">Submit</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('Focus States', () => {
    it('can receive focus', () => {
      render(<Button>Focusable</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(button).toHaveFocus()
    })

    it('shows focus ring on keyboard focus', () => {
      const { container } = render(<Button>Button</Button>)
      
      const button = container.firstChild as HTMLElement
      fireEvent.focus(button)
      
      expect(button).toHaveClass('focus-visible:ring-2')
    })
  })

  describe('Loading State', () => {
    it('can show loading state', () => {
      render(<Button loading>Loading</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
    })

    it('disables button when loading', () => {
      render(<Button loading>Loading</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })
})
