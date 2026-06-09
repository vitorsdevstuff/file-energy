"use client";

import * as React from "react";
import {
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export type UserRow = {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  planName: string | null;
  chatsCount: number;
};

type ApiResponse = {
  users: UserRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;
type SubFilter = "all" | "with" | "without";

export function UsersTable({ initial }: { initial?: ApiResponse }) {
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [subFilter, setSubFilter] = React.useState<SubFilter>("all");
  const [page, setPage] = React.useState(1);

  const [data, setData] = React.useState<ApiResponse | null>(initial ?? null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Debounce the search input.
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  // Reset to page 1 whenever the search term or the subscription filter
  // changes — page numbers are not meaningful across result sets.
  React.useEffect(() => {
    setPage(1);
  }, [debouncedQuery, subFilter]);

  // Fetch whenever any of the inputs change.
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
      sub: subFilter,
    });
    if (debouncedQuery) params.set("q", debouncedQuery);

    fetch(`/api/admin/users?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? `Request failed: ${res.status}`);
        }
        return (await res.json()) as ApiResponse;
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, subFilter, page]);

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const hasData = users.length > 0;

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative w-full max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10 pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && (
            <Loader2
              aria-label="Loading"
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400"
            />
          )}
        </div>
        <select
          value={subFilter}
          onChange={(e) => setSubFilter(e.target.value as SubFilter)}
          className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="all">All Users</option>
          <option value="with">With Subscription</option>
          <option value="without">Without Subscription</option>
        </select>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loading && !data
            ? "Loading…"
            : `${total} user${total === 1 ? "" : "s"}`}
          {debouncedQuery && data ? ` for "${debouncedQuery}"` : ""}
        </p>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Documents
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {hasData &&
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
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
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.planName
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {user.planName || "Free"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {user.chatsCount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {user.isActive ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(new Date(user.createdAt))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        aria-label="More actions"
                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!loading && !hasData && (
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {debouncedQuery || subFilter !== "all"
                ? "No users match the current filters."
                : "No users yet."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </p>
      )}
    </>
  );
}
