import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import openai from "@/lib/openai";

export const maxDuration = 300;

// GET - Fetch chat details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chat = await prisma.chat.findFirst({
      where: {
        uuid: id,
        userId: session.user.id,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({
      chat: {
        uuid: chat.uuid,
        title: chat.title,
        chatHistory: chat.chatHistory,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}

// POST - Send message to chat (streaming)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Fetch chat
    const chat = await prisma.chat.findFirst({
      where: {
        uuid: id,
        userId: session.user.id,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!chat.threadId || !chat.assistantId) {
      return NextResponse.json(
        { error: "Chat is not properly configured" },
        { status: 400 }
      );
    }

    // Check subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (!subscription || subscription.questions <= 0) {
      return NextResponse.json(
        { error: "No active subscription or question limit reached" },
        { status: 403 }
      );
    }

    // Parse and update chat history
    const chatHistory = chat.chatHistory ? JSON.parse(chat.chatHistory) : [];
    chatHistory.push({ type: "human", content: message, timestamp: new Date().toISOString() });

    // Add message to OpenAI thread
    await openai.beta.threads.messages.create(chat.threadId, {
      role: "user",
      content: message,
    });

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";

        try {
          const run = openai.beta.threads.runs.stream(chat.threadId!, {
            assistant_id: chat.assistantId!,
          });

          run
            .on("textDelta", (textDelta) => {
              const content = textDelta.value || "";
              fullResponse += content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            })
            .on("end", async () => {
              // Save AI response to chat history
              chatHistory.push({
                type: "ai",
                content: fullResponse,
                timestamp: new Date().toISOString(),
              });

              await prisma.chat.update({
                where: { id: chat.id },
                data: { chatHistory: JSON.stringify(chatHistory) },
              });

              // Decrement question count
              await prisma.subscription.update({
                where: { id: subscription.id },
                data: { questions: subscription.questions - 1 },
              });

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
              );
              controller.close();
            })
            .on("error", (error) => {
              console.error("Stream error:", error);
              controller.error(error);
            });
        } catch (error) {
          console.error("Error in stream:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// DELETE - Delete chat
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chat = await prisma.chat.findFirst({
      where: {
        uuid: id,
        userId: session.user.id,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Delete OpenAI resources
    if (chat.assistantId) {
      try {
        await openai.beta.assistants.del(chat.assistantId);
      } catch {
        // Ignore if already deleted
      }
    }

    if (chat.threadId) {
      try {
        await openai.beta.threads.del(chat.threadId);
      } catch {
        // Ignore if already deleted
      }
    }

    // Delete from database
    await prisma.chat.delete({ where: { id: chat.id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
