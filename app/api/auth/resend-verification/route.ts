import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createVerificationToken } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";

const resendSchema = z.object({
  email: z.string().email().optional(),
});

export async function POST(req: Request) {
  // Determine which email to verify. Prefer the authenticated session; fall
  // back to a body-provided email so users who just registered (and aren't
  // logged in yet) can still request a resend.
  const session = await auth();
  let body: z.infer<typeof resendSchema> = {};
  try {
    body = resendSchema.parse(await req.json().catch(() => ({})));
  } catch {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const email = session?.user?.email ?? body.email;
  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { username: true, emailVerifiedAt: true },
  });

  // Respond with 200 even for unknown users to avoid leaking account existence.
  if (!user || user.emailVerifiedAt) {
    return NextResponse.json({ success: true });
  }

  try {
    const { token } = await createVerificationToken(email);
    const result = await sendVerificationEmail({
      to: email,
      username: user.username,
      token,
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 502 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[resend-verification] Failed:", err);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
