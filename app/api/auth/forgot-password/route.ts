import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/verification";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "We can't find a user with that email address." },
        { status: 400 }
      );
    }

    // Generate reset token
    const { token } = await createPasswordResetToken(email);

    // Send reset email
    try {
      const result = await sendPasswordResetEmail({
        to: email,
        username: user.username,
        token,
      });
      if (!result.ok) {
        console.error("[forgot-password] Reset email send failed:", result.error);
      }
    } catch (err) {
      console.error("[forgot-password] Failed to send reset email:", err);
    }

    return NextResponse.json(
      {
        success: true,
        message: "If an account exists with this email, a reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues;
      return NextResponse.json(
        { error: issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
