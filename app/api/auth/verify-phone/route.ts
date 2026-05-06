import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPhoneVerification, isPreludeConfigured } from "@/lib/prelude";
import { notifyPhoneVerificationStarted } from "@/lib/telegram";

const PHONE_E164 = /^\+[1-9]\d{1,14}$/;

const sendSchema = z.object({
  phone: z.string().regex(PHONE_E164, "Phone must be in E.164 format (e.g. +1234567890)"),
});

const CODE_COOLDOWN_MS = 30_000;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof sendSchema>;
  try {
    body = sendSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { phone } = body;

  // Check if this phone is already taken by another user
  const existingUser = await prisma.user.findFirst({
    where: { phone, NOT: { id: session.user.id } },
    select: { id: true },
  });
  if (existingUser) {
    return NextResponse.json(
      { error: "This phone number is already associated with another account." },
      { status: 409 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { phone: true, phoneVerifiedAt: true, phoneVerificationSentAt: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.phone === phone && user.phoneVerifiedAt) {
    return NextResponse.json({ error: "Phone number is already verified." }, { status: 400 });
  }

  // Rate limit: prevent spamming SMS
  if (
    user.phoneVerificationSentAt &&
    Date.now() - user.phoneVerificationSentAt.getTime() < CODE_COOLDOWN_MS
  ) {
    const waitSeconds = Math.ceil(
      (CODE_COOLDOWN_MS - (Date.now() - user.phoneVerificationSentAt.getTime())) / 1000
    );
    return NextResponse.json(
      { error: `Please wait ${waitSeconds}s before requesting another code.`, code: "COOLDOWN" },
      { status: 429 }
    );
  }

  // Update user phone and reset verification state
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      phone,
      phoneVerifiedAt: null,
      phoneVerificationSentAt: null,
    },
  });

  // Create a job record for tracking the Prelude API call
  const job = await prisma.job.create({
    data: {
      type: "send_phone_verification",
      status: "PENDING",
      payload: JSON.stringify({ userId: session.user.id, phone }),
    },
  });

  // Process the job: call Prelude API
  await prisma.job.update({
    where: { id: job.id },
    data: { status: "PROCESSING" },
  });

  if (!isPreludeConfigured()) {
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        error: "PRELUDE_API_KEY not configured",
      },
    });
    return NextResponse.json(
      { error: "SMS service is not configured. Please contact support." },
      { status: 503 }
    );
  }

  const result = await sendPhoneVerification({
    phone,
    correlationId: session.user.id,
  });

  if (!result.ok) {
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        error: result.error || "Unknown error",
      },
    });
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 502 }
    );
  }

  // Success: update job and user
  await prisma.job.update({
    where: { id: job.id },
    data: {
      status: "COMPLETED",
      result: JSON.stringify(result.data || {}),
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { phoneVerificationSentAt: new Date() },
  });

  // Fire-and-forget Telegram notification
  notifyPhoneVerificationStarted({ email: session.user.email!, phone }).catch(
    (err) => console.error("[verify-phone] Telegram notification failed:", err)
  );

  return NextResponse.json({ success: true, cooldown: CODE_COOLDOWN_MS });
}