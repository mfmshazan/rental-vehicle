import { defineConfig, devices } from "@playwright/test";

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
      RENTAL_DATABASE_URL: "file:./roam-test.db",
      ROAM_TEST_MODE: "true",
      AUTH_TRUST_HOST: "true",
    },
    timeout: 60000,
  },
});
