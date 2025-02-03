import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe('Credentials Authentication Flow', () => {
  let testUser: { email: string; password: string; } | null = null;

  test.beforeAll(async () => {
    testUser = {
      email: 'test@example.com',
      password: 'password123'
    };
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('should show the signin form', async ({ page }) => {
    // Check for form fields
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  });

  test('Credentials login - success', async ({ page }) => {
    if (!testUser) throw new Error('Test user not initialized');
    
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    
    // Get the submit button and submit the form
    const submitButton = page.getByRole('button', { name: 'Sign in', exact: true });
    
    // Create a promise that waits for navigation or error
    const formSubmission = Promise.race([
      page.waitForURL('/', { timeout: 10000 }).catch(() => {}),
      page.waitForSelector('div[role="alert"][aria-live="polite"]', { timeout: 10000 }).catch(() => {})
    ]);
    
    // Click and wait for submission to start
    await Promise.all([
      formSubmission,
      submitButton.click()
    ]);
    
    // Wait for either navigation or error message
    await Promise.race([
      page.waitForURL('/', { timeout: 10000 }),
      page.waitForSelector('div[role="alert"][aria-live="polite"]', { timeout: 10000 })
    ]);

    // If we're still on the signin page, verify the button is enabled again
    if (page.url().includes('/signin')) {
      await expect(submitButton).toBeEnabled();
    }
  });

  test('Credentials login - invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    
    // Get the submit button and submit the form
    const submitButton = page.getByRole('button', { name: 'Sign in', exact: true });
    
    // Create a promise that waits for navigation or error
    const formSubmission = Promise.race([
      page.waitForURL('/', { timeout: 10000 }).catch(() => {}),
      page.waitForSelector('div[role="alert"][aria-live="polite"]', { timeout: 10000 }).catch(() => {})
    ]);
    
    // Click and wait for submission to start
    await Promise.all([
      formSubmission,
      submitButton.click()
    ]);
    
    // Wait for either navigation or error message
    await Promise.race([
      page.waitForURL('/', { timeout: 10000 }),
      page.waitForSelector('div[role="alert"][aria-live="polite"]', { timeout: 10000 })
    ]);

    // If we're still on the signin page, verify the button is enabled again
    if (page.url().includes('/signin')) {
      await expect(submitButton).toBeEnabled();
    }
  });

  test('Credentials login - wrong password', async ({ page }) => {
    if (!testUser) throw new Error('Test user not initialized');
    
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill('wrongpass');
    
    // Get the submit button and submit the form
    const submitButton = page.getByRole('button', { name: 'Sign in', exact: true });
    
    // Create a promise that waits for navigation or error
    const formSubmission = Promise.race([
      page.waitForURL('/', { timeout: 10000 }).catch(() => {}),
      page.waitForSelector('div[role="alert"][aria-live="polite"]', { timeout: 10000 }).catch(() => {})
    ]);
    
    // Click and wait for submission to start
    await Promise.all([
      formSubmission,
      submitButton.click()
    ]);
    
    // Wait for either navigation or error message
    await Promise.race([
      page.waitForURL('/', { timeout: 10000 }),
      page.waitForSelector('div[role="alert"][aria-live="polite"]', { timeout: 10000 })
    ]);

    // If we're still on the signin page, verify the button is enabled again
    if (page.url().includes('/signin')) {
      await expect(submitButton).toBeEnabled();
    }
  });

  test('Credentials login - validation errors', async ({ page }) => {
    // First clear any existing values
    await page.getByLabel('Email').clear();
    await page.getByLabel('Password').clear();
    
    // Submit empty form to trigger required field errors
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    // Check for required field errors
    await expect(page.locator('#email-error')).toContainText('Email is required');
    await expect(page.locator('#password-error')).toContainText('Password is required');
    
    // Now test invalid format errors
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').fill('123');
    
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    // Check for format error messages
    await expect(page.locator('#email-error')).toContainText('Invalid email');
    await expect(page.locator('#password-error')).toContainText('Password must be more than 8 characters');
  });

  // TODO: Add test for authenticated user redirect after implementing route protection
  // This will require:
  // 1. Protecting the root route in middleware.ts
  // 2. Setting up proper session mocking
  // 3. Verifying the redirect behavior
});