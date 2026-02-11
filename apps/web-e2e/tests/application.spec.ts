import { test, expect } from '@playwright/test';

test.describe('Application Workflow', () => {

    test('should allow public candidate application', async ({ page }) => {
        // 1. Create and Publish a Job first (Authenticated)
        await page.goto('/dashboard/job-descriptions/new');
        const title = `E2E Public Job ${Date.now()}`;
        await page.getByLabel('Job Title').fill(title);
        await page.getByRole('combobox').click();
        await page.getByRole('option').first().click();
        await page.getByRole('button', { name: 'Create Draft' }).click();

        // Publish
        await page.click('button:has-text("Publish")');
        await expect(page.getByText('Job description published')).toBeVisible();

        // Get public URL
        const publicUrl = page.url().replace('/dashboard/job-descriptions/', '/jobs/');

        // 2. Visit as Guest (incognito context)
        const context = await page.context().browser().newContext();
        const guestPage = await context.newPage();
        await guestPage.goto(publicUrl);

        await expect(guestPage.getByRole('heading', { name: title })).toBeVisible();

        // Click Apply
        await guestPage.getByRole('button', { name: 'Apply Now' }).click();

        // Fill form
        await guestPage.getByLabel('First Name').fill('Candidate');
        await guestPage.getByLabel('Last Name').fill('E2E');
        await guestPage.getByLabel('Email').fill(`candidate${Date.now()}@test.com`);
        // Upload Resume (create dummy file)
        await guestPage.setInputFiles('input[type="file"]', {
            name: 'resume.pdf',
            mimeType: 'application/pdf',
            buffer: Buffer.from('dummy pdf content'),
        });

        await guestPage.getByRole('button', { name: 'Submit Application' }).click();

        await expect(guestPage.getByText('Application submitted successfully')).toBeVisible();

        await context.close();
    });

});
