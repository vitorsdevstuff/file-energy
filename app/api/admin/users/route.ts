import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
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
    const data = createUserSchema.parse(body);

    // Check uniqueness on email and username up front so we can return a
    // helpful error rather than a Prisma P2002.
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
      select: { email: true, username: true },
    });
    if (existing) {
      const field =
        existing.email === data.email ? "email" : "username";
      return NextResponse.json(
        { error: `User with this ${field} already exists` },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        // Admin-created accounts are active and email-verified by
        // default — the admin is vouching for the user.
        isActive: true,
        emailVerifiedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues;
      return NextResponse.json(
        { error: issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    console.error("POST /api/admin/users failed:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
