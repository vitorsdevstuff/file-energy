import { test, expect } from "@playwright/test";

test.describe("Marketing Pages", () => {
  test.describe("Landing Page", () => {
    test("should display hero section with correct content", async ({ page }) => {
      await page.goto("/");

      // Check hero title
      await expect(
        page.getByRole("heading", { name: /Interact with your Documents/i })
      ).toBeVisible();

      // Check hero subtitle
      await expect(
        page.getByText(/2025: When AI is changing the world/i)
      ).toBeVisible();

      // Check FILE ENERGY badge
      await expect(page.getByText("FILE ENERGY")).toBeVisible();

      // Check CTA buttons
      await expect(
        page.getByRole("link", { name: /Get Started Free/i })
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /View Pricing/i })
      ).toBeVisible();

      // Check social proof
      await expect(
        page.getByText(/1,000\+ professionals trust File.energy/i)
      ).toBeVisible();
    });

    test("should have working navigation links", async ({ page }) => {
      await page.goto("/");

      // Check navbar exists
      await expect(page.locator("nav")).toBeVisible();

      // Check logo
      await expect(page.getByAltText(/File.energy/i).first()).toBeVisible();
    });

    test("should display features section", async ({ page }) => {
      await page.goto("/");

      // Scroll to features
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(500);

      // Check features heading
      await expect(
        page.getByRole("heading", { name: /Why Choose File.energy/i })
      ).toBeVisible();

      // Check some feature cards exist
      await expect(page.getByText(/Document Q&A/i).first()).toBeVisible();
    });

    test("should display pricing section", async ({ page }) => {
      await page.goto("/");

      // Scroll to pricing
      await page.evaluate(() => window.scrollBy(0, 2000));
      await page.waitForTimeout(500);

      // Check pricing heading
      await expect(
        page.getByRole("heading", { name: /Our Pricing/i })
      ).toBeVisible();

      // Check pricing cards exist
      await expect(page.getByText(/\$7.99/).first()).toBeVisible();
      await expect(page.getByText(/\$19.99/).first()).toBeVisible();
    });

    test("should display testimonials section", async ({ page }) => {
      await page.goto("/");

      // Scroll to testimonials
      await page.evaluate(() => window.scrollBy(0, 1500));
      await page.waitForTimeout(500);

      // Check testimonials heading
      await expect(
        page.getByRole("heading", { name: /What Our Users Say/i })
      ).toBeVisible();
    });

    test("should display FAQ section", async ({ page }) => {
      await page.goto("/");

      // Scroll to FAQ
      await page.evaluate(() => window.scrollBy(0, 3500));
      await page.waitForTimeout(500);

      // Check FAQ heading
      await expect(
        page.getByRole("heading", { name: /Frequently Asked Questions/i })
      ).toBeVisible();
    });

    test("should display footer with correct content", async ({ page }) => {
      await page.goto("/");

      // Scroll to bottom
      await page.evaluate(() =>
        window.scrollTo(0, document.body.scrollHeight)
      );
      await page.waitForTimeout(500);

      // Check footer exists
      await expect(page.locator("footer")).toBeVisible();

      // Check footer links
      await expect(
        page.locator("footer").getByRole("link", { name: /Privacy Policy/i })
      ).toBeVisible();
      await expect(
        page.locator("footer").getByRole("link", { name: /Terms of Service/i })
      ).toBeVisible();
    });

    test("should be responsive on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Hero should still be visible
      await expect(
        page.getByRole("heading", { name: /Interact with your Documents/i })
      ).toBeVisible();

      // CTA buttons should be visible
      await expect(
        page.getByRole("link", { name: /Get Started Free/i })
      ).toBeVisible();
    });
  });

  test.describe("Pricing Page", () => {
    test("should display all pricing plans", async ({ page }) => {
      await page.goto("/pricing");

      // Check page title
      await expect(
        page.getByRole("heading", { name: /Pricing/i }).first()
      ).toBeVisible();

      // Check all 4 pricing plans exist
      await expect(page.getByText("Starter")).toBeVisible();
      await expect(page.getByText("Professional")).toBeVisible();
      await expect(page.getByText("Business")).toBeVisible();
      await expect(page.getByText("Enterprise")).toBeVisible();

      // Check prices
      await expect(page.getByText("$7.99")).toBeVisible();
      await expect(page.getByText("$19.99")).toBeVisible();
      await expect(page.getByText("$34.99")).toBeVisible();
      await expect(page.getByText("$59.99")).toBeVisible();
    });

    test("should highlight popular plan", async ({ page }) => {
      await page.goto("/pricing");

      // Check "Most Popular" badge exists
      await expect(page.getByText("Most Popular")).toBeVisible();
    });

    test("should show payment methods", async ({ page }) => {
      await page.goto("/pricing");

      // Check payment method images
      await expect(page.getByAltText(/Mastercard/i).first()).toBeVisible();
      await expect(page.getByAltText(/Visa/i).first()).toBeVisible();
    });

    test("should have working Get Started buttons", async ({ page }) => {
      await page.goto("/pricing");

      // Click on first Get Started button
      const getStartedButton = page
        .getByRole("link", { name: /Get Started/i })
        .first();
      await expect(getStartedButton).toBeVisible();

      // Check it links to register
      await expect(getStartedButton).toHaveAttribute("href", "/register");
    });
  });

  test.describe("About Page", () => {
    test("should display about page content", async ({ page }) => {
      await page.goto("/about");

      // Check page loads with about content
      await expect(
        page.getByRole("heading", { level: 1 }).first()
      ).toBeVisible();
    });
  });

  test.describe("Contact Page", () => {
    test("should display contact page content", async ({ page }) => {
      await page.goto("/contact");

      // Check page loads with contact content
      await expect(
        page.getByRole("heading", { level: 1 }).first()
      ).toBeVisible();
    });
  });

  test.describe("Navigation", () => {
    test("should navigate from landing to pricing", async ({ page }) => {
      await page.goto("/");

      // Click on View Pricing button
      await page.getByRole("link", { name: /View Pricing/i }).first().click();

      // Should be on pricing page
      await expect(page).toHaveURL(/.*pricing/);
    });

    test("should navigate from landing to register", async ({ page }) => {
      await page.goto("/");

      // Click on Get Started Free button
      await page.getByRole("link", { name: /Get Started Free/i }).first().click();

      // Should be on register page
      await expect(page).toHaveURL(/.*register/);
    });
  });

  test.describe("SEO and Meta", () => {
    test("should have correct page title on landing", async ({ page }) => {
      await page.goto("/");

      // Check title
      await expect(page).toHaveTitle(/File.energy/i);
    });

    test("should have correct page title on pricing", async ({ page }) => {
      await page.goto("/pricing");

      // Check title
      await expect(page).toHaveTitle(/Pricing/i);
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper heading hierarchy on landing", async ({ page }) => {
      await page.goto("/");

      // Should have exactly one h1
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);
    });

    test("should have alt text on images", async ({ page }) => {
      await page.goto("/");

      // Check robot image has alt text
      const robotImage = page.locator('img[src*="robot"]');
      if (await robotImage.count() > 0) {
        await expect(robotImage.first()).toHaveAttribute("alt");
      }
    });

    test("should have visible focus indicators", async ({ page }) => {
      await page.goto("/");

      // Tab to first focusable element
      await page.keyboard.press("Tab");

      // Check something is focused
      const focused = await page.evaluate(
        () => document.activeElement?.tagName
      );
      expect(focused).toBeTruthy();
    });
  });

  test.describe("Performance", () => {
    test("should load landing page in reasonable time", async ({ page }) => {
      const startTime = Date.now();
      await page.goto("/");
      const loadTime = Date.now() - startTime;

      // Should load in less than 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });

    test("should have no console errors on landing", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });

      await page.goto("/");
      await page.waitForTimeout(2000);

      // Filter out known acceptable errors (like missing images in dev)
      const criticalErrors = errors.filter(
        (e) =>
          !e.includes("404") &&
          !e.includes("favicon") &&
          !e.includes("Failed to load resource")
      );

      expect(criticalErrors.length).toBe(0);
    });
  });
});
