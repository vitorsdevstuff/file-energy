import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createVerificationToken } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, username } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user (email verification gated separately via emailVerifiedAt)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        isActive: true,
      },
    });

    // Issue a verification token and send the email. We intentionally do not
    // fail the registration if sending fails — the user can request a resend.
    try {
      const { token } = await createVerificationToken(email);
      const result = await sendVerificationEmail({
        to: email,
        username,
        token,
      });
      if (!result.ok) {
        console.error("[register] Verification email send failed:", result.error);
      }
    } catch (err) {
      console.error("[register] Failed to issue verification email:", err);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created. Check your inbox to verify your email address.",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues;
      return NextResponse.json(
        { error: issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
