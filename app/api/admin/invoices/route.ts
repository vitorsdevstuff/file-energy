import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 100;

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
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const requestedSize = parseInt(
      searchParams.get("pageSize") ?? String(PAGE_SIZE_DEFAULT),
      10
    );
    const pageSize = Math.min(
      PAGE_SIZE_MAX,
      Math.max(1, isNaN(requestedSize) ? PAGE_SIZE_DEFAULT : requestedSize)
    );

    // Filter by user.username or user.email — case-insensitive contains.
    // If `q` is empty, no filter is applied (admin sees the latest invoices).
    const where: Prisma.InvoiceWhereInput = q
      ? {
          user: {
            is: {
              OR: [
                { username: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
              ],
            },
          },
        }
      : {};

    const [total, invoices] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: { select: { username: true, email: true } },
          plan: { select: { name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      invoices: invoices.map((inv) => ({
        id: inv.id,
        invoiceId: inv.invoiceId,
        amount: inv.amount,
        currency: inv.currency,
        paymentGateway: inv.paymentGateway,
        status: inv.status,
        createdAt: inv.createdAt.toISOString(),
        user: inv.user,
        plan: inv.plan,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (err) {
    console.error("GET /api/admin/invoices failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
