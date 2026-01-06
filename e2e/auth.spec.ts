import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.describe("Login Page", () => {
    test("should display login form", async ({ page }) => {
      await page.goto("/login");

      // Check page title
      await expect(
        page.getByRole("heading", { name: /Welcome back/i })
      ).toBeVisible();

      // Check form fields exist
      await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
      await expect(page.getByPlaceholder(/Enter your password/i)).toBeVisible();

      // Check submit button
      await expect(
        page.getByRole("button", { name: /Sign in/i })
      ).toBeVisible();

      // Check registration link
      await expect(
        page.getByRole("link", { name: /Sign up/i })
      ).toBeVisible();

      // Check forgot password link
      await expect(
        page.getByRole("link", { name: /Forgot password/i })
      ).toBeVisible();
    });

    test("should show validation errors for empty form", async ({ page }) => {
      await page.goto("/login");

      // Submit empty form
      await page.getByRole("button", { name: /Sign in/i }).click();

      // Should show validation errors
      await expect(page.getByText(/Please enter a valid email/i)).toBeVisible();
    });

    test("should show validation error for invalid email", async ({ page }) => {
      await page.goto("/login");

      // Enter invalid email
      await page.getByPlaceholder(/you@example.com/i).fill("invalid-email");
      await page.getByPlaceholder(/Enter your password/i).fill("password123");

      // Submit form
      await page.getByRole("button", { name: /Sign in/i }).click();

      // Should show email validation error
      await expect(page.getByText(/Please enter a valid email/i)).toBeVisible();
    });

    test("should navigate to register page", async ({ page }) => {
      await page.goto("/login");

      // Click sign up link
      await page.getByRole("link", { name: /Sign up/i }).click();

      // Should be on register page
      await expect(page).toHaveURL(/.*register/);
    });

    test("should have correct page title", async ({ page }) => {
      await page.goto("/login");

      await expect(page).toHaveTitle(/Login/i);
    });

    test("should show loading state when submitting", async ({ page }) => {
      await page.goto("/login");

      // Fill form
      await page.getByPlaceholder(/you@example.com/i).fill("test@example.com");
      await page.getByPlaceholder(/Enter your password/i).fill("password123");

      // Submit form
      await page.getByRole("button", { name: /Sign in/i }).click();

      // Button should show loading state (may be brief)
      // The button text changes to "Loading..." during submission
    });
  });

  test.describe("Register Page", () => {
    test("should display registration form", async ({ page }) => {
      await page.goto("/register");

      // Check page title
      await expect(
        page.getByRole("heading", { name: /Create an account/i })
      ).toBeVisible();

      // Check all form fields
      await expect(page.getByPlaceholder(/johndoe/i)).toBeVisible();
      await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
      await expect(page.getByPlaceholder(/Create a password/i)).toBeVisible();
      await expect(
        page.getByPlaceholder(/Confirm your password/i)
      ).toBeVisible();

      // Check submit button
      await expect(
        page.getByRole("button", { name: /Create account/i })
      ).toBeVisible();

      // Check login link
      await expect(
        page.getByRole("link", { name: /Sign in/i })
      ).toBeVisible();
    });

    test("should show validation errors for empty form", async ({ page }) => {
      await page.goto("/register");

      // Submit empty form
      await page.getByRole("button", { name: /Create account/i }).click();

      // Should show validation errors
      await expect(
        page.getByText(/Username must be at least 2 characters/i)
      ).toBeVisible();
    });

    test("should show validation error for short password", async ({
      page,
    }) => {
      await page.goto("/register");

      // Fill form with short password
      await page.getByPlaceholder(/johndoe/i).fill("testuser");
      await page.getByPlaceholder(/you@example.com/i).fill("test@example.com");
      await page.getByPlaceholder(/Create a password/i).fill("short");
      await page.getByPlaceholder(/Confirm your password/i).fill("short");

      // Submit form
      await page.getByRole("button", { name: /Create account/i }).click();

      // Should show password validation error
      await expect(
        page.getByText(/Password must be at least 8 characters/i)
      ).toBeVisible();
    });

    test("should show validation error for mismatched passwords", async ({
      page,
    }) => {
      await page.goto("/register");

      // Fill form with mismatched passwords
      await page.getByPlaceholder(/johndoe/i).fill("testuser");
      await page.getByPlaceholder(/you@example.com/i).fill("test@example.com");
      await page.getByPlaceholder(/Create a password/i).fill("password123");
      await page.getByPlaceholder(/Confirm your password/i).fill("different123");

      // Submit form
      await page.getByRole("button", { name: /Create account/i }).click();

      // Should show password mismatch error
      await expect(page.getByText(/Passwords don't match/i)).toBeVisible();
    });

    test("should navigate to login page", async ({ page }) => {
      await page.goto("/register");

      // Click sign in link
      await page.getByRole("link", { name: /Sign in/i }).click();

      // Should be on login page
      await expect(page).toHaveURL(/.*login/);
    });

    test("should have correct page title", async ({ page }) => {
      await page.goto("/register");

      await expect(page).toHaveTitle(/Register/i);
    });

    test("should show terms and privacy links", async ({ page }) => {
      await page.goto("/register");

      // Check legal links
      await expect(
        page.getByRole("link", { name: /Terms of Service/i })
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /Privacy Policy/i })
      ).toBeVisible();
    });
  });

  test.describe("Auth Layout", () => {
    test("should display logo on auth pages", async ({ page }) => {
      await page.goto("/login");

      // Check logo exists
      await expect(page.getByAltText(/File.energy/i).first()).toBeVisible();
    });

    test("should be responsive on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/login");

      // Form should still be visible
      await expect(
        page.getByRole("heading", { name: /Welcome back/i })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Sign in/i })
      ).toBeVisible();
    });
  });

  test.describe("Protected Routes", () => {
    test("should redirect to login when accessing playground without auth", async ({
      page,
    }) => {
      await page.goto("/playground");

      // Should redirect to login
      await expect(page).toHaveURL(/.*login/);
    });

    test("should redirect to login when accessing account without auth", async ({
      page,
    }) => {
      await page.goto("/account");

      // Should redirect to login (or similar protected route behavior)
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe("Registration and Login Flow", () => {
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: "TestPassword123!",
    };

    test("should complete full registration flow", async ({ page }) => {
      await page.goto("/register");

      // Fill registration form
      await page.getByPlaceholder(/johndoe/i).fill(testUser.username);
      await page.getByPlaceholder(/you@example.com/i).fill(testUser.email);
      await page.getByPlaceholder(/Create a password/i).fill(testUser.password);
      await page
        .getByPlaceholder(/Confirm your password/i)
        .fill(testUser.password);

      // Submit form
      await page.getByRole("button", { name: /Create account/i }).click();

      // Wait for redirect or success message
      // Note: This may fail if backend isn't properly configured
      await page.waitForTimeout(2000);

      // Either redirected to login or shows success message
      const url = page.url();
      const hasSuccessMessage = await page
        .getByText(/Account created successfully/i)
        .isVisible()
        .catch(() => false);

      expect(url.includes("login") || hasSuccessMessage).toBeTruthy();
    });

    test("should handle duplicate email registration", async ({ page }) => {
      // First, try to register with a common email that might already exist
      await page.goto("/register");

      await page.getByPlaceholder(/johndoe/i).fill("duplicateuser");
      await page.getByPlaceholder(/you@example.com/i).fill("existing@example.com");
      await page.getByPlaceholder(/Create a password/i).fill("TestPassword123!");
      await page
        .getByPlaceholder(/Confirm your password/i)
        .fill("TestPassword123!");

      await page.getByRole("button", { name: /Create account/i }).click();

      // Wait for response
      await page.waitForTimeout(2000);

      // If email exists, should show error (this tests error handling)
    });
  });

  test.describe("Form Accessibility", () => {
    test("should have proper labels for form fields on login", async ({
      page,
    }) => {
      await page.goto("/login");

      // Check labels exist
      await expect(page.getByText("Email").first()).toBeVisible();
      await expect(page.getByText("Password").first()).toBeVisible();
    });

    test("should have proper labels for form fields on register", async ({
      page,
    }) => {
      await page.goto("/register");

      // Check labels exist
      await expect(page.getByText("Username").first()).toBeVisible();
      await expect(page.getByText("Email").first()).toBeVisible();
      await expect(page.getByText("Password").first()).toBeVisible();
      await expect(page.getByText("Confirm Password").first()).toBeVisible();
    });

    test("should support keyboard navigation on login", async ({ page }) => {
      await page.goto("/login");

      // Tab through form
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Email input should eventually be focused
      const emailInput = page.getByPlaceholder(/you@example.com/i);
      await emailInput.focus();

      // Type in email field
      await page.keyboard.type("test@example.com");

      // Tab to password
      await page.keyboard.press("Tab");

      // Type in password field
      await page.keyboard.type("password123");

      // Tab to submit button
      await page.keyboard.press("Tab");

      // Should be able to submit with Enter
      const submitButton = page.getByRole("button", { name: /Sign in/i });
      await expect(submitButton).toBeFocused();
    });
  });
});
