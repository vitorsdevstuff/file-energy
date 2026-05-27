"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]/,
        "Password must contain at least one special character"
      )
      .regex(/^\S*$/, "Password must not contain spaces"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to change password.");
        return;
      }

      toast.success("Password changed successfully.");
      router.push("/account");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-lg px-4 py-8">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Account
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Change Password
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update your password to keep your account secure.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              error={errors.currentPassword?.message}
              {...register("currentPassword")}
            />
          </div>

          <div className="space-y-2">
            <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
          </div>

          <div className="space-y-2">
            <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm New Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Change Password
          </Button>
        </form>
      </div>
      </div>
    </div>
  );
}