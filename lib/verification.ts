import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_TTL_HOURS = 24;

/**
 * Creates a fresh email-verification token for an identifier (user email),
 * replacing any existing tokens for that identifier.
 */
export async function createVerificationToken(
  identifier: string
): Promise<{ token: string; expires: Date }> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  // Invalidate any pre-existing tokens for this identifier.
  await prisma.verificationToken.deleteMany({ where: { identifier } });

  await prisma.verificationToken.create({
    data: { identifier, token, expires },
  });

  return { token, expires };
}

export type ConsumeResult =
  | { status: "ok"; identifier: string }
  | { status: "invalid" }
  | { status: "expired" };

/**
 * Looks up a verification token, deletes it, and returns the associated
 * identifier. Tokens are single-use; the row is removed regardless of outcome.
 */
export async function consumeVerificationToken(
  token: string
): Promise<ConsumeResult> {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) return { status: "invalid" };

  // Single-use: always delete after lookup.
  await prisma.verificationToken.delete({ where: { token } });

  if (record.expires.getTime() < Date.now()) {
    return { status: "expired" };
  }

  return { status: "ok", identifier: record.identifier };
}
