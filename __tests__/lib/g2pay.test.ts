import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  SUPPORTED_CURRENCIES,
  isSupportedCurrency,
  generatePaymentHash,
  buildCheckoutRequest,
  createCheckoutSession,
  type CheckoutRequestData,
  type SupportedCurrency,
} from "@/lib/g2pay";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock crypto-js
vi.mock("crypto-js", () => ({
  default: {
    MD5: (str: string) => ({
      toString: () => `md5_${str.substring(0, 10)}`,
    }),
    SHA1: (str: string) => ({
      toString: () => `sha1_${str.substring(0, 10)}`,
    }),
  },
}));

describe("SUPPORTED_CURRENCIES", () => {
  it("should include major currencies", () => {
    expect(SUPPORTED_CURRENCIES).toContain("EUR");
    expect(SUPPORTED_CURRENCIES).toContain("USD");
    expect(SUPPORTED_CURRENCIES).toContain("GBP");
    expect(SUPPORTED_CURRENCIES).toContain("AUD");
    expect(SUPPORTED_CURRENCIES).toContain("CAD");
  });

  it("should include Middle Eastern currencies", () => {
    expect(SUPPORTED_CURRENCIES).toContain("AED");
    expect(SUPPORTED_CURRENCIES).toContain("SAR");
    expect(SUPPORTED_CURRENCIES).toContain("QAR");
    expect(SUPPORTED_CURRENCIES).toContain("KWD");
  });

  it("should include European currencies", () => {
    expect(SUPPORTED_CURRENCIES).toContain("SEK");
    expect(SUPPORTED_CURRENCIES).toContain("PLN");
    expect(SUPPORTED_CURRENCIES).toContain("DKK");
    expect(SUPPORTED_CURRENCIES).toContain("CZK");
    expect(SUPPORTED_CURRENCIES).toContain("HUF");
    expect(SUPPORTED_CURRENCIES).toContain("NOK");
  });

  it("should have 21 supported currencies", () => {
    expect(SUPPORTED_CURRENCIES).toHaveLength(21);
  });
});

describe("isSupportedCurrency", () => {
  it("should return true for supported currencies", () => {
    expect(isSupportedCurrency("EUR")).toBe(true);
    expect(isSupportedCurrency("USD")).toBe(true);
    expect(isSupportedCurrency("GBP")).toBe(true);
  });

  it("should return false for unsupported currencies", () => {
    expect(isSupportedCurrency("XYZ")).toBe(false);
    expect(isSupportedCurrency("BTC")).toBe(false);
    expect(isSupportedCurrency("ETH")).toBe(false);
  });

  it("should be case-sensitive", () => {
    expect(isSupportedCurrency("eur")).toBe(false);
    expect(isSupportedCurrency("Usd")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isSupportedCurrency("")).toBe(false);
  });
});

