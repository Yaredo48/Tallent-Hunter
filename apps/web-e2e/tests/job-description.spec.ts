import { test, expect } from '@playwright/test';

test.describe('Job Description Workflow', () => {

    test('should create a new job description', async ({ page }) => {
        await page.goto('/dashboard');

        await page.getByRole('link', { name: 'Job Descriptions' }).click();
        await page.getByRole('button', { name: 'New Job Description' }).click();

        // Fill form
        await page.getByLabel('Job Title').fill('Software Engineer E2E');
        // Select Department (assuming a Select trigger)
        await page.getByRole('combobox').click();
        // Just pick the first option
        await page.getByRole('option').first().click();

        await page.getByRole('button', { name: 'Create Draft' }).click();

        // Should redirect to edit page
        await expect(page).toHaveURL(/\/job-descriptions\/.+/);
        await expect(page.getByRole('heading', { name: 'Software Engineer E2E' })).toBeVisible();
    });

    test('should use AI suggestions in editor', async ({ page }) => {
        // Navigate to a JD edit page (we could reuse the one from previous test if we setup state, or just create new one)
        // For simplicity, let's create a new one quickly
        await page.goto('/dashboard/job-descriptions/new');
        await page.getByLabel('Job Title').fill('AI Product Manager');
        await page.getByRole('combobox').click();
        await page.getByRole('option').first().click();
        await page.getByRole('button', { name: 'Create Draft' }).click();

        // wait for editor
        await page.waitForSelector('.ProseMirror');

        // Click AI Suggest
        await page.getByRole('button', { name: 'Suggest Content' }).click();

        // Choose a section
        await page.getByRole('menuitem', { name: 'Responsibilities' }).click();

        // Verify loading state or content insertion
        // Content insertion might be hard to verify exactly without mocking API, 
        // but we can check if text appears in editor
        await expect(page.locator('.ProseMirror')).toContainText('Responsibilities', { timeout: 15000 });
    });

});
