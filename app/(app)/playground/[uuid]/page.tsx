import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ChatSidebar } from "@/components/app/ChatSidebar";
import { ChatSection } from "@/components/app/ChatSection";

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { uuid } = await params;
  const chat = await prisma.chat.findUnique({
    where: { uuid },
    select: { title: true },
  });

  return {
    title: chat?.title || "Chat",
  };
}

export default async function ChatPage({ params }: PageProps) {
  const { uuid } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user data, chats, and current chat
  const [user, chat] = await Promise.all([
    prisma.user.findUnique({
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
    }),
    prisma.chat.findFirst({
      where: {
        uuid,
        userId: session.user.id,
      },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  if (!chat) {
    notFound();
  }

  const subscription = user.subscriptions[0] || null;
  const chatHistory = chat.chatHistory ? JSON.parse(chat.chatHistory) : [];

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

      <div className="flex-1">
        <ChatSection
          uuid={uuid}
          title={chat.title}
          initialHistory={chatHistory}
        />
      </div>
    </div>
  );
}
