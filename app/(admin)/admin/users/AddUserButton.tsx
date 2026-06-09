"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddUserButton() {
  const router = useRouter();
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Open/close the native dialog as state changes. Using showModal()
  // gives us the backdrop, focus trap, and Escape-to-close for free.
  React.useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) {
      dlg.showModal();
    } else if (!open && dlg.open) {
      dlg.close();
    }
  }, [open]);

  const close = () => {
    setOpen(false);
    setError(null);
    setSuccess(null);
  };

  // Reset form when the dialog is dismissed from outside (Escape key,
  // backdrop click). The dialog's native `close` event covers this.
  React.useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const handleClose = () => {
      setOpen(false);
      setError(null);
      setSuccess(null);
      setEmail("");
      setUsername("");
      setPassword("");
    };
    dlg.addEventListener("close", handleClose);
    return () => dlg.removeEventListener("close", handleClose);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Failed to create user");
      }
      setSuccess(`User "${json.user.username}" created`);
      setEmail("");
      setUsername("");
      setPassword("");
      // Refresh the SSR list so the new row shows up immediately.
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add User
      </Button>

      <dialog
        ref={dialogRef}
        // Clicking the backdrop (outside the inner panel) closes the
        // dialog. The dialog itself fills the viewport, so we check that
        // the click target is the dialog element itself, not a child.
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="backdrop:bg-black/50 m-0 max-h-full max-w-full bg-transparent p-0 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="m-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add new user
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Account will be active immediately. Share the credentials
                with the user.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="jane-doe"
                required
                minLength={2}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-gray-500">
                The user can change this after signing in.
              </p>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
                {success}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={close}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create user
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
