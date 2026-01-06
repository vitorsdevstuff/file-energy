import { chromium, type FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Create a test user for authenticated tests
  const testEmail = "e2e-test@file.energy";
  const testPassword = "E2ETestPassword123!";
  const testUsername = "e2e_test_user";

  try {
    // First, try to register the test user (will fail if already exists)
    await page.goto(`${baseURL}/register`);

    // Fill registration form
    await page.getByPlaceholder(/johndoe/i).fill(testUsername);
    await page.getByPlaceholder(/you@example.com/i).fill(testEmail);
    await page.getByPlaceholder(/Create a password/i).fill(testPassword);
    await page.getByPlaceholder(/Confirm your password/i).fill(testPassword);

    // Submit
    await page.getByRole("button", { name: /Create account/i }).click();

    // Wait for response
    await page.waitForTimeout(3000);
  } catch {
    // User might already exist, continue to login
  }

  try {
    // Now login to get authenticated state
    await page.goto(`${baseURL}/login`);

    await page.getByPlaceholder(/you@example.com/i).fill(testEmail);
    await page.getByPlaceholder(/Enter your password/i).fill(testPassword);

    await page.getByRole("button", { name: /Sign in/i }).click();

    // Wait for login to complete
    await page.waitForTimeout(3000);

    // Save the storage state
    await context.storageState({ path: "e2e/.auth/user.json" });
  } catch (error) {
    console.log("Global setup: Could not authenticate test user", error);
  }

  await browser.close();
}

export default globalSetup;
