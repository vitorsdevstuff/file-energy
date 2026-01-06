import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChatSidebar } from "@/components/app/ChatSidebar";
import { Bot, Upload } from "lucide-react";

export const metadata = {
  title: "Playground",
};

export default async function PlaygroundPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user data and chats
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      chats: {
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          uuid: true,
          title: true,
        },
      },
      subscriptions: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const subscription = user.subscriptions[0] || null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <ChatSidebar
        chats={user.chats}
        user={{
          id: user.id,
          email: user.email,
          username: user.username,
        }}
        subscription={
          subscription
            ? {
                pdfs: subscription.pdfs,
                questions: subscription.questions,
                pdfSize: subscription.pdfSize,
              }
            : null
        }
      />

      {/* Empty state */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to File.energy
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Upload a document to start chatting with it. Our AI will help you
            extract insights, answer questions, and analyze your files.
          </p>

          {!subscription && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
              <p>
                You don&apos;t have an active subscription.{" "}
                <a href="/pricing" className="font-semibold underline">
                  Upgrade now
                </a>{" "}
                to start uploading documents.
              </p>
            </div>
          )}

          {subscription && subscription.pdfs <= 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
              <p>
                You&apos;ve used all your document uploads.{" "}
                <a href="/pricing" className="font-semibold underline">
                  Upgrade
                </a>{" "}
                to continue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
