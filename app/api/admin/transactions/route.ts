import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTransactionSchema = z.object({
  userId: z.string().min(1, "User is required"),
  planId: z.string().min(1, "Plan is required"),
  amount: z.number().nonnegative("Amount must be ≥ 0"),
  currency: z.string().min(1).default("EUR"),
  paymentMethod: z.string().min(1).default("manual"),
  note: z.string().optional().nullable(),
  cancelExisting: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = createTransactionSchema.parse(body);

    const [user, plan] = await Promise.all([
      prisma.user.findUnique({ where: { id: data.userId } }),
      prisma.plan.findUnique({ where: { id: data.planId } }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      if (data.cancelExisting) {
        await tx.subscription.updateMany({
          where: { userId: user.id, status: "ACTIVE" },
          data: { status: "CANCELLED", updatedAt: new Date() },
        });
      }

      const expiringAt = new Date();
      expiringAt.setFullYear(expiringAt.getFullYear() + 1);
      expiringAt.setDate(expiringAt.getDate() - 1);

      const subscription = await tx.subscription.create({
        data: {
          userId: user.id,
          planId: plan.id,
          status: "ACTIVE",
          paymentGateway: data.paymentMethod,
          pdfs: plan.pdfs,
          questions: plan.questions,
          pdfSize: Math.round(plan.pdfSize),
          pdfPages: plan.pdfPages,
          currency: data.currency,
          expiringAt,
        },
      });

      const invoice = await tx.invoice.create({
        data: {
          userId: user.id,
          planId: plan.id,
          status: "PAID",
          amount: data.amount,
          currency: data.currency,
          paidAt: new Date(),
          paymentGateway: data.paymentMethod,
          gatewaySubscriptionId: `manual-${subscription.id}`,
        },
      });

      return { subscription, invoice };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues;
      return NextResponse.json(
        { error: issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Error creating manual transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
