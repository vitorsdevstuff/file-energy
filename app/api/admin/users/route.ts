import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 100;

type SubFilter = "all" | "with" | "without";

// GET /api/admin/users?q=&sub=&page=&pageSize=
// Lists users with server-side search, subscription filter, and pagination.
// Used by the admin users page table.
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    const subFilter = (searchParams.get("sub") ?? "all") as SubFilter;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const requestedSize = parseInt(
      searchParams.get("pageSize") ?? String(PAGE_SIZE_DEFAULT),
      10
    );
    const pageSize = Math.min(
      PAGE_SIZE_MAX,
      Math.max(1, isNaN(requestedSize) ? PAGE_SIZE_DEFAULT : requestedSize)
    );

    // Build the where clause incrementally so we don't end up with
    // contradictory AND/OR conditions on the same field.
    const where: Prisma.UserWhereInput = {};

    if (q) {
      where.OR = [
        { username: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    if (subFilter === "with") {
      where.subscriptions = { some: { status: "ACTIVE" } };
    } else if (subFilter === "without") {
      where.subscriptions = { none: { status: "ACTIVE" } };
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          subscriptions: {
            where: { status: "ACTIVE" },
            include: { plan: true },
            take: 1,
          },
          _count: { select: { chats: true } },
        },
      }),
    ]);

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString(),
        planName: u.subscriptions[0]?.plan.name ?? null,
        chatsCount: u._count.chats,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (err) {
    console.error("GET /api/admin/users failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
});

// POST /api/admin/users
// Creates a new user with admin-set credentials. The account is active
// and email-verified immediately.
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
