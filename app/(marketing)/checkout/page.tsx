"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { pricingData } from "@/lib/data";
import { SUPPORTED_CURRENCIES, type SupportedCurrency } from "@/lib/g2pay";

// Currency symbols
const currencyInfo: Record<SupportedCurrency, { symbol: string }> = {
  EUR: { symbol: "€" },
  USD: { symbol: "$" },
  AUD: { symbol: "A$" },
  CAD: { symbol: "C$" },
  JPY: { symbol: "¥" },
  SEK: { symbol: "kr" },
  PLN: { symbol: "zł" },
  BGN: { symbol: "лв" },
  DKK: { symbol: "kr" },
  CZK: { symbol: "Kč" },
  HUF: { symbol: "Ft" },
  NZD: { symbol: "NZ$" },
  NOK: { symbol: "kr" },
  GBP: { symbol: "£" },
  AED: { symbol: "د.إ" },
  JOD: { symbol: "د.ا" },
  KWD: { symbol: "د.ك" },
  BHD: { symbol: ".د.ب" },
  SAR: { symbol: "﷼" },
  QAR: { symbol: "﷼" },
  OMR: { symbol: "﷼" },
};

function CheckoutLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading checkout...</p>
      </div>
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();

  // Standard plan params
  const planId = searchParams.get("plan");
  const currencyParam = searchParams.get("currency") as SupportedCurrency | null;

  // Custom plan params
  const isCustom = searchParams.get("custom") === "true";
  const customPrice = searchParams.get("price");
  const customPDFs = searchParams.get("pdfs");
  const customQuestions = searchParams.get("questions");
  const customSize = searchParams.get("size");
  const customApi = searchParams.get("api") === "true";

  // Team plan params
  const teamPlan = searchParams.get("team");
  const teamUsers = searchParams.get("users");
  const teamDocuments = searchParams.get("documents");
  const teamQuestions = searchParams.get("questions");

  const [currency] = useState<SupportedCurrency>(
    currencyParam && SUPPORTED_CURRENCIES.includes(currencyParam) ? currencyParam : "EUR"
  );
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [digitalServiceAccepted, setDigitalServiceAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine plan type and details
  let planTitle = "";
  let planFeatures: string[] = [];
  let totalPrice = "";

  if (isCustom && customPrice) {
    // Custom plan
    planTitle = "Custom Plan";
    planFeatures = [
      `${customPDFs} Documents`,
      `Max document size: ${customSize}MB/pdf`,
      `${customQuestions} document questions`,
    ];
    if (customApi) {
      planFeatures.push("API Access included");
    }
    totalPrice = `${currencyInfo[currency].symbol}${customPrice}`;
  } else if (teamPlan) {
    // Team plan
    planTitle = `${teamPlan} Team Plan`;
    planFeatures = [
      `${teamUsers} Users`,
      `${teamDocuments} Documents`,
      `${teamQuestions} document questions`,
    ];
    // Team price should be passed in URL
    const teamPrice = searchParams.get("price");
    totalPrice = teamPrice ? `${currencyInfo[currency].symbol}${teamPrice}` : "";
  } else if (planId) {
    // Standard preset plan
    const selectedPlan = pricingData.find((p) => p.id.toString() === planId);
    if (selectedPlan) {
      planTitle = `${selectedPlan.title} Plan`;
      planFeatures = selectedPlan.priceList.map((f) => f.name);
      const priceObj = selectedPlan.priceMonthly as Record<string, string>;
      const price = priceObj[currency] || priceObj["EUR"];
      totalPrice = `${currencyInfo[currency].symbol}${price}`;
    }
  }

  const hasValidPlan = planTitle && totalPrice;
  const canPay = termsAccepted && digitalServiceAccepted && hasValidPlan;

  const handlePayment = async () => {
    if (!canPay) return;

    setIsLoading(true);
    setError(null);

    try {
      const body: Record<string, unknown> = { currency };

      if (isCustom) {
        body.type = "custom";
        body.price = customPrice;
        body.pdfs = customPDFs;
        body.questions = customQuestions;
        body.size = customSize;
        body.api = customApi;
      } else if (teamPlan) {
        body.type = "team";
        body.plan = teamPlan;
        body.users = teamUsers;
        body.documents = teamDocuments;
        body.questions = teamQuestions;
      } else {
        body.type = "standard";
        body.planId = planId;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  if (!hasValidPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            No plan selected
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Please select a plan from our pricing page.
          </p>
          <Link href="/pricing">
            <Button>View Pricing</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Back Link */}
        <Link
          href="/pricing"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to pricing
        </Link>

        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review your order and complete payment
          </p>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div
          className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Order Summary
          </h2>

          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {planTitle}
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {planFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalPrice}
              </p>
            </div>
          </div>

          {/* Final Price Confirmation */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              The total price shown is the final amount you will be charged.
              <br />
              No additional fees or taxes will be added after payment.
            </p>
          </div>
        </motion.div>

        {/* Information Block */}
        <motion.div
          className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <p>
              This is a one-time payment. No subscriptions or recurring charges apply.
            </p>
            <p>
              File.energy provides digital services only. Access is provided immediately after successful payment.
            </p>
            <p>
              You have a 14-day right of withdrawal under UK/EU consumer law.
              <br />
              If you request immediate access and begin using the service, a proportional deduction may apply.
            </p>
          </div>
        </motion.div>

        {/* Consent Checkboxes */}
        <motion.div
          className="mb-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Checkbox 1: Terms & Privacy */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I agree with the{" "}
              <Link href="/terms" className="text-primary hover:underline" target="_blank">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                Privacy Notice
              </Link>
            </span>
          </label>

          {/* Checkbox 2: Digital Service Acknowledgment */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600">
            <input
              type="checkbox"
              checked={digitalServiceAccepted}
              onChange={(e) => setDigitalServiceAccepted(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I acknowledge that this purchase is for a digital service and I expressly request immediate access.
              I understand that once the service is accessed, my right of withdrawal may be limited or lost.
            </span>
          </label>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Pay Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handlePayment}
            disabled={!canPay || isLoading}
            className="w-full py-6 text-lg"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>Pay {totalPrice}</>
            )}
          </Button>
        </motion.div>

        {/* Payment Processing Info */}
        <motion.div
          className="mt-8 space-y-4 text-center text-xs text-gray-500 dark:text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>
            Payments are processed by the applicable legal entity based on your billing country.
            <br />
            This name will appear on your bank or card statement.
          </p>
          <p>
            All payments are processed by PCI DSS-compliant payment service providers.
            <br />
            File.energy does not store or process card details.
          </p>

          {/* Payment Method Icons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Shield className="h-5 w-5 text-gray-400" />
            <Image
              src="/images/master-card.png"
              alt="Mastercard"
              width={40}
              height={26}
              className="h-6 w-auto opacity-60"
            />
            <Image
              src="/images/visa.png"
              alt="Visa"
              width={40}
              height={26}
              className="h-6 w-auto opacity-60"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
