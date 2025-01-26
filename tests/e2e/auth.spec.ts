import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('Google login flow', async ({ page }) => {
    // Trigger Google OAuth
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button:has-text("Sign in with Google")')
    ]);
    
    // Mocked OAuth flow completes automatically
    await page.waitForURL('/');
    await expect(page.getByText('test@example.com')).toBeVisible();
  });

  test('Credentials login flow - success', async ({ page }) => {
    // Fill in the form
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('demo123');
    
    // Submit the form
    await page.click('button:has-text("Sign in")');
    
    // Should redirect to home
    await page.waitForURL('/');
  });

  test('Credentials login flow - invalid credentials', async ({ page }) => {
    // Fill in the form with wrong password
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    
    // Submit the form
    await page.click('button:has-text("Sign in")');
    
    // Should show error message
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});