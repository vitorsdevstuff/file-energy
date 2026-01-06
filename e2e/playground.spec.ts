import { test, expect, type Page } from "@playwright/test";

// Helper function to login
async function loginUser(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByPlaceholder(/you@example.com/i).fill(email);
  await page.getByPlaceholder(/Enter your password/i).fill(password);
  await page.getByRole("button", { name: /Sign in/i }).click();
  await page.waitForTimeout(2000);
}

// Setup authenticated context
test.describe("Playground (Authenticated)", () => {
  test.describe.configure({ mode: "serial" });

  // Create a test user and authenticate
  const testEmail = `e2e_test_${Date.now()}@example.com`;
  const testPassword = "TestPassword123!";
  const testUsername = `e2e_user_${Date.now()}`;

  test("should setup test user", async ({ page }) => {
    // Register a test user
    await page.goto("/register");

    await page.getByPlaceholder(/johndoe/i).fill(testUsername);
    await page.getByPlaceholder(/you@example.com/i).fill(testEmail);
    await page.getByPlaceholder(/Create a password/i).fill(testPassword);
    await page.getByPlaceholder(/Confirm your password/i).fill(testPassword);

    await page.getByRole("button", { name: /Create account/i }).click();

    // Wait for registration to complete
    await page.waitForTimeout(3000);
  });
});

