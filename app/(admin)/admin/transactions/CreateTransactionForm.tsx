"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Receipt, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

type Option = { id: string; label: string; subLabel?: string; price?: number; currency?: string };

type Props = {
  users: Option[];
  plans: Option[];
};

export function CreateTransactionForm({ users, plans }: Props) {
  const router = useRouter();
  const [userId, setUserId] = React.useState("");
  const [planId, setPlanId] = React.useState("");
  const [amount, setAmount] = React.useState<string>("");
  const [currency, setCurrency] = React.useState("EUR");
  const [paymentMethod, setPaymentMethod] = React.useState("manual");
  const [note, setNote] = React.useState("");
  const [cancelExisting, setCancelExisting] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const selectedPlan = plans.find((p) => p.id === planId);

  React.useEffect(() => {
    if (selectedPlan) {
      if (selectedPlan.currency) setCurrency(selectedPlan.currency);
      if (selectedPlan.price != null) {
        setAmount(String(selectedPlan.price));
      }
    }
  }, [planId, selectedPlan]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userId) return setError("Please select a user");
    if (!planId) return setError("Please select a plan");
    const amountNumber = parseFloat(amount);
    if (Number.isNaN(amountNumber) || amountNumber < 0) {
      return setError("Amount must be a non-negative number");
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          planId,
          amount: amountNumber,
          currency,
          paymentMethod,
          note: note || null,
          cancelExisting,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Failed to create transaction");
      }
      setSuccess("Transaction created successfully");
      setUserId("");
      setPlanId("");
      setAmount("");
      setNote("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Receipt className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create transaction
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Creates a PAID invoice and an ACTIVE subscription for the user.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            User
          </label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="">Select a user…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label} — {u.subLabel}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Plan
          </label>
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="">Select a plan…</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} — {p.subLabel}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {selectedPlan?.price != null && (
            <p className="mt-1 text-xs text-gray-500">
              Plan default: {formatCurrency(selectedPlan.price, currency)}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900"
          >
            {["EUR", "USD", "GBP", "AUD", "NZD", "CHF", "PLN", "CZK", "HUF", "AED"].map(
              (c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Payment method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="manual">Manual</option>
            <option value="bank-transfer">Bank transfer</option>
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
            <option value="g2pay">G2Pay</option>
            <option value="comp">Comp / promo</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Note (optional)
          </label>
          <Input
            type="text"
            placeholder="Internal note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={cancelExisting}
          onChange={(e) => setCancelExisting(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        Cancel user&apos;s existing ACTIVE subscription
      </label>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
          {success}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating…
            </>
          ) : (
            <>
              <Receipt className="mr-2 h-4 w-4" />
              Create transaction
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
