import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import openai from "@/lib/openai";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await prisma.chat.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        uuid: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, fileId, vectorStoreId } = await req.json();

    // Check subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (!subscription || subscription.pdfs <= 0) {
      return NextResponse.json(
        { error: "No active subscription or document limit reached" },
        { status: 403 }
      );
    }

    // Create OpenAI assistant and thread
    const assistant = await openai.beta.assistants.create({
      name: `File.energy Assistant - ${title}`,
      instructions: `You are an intelligent document analysis assistant. Analyze the uploaded document and answer questions about its content accurately. Be helpful, clear, and provide well-structured responses.`,
      model: "gpt-4o",
      tools: [{ type: "file_search" }],
      tool_resources: vectorStoreId
        ? { file_search: { vector_store_ids: [vectorStoreId] } }
        : undefined,
    });

    const thread = await openai.beta.threads.create();

    // Create chat in database
    const chat = await prisma.chat.create({
      data: {
        userId: session.user.id,
        title: title || "New Chat",
        assistantId: assistant.id,
        threadId: thread.id,
        vectorStoreId: vectorStoreId || null,
        chatHistory: JSON.stringify([]),
      },
    });

    // Decrement PDF count
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { pdfs: subscription.pdfs - 1 },
    });

    return NextResponse.json({
      success: true,
      chat: {
        id: chat.id,
        uuid: chat.uuid,
        title: chat.title,
      },
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
