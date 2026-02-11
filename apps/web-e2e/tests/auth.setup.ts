import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    // Use a fixed test user. 
    // In a real setup, you might create a new user per test run via API.
    const email = 'e2e-test-user@example.com';
    const password = 'TestPassword123!';

    // Try to register first (handle if exists)
    await page.goto('/register');
    await page.getByLabel('First Name').fill('E2E');
    await page.getByLabel('Last Name').fill('Test');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByLabel('Organization ID').fill('e2e-org');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Check for success or error
    try {
        await page.waitForURL('/dashboard', { timeout: 10000 });
    } catch (e) {
        const errorLocator = page.locator('div.text-red-500');
        if (await errorLocator.isVisible()) {
            const errorText = await errorLocator.textContent();
            console.log('Registration Error:', errorText);

            if (errorText?.includes('already exists')) {
                await page.goto('/login');
                await page.getByLabel('Email').fill(email);
                await page.getByLabel('Password').fill(password);
                await page.getByRole('button', { name: 'Sign In' }).click();
                await page.waitForURL('/dashboard'); // Wait for login success
            } else {
                throw new Error(`Registration failed with: ${errorText}`);
            }
        } else {
            throw e;
        }
    }
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 });

    // End of authentication steps.
    await page.context().storageState({ path: authFile });
});
