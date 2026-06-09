import { prisma } from "@/lib/prisma";
import { UsersTable, type UserRow } from "./UsersTable";
import { AddUserButton } from "./AddUserButton";

export const metadata = {
  title: "Users - Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  // SSR first page of the user list — keeps the initial render populated
  // so the admin doesn't see an empty table flash.
  const [total, firstPage] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
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

  const initial = {
    users: firstPage.map<UserRow>((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      isActive: u.isActive,
      createdAt: u.createdAt.toISOString(),
      planName: u.subscriptions[0]?.plan.name ?? null,
      chatsCount: u._count.chats,
    })),
    total,
    page: 1,
    pageSize: 20,
    totalPages: Math.max(1, Math.ceil(total / 20)),
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Users
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all registered users
          </p>
        </div>
        <AddUserButton />
      </div>

      <UsersTable initial={initial} />
    </div>
  );
}
