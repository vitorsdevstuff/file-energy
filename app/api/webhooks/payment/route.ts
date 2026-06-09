import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mergeOrCreateSubscription } from "@/lib/subscription";

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

    const transactionId = null;
    // Handle different webhook events from G2Pay
    const { referenceId, state } = body;


    const upState = (state ?? "")
    .toString()
    .trim()
    .toUpperCase();

    if (!referenceId) {
      return NextResponse.json({ error: "Missing reference ID" }, { status: 400 });
    }

    // Extract subscription ID from reference
    const subscriptionId = referenceId.replace("order-", "");

    if (upState === "APPROVED" || upState === "SUCCESS" || upState === "COMPLETED") {
      // Read the PENDING subscription that checkout created. We need its
      // plan + currency + the new plan's resources (pdfs/questions/...) so
      // we can merge them with whatever the user already has.
      const pending = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { plan: true },
      });

      if (!pending) {
        console.error("Webhook: subscription not found:", subscriptionId);
        return NextResponse.json(
          { error: "Subscription not found" },
          { status: 404 }
        );
      }

      // Mark the PENDING row as CANCELLED so it doesn't linger — the
      // mergeOrCreateSubscription helper will create a fresh merged row
      // (or update the user's existing ACTIVE one) inside a transaction.
      await prisma.subscription.update({
        where: { id: pending.id },
        data: { status: "CANCELLED", updatedAt: new Date() },
      });

      const paidAt = new Date();

      const subscription = await mergeOrCreateSubscription({
        userId: pending.userId,
        planId: pending.planId,
        pdfs: pending.pdfs,
        questions: pending.questions,
        pdfSize: pending.pdfSize,
        pdfPages: pending.pdfPages,
        currency: pending.currency,
        paymentGateway: "g2pay",
        paidAt,
        gatewaySubscriptionId: transactionId,
      });

      // Create invoice
      await prisma.invoice.create({
        data: {
          userId: subscription.userId,
          planId: subscription.planId,
          status: "PAID",
          amount: pending.plan.price,
          currency: subscription.currency,
          paidAt,
          paymentGateway: "g2pay",
          gatewaySubscriptionId: transactionId,
        },
      });
    } else if (upState === "DECLINED" || upState === "FAILED") {
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
