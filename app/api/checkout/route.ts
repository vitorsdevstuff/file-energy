import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createCheckoutSession,
  buildCheckoutRequest,
  isSupportedCurrency,
  SUPPORTED_CURRENCIES,
  type SupportedCurrency,
} from "@/lib/g2pay";
import { z } from "zod";

const checkoutSchema = z.object({
  type: z.enum(["standard", "custom", "team"]).optional().default("standard"),
  currency: z.string().default("EUR"),
  // Standard plan
  planId: z.string().optional(),
  // Custom plan
  price: z.string().optional(),
  pdfs: z.string().optional(),
  questions: z.string().optional(),
  size: z.string().optional(),
  api: z.boolean().optional(),
  // Team plan
  plan: z.string().optional(),
  users: z.string().optional(),
  documents: z.string().optional(),
});

// Preset plan data (matches lib/data.ts)
const presetPlans: Record<string, {
  name: string;
  pdfs: number;
  questions: number;
  pdfSize: number;
  pdfPages: number;
  prices: Record<string, number>
}> = {
  "1": { name: "Test", pdfs: 5, questions: 50, pdfSize: 10, pdfPages: 50, prices: { EUR: 2.75, USD: 2.99, GBP: 2.36, AUD: 4.59, NZD: 5.09, CHF: 2.64, PLN: 12.20, CZK: 72.45, HUF: 1188, AED: 10.98 } },
  "2": { name: "Basic", pdfs: 10, questions: 150, pdfSize: 15, pdfPages: 100, prices: { EUR: 7.99, USD: 8.70, GBP: 6.86, AUD: 13.33, NZD: 14.81, CHF: 7.67, PLN: 35.50, CZK: 210.80, HUF: 3459, AED: 31.96 } },
  "3": { name: "Intermediate", pdfs: 20, questions: 250, pdfSize: 20, pdfPages: 150, prices: { EUR: 19.99, USD: 21.77, GBP: 17.15, AUD: 33.34, NZD: 37.03, CHF: 19.19, PLN: 88.76, CZK: 526.99, HUF: 8646, AED: 79.90 } },
  "4": { name: "Advanced", pdfs: 40, questions: 400, pdfSize: 35, pdfPages: 200, prices: { EUR: 34.99, USD: 38.11, GBP: 30.01, AUD: 58.36, NZD: 64.80, CHF: 33.59, PLN: 155.33, CZK: 922.23, HUF: 15131, AED: 139.82 } },
  "5": { name: "Professional", pdfs: 70, questions: 700, pdfSize: 50, pdfPages: 300, prices: { EUR: 59.99, USD: 65.35, GBP: 51.45, AUD: 100.12, NZD: 111.19, CHF: 57.59, PLN: 266.43, CZK: 1582.42, HUF: 25962, AED: 239.94 } },
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = checkoutSchema.parse(body);
    const { type, currency } = parsed;

    // Validate currency
    if (!isSupportedCurrency(currency)) {
      return NextResponse.json(
        { error: `Unsupported currency. Supported: ${SUPPORTED_CURRENCIES.join(", ")}` },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Email must be verified before any payment can be created.
    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        {
          error:
            "Please verify your email address before making a purchase.",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 }
      );
    }

    // Phone must be verified before any payment can be created.
    // if (!user.phoneVerifiedAt) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         "Please verify your phone number before making a purchase.",
    //       code: "PHONE_NOT_VERIFIED",
    //     },
    //     { status: 403 }
    //   );
    // }

    let planName: string;
    let price: number;
    let pdfs: number;
    let questions: number;
    let pdfSize: number;
    let pdfPages: number;

    if (type === "custom") {
      // Custom plan
      planName = "Custom Plan";
      price = parseFloat(parsed.price || "0");
      pdfs = parseInt(parsed.pdfs || "0", 10);
      questions = parseInt(parsed.questions || "0", 10);
      pdfSize = parseFloat(parsed.size || "10");
      pdfPages = 100; // Default pages for custom
    } else if (type === "team") {
      // Team plan
      const basePlanName = parsed.plan || "Basic";
      const users = parseInt(parsed.users || "1", 10);
      planName = `${basePlanName} Team (${users} users)`;
      price = parseFloat(parsed.price || "0");
      pdfs = parseInt(parsed.documents || "10", 10);
      questions = parseInt(parsed.questions || "150", 10);

      // Find base plan to get pdfSize and pdfPages
      const basePlan = Object.values(presetPlans).find(p => p.name === basePlanName);
      pdfSize = basePlan?.pdfSize || 15;
      pdfPages = basePlan?.pdfPages || 100;
    } else {
      // Standard preset plan
      const planId = parsed.planId;
      if (!planId || !presetPlans[planId]) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }

      const preset = presetPlans[planId];
      planName = preset.name;
      price = preset.prices[currency] || preset.prices["EUR"];
      pdfs = preset.pdfs;
      questions = preset.questions;
      pdfSize = preset.pdfSize;
      pdfPages = preset.pdfPages;
    }

    // Create or find a plan in the database
    let plan = await prisma.plan.findFirst({
      where: {
        name: planName,
        price: price,
      },
    });

    if (!plan) {
      plan = await prisma.plan.create({
        data: {
          name: planName,
          description: `${planName} - one-time purchase`,
          price: price,
          status: true,
          billingCycle: "one-time",
          pdfs: pdfs,
          questions: questions,
          pdfSize: pdfSize,
          pdfPages: pdfPages,
        },
      });
    }

    // Calculate expiry date (1 year from now)
    const expiringAt = new Date();
    expiringAt.setFullYear(expiringAt.getFullYear() + 1);
    expiringAt.setDate(expiringAt.getDate() - 1);

    // Create subscription (pending)
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: "PENDING",
        paymentGateway: "g2pay",
        pdfs: pdfs,
        questions: questions,
        pdfSize: Math.round(pdfSize),
        pdfPages: pdfPages,
        currency: currency,
        expiringAt,
      },
    });

    // Build checkout request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://file.energy";
    const checkoutData = buildCheckoutRequest(
      {
        orderId: `order-${subscription.id}`,
        amount: price,
        currency: currency as SupportedCurrency,
        description: `${planName} - File.energy`,
        subscriptionId: subscription.id,
        isFile: true,
      },
      baseUrl
    );

    // Create checkout session with G2Pay
    const checkoutResult = await createCheckoutSession(checkoutData);

    return NextResponse.json({
      success: true,
      url: checkoutResult.result.redirectUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues;
      return NextResponse.json(
        { error: `Invalid input: ${issues[0]?.message || "Validation error"}` },
        { status: 400 }
      );
    }

    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
