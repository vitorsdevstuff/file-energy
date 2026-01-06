import { prisma } from "@/lib/prisma";
import { TrendingUp, Users, FileText, DollarSign } from "lucide-react";

export const metadata = {
  title: "Analytics - Admin",
};

export default async function AdminAnalyticsPage() {
  // Get stats
  const [userCount, chatCount, subCount, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.chat.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.invoice.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
  ]);

  // Get monthly data (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyUsers = await prisma.user.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: { gte: sixMonthsAgo },
    },
    _count: true,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your platform performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-green-600">+12%</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {userCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Users
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
              <FileText className="h-6 w-6 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-green-600">+8%</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {chatCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Documents Processed
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <span className="text-sm font-medium text-green-600">+15%</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {subCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active Subscriptions
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <DollarSign className="h-6 w-6 text-amber-500" />
            </div>
            <span className="text-sm font-medium text-green-600">+23%</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${(revenue._sum.amount || 0).toFixed(0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Revenue
            </p>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            User Growth
          </h3>
          <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <div className="mb-4 flex justify-center gap-1">
                {[40, 60, 45, 70, 55, 80].map((height, i) => (
                  <div
                    key={i}
                    className="w-8 rounded-t bg-primary/80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monthly user signups
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Revenue
          </h3>
          <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <div className="mb-4 flex justify-center gap-1">
                {[30, 50, 40, 65, 55, 75].map((height, i) => (
                  <div
                    key={i}
                    className="w-8 rounded-t bg-green-500/80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monthly revenue
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Plans */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Plan Distribution
        </h3>
        <div className="space-y-4">
          {[
            { name: "Basic", percentage: 45, color: "bg-blue-500" },
            { name: "Intermediate", percentage: 30, color: "bg-purple-500" },
            { name: "Premium", percentage: 15, color: "bg-green-500" },
            { name: "Enterprise", percentage: 10, color: "bg-amber-500" },
          ].map((plan) => (
            <div key={plan.name}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-gray-900 dark:text-white">
                  {plan.name}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {plan.percentage}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full ${plan.color} transition-all duration-500`}
                  style={{ width: `${plan.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
