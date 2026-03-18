/**
 * Accessibility (A11y) Tests for VOZAZI
 * 
 * Tests that ensure the application is accessible to all users,
 * including those using assistive technologies.
 */

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility - Home Page', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check for h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
    
    // Check h1 is not empty
    const h1Text = await page.locator('h1').textContent()
    expect(h1Text?.trim()).toBeTruthy()
  })

  test('should have skip link', async ({ page }) => {
    await page.goto('/')
    
    // Press Tab to show skip link
    await page.keyboard.press('Tab')
    
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeVisible()
  })

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      
      // Alt can be empty string for decorative images, but should exist
      expect(alt !== null).toBeTruthy()
    }
  })

  test('all buttons should have accessible names', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const buttons = page.locator('button')
    const count = await buttons.count()
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      
      // Check for text content, aria-label, or aria-labelledby
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      const ariaLabelledBy = await button.getAttribute('aria-labelledby')
      
      expect(text?.trim() || ariaLabel || ariaLabelledBy).toBeTruthy()
    }
  })

  test('all links should have accessible names', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const links = page.locator('a')
    const count = await links.count()
    
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      const href = await link.getAttribute('href')
      
      // Skip anchor links and javascript:void
      if (href?.startsWith('#') || href === 'javascript:void(0)') {
        continue
      }
      
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      
      expect(text?.trim() || ariaLabel).toBeTruthy()
    }
  })

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const inputs = page.locator('input:not([type="hidden"]):not([type="submit"])')
    const count = await inputs.count()
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      
      // Check for associated label
      let hasLabel = false
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        hasLabel = (await label.count()) > 0
      }
      
      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy()
    }
  })
})

test.describe('Accessibility - Dashboard', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('charts should have accessible descriptions', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const charts = page.locator('[data-testid="chart"], [role="img"]')
    const count = await charts.count()
    
    for (let i = 0; i < count; i++) {
      const chart = charts.nth(i)
      const ariaLabel = await chart.getAttribute('aria-label')
      const ariaDescription = await chart.getAttribute('aria-description')
      
      expect(ariaLabel || ariaDescription).toBeTruthy()
    }
  })

  test('stats should be announced to screen readers', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const stats = page.locator('[data-testid="stat"]')
    const count = await stats.count()
    
    for (let i = 0; i < count; i++) {
      const stat = stats.nth(i)
      const role = await stat.getAttribute('role')
      const ariaLabel = await stat.getAttribute('aria-label')
      
      expect(role === 'status' || role === 'figure' || ariaLabel).toBeTruthy()
    }
  })
})

test.describe('Accessibility - Practice', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('audio visualizer should have accessible alternative', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    const visualizer = page.locator('[data-testid="audio-visualizer"], canvas')
    
    if (await visualizer.count() > 0) {
      const ariaLabel = await visualizer.first().getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
    }
  })

  test('feedback should be announced to screen readers', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    const feedback = page.locator('[data-testid="feedback"]')
    const role = await feedback.getAttribute('role')
    const ariaLive = await feedback.getAttribute('aria-live')
    
    expect(role === 'status' || role === 'alert' || ariaLive === 'polite' || ariaLive === 'assertive').toBeTruthy()
  })
})

