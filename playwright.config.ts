import { defineConfig, devices } from "@playwright/test";

const port = 3100;
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  retries: 0,
  use: { baseURL: `http://127.0.0.1:${port}`, trace: "retain-on-failure" },
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: undefined } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
