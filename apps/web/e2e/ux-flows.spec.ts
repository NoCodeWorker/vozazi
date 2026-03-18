/**
 * UX Flow Tests for VOZAZI
 * 
 * Tests that verify user experience flows are intuitive and functional.
 */

import { test, expect } from '@playwright/test'

test.describe('UX Flow - Onboarding', () => {
  test('complete onboarding flow', async ({ page }) => {
    await page.goto('/onboarding')
    await page.waitForLoadState('networkidle')
    
    // Step 1: Welcome
    await expect(page.getByTestId('onboarding-welcome')).toBeVisible()
    await page.click('[data-testid="next-button"]')
    
    // Step 2: Goals
    await expect(page.getByTestId('onboarding-goals')).toBeVisible()
    await page.click('[data-testid="goal-improve-pitch"]')
    await page.click('[data-testid="next-button"]')
    
    // Step 3: Level
    await expect(page.getByTestId('onboarding-level')).toBeVisible()
    await page.click('[data-testid="level-intermediate"]')
    await page.click('[data-testid="next-button"]')
    
    // Step 4: Availability
    await expect(page.getByTestId('onboarding-availability')).toBeVisible()
    await page.click('[data-testid="availability-15min"]')
    await page.click('[data-testid="finish-button"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('can skip onboarding', async ({ page }) => {
    await page.goto('/onboarding')
    await page.waitForLoadState('networkidle')
    
    await page.click('[data-testid="skip-button"]')
    
    // Should show confirmation or redirect
    await expect(page).toHaveURL(/.*dashboard|.*confirm-skip/)
  })

  test('can go back in onboarding', async ({ page }) => {
    await page.goto('/onboarding')
    await page.waitForLoadState('networkidle')
    
    // Go to step 2
    await page.click('[data-testid="next-button"]')
    await expect(page.getByTestId('onboarding-goals')).toBeVisible()
    
    // Go back
    await page.click('[data-testid="back-button"]')
    await expect(page.getByTestId('onboarding-welcome')).toBeVisible()
  })

  test('onboarding progress indicator', async ({ page }) => {
    await page.goto('/onboarding')
    await page.waitForLoadState('networkidle')
    
    // Check progress indicator exists
    const progress = page.locator('[data-testid="progress-indicator"]')
    await expect(progress).toBeVisible()
    
    // Check progress updates
    const step1 = page.locator('[data-testid="progress-step-1"]')
    await expect(step1).toHaveAttribute('data-state', 'active')
    
    await page.click('[data-testid="next-button"]')
    
    const step2 = page.locator('[data-testid="progress-step-2"]')
    await expect(step2).toHaveAttribute('data-state', 'active')
    await expect(step1).toHaveAttribute('data-state', 'completed')
  })
})

test.describe('UX Flow - First Practice Session', () => {
  test('first time user practice flow', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Click on first practice
    await page.click('[data-testid="start-first-practice"]')
    
    // Should show tutorial/intro
    await expect(page.getByTestId('practice-intro')).toBeVisible()
    await page.click('[data-testid="understand-button"]')
    
    // Microphone permission request
    await expect(page.getByTestId('mic-permission')).toBeVisible()
    
    // Allow microphone (mocked)
    await page.click('[data-testid="allow-mic"]')
    
    // Should start practice
    await expect(page.getByTestId('practice-session')).toBeVisible()
  })

  test('can pause and resume practice', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    // Start practice
    await page.click('[data-testid="start-practice"]')
    await page.waitForTimeout(2000)
    
    // Pause
    await page.click('[data-testid="pause-button"]')
    await expect(page.getByTestId('paused-indicator')).toBeVisible()
    
    // Resume
    await page.click('[data-testid="resume-button"]')
    await expect(page.getByTestId('recording-indicator')).toBeVisible()
  })

  test('can end practice early', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    await page.click('[data-testid="start-practice"]')
    await page.waitForTimeout(2000)
    
    // End early
    await page.click('[data-testid="end-early-button"]')
    
    // Should show confirmation
    await expect(page.getByTestId('end-confirmation")).toBeVisible()
    await page.click('[data-testid="confirm-end"]')
    
    // Should show results
    await expect(page.getByTestId('results-summary")).toBeVisible()
  })
})

test.describe('UX Flow - Audio Recording', () => {
  test('audio visualization updates during recording', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    await page.click('[data-testid="start-practice"]')
    
    // Check visualizer is active
    const visualizer = page.locator('[data-testid="audio-visualizer"]')
    await expect(visualizer).toHaveClass(/active|recording/)
  })

  test('shows recording timer', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    await page.click('[data-testid="start-practice"]')
    await page.waitForTimeout(3000)
    
    const timer = page.locator('[data-testid="recording-timer"]')
    await expect(timer).toBeVisible()
    
    const timerText = await timer.textContent()
    expect(timerText).toMatch(/\d{2}:\d{2}/)
  })

  test('shows real-time pitch feedback', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    await page.click('[data-testid="start-practice"]')
    
    // Should show pitch indicator
    const pitchIndicator = page.locator('[data-testid="pitch-indicator"]')
    await expect(pitchIndicator).toBeVisible()
  })
})

