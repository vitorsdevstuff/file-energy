"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Mail, XCircle, Clock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

type Status = "pending" | "success" | "invalid" | "expired";

function parseStatus(value: string | null): Status {
  if (value === "success" || value === "invalid" || value === "expired") {
    return value;
  }
  return "pending";
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const status = parseStatus(searchParams.get("status"));
  const email = searchParams.get("email") ?? "";
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);

  const handleResend = async () => {
    if (resendCooldown) {
      toast.error("Please wait a moment before requesting another email.");
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email ? { email } : {}),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.error || "Failed to resend verification email");
        return;
      }
      toast.success("Verification email sent. Check your inbox.");
      setResendCooldown(true);
      setTimeout(() => setResendCooldown(false), 30_000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (status === "success") {
    return (
      <VerifyLayout
        icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
        iconBg="bg-green-100 dark:bg-green-900/40"
        title="Email verified"
        description="Your email has been verified. You can now sign in and purchase a plan."
      >
        <Link href="/login">
          <Button className="w-full">Continue to sign in</Button>
        </Link>
      </VerifyLayout>
    );
  }

  if (status === "invalid") {
    return (
      <VerifyLayout
        icon={<XCircle className="h-8 w-8 text-red-600" />}
        iconBg="bg-red-100 dark:bg-red-900/40"
        title="Invalid verification link"
        description="This link is invalid or has already been used. Request a new email below."
      >
        <Button
          className="w-full"
          isLoading={isResending}
          onClick={handleResend}
          disabled={!email || resendCooldown}
        >
          Send a new verification email
        </Button>
        {!email && (
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Already logged in? Go to your{" "}
            <Link href="/account/settings" className="text-primary hover:underline">
              account settings
            </Link>{" "}
            to request a new email.
          </p>
        )}
      </VerifyLayout>
    );
  }

  if (status === "expired") {
    return (
      <VerifyLayout
        icon={<Clock className="h-8 w-8 text-amber-600" />}
        iconBg="bg-amber-100 dark:bg-amber-900/40"
        title="Verification link expired"
        description="That link has expired. We can send you a fresh one right now."
      >
        <Button
          className="w-full"
          isLoading={isResending}
          onClick={handleResend}
          disabled={!email || resendCooldown}
        >
          Send a new verification email
        </Button>
      </VerifyLayout>
    );
  }

  // Default: post-registration "check your email" state
  return (
    <VerifyLayout
      icon={<Mail className="h-8 w-8 text-primary" />}
      iconBg="bg-primary/10"
      title="Check your email"
      description={
        email
          ? `We sent a verification link to ${email}. Click the link to activate your account.`
          : "We sent a verification link to your inbox. Click the link to activate your account."
      }
    >
      <Button
        variant="outline"
        className="w-full"
        isLoading={isResending}
        onClick={handleResend}
        disabled={resendCooldown}
      >
        {resendCooldown ? "Email sent — wait 30s to retry" : "Resend verification email"}
      </Button>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        Already verified?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </VerifyLayout>
  );
}

interface VerifyLayoutProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function VerifyLayout({
  icon,
  iconBg,
  title,
  description,
  children,
}: VerifyLayoutProps) {
  return (
    <div>
      <div
        className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
      >
        {icon}
      </div>
      <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="mb-8 text-gray-600 dark:text-gray-400">{description}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
