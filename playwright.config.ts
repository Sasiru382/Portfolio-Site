import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45000,
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  reporter: [["list"], ["json", { outputFile: "docs/validation/e2e.json" }]],
  webServer: {
    command: "npx serve out -l 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
});