test.describe('UX Flow - Results and Feedback', () => {
  test('shows session results after completion', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    await page.click('[data-testid="start-practice"]')
    await page.waitForTimeout(5000)
    await page.click('[data-testid="finish-button"]')
    
    // Should show results
    await expect(page.getByTestId('results-page")).toBeVisible()
    
    // Check score is displayed
    const score = page.locator('[data-testid="overall-score"]')
    await expect(score).toBeVisible()
  })

  test('can navigate to next exercise from results', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    await page.click('[data-testid="start-practice"]')
    await page.waitForTimeout(5000)
    await page.click('[data-testid="finish-button"]')
    
    // Click next exercise
    await page.click('[data-testid="next-exercise-button"]')
    
    // Should start new practice
    await expect(page.getByTestId('practice-session")).toBeVisible()
  })

  test('can save results to history', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    await page.click('[data-testid="start-practice"]')
    await page.waitForTimeout(5000)
    await page.click('[data-testid="finish-button"]')
    
    // Save to history
    await page.click('[data-testid="save-results"]')
    
    // Should show success message
    await expect(page.getByTestId('save-success")).toBeVisible()
  })
})

test.describe('UX Flow - Settings', () => {
  test('can change language', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')
    
    // Open language selector
    await page.click('[data-testid="language-selector"]')
    
    // Select different language
    await page.click('[data-testid="lang-en"]')
    
    // Should update UI language
    await page.waitForTimeout(500)
    const heading = page.locator('h1')
    const text = await heading.textContent()
    
    // Text should be in English now
    expect(text?.toLowerCase()).not.toMatch(/[áéíóúñ]/)
  })

  test('can toggle dark mode', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')
    
    // Toggle dark mode
    await page.click('[data-testid="dark-mode-toggle"]')
    await page.waitForTimeout(500)
    
    // Check dark mode is applied
    const html = page.locator('html')
    const classes = await html.getAttribute('class')
    expect(classes).toContain('dark')
  })

  test('changes persist after refresh', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')
    
    // Change setting
    await page.click('[data-testid="dark-mode-toggle"]')
    await page.waitForTimeout(300)
    
    // Refresh
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Setting should persist
    const html = page.locator('html')
    const classes = await html.getAttribute('class')
    expect(classes).toContain('dark')
  })
})

test.describe('UX Flow - Error States', () => {
  test('shows helpful error when microphone fails', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    // Block microphone
    await page.context().setPermissions({
      name: 'microphone',
    } as any, 'denied')
    
    await page.click('[data-testid="start-practice"]')
    
    // Should show error with helpful message
    await expect(page.getByTestId('mic-error')).toBeVisible()
    await expect(page.getByTestId('mic-error-help')).toBeVisible()
  })

  test('can recover from network error', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Simulate network error
    await page.route('**/api/**', route => route.abort('failed'))
    
    await page.click('[data-testid="refresh-button"]')
    
    // Should show error with retry option
    await expect(page.getByTestId('network-error')).toBeVisible()
    await expect(page.getByTestId('retry-button")).toBeVisible()
  })

  test('shows empty state when no data', async ({ page }) => {
    await page.goto('/history')
    await page.waitForLoadState('networkidle')
    
    // Should show empty state
    await expect(page.getByTestId('empty-state')).toBeVisible()
    await expect(page.getByTestId('empty-state-cta')).toBeVisible()
  })
})

test.describe('UX Flow - Navigation', () => {
  test('can navigate to all main sections', async ({ page }) => {
    const navItems = [
      { name: 'Dashboard', url: '/dashboard', testId: 'nav-dashboard' },
      { name: 'Practice', url: '/practice', testId: 'nav-practice' },
      { name: 'History', url: '/history', testId: 'nav-history' },
      { name: 'Library', url: '/library', testId: 'nav-library' },
      { name: 'Settings', url: '/settings', testId: 'nav-settings' },
    ]
    
    for (const item of navItems) {
      await page.click(`[data-testid="${item.testId}"]`)
      await page.waitForURL(new RegExp(`.*${item.url}`))
      await expect(page).toHaveURL(new RegExp(`.*${item.url}`))
    }
  })

  test('breadcrumbs update correctly', async ({ page }) => {
    await page.goto('/library/techniques')
    await page.waitForLoadState('networkidle')
    
    const breadcrumbs = page.locator('[data-testid="breadcrumbs"]')
    await expect(breadcrumbs).toBeVisible()
    
    // Check breadcrumb items
    const homeCrumb = breadcrumbs.locator('[data-testid="crumb-home"]')
    await expect(homeCrumb).toBeVisible()
    
    const libraryCrumb = breadcrumbs.locator('[data-testid="crumb-library"]')
    await expect(libraryCrumb).toBeVisible()
  })

  test('active nav item is highlighted', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const dashboardNav = page.locator('[data-testid="nav-dashboard"]')
    await expect(dashboardNav).toHaveAttribute('aria-current', 'page')
    await expect(dashboardNav).toHaveClass(/active/)
  })
})

test.describe('UX Flow - Loading States', () => {
  test('shows skeleton while loading dashboard', async ({ page }) => {
    // Slow down network
    await page.route('**/api/dashboard', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })
    
    await page.goto('/dashboard')
    
    // Should show skeleton
    const skeleton = page.locator('[data-testid="skeleton"]')
    await expect(skeleton.first()).toBeVisible()
    
    // Wait for load
    await page.waitForLoadState('networkidle')
    
    // Skeleton should be gone
    await expect(skeleton.first()).not.toBeVisible()
  })

  test('shows loading spinner for actions', async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    
    await page.click('[data-testid="start-practice"]')
    
    // Should show loading state
    const loading = page.locator('[data-testid="loading-spinner"]')
    await expect(loading).toBeVisible({ timeout: 5000 })
  })
})
