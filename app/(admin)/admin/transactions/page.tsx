import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { CreateTransactionForm } from "./CreateTransactionForm";
import { InvoicesTable } from "./InvoicesTable";

export const metadata = {
  title: "Transactions - Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage() {
  const [invoiceCount, paidCount, revenueSum, users, plans, firstPage] = await Promise.all([
    prisma.invoice.count(),
    prisma.invoice.count({ where: { status: "PAID" } }),
    prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, username: true },
      take: 500,
    }),
    prisma.plan.findMany({
      where: { softDelete: false },
      orderBy: { price: "asc" },
      select: { id: true, name: true, price: true },
    }),
    // SSR first page of the invoices table — keeps the initial render
    // populated so the user doesn't see a flash of "no invoices".
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        user: { select: { email: true, username: true } },
        plan: { select: { name: true } },
      },
    }),
  ]);

  const revenue = revenueSum._sum.amount ?? 0;

  const userOptions = users.map((u) => ({
    id: u.id,
    label: u.username,
    subLabel: u.email,
  }));

  const planOptions = plans.map((p) => ({
    id: p.id,
    label: p.name,
    subLabel: formatCurrency(p.price, "EUR"),
    price: p.price,
    currency: "EUR" as const,
    isCustom: p.name === "Custom Plan",
  }));

  const initialInvoices = {
    invoices: firstPage.map((inv) => ({
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
    total: invoiceCount,
    page: 1,
    pageSize: 20,
    totalPages: Math.max(1, Math.ceil(invoiceCount / 20)),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View all invoices and create manual transactions for users
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total invoices</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {invoiceCount}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
          <p className="text-2xl font-bold text-green-600">{paidCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
          <p className="text-2xl font-bold text-primary">
            ${revenue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CreateTransactionForm users={userOptions} plans={planOptions} />
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              How it works
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <span className="font-medium text-gray-900 dark:text-white">
                  1.
                </span>{" "}
                Pick the user and the plan to grant.
              </li>
              <li>
                <span className="font-medium text-gray-900 dark:text-white">
                  2.
                </span>{" "}
                An invoice is created with status{" "}
                <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                  PAID
                </code>{" "}
                and a matching ACTIVE subscription (mirrors the webhook flow).
              </li>
              <li>
                <span className="font-medium text-gray-900 dark:text-white">
                  3.
                </span>{" "}
                The user&apos;s previous ACTIVE subscription is cancelled by
                default.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <InvoicesTable initial={initialInvoices} />
    </div>
  );
}
