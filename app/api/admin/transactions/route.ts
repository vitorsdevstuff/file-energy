import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mergeOrCreateSubscription } from "@/lib/subscription";
import { z } from "zod";

const createTransactionSchema = z.object({
  userId: z.string().min(1, "User is required"),
  planId: z.string().min(1, "Plan is required"),
  amount: z.number().nonnegative("Amount must be ≥ 0"),
  currency: z.string().min(1).default("EUR"),
  paymentMethod: z.string().min(1).default("manual"),
  note: z.string().optional().nullable(),
  cancelExisting: z.boolean().optional().default(false),
  paidAt: z
    .string()
    .datetime({ message: "paidAt must be a valid ISO date" })
    .optional()
    .nullable(),
  // Custom-plan overrides (mirrors Pricing page)
  customOverrides: z
    .object({
      pdfs: z.number().int().positive(),
      questions: z.number().int().min(10),
      pdfSize: z.number().positive(),
      apiAccess: z.boolean().optional().default(false),
    })
    .optional(),
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
      const paidAt = data.paidAt ? new Date(data.paidAt) : new Date();

      // Resolve final plan values once (custom-plan overrides win over plan defaults).
      const finalPdfs = data.customOverrides?.pdfs ?? plan.pdfs;
      const finalQuestions = data.customOverrides?.questions ?? plan.questions;
      const finalPdfSize = data.customOverrides?.pdfSize ?? plan.pdfSize;

      let subscription;

      if (data.cancelExisting) {
        // Explicit replacement: cancel any active sub first, then create
        // a brand-new one with the new plan's resources. Usage counters
        // (pdfs/questions remaining) reset in this branch by design.
        await tx.subscription.updateMany({
          where: { userId: user.id, status: "ACTIVE" },
          data: { status: "CANCELLED", updatedAt: new Date() },
        });

        const expiringAt = new Date(paidAt);
        expiringAt.setFullYear(expiringAt.getFullYear() + 1);
        expiringAt.setDate(expiringAt.getDate() - 1);

        subscription = await tx.subscription.create({
          data: {
            userId: user.id,
            planId: plan.id,
            status: "ACTIVE",
            paymentGateway: data.paymentMethod,
            pdfs: finalPdfs,
            questions: finalQuestions,
            pdfSize: Math.round(finalPdfSize),
            pdfPages: plan.pdfPages,
            currency: data.currency,
            expiringAt,
            createdAt: paidAt,
          },
        });
      } else {
        // Default: merge into the existing ACTIVE subscription so the
        // user keeps their remaining resources and paid time. See
        // lib/subscription.ts for the full semantics.
        subscription = await mergeOrCreateSubscription({
          userId: user.id,
          planId: plan.id,
          pdfs: finalPdfs,
          questions: finalQuestions,
          pdfSize: finalPdfSize,
          pdfPages: plan.pdfPages,
          currency: data.currency,
          paymentGateway: data.paymentMethod,
          paidAt,
          tx,
        });
      }

      const invoice = await tx.invoice.create({
        data: {
          userId: user.id,
          planId: plan.id,
          status: "PAID",
          amount: data.amount,
          currency: data.currency,
          paidAt,
          paymentGateway: data.paymentMethod,
          gatewaySubscriptionId: `manual-${subscription.id}`,
          createdAt: paidAt,
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
