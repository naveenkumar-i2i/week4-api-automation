import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./globalSetup'),
  reporter: [
    // keep the console list reporter…
    ['list'],
    // …and add the HTML reporter
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: { 'Content-Type': 'application/json' },
  },
});
