import CryptoJS from "crypto-js";

const CHECKOUT_URL = process.env.G2PAY_CHECKOUT_URL || "https://engine.g2pay.io";
const MERCHANT_KEY = process.env.G2PAY_MERCHANT_KEY || "";
const PASSWORD = process.env.G2PAY_PASSWORD || "";
const BEARER_TOKEN = process.env.G2PAY_BEARER_TOKEN || "";

export const SUPPORTED_CURRENCIES = [
  "EUR",
  "USD",
  "AUD",
  "CAD",
  "JPY",
  "SEK",
  "PLN",
  "BGN",
  "DKK",
  "CZK",
  "HUF",
  "NZD",
  "NOK",
  "GBP",
  "AED",
  "JOD",
  "KWD",
  "BHD",
  "SAR",
  "QAR",
  "OMR",
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export function isSupportedCurrency(
  currency: string
): currency is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency);
}

export function generatePaymentHash(
  orderNumber: string,
  amount: string,
  currency: string,
  description: string
): string {
  const toMd5 = `${orderNumber}${amount}${currency}${description}${PASSWORD}`;
  const md5Hash = CryptoJS.MD5(toMd5.toUpperCase()).toString();
  return CryptoJS.SHA1(md5Hash).toString();
}

export interface CheckoutRequestData {
  referenceId: string;
  paymentType: "DEPOSIT";
  currency: SupportedCurrency;
  amount: string;
  returnUrl: string;
  successReturnUrl: string;
  declineReturnUrl: string;
  webhookUrl: string;
}

export interface CheckoutResponse {
  result: {
    redirectUrl: string;
    transactionId?: string;
  };
  error_message?: string;
}

export async function createCheckoutSession(
  data: CheckoutRequestData
): Promise<CheckoutResponse> {
  const response = await fetch(`${CHECKOUT_URL}/api/v1/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error_message || "Failed to create checkout session");
  }

  return result;
}

export interface CreatePaymentParams {
  orderId: string;
  amount: number;
  currency: SupportedCurrency;
  description: string;
  subscriptionId: string;
  isFile?: boolean;
}

export function buildCheckoutRequest(
  params: CreatePaymentParams,
  baseUrl: string
): CheckoutRequestData {
  const { orderId, amount, currency, subscriptionId, isFile = false } = params;

  return {
    referenceId: orderId,
    paymentType: "DEPOSIT",
    currency,
    amount: amount.toFixed(2),
    returnUrl: `${baseUrl}/account/settings/subscription`,
    successReturnUrl: `${baseUrl}/api/webhooks/payment?subscriptionId=${subscriptionId}&isFile=${isFile}&currency=${currency}`,
    declineReturnUrl: `${baseUrl}/account/settings/subscription`,
    webhookUrl: `${baseUrl}/api/webhooks/payment`,
  };
}
