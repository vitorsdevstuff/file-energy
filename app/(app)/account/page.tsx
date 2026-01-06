import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, CreditCard, Shield, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { plan: true },
      },
      chats: {
        select: { id: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const subscription = user.subscriptions[0];
  const totalChats = user.chats.length;

  const menuItems = [
    { icon: User, label: "Profile Settings", href: "/account/settings" },
    { icon: CreditCard, label: "Subscription", href: "/account/settings/subscription" },
    { icon: Shield, label: "Security", href: "/account/settings/security" },
    { icon: Bell, label: "Notifications", href: "/account/settings/notifications" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Account
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <div className="col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-2xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user.username}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {subscription?.plan.name || "No Plan"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">Documents</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {totalChats}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">Questions Left</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {subscription?.questions || 0}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Link href="/playground">
                <Button>Go to Playground</Button>
              </Link>
              <Link href="/account/settings">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </form>
            </nav>
          </div>
        </div>

        {/* Subscription Details */}
        {subscription && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Current Subscription
            </h3>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {subscription.plan.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                  {subscription.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">PDFs Remaining</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {subscription.pdfs}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Questions Remaining</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {subscription.questions}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/pricing">
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </div>
        )}

        {!subscription && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
            <h3 className="mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
              No Active Subscription
            </h3>
            <p className="mb-4 text-amber-700 dark:text-amber-300">
              Get started with a plan to upload documents and ask questions.
            </p>
            <Link href="/pricing">
              <Button>View Plans</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
