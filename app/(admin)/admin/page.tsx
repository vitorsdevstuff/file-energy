import { prisma } from "@/lib/prisma";
import { Users, FileText, CreditCard, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboard() {
  const [userCount, chatCount, activeSubscriptions, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.chat.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.invoice.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
  ]);

  const stats = [
    {
      label: "Total Users",
      value: userCount.toString(),
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      label: "Total Documents",
      value: chatCount.toString(),
      icon: FileText,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      label: "Active Subscriptions",
      value: activeSubscriptions.toString(),
      icon: CreditCard,
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      label: "Total Revenue",
      value: `$${(revenue._sum.amount || 0).toFixed(2)}`,
      icon: TrendingUp,
      change: "+23%",
      changeType: "positive" as const,
    },
  ];

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      subscriptions: {
        where: { status: "ACTIVE" },
        select: { plan: { select: { name: true } } },
      },
    },
  });

  // Get recent subscriptions
  const recentSubscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: { select: { email: true, username: true } },
      plan: { select: { name: true, price: true } },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to the File.energy admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Recent Users
          </h3>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user.subscriptions[0]?.plan.name || "No Plan"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Recent Subscriptions
          </h3>
          <div className="space-y-4">
            {recentSubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {sub.user.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sub.plan.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${sub.plan.price}
                  </p>
                  <span
                    className={`text-xs ${
                      sub.status === "ACTIVE"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500"
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
