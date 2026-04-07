import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consumeVerificationToken } from "@/lib/verification";
import { getBaseUrl } from "@/lib/email";

function redirectWithStatus(
  status: "success" | "invalid" | "expired",
  email?: string
): NextResponse {
  const url = new URL("/verify-email", getBaseUrl());
  url.searchParams.set("status", status);
  if (email) url.searchParams.set("email", email);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return redirectWithStatus("invalid");
  }

  const result = await consumeVerificationToken(token);

  if (result.status === "invalid") {
    return redirectWithStatus("invalid");
  }

  if (result.status === "expired") {
    return redirectWithStatus("expired");
  }

  // Mark the user as verified. If the user no longer exists, fall through as
  // invalid so the UI doesn't show a misleading "success".
  const user = await prisma.user.findUnique({
    where: { email: result.identifier },
    select: { id: true, emailVerifiedAt: true },
  });

  if (!user) {
    return redirectWithStatus("invalid");
  }

  if (!user.emailVerifiedAt) {
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    });
  }

  return redirectWithStatus("success", result.identifier);
}
