import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/VOZAZI/)
})

test('displays main heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /vozazi/i })).toBeVisible()
})
