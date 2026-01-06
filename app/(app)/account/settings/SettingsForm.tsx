"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { User, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

interface SettingsFormProps {
  user: {
    id: string;
    username: string;
    email: string;
    addressLine1: string | null;
    city: string | null;
    country: string | null;
    postcode: string | null;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      addressLine1: user.addressLine1 || "",
      city: user.city || "",
      country: user.country || "",
      postcode: user.postcode || "",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <Input
                  placeholder="johndoe"
                  {...register("username")}
                  error={errors.username?.message}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <MapPin className="h-5 w-5 text-primary" />
              Address
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address Line 1
                </label>
                <Input
                  placeholder="123 Main Street"
                  {...register("addressLine1")}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    City
                  </label>
                  <Input placeholder="New York" {...register("city")} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Country
                  </label>
                  <Input placeholder="USA" {...register("country")} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Postcode
                  </label>
                  <Input placeholder="10001" {...register("postcode")} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
            <Link href="/account">
              <Button type="button" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Account
              </Button>
            </Link>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
          Danger Zone
        </h3>
        <p className="mb-4 text-sm text-red-700 dark:text-red-300">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="destructive" size="sm">
          Delete Account
        </Button>
      </div>
    </>
  );
}
