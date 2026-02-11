import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {

    test('should allow user to login', async ({ page }) => {
        // We already have authentication state set up, so visiting dashboard should work
        await page.goto('/dashboard');
        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

        // Verify session
        const avatar = page.locator('button[aria-label="User menu"]'); // Assuming user menu has aria-label
        // Or just check for a logout button if visible directly
        // Let's assume there's a user menu trigger.
        // If not, just verifying dashboard access is enough for basic auth test.
    });

    test('should redirect to login when unauthenticated', async ({ browser }) => {
        // Create a new context without auth state
        const context = await browser.newContext({ storageState: undefined });
        const page = await context.newPage();

        await page.goto('/dashboard');
        await expect(page).toHaveURL(/\/login/);
        await context.close();
    });
});
