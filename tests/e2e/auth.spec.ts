import { test, expect } from '@playwright/test';
import { prisma } from '@/prisma';
import bcrypt from 'bcryptjs';

test.describe('Authentication Flow', () => {
  let testUser: { email: string; password: string; } | null = null;

  test.beforeAll(async () => {
    // Fetch the test user that was created by seed.ts
    const user = await prisma.user.findFirst({
      where: {
        email: 'test@example.com'
      }
    });

    if (!user) {
      throw new Error('Test user not found. Please run prisma seed first.');
    }

    testUser = {
      email: user.email,
      password: 'password123' // This is the password we know was set in seed.ts
    };
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('should show the signin page with both auth options', async ({ page }) => {
    // Check for the presence of both authentication methods
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
    
    // Check for form fields
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('Credentials login - success', async ({ page }) => {
    if (!testUser) throw new Error('Test user not initialized');
    
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    
    // Get the submit button specifically
    const submitButton = page.getByRole('button', { name: 'Sign in', exact: true });
    await submitButton.click();
    
    // Wait for loading state
    await expect(page.getByText('Signing in...')).toBeVisible();
    
    // Wait for the form submission and redirect
    await page.waitForURL('/', { timeout: 10000 });
  });

  test('Credentials login - invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    // Wait for loading state to finish
    await expect(page.getByText('Signing in...')).toBeVisible();
    await expect(page.getByText('Signing in...')).not.toBeVisible();
    
    // Look for the error message
    await expect(
      page.locator('div[role="alert"]').filter({ hasText: 'Invalid email or password' })
    ).toBeVisible({ timeout: 10000 });
  });

  test('Credentials login - wrong password', async ({ page }) => {
    if (!testUser) throw new Error('Test user not initialized');
    
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill('wrongpass');
    
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    // Wait for loading state to finish
    await expect(page.getByText('Signing in...')).toBeVisible();
    await expect(page.getByText('Signing in...')).not.toBeVisible();
    
    // Look for the error message
    await expect(
      page.locator('div[role="alert"]').filter({ hasText: 'Invalid email or password' })
    ).toBeVisible({ timeout: 10000 });
  });

  test('Credentials login - validation errors', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').fill('123');
    
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    // Check for field-specific error messages
    await expect(
      page.locator('p[role="alert"]').filter({ hasText: 'Invalid email format' })
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.locator('p[role="alert"]').filter({ hasText: 'Password must be at least 6 characters' })
    ).toBeVisible({ timeout: 10000 });
  });

  test('Google login button is present and clickable', async ({ page }) => {
    const googleButton = page.getByRole('button', { name: 'Sign in with Google' });
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
  });

  test('Already authenticated user is redirected', async ({ page }) => {
    // TODO: Mock authentication state
    // This would require setting up auth session/cookies before visiting the page
    // The actual implementation depends on your auth setup
  });
});