import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Invoices",
};

export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      invoices: {
        orderBy: { createdAt: "desc" },
        include: { plan: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Account
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Invoices
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View your billing history and invoice details
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {user.invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-600 dark:text-gray-400">
                No invoices yet.
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                Invoices will appear here once you subscribe to a plan.
              </p>
              <Link href="/pricing" className="mt-4">
                <button className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
                  View Plans
                </button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Invoice
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Date
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Plan
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                      Amount
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user.invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-50 dark:border-gray-800"
                    >
                      <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.invoiceId}
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="py-3 text-sm text-gray-900 dark:text-white">
                        {invoice.plan.name}
                      </td>
                      <td className="py-3 text-right text-sm text-gray-900 dark:text-white">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            invoice.status === "PAID"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : invoice.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}