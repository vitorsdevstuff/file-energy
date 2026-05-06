import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkPhoneVerification, isPreludeConfigured } from "@/lib/prelude";
import { notifyPhoneVerified } from "@/lib/telegram";

const CODE_EXPIRY_MS = 60_000; // 1 minute

const confirmSchema = z.object({
  code: z.string().length(4, "Code must be 4 digits").regex(/^\d+$/, "Code must be numeric"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof confirmSchema>;
  try {
    body = confirmSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { code } = body;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { phone: true, phoneVerifiedAt: true, phoneVerificationSentAt: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.phone) {
    return NextResponse.json(
      { error: "No phone number set. Please add a phone number first." },
      { status: 400 }
    );
  }

  if (user.phoneVerifiedAt) {
    return NextResponse.json(
      { error: "Phone number is already verified." },
      { status: 400 }
    );
  }

  // Check 1-minute expiration
  if (!user.phoneVerificationSentAt) {
    return NextResponse.json(
      { error: "No verification code was sent. Please request a new one.", code: "NO_CODE_SENT" },
      { status: 400 }
    );
  }

  const elapsed = Date.now() - user.phoneVerificationSentAt.getTime();
  if (elapsed > CODE_EXPIRY_MS) {
    return NextResponse.json(
      { error: "Verification code has expired. Please request a new one.", code: "CODE_EXPIRED" },
      { status: 400 }
    );
  }

  // Verify the code with Prelude
  if (!isPreludeConfigured()) {
    return NextResponse.json(
      { error: "SMS service is not configured. Please contact support." },
      { status: 503 }
    );
  }

  // Create a job record for tracking
  const job = await prisma.job.create({
    data: {
      type: "check_phone_verification",
      status: "PROCESSING",
      payload: JSON.stringify({ userId: session.user.id, phone: user.phone }),
    },
  });

  const result = await checkPhoneVerification({
    phone: user.phone,
    code,
  });

  if (!result.ok) {
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        error: result.error || "Verification check failed",
      },
    });
    return NextResponse.json(
      { error: "Failed to verify code. Please try again." },
      { status: 502 }
    );
  }

  const checkData = result.data || {};
  const checkStatus = checkData.status as string | undefined;

  if (checkStatus === "expired_or_not_found") {
    await prisma.job.update({
      where: { id: job.id },
      data: { status: "COMPLETED", result: JSON.stringify(checkData) },
    });
    return NextResponse.json(
      { error: "Verification code has expired. Please request a new one.", code: "CODE_EXPIRED" },
      { status: 400 }
    );
  }

  if (checkStatus === "failure" || checkStatus !== "success") {
    await prisma.job.update({
      where: { id: job.id },
      data: { status: "COMPLETED", result: JSON.stringify(checkData) },
    });
    return NextResponse.json(
      { error: "Invalid verification code. Please try again.", code: "INVALID_CODE" },
      { status: 400 }
    );
  }

  // Success: mark phone as verified
  await prisma.job.update({
    where: { id: job.id },
    data: { status: "COMPLETED", result: JSON.stringify(checkData) },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      phoneVerifiedAt: new Date(),
      phoneVerificationSentAt: null,
    },
  });

  // Fire-and-forget Telegram notification
  notifyPhoneVerified({ email: user.email, phone: user.phone }).catch(
    (err) => console.error("[verify-phone/confirm] Telegram notification failed:", err)
  );

  return NextResponse.json({ success: true });
}