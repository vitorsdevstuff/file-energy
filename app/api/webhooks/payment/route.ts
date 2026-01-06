import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subscriptionId = searchParams.get("subscriptionId");
    const currency = searchParams.get("currency") || "EUR";

    if (!subscriptionId) {
      return NextResponse.redirect(
        new URL("/account/settings/subscription?error=missing_subscription", req.url)
      );
    }

    // Update subscription status
    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: "ACTIVE",
        updatedAt: new Date(),
      },
      include: { plan: true, user: true },
    });

    // Create invoice
    await prisma.invoice.create({
      data: {
        userId: subscription.userId,
        planId: subscription.planId,
        status: "PAID",
        amount: subscription.plan.price,
        currency,
        paidAt: new Date(),
        paymentGateway: "g2pay",
      },
    });

    // Redirect to success page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://file.energy";
    return NextResponse.redirect(
      `${baseUrl}/account/settings/subscription?success=true`
    );
  } catch (error) {
    console.error("Payment webhook error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://file.energy";
    return NextResponse.redirect(
      `${baseUrl}/account/settings/subscription?error=payment_failed`
    );
  }
}

// Webhook for G2Pay notifications
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Payment webhook received:", body);

    // Handle different webhook events from G2Pay
    const { referenceId, status, transactionId } = body;

    if (!referenceId) {
      return NextResponse.json({ error: "Missing reference ID" }, { status: 400 });
    }

    // Extract subscription ID from reference
    const subscriptionId = referenceId.replace("order-", "");

    if (status === "APPROVED" || status === "SUCCESS") {
      const subscription = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: "ACTIVE",
          gatewaySubscriptionId: transactionId,
          updatedAt: new Date(),
        },
        include: { plan: true },
      });

      // Create invoice
      await prisma.invoice.create({
        data: {
          userId: subscription.userId,
          planId: subscription.planId,
          status: "PAID",
          amount: subscription.plan.price,
          currency: subscription.currency,
          paidAt: new Date(),
          paymentGateway: "g2pay",
          gatewaySubscriptionId: transactionId,
        },
      });
    } else if (status === "DECLINED" || status === "FAILED") {
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: "CANCELLED",
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
