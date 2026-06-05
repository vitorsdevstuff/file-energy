import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateTransactionForm } from "./CreateTransactionForm";

export const metadata = {
  title: "Transactions - Admin",
};

export default async function AdminTransactionsPage() {
  const [invoices, users, plans] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { email: true, username: true } },
        plan: { select: { name: true } },
      },
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
  ]);

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "PAID").length,
    revenue: invoices
      .filter((i) => i.status === "PAID")
      .reduce((acc, i) => acc + i.amount, 0),
  };

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
  }));

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
            {stats.total}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
          <p className="text-2xl font-bold text-primary">
            ${stats.revenue.toFixed(2)}
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

      {/* Search */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search invoices..." className="pl-10" />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Invoice
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Gateway
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-gray-400" />
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {inv.invoiceId.slice(0, 8)}…
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {inv.user.username}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {inv.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {inv.plan.name}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {formatCurrency(inv.amount, inv.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {inv.paymentGateway || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        inv.status === "PAID"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : inv.status === "FAILED"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : inv.status === "REFUNDED"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(inv.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoices.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No invoices yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
