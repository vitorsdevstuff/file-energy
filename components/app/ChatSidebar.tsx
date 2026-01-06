"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Trash2,
  Plus,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dropzone } from "./Dropzone";
import toast from "react-hot-toast";

interface Chat {
  id: string;
  uuid: string;
  title: string;
}

interface Subscription {
  pdfs: number;
  questions: number;
  pdfSize: number;
}

interface User {
  id: string;
  email: string;
  username: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  user: User;
  subscription: Subscription | null;
  onChatCreated?: (uuid: string) => void;
}

export function ChatSidebar({
  chats,
  user,
  subscription,
  onChatCreated,
}: ChatSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    toast.success("Document uploaded successfully!");
    onChatCreated?.(data.chat.uuid);
    router.push(`/playground/${data.chat.uuid}`);
    router.refresh();
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;

    setDeletingId(uuid);

    try {
      const response = await fetch(`/api/chat/${uuid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }

      toast.success("Chat deleted successfully");
      router.push("/playground");
      router.refresh();
    } catch {
      toast.error("Failed to delete chat");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex h-full w-80 flex-col border-r border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-100 p-4 dark:border-gray-800">
        <Link href="/" className="text-xl font-bold text-primary">
          File.energy
        </Link>
      </div>

      {/* Upload */}
      <div className="border-b border-gray-100 p-4 dark:border-gray-800">
        <Dropzone
          onFileAccepted={handleFileUpload}
          disabled={!subscription || subscription.pdfs <= 0}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Your Documents
        </p>

        <div className="space-y-1">
          {chats.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              No documents yet. Upload one to get started!
            </p>
          ) : (
            chats.map((chat) => {
              const isActive = pathname === `/playground/${chat.uuid}`;
              return (
                <div
                  key={chat.uuid}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2 transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <Link
                    href={`/playground/${chat.uuid}`}
                    className="flex flex-1 items-center gap-3 overflow-hidden"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-sm">
                      {chat.title.length > 25
                        ? `${chat.title.slice(0, 25)}...`
                        : chat.title}
                    </span>
                  </Link>

                  <button
                    onClick={() => handleDelete(chat.uuid)}
                    disabled={deletingId === chat.uuid}
                    className="ml-2 rounded p-1 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Subscription Info */}
      {subscription && (
        <div className="border-t border-gray-100 p-4 dark:border-gray-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Balance
          </p>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">
                {subscription.pdfs}
              </span>{" "}
              Documents
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">
                {subscription.questions}
              </span>{" "}
              Questions
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">
                {subscription.pdfSize}MB
              </span>{" "}
              Max size
            </p>
          </div>

          {(subscription.pdfs <= 5 || subscription.questions <= 10) && (
            <Link href="/pricing">
              <Button className="mt-3 w-full" size="sm">
                <Zap className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* User */}
      <div className="border-t border-gray-100 p-4 dark:border-gray-800">
        <Link
          href="/account/settings"
          className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="truncate font-medium text-gray-900 dark:text-white">
                {user.username}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-2 flex w-full items-center gap-2 rounded-lg p-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