test.describe('Accessibility - Keyboard Navigation', () => {
  test('should be navigable with keyboard only', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Tab through all focusable elements
    let focusableCount = 0
    const maxTabs = 50 // Prevent infinite loop
    
    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      
      if (await focusedElement.count() === 0) {
        break
      }
      
      focusableCount++
      
      // Check that focused element is visible
      await expect(focusedElement).toBeVisible()
      
      // Check for focus indicator
      const focusedBox = await focusedElement.boundingBox()
      expect(focusedBox).toBeTruthy()
    }
    
    expect(focusableCount).toBeGreaterThan(0)
  })

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    
    // Get computed style
    const outlineWidth = await focusedElement.evaluate((el) => 
      window.getComputedStyle(el).outlineWidth
    )
    const outlineStyle = await focusedElement.evaluate((el) => 
      window.getComputedStyle(el).outlineStyle
    )
    
    // Focus should be visible
    expect(outlineWidth !== '0px' || outlineStyle !== 'none').toBeTruthy()
  })

  test('modal should trap focus', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Open modal if there is one
    const openModalButton = page.locator('[data-testid="open-modal"], button:has-text("Modal")')
    
    if (await openModalButton.count() > 0) {
      await openModalButton.click()
      await page.waitForTimeout(500)
      
      // Tab through and check focus stays in modal
      const modal = page.locator('[role="dialog"]')
      
      if (await modal.count() > 0) {
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab')
          const focusedElement = page.locator(':focus')
          
          // Check if focused element is inside modal
          const isInsideModal = await modal.contains(focusedElement)
          expect(isInsideModal).toBeTruthy()
        }
      }
    }
  })

  test('dropdown should be keyboard accessible', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Find and test dropdown
    const dropdown = page.locator('[data-testid="dropdown"], [role="menu"]')
    
    if (await dropdown.count() > 0) {
      // Tab to dropdown trigger
      await page.keyboard.press('Tab')
      
      // Press Enter or Space to open
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
      
      // Arrow keys should navigate options
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowUp')
      
      // Escape should close
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
      
      const isOpen = await dropdown.first().getAttribute('aria-expanded')
      expect(isOpen === 'false' || isOpen === null).toBeTruthy()
    }
  })
})

test.describe('Accessibility - Color and Contrast', () => {
  test('should not rely on color alone', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check for links that might only use color to indicate state
    const links = page.locator('a')
    const count = await links.count()
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = links.nth(i)
      const hasUnderline = await link.evaluate((el) => 
        window.getComputedStyle(el).textDecorationLine.includes('underline')
      )
      const hasOtherIndicator = await link.evaluate((el) => 
        el.getAttribute('aria-current') !== null || 
        el.classList.contains('active') ||
        window.getComputedStyle(el).fontWeight === 'bold'
      )
      
      // Links should have non-color indicators
      expect(hasUnderline || hasOtherIndicator).toBeTruthy()
    }
  })
})

test.describe('Accessibility - Forms', () => {
  test('form errors should be accessible', async ({ page }) => {
    await page.goto('/sign-in')
    await page.waitForLoadState('networkidle')
    
    // Submit form with empty fields to trigger errors
    const submitButton = page.locator('button[type="submit"]')
    
    if (await submitButton.count() > 0) {
      await submitButton.click()
      await page.waitForTimeout(500)
      
      // Check error messages have proper role
      const errors = page.locator('[role="alert"], [aria-live="assertive"], .error-message')
      
      if (await errors.count() > 0) {
        const role = await errors.first().getAttribute('role')
        const ariaLive = await errors.first().getAttribute('aria-live')
        
        expect(role === 'alert' || ariaLive === 'assertive' || ariaLive === 'polite').toBeTruthy()
      }
    }
  })

  test('required fields should be indicated', async ({ page }) => {
    await page.goto('/sign-up')
    await page.waitForLoadState('networkidle')
    
    const requiredInputs = page.locator('input[required], input[aria-required="true"]')
    const count = await requiredInputs.count()
    
    for (let i = 0; i < count; i++) {
      const input = requiredInputs.nth(i)
      const ariaRequired = await input.getAttribute('aria-required')
      const hasRequiredIndicator = await input.evaluate((el) => {
        const label = document.querySelector(`label[for="${el.id}"]`)
        return label?.textContent?.includes('*') || 
               label?.textContent?.includes('required') ||
               el.getAttribute('required') !== null
      })
      
      expect(ariaRequired === 'true' || hasRequiredIndicator).toBeTruthy()
    }
  })
})
