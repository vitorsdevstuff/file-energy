"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Receipt, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import {
  calculateCustomPlan,
  CUSTOM_PLAN_DEFAULTS,
  type CustomPriorityKey,
} from "@/lib/custom-plan";

type Option = {
  id: string;
  label: string;
  subLabel?: string;
  price?: number;
  currency?: string;
  isCustom?: boolean;
};

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
  const [paidAt, setPaidAt] = React.useState<string>("");
  // Custom plan: admin enters a budget, resources are derived (same as Pricing page)
  const [apiAccess, setApiAccess] = React.useState(false);
  const [priorities, setPriorities] = React.useState<CustomPriorityKey[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const selectedPlan = plans.find((p) => p.id === planId);
  const isCustomPlan = selectedPlan?.isCustom === true;
  const mode: "balance" | "custom" =
    priorities.length === 0 ? "balance" : "custom";

  // Initialise the amount from the selected plan; reset priorities when plan
  // changes so a non-custom plan doesn't carry a stale selection.
  React.useEffect(() => {
    if (selectedPlan) {
      if (selectedPlan.currency) setCurrency(selectedPlan.currency);
      if (selectedPlan.price != null) {
        setAmount(String(selectedPlan.price));
      }
    }
    if (!isCustomPlan) {
      setPriorities([]);
      setApiAccess(false);
    }
  }, [planId, selectedPlan, isCustomPlan]);

  const togglePriority = (key: CustomPriorityKey) => {
    setPriorities((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };
  const switchToBalance = () => setPriorities([]);

  // Custom plan resource calculation (mirrors Pricing page)
  const amountNumber = parseFloat(amount) || 0;
  const customPlan = isCustomPlan
    ? calculateCustomPlan({
        budget: amountNumber,
        currency,
        priorities,
        apiAccess,
      })
    : null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userId) return setError("Please select a user");
    if (!planId) return setError("Please select a plan");
    if (Number.isNaN(amountNumber) || amountNumber < 0) {
      return setError("Amount must be a non-negative number");
    }
    if (isCustomPlan && (!customPlan || customPlan.pdfs < 1)) {
      return setError("Custom plan: budget is too low for at least 1 PDF");
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
          paidAt: paidAt ? new Date(paidAt).toISOString() : null,
          ...(isCustomPlan && customPlan
            ? {
                customOverrides: {
                  pdfs: customPlan.pdfs,
                  questions: customPlan.questions,
                  pdfSize: customPlan.pdfSize,
                  apiAccess,
                },
              }
            : {}),
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
      setPaidAt("");
      setPriorities([]);
      setApiAccess(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const activeKeys: CustomPriorityKey[] =
    mode === "balance" ? ["pdfs", "size", "questions"] : priorities;

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

        {isCustomPlan && (
          <div className="sm:col-span-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Custom plan resources
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (calculated from amount — same logic as Pricing page)
              </span>
            </div>

            {/* Priorities — mirrors Pricing page */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                What should the budget prioritise?
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-colors ${
                    mode === "balance"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white hover:border-primary/50 dark:border-gray-700 dark:bg-gray-900"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    switchToBalance();
                  }}
                >
                  <div
                    className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      mode === "balance"
                        ? "border-primary"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {mode === "balance" && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Balance
                    </span>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      40% PDFs · 35% Q · 25% Size
                    </p>
                  </div>
                </label>
                {(
                  [
                    { key: "pdfs" as const, label: "PDFs", hint: "more documents" },
                    { key: "size" as const, label: "Document size", hint: "bigger files" },
                    { key: "questions" as const, label: "Questions", hint: "more queries" },
                  ]
                ).map(({ key, label, hint }) => (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-colors ${
                      priorities.includes(key)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white hover:border-primary/50 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={priorities.includes(key)}
                      onChange={() => togglePriority(key)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {label}
                      </span>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {hint}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* API Access toggle */}
            <label className="mb-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={apiAccess}
                onChange={(e) => setApiAccess(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              API Access (+10%)
            </label>

            {/* Calculated resources (read-only) */}
            <div className="rounded-lg border border-primary/30 bg-white p-3 dark:bg-gray-900">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Subscription will get:
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    PDFs
                    {activeKeys.includes("pdfs") && (
                      <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium uppercase text-primary">
                        {mode === "balance" ? "Included" : "Priority"}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {customPlan?.pdfs ?? CUSTOM_PLAN_DEFAULTS.minPDFs}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    Document size
                    {activeKeys.includes("size") && (
                      <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium uppercase text-primary">
                        {mode === "balance" ? "Included" : "Priority"}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {customPlan?.pdfSize ?? CUSTOM_PLAN_DEFAULTS.defaultSizeMB} MB/pdf
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    Questions
                    {activeKeys.includes("questions") && (
                      <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium uppercase text-primary">
                        {mode === "balance" ? "Included" : "Priority"}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {customPlan?.questions ?? CUSTOM_PLAN_DEFAULTS.minQuestions}
                  </span>
                </li>
              </ul>
              <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                {amountNumber > 0
                  ? `Set the Amount field above to see live values.`
                  : `Enter an amount to compute the resources.`}
              </p>
            </div>
          </div>
        )}

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

      <div className="mt-4">
        <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <span>Paid at (optional)</span>
          {paidAt && (
            <button
              type="button"
              onClick={() => setPaidAt("")}
              className="text-xs font-normal text-primary hover:underline"
            >
              Reset to now
            </button>
          )}
        </label>
        <input
          type="datetime-local"
          value={paidAt}
          onChange={(e) => setPaidAt(e.target.value)}
          className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900"
        />
        <p className="mt-1 text-xs text-gray-500">
          Leave empty to use the current time. Setting a past date will also
          backdate the subscription&apos;s expiry to one year from that date.
        </p>
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
