/**
 * Visual Regression Tests for VOZAZI
 * 
 * Tests that capture screenshots and compare them against baselines
 * to detect visual changes and regressions.
 */

import { test, expect } from '@playwright/test'

test.describe('Visual Regression - Home Page', () => {
  test('homepage should look the same', async ({ page }) => {
    await page.goto('/')
    
    // Wait for any animations to complete
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('homepage hero section', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const hero = page.getByTestId('hero-section')
    await expect(hero).toHaveScreenshot('homepage-hero.png')
  })

  test('homepage navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const nav = page.getByTestId('main-navigation')
    await expect(nav).toHaveScreenshot('homepage-nav.png')
  })
})

test.describe('Visual Regression - Dashboard', () => {
  test('dashboard should look the same', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    await expect(page).toHaveScreenshot('dashboard-full.png', {
      fullPage: true,
      maxDiffPixels: 150,
    })
  })

  test('dashboard stats cards', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const statsCards = page.getByTestId('stats-cards')
    await expect(statsCards).toHaveScreenshot('dashboard-stats.png')
  })

  test('dashboard progress chart', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const chart = page.getByTestId('progress-chart')
    await expect(chart).toHaveScreenshot('dashboard-chart.png')
  })
})

test.describe('Visual Regression - Practice Page', () => {
  test('practice page should look the same', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    await expect(page).toHaveScreenshot('practice-full.png', {
      fullPage: true,
      maxDiffPixels: 150,
    })
  })

  test('practice audio controls', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    const controls = page.getByTestId('audio-controls')
    await expect(controls).toHaveScreenshot('practice-controls.png')
  })

  test('practice feedback panel', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    const feedback = page.getByTestId('feedback-panel')
    await expect(feedback).toHaveScreenshot('practice-feedback.png')
  })
})

test.describe('Visual Regression - Components', () => {
  test('buttons variants', async ({ page }) => {
    await page.goto('/components/buttons')
    await page.waitForLoadState('networkidle')
    
    await expect(page).toHaveScreenshot('components-buttons.png')
  })

  test('input fields', async ({ page }) => {
    await page.goto('/components/inputs')
    await page.waitForLoadState('networkidle')
    
    await expect(page).toHaveScreenshot('components-inputs.png')
  })

  test('cards', async ({ page }) => {
    await page.goto('/components/cards')
    await page.waitForLoadState('networkidle')
    
    await expect(page).toHaveScreenshot('components-cards.png')
  })

  test('modals', async ({ page }) => {
    await page.goto('/components/modals')
    await page.waitForLoadState('networkidle')
    
    // Open modal
    await page.click('[data-testid="open-modal"]')
    await page.waitForTimeout(500)
    
    await expect(page).toHaveScreenshot('components-modals.png')
  })
})

test.describe('Visual Regression - Dark Mode', () => {
  test('homepage dark mode', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    await page.waitForTimeout(500)
    
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
    })
  })

  test('dashboard dark mode', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    await page.waitForTimeout(500)
    
    await expect(page).toHaveScreenshot('dashboard-dark.png', {
      fullPage: true,
    })
  })
})

test.describe('Visual Regression - Mobile', () => {
  test('homepage mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    })
  })

  test('dashboard mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
    })
  })

  test('practice mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    await expect(page).toHaveScreenshot('practice-mobile.png', {
      fullPage: true,
    })
  })
})
