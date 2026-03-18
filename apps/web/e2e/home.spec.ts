/**
 * Playwright E2E Test for VOZAZI Home Page
 */

import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/VOZAZI/)
  })

  test('displays main heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /vozazi/i })
    await expect(heading).toBeVisible()
  })

  test('displays tagline', async ({ page }) => {
    const tagline = page.getByText(/AI-powered audio processing/i)
    await expect(tagline).toBeVisible()
  })

  test('has get started button', async ({ page }) => {
    const button = page.getByRole('button', { name: /get started/i })
    await expect(button).toBeVisible()
  })

  test('button is clickable', async ({ page }) => {
    const button = page.getByRole('button', { name: /get started/i })
    await button.click()
    // Add assertion for navigation or action
  })
})

test.describe('Home Page - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('displays correctly on mobile', async ({ page }) => {
    await page.goto('/')
    
    const heading = page.getByRole('heading', { name: /vozazi/i })
    await expect(heading).toBeVisible()
  })

  test('button is accessible on mobile', async ({ page }) => {
    await page.goto('/')
    
    const button = page.getByRole('button', { name: /get started/i })
    await expect(button).toBeVisible()
    await button.click()
  })
})

test.describe('Home Page - Accessibility', () => {
  test('has no accessibility violations', async ({ page }) => {
    await page.goto('/')
    
    // Add axe-core integration if needed
    // const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    // expect(accessibilityScanResults.violations).toEqual([])
  })

  test('supports keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })
})

test.describe('Home Page - Performance', () => {
  test('loads within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(5000) // 5 seconds
  })

  test('has correct LCP element', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    // Check that main heading is visible
    const heading = page.getByRole('heading', { name: /vozazi/i })
    await expect(heading).toBeVisible()
  })
})
