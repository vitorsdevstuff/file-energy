import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consumePasswordResetToken } from "@/lib/verification";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password, confirmPassword } = resetPasswordSchema.parse(body);

    // Consume token
    const result = await consumePasswordResetToken(token);

    if (result.status === "invalid") {
      return NextResponse.json(
        { error: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    if (result.status === "expired") {
      return NextResponse.json(
        { error: "Your reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const email = result.identifier;

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your password has been successfully reset.",
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

    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