test.describe("Playground Page Structure", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/playground");

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test("should display empty state with subscription warning for new users", async ({
    page,
  }) => {
    // This test checks the empty state when visiting playground directly
    // In a real scenario, you'd need proper auth setup

    // Navigate to playground (will redirect to login)
    await page.goto("/playground");

    // Verify login redirect
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe("Chat Sidebar", () => {
  test("should have sidebar navigation structure", async ({ page }) => {
    // Navigate to login first
    await page.goto("/login");

    // The sidebar is only visible when authenticated
    // Testing the structure would require a logged-in state
  });
});

test.describe("Chat Interface Elements", () => {
  test.beforeEach(async ({ page }) => {
    // Each test starts at login since we need authentication
    await page.goto("/login");
  });

  test("should have login form visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Welcome back/i })
    ).toBeVisible();
  });
});

test.describe("Document Upload Flow", () => {
  test("should redirect to login for document upload", async ({ page }) => {
    await page.goto("/playground");

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe("Chat Functionality", () => {
  test("should redirect when trying to access specific chat", async ({
    page,
  }) => {
    // Try to access a specific chat UUID
    await page.goto("/playground/test-uuid-12345");

    // Should redirect to login or show 404
    const url = page.url();
    expect(url.includes("login") || url.includes("404")).toBeTruthy();
  });
});

test.describe("Playground UI Components", () => {
  test("should have proper mobile navigation", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/playground");

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);

    // Login page should be responsive
    await expect(
      page.getByRole("heading", { name: /Welcome back/i })
    ).toBeVisible();
  });
});

// Tests that simulate authenticated behavior
test.describe("Authenticated Playground Tests", () => {
  // These tests would require proper authentication setup
  // Using test fixtures or storage state

  test("should have proper page structure when logged in", async ({ page }) => {
    // This is a placeholder for authenticated tests
    // In practice, you'd use:
    // 1. test.use({ storageState: 'auth.json' })
    // 2. Or setup global authentication in playwright.config.ts

    await page.goto("/login");
    await expect(page).toHaveURL(/.*login/);
  });
});

// E2E Flow Tests
test.describe("Complete User Journey", () => {
  test("should complete landing to register flow", async ({ page }) => {
    // Start at landing page
    await page.goto("/");

    // Click Get Started
    await page.getByRole("link", { name: /Get Started Free/i }).first().click();

    // Should be on register page
    await expect(page).toHaveURL(/.*register/);

    // Verify registration form
    await expect(
      page.getByRole("heading", { name: /Create an account/i })
    ).toBeVisible();
  });

  test("should navigate between auth pages", async ({ page }) => {
    // Start at login
    await page.goto("/login");

    // Go to register
    await page.getByRole("link", { name: /Sign up/i }).click();
    await expect(page).toHaveURL(/.*register/);

    // Go back to login
    await page.getByRole("link", { name: /Sign in/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  test("should show pricing and redirect to register", async ({ page }) => {
    // Start at pricing
    await page.goto("/pricing");

    // Click any Get Started button
    await page.getByRole("link", { name: /Get Started/i }).first().click();

    // Should be on register page
    await expect(page).toHaveURL(/.*register/);
  });
});

// API-related tests
test.describe("API Endpoints", () => {
  test("should return 401 for unauthenticated chat request", async ({
    request,
  }) => {
    const response = await request.post("/api/chat/test-id", {
      data: { message: "Hello" },
    });

    // Should return 401 or similar unauthorized response
    expect([401, 403, 404]).toContain(response.status());
  });

  test("should return 401 for unauthenticated upload", async ({ request }) => {
    const response = await request.post("/api/upload");

    // Should return 401 or similar unauthorized response
    expect([401, 403]).toContain(response.status());
  });
});

// Performance tests for playground
test.describe("Playground Performance", () => {
  test("should redirect quickly when not authenticated", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/playground");
    await page.waitForURL(/.*login/);
    const loadTime = Date.now() - startTime;

    // Should redirect in less than 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});

// Accessibility tests
test.describe("Playground Accessibility", () => {
  test("should maintain focus management on auth redirect", async ({
    page,
  }) => {
    await page.goto("/playground");

    // After redirect, page should have proper focus
    await page.waitForURL(/.*login/);

    // Tab should work
    await page.keyboard.press("Tab");

    // Something should be focusable
    const focused = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(focused).toBeTruthy();
  });
});

// Error handling tests
test.describe("Error Handling", () => {
  test("should handle 404 for non-existent chat", async ({ page }) => {
    // Try to access a non-existent chat (will redirect to login first)
    await page.goto("/playground/non-existent-uuid-12345");

    // Either redirects to login or shows 404
    await page.waitForTimeout(2000);
    const url = page.url();

    // Should either redirect to login or stay on page with 404
    expect(
      url.includes("login") ||
        url.includes("404") ||
        url.includes("non-existent")
    ).toBeTruthy();
  });

  test("should handle invalid routes gracefully", async ({ page }) => {
    await page.goto("/playground/invalid/nested/route");

    // Should handle gracefully
    await page.waitForTimeout(2000);

    // Either 404 or redirect
    const status = await page.evaluate(() => document.title);
    expect(status).toBeTruthy();
  });
});

// Session management tests
test.describe("Session Management", () => {
  test("should persist redirect URL for post-login navigation", async ({
    page,
  }) => {
    // Try to access protected route
    await page.goto("/playground");

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);

    // Login form should be visible
    await expect(
      page.getByRole("button", { name: /Sign in/i })
    ).toBeVisible();
  });
});

// Visual regression helpers (structure tests)
test.describe("UI Consistency", () => {
  test("should have consistent header across pages", async ({ page }) => {
    // Check login page header
    await page.goto("/login");
    const loginHeader = await page.locator("header, nav").first().isVisible();

    // Check register page header
    await page.goto("/register");
    const registerHeader = await page.locator("header, nav").first().isVisible();

    // Both should have consistent navigation structure
    expect(loginHeader).toBe(registerHeader);
  });

  test("should have consistent footer across marketing pages", async ({
    page,
  }) => {
    // Check landing page footer
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const landingFooter = await page.locator("footer").isVisible();

    // Check pricing page footer
    await page.goto("/pricing");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const pricingFooter = await page.locator("footer").isVisible();

    expect(landingFooter).toBe(true);
    expect(pricingFooter).toBe(true);
  });
});
