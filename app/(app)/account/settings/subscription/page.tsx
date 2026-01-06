import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Subscription",
};

export default async function SubscriptionPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: {
        orderBy: { createdAt: "desc" },
        include: { plan: true },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { plan: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const activeSubscription = user.subscriptions.find((s) => s.status === "ACTIVE");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Subscription
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your subscription and billing
          </p>
        </div>

        {/* Current Plan */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Current Plan
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeSubscription ? activeSubscription.plan.name : "No active plan"}
                </p>
              </div>
            </div>
            {activeSubscription && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                <Check className="mr-1 h-4 w-4" />
                Active
              </span>
            )}
          </div>

          {activeSubscription && (
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${activeSubscription.plan.price}
                  <span className="text-sm font-normal text-gray-500">/mo</span>
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">PDFs Left</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {activeSubscription.pdfs}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">Questions Left</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {activeSubscription.questions}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">Max PDF Size</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {activeSubscription.pdfSize}MB
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <Link href="/pricing">
              <Button>{activeSubscription ? "Upgrade Plan" : "Choose a Plan"}</Button>
            </Link>
            {activeSubscription && (
              <Button variant="outline">Cancel Subscription</Button>
            )}
          </div>
        </div>

        {/* Usage Warning */}
        {activeSubscription && (activeSubscription.pdfs <= 2 || activeSubscription.questions <= 10) && (
          <div className="mb-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                Running Low on Usage
              </h4>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                You&apos;re running low on your monthly allowance. Consider upgrading your plan
                to continue using File.energy without interruption.
              </p>
              <Link href="/pricing" className="mt-3 inline-block">
                <Button size="sm">Upgrade Now</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Billing History */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Billing History
          </h3>

          {user.invoices.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No billing history yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Date
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Plan
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Amount
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
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
                      <td className="py-3 text-sm text-gray-900 dark:text-white">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="py-3 text-sm text-gray-900 dark:text-white">
                        {invoice.plan.name}
                      </td>
                      <td className="py-3 text-sm text-gray-900 dark:text-white">
                        ${invoice.amount.toFixed(2)} {invoice.currency}
                      </td>
                      <td className="py-3">
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
