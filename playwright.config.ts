import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './spec',
  /* Run tests sequentially, never in parallel, to avoid shared-session/state collisions on the demo environment. */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Single worker always — sequential execution across all projects/platforms. */
  workers: 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://opensource-demo.orangehrmlive.com',
  },

  /* Configure projects — Chrome only, no cross-browser fan-out */
  projects: [
    // --- API project (jsonplaceholder.typicode.com) ---
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: 'spec/api/**/*.spec.ts',
    },

    // --- UI auth setup (runs before pim-ui) ---
    {
      name: 'auth-setup',
      use: { ...devices['Desktop Chrome'] },
      testMatch: 'spec/ui/auth.setup.ts',
    },

    // --- PIM UI project (OrangeHRM) ---
    {
      name: 'pim-ui',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      testMatch: 'spec/ui/pim/**/*.spec.ts',
      dependencies: ['auth-setup'],
    },

    // --- Leave UI project (OrangeHRM) ---
    {
      name: 'leave-ui',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      testMatch: 'spec/ui/leave/**/*.spec.ts',
      dependencies: ['auth-setup'],
    },

    // --- Admin UI project (OrangeHRM — User Management) ---
    {
      name: 'admin-ui',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      testMatch: 'spec/ui/admin/**/*.spec.ts',
      dependencies: ['auth-setup'],
    },
  ],

  /* Global setup */
  globalSetup: require.resolve('./global-setup.ts'),

  // Each test is given 30 seconds.
  timeout: 60000
});
