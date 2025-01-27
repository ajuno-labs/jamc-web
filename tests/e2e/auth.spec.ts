import { test, expect } from '@playwright/test';
import bcrypt from 'bcryptjs';
import { prisma } from '@/prisma';

test.describe('Authentication Flow', () => {
  const testUser = {
    id: 'test-user-id', // Match the ID from seed.ts
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  };

  test.beforeAll(async () => {
    // Create or update test user with password
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await prisma.user.upsert({
      where: { id: testUser.id },
      update: { password: hashedPassword },
      create: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        password: hashedPassword
      }
    });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('Credentials login - success', async ({ page }) => {
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    // Wait for the form submission and redirect
    await page.waitForURL('/');
    expect(page.url()).toMatch(/\/$/); // Match the root path
  });

  test('Credentials login - invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    await expect(
      page.getByRole('alert').filter({ hasText: 'Invalid email or password' })
    ).toBeVisible({ timeout: 10000 });
  });

  test('Credentials login - wrong password', async ({ page }) => {
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill('wrongpass');
    
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    await expect(
      page.getByRole('alert').filter({ hasText: 'Invalid email or password' })
    ).toBeVisible({ timeout: 10000 });
  });

  test('Credentials login - validation errors', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').fill('123');
    
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    await expect(
      page.getByRole('alert').filter({ hasText: 'Invalid email format' })
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.getByRole('alert').filter({ hasText: 'Password must be at least 6 characters' })
    ).toBeVisible({ timeout: 10000 });
  });
});