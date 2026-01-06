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
  planId: z.string(),
  currency: z.string().default("EUR"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planId, currency } = checkoutSchema.parse(body);

    // Validate currency
    if (!isSupportedCurrency(currency)) {
      return NextResponse.json(
        {
          error: `Unsupported currency. Supported: ${SUPPORTED_CURRENCIES.join(", ")}`,
        },
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

    // Get plan
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.status) {
      return NextResponse.json(
        { error: "Plan not found or not available" },
        { status: 404 }
      );
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
        pdfs: plan.pdfs,
        questions: plan.questions,
        pdfSize: Math.round(plan.pdfSize),
        pdfPages: plan.pdfPages,
        currency,
        expiringAt,
      },
    });

    // Build checkout request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://file.energy";
    const checkoutData = buildCheckoutRequest(
      {
        orderId: `order-${subscription.id}`,
        amount: plan.price,
        currency: currency as SupportedCurrency,
        description: `${plan.name} Subscription Plan`,
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
      return NextResponse.json(
        { error: error.errors[0].message },
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
