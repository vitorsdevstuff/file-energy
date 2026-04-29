"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const resetPasswordSchema = z.object({
  password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]/,
        "Password must contain at least one special character"
      )
      .regex(/^\S*$/, "Password must not contain spaces")
      .regex(
        /^[A-Za-z0-9!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]+$/,
        "Password contains forbidden characters"
      ),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error("Reset token is missing. Please request a new reset link.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Something went wrong. Please try again.");
        return;
      }

      toast.success("Your password has been reset successfully!");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Invalid reset link</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The reset token is missing or invalid. Please request a new password reset link.
        </p>
        <Link
          href="/forgot-password"
          className="text-primary hover:underline font-medium"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Set new password
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Please enter your new password below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Update password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
