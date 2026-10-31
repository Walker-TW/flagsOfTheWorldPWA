import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
// Set to test a deployed site instead, e.g. the live Vercel URL.
const BASE_URL = process.env.BASE_URL;
const baseURL = BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    // Start every test past the one-time welcome screen; welcome.spec.ts
    // clears this to test the screen itself.
    storageState: {
      cookies: [],
      origins: [
        {
          origin: baseURL,
          localStorage: [{ name: "welcomeSeen", value: "1" }],
        },
      ],
    },
  },
  // A phone in Chromium, and an iPhone in WebKit (Safari's engine).
  projects: [
    { name: "chromium", use: { ...devices["Pixel 7"] } },
    { name: "webkit", use: { ...devices["iPhone 15"] } },
  ],
  // Tests run against a production build: precaching only happens there.
  // CI builds in an earlier step, so it only needs to start the server.
  webServer: BASE_URL
    ? undefined
    : {
        command: process.env.CI
          ? `npm run start -- --port ${PORT}`
          : `npm run build && npm run start -- --port ${PORT}`,
        url: `http://localhost:${PORT}`,
        timeout: 180_000,
        reuseExistingServer: false,
      },
});
