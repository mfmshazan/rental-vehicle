import { defineConfig, devices } from "@playwright/test";

// Keep in sync with tests/setup.cjs — the app server under test must use the
// same database the global setup migrates and seeds.
const TEST_DATABASE_URL =
  process.env.DATABASE_URL_TEST ||
  "postgresql://postgres:postgres@localhost:5432/roam_test?schema=public";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  globalSetup: "./tests/setup.cjs",
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: process.platform === "win32" ? "msedge" : "chromium",
      },
    },
  ],
  webServer: {
    command: "npm run start -- --port 3100",
    url: "http://localhost:3100/api/health",
    reuseExistingServer: false,
    env: {
      DATABASE_URL: TEST_DATABASE_URL,
      DIRECT_URL: TEST_DATABASE_URL,
      ROAM_TEST_MODE: "true",
      AUTH_TRUST_HOST: "true",
    },
    timeout: 60000,
  },
});
