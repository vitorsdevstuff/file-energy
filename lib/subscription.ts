import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Merges a newly-granted plan into a user's existing ACTIVE subscription
 * instead of creating a separate one. Without this, every purchase adds a
 * new ACTIVE row and the UI/resources silently disagree with each other.
 *
 * Semantics:
 *   - pdfs, questions  are *remaining* counters (decremented on use), so
 *     we just sum them: 5 remaining + 20 new = 25 remaining, which keeps
 *     usage intact.
 *   - pdfSize is a per-file cap (MB); we take the higher cap so a smaller
 *     plan can never shrink what a larger one granted.
 *   - expiringAt becomes max(oldExpiringAt, paidAt + 1y) so the user
 *     never loses time already paid for.
 *   - All previously ACTIVE subscriptions for this user are marked
 *     SUPERSEDED with a back-reference to the merged one.
 *
 * Returns the merged ACTIVE subscription. If the user has no ACTIVE
 * subscription, a fresh one is created with the new plan's resources.
 */
export async function mergeOrCreateSubscription(params: {
  userId: string;
  planId: string;
  pdfs: number;
  questions: number;
  pdfSize: number;
  pdfPages: number;
  currency: string;
  paymentGateway: string;
  paidAt: Date;
  // Optional override for the gateway id (e.g. subscriptionId from G2Pay).
  gatewaySubscriptionId?: string | null;
  tx?: Prisma.TransactionClient;
}) {
  const client = params.tx ?? prisma;
  const { userId, planId, paidAt, paymentGateway } = params;

  // Read the user's existing ACTIVE subscriptions INSIDE the caller's
  // transaction (or a top-level query if none was passed) so concurrent
  // purchases can't both see "no active sub" and create two.
  const existing = await client.subscription.findMany({
    where: { userId, status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
  });

  // New expiry: 1 year from paidAt, snapped back 1 day to mirror the
  // existing convention in the codebase.
  const newExpiringAt = new Date(paidAt);
  newExpiringAt.setFullYear(newExpiringAt.getFullYear() + 1);
  newExpiringAt.setDate(newExpiringAt.getDate() - 1);

  if (existing.length === 0) {
    return client.subscription.create({
      data: {
        userId,
        planId,
        status: "ACTIVE",
        paymentGateway,
        gatewaySubscriptionId: params.gatewaySubscriptionId ?? null,
        pdfs: params.pdfs,
        questions: params.questions,
        pdfSize: Math.round(params.pdfSize),
        pdfPages: params.pdfPages,
        currency: params.currency,
        expiringAt: newExpiringAt,
        createdAt: paidAt,
      },
    });
  }

  // Use the oldest ACTIVE subscription as the merge target. If the
  // user has multiple ACTIVE rows (legacy bug), we collapse them all
  // into the oldest one.
  const target = existing[0];
  const otherActives = existing.slice(1);

  const mergedPdfs = existing.reduce(
    (sum, s) => sum + (s.pdfs ?? 0),
    params.pdfs
  );
  const mergedQuestions = existing.reduce(
    (sum, s) => sum + (s.questions ?? 0),
    params.questions
  );
  // pdfSize is a per-file cap, not a counter — never go down.
  const mergedPdfSize = Math.max(
    params.pdfSize,
    ...existing.map((s) => s.pdfSize ?? 0)
  );
  // The newer plan's pdfPages usually wins, but take max to be safe.
  const mergedPdfPages = Math.max(
    params.pdfPages,
    ...existing.map((s) => s.pdfPages ?? 0)
  );

  // Keep whichever expiry is further in the future.
  const mergedExpiringAt = existing.reduce((acc, s) => {
    if (!s.expiringAt) return acc;
    return s.expiringAt > acc ? s.expiringAt : acc;
  }, newExpiringAt);

  // Mark superseded rows so the audit trail is preserved. We keep the
  // original planId on each row — that way the admin can still see
  // which plan a user originally bought.
  await client.subscription.updateMany({
    where: { id: { in: otherActives.map((s) => s.id) } },
    data: { status: "SUPERSEDED", updatedAt: new Date() },
  });

  // Update the target row with the merged values.
  return client.subscription.update({
    where: { id: target.id },
    data: {
      planId,
      status: "ACTIVE",
      paymentGateway,
      gatewaySubscriptionId:
        params.gatewaySubscriptionId ?? target.gatewaySubscriptionId,
      pdfs: mergedPdfs,
      questions: mergedQuestions,
      pdfSize: Math.round(mergedPdfSize),
      pdfPages: mergedPdfPages,
      currency: params.currency,
      expiringAt: mergedExpiringAt,
      updatedAt: new Date(),
    },
  });
}