describe("generatePaymentHash", () => {
  it("should generate a hash string", () => {
    const hash = generatePaymentHash("ORDER123", "99.99", "EUR", "Test payment");
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("should be deterministic", () => {
    const hash1 = generatePaymentHash("ORDER123", "99.99", "EUR", "Test");
    const hash2 = generatePaymentHash("ORDER123", "99.99", "EUR", "Test");
    expect(hash1).toBe(hash2);
  });

  it("should change with different order numbers", () => {
    const hash1 = generatePaymentHash("ORDER123", "99.99", "EUR", "Test");
    const hash2 = generatePaymentHash("ORDER456", "99.99", "EUR", "Test");
    expect(hash1).not.toBe(hash2);
  });

  it("should change with different amounts", () => {
    const hash1 = generatePaymentHash("ORDER123", "99.99", "EUR", "Test");
    const hash2 = generatePaymentHash("ORDER123", "50.00", "EUR", "Test");
    expect(hash1).not.toBe(hash2);
  });

  it("should change with different currencies", () => {
    const hash1 = generatePaymentHash("ORDER123", "99.99", "EUR", "Test");
    const hash2 = generatePaymentHash("ORDER123", "99.99", "USD", "Test");
    expect(hash1).not.toBe(hash2);
  });
});

describe("buildCheckoutRequest", () => {
  const baseParams = {
    orderId: "order_123",
    amount: 19.99,
    currency: "EUR" as SupportedCurrency,
    description: "Monthly subscription",
    subscriptionId: "sub_456",
  };
  const baseUrl = "https://file.energy";

  it("should build a valid checkout request", () => {
    const result = buildCheckoutRequest(baseParams, baseUrl);

    expect(result).toEqual({
      referenceId: "order_123",
      paymentType: "DEPOSIT",
      currency: "EUR",
      amount: "19.99",
      returnUrl: "https://file.energy/account/settings/subscription",
      successReturnUrl:
        "https://file.energy/api/webhooks/payment?subscriptionId=sub_456&isFile=false&currency=EUR",
      declineReturnUrl: "https://file.energy/account/settings/subscription",
      webhookUrl: "https://file.energy/api/webhooks/payment",
    });
  });

  it("should format amount with two decimal places", () => {
    const params = { ...baseParams, amount: 100 };
    const result = buildCheckoutRequest(params, baseUrl);
    expect(result.amount).toBe("100.00");
  });

  it("should handle isFile flag", () => {
    const params = { ...baseParams, isFile: true };
    const result = buildCheckoutRequest(params, baseUrl);
    expect(result.successReturnUrl).toContain("isFile=true");
  });

  it("should default isFile to false", () => {
    const result = buildCheckoutRequest(baseParams, baseUrl);
    expect(result.successReturnUrl).toContain("isFile=false");
  });

  it("should handle different currencies", () => {
    const params = { ...baseParams, currency: "USD" as SupportedCurrency };
    const result = buildCheckoutRequest(params, baseUrl);
    expect(result.currency).toBe("USD");
    expect(result.successReturnUrl).toContain("currency=USD");
  });

  it("should handle decimal amounts correctly", () => {
    const params = { ...baseParams, amount: 7.5 };
    const result = buildCheckoutRequest(params, baseUrl);
    expect(result.amount).toBe("7.50");
  });

  it("should handle large amounts", () => {
    const params = { ...baseParams, amount: 9999.99 };
    const result = buildCheckoutRequest(params, baseUrl);
    expect(result.amount).toBe("9999.99");
  });
});

describe("createCheckoutSession", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const validRequestData: CheckoutRequestData = {
    referenceId: "order_123",
    paymentType: "DEPOSIT",
    currency: "EUR",
    amount: "19.99",
    returnUrl: "https://file.energy/return",
    successReturnUrl: "https://file.energy/success",
    declineReturnUrl: "https://file.energy/decline",
    webhookUrl: "https://file.energy/webhook",
  };

  it("should make POST request to G2Pay API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          result: {
            redirectUrl: "https://checkout.g2pay.io/pay/123",
            transactionId: "tx_123",
          },
        }),
    });

    await createCheckoutSession(validRequestData);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/payments"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: expect.stringContaining("Bearer"),
        }),
        body: JSON.stringify(validRequestData),
      })
    );
  });

  it("should return checkout response on success", async () => {
    const mockResponse = {
      result: {
        redirectUrl: "https://checkout.g2pay.io/pay/123",
        transactionId: "tx_123",
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await createCheckoutSession(validRequestData);
    expect(result).toEqual(mockResponse);
  });

  it("should throw error on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({
          error_message: "Invalid currency",
        }),
    });

    await expect(createCheckoutSession(validRequestData)).rejects.toThrow(
      "Invalid currency"
    );
  });

  it("should throw generic error when no error message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    await expect(createCheckoutSession(validRequestData)).rejects.toThrow(
      "Failed to create checkout session"
    );
  });

  it("should handle network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(createCheckoutSession(validRequestData)).rejects.toThrow(
      "Network error"
    );
  });
});
