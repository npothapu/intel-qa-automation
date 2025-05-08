import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 0,

  projects: [
    {
      name: 'Chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: null, // Let the test script set it dynamically
      },
    },
    // {
    //   name: 'Firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: null,
    //   },
    // },
    // {
    //   name: 'WebKit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: null,
    //   },
    // },
  ],

  reporter: [['list'], ['html', { open: 'never' }]],
});
