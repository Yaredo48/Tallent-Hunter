import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root or apps/web
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },
    ],

    // Run local servers before starting tests
    webServer: [
        {
            command: 'PORT=3001 npx -y pnpm --filter api start:dev',
            url: 'http://localhost:3001/', // Assuming a health check exists or just wait for 3001
            reuseExistingServer: !process.env.CI,
            cwd: path.resolve(__dirname, '../../'),
            timeout: 120000,
        },
        {
            command: 'PORT=3000 npx -y pnpm --filter web dev',
            url: 'http://localhost:3000',
            reuseExistingServer: !process.env.CI,
            cwd: path.resolve(__dirname, '../../'),
            timeout: 120000,
        },
    ],
});
