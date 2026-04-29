"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Something went wrong. Please try again.");
        return;
      }

      toast.success("If an account exists with this email, a reset link has been sent.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Forgot password?
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Email me a reset link
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Already remember your password?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
