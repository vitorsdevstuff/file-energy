import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import openai from "@/lib/openai";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    const maxSize = subscription.pdfSize * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds limit of ${subscription.pdfSize}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/csv",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PDF, DOC, DOCX, TXT, CSV" },
        { status: 400 }
      );
    }

    // Upload file to OpenAI
    const openaiFile = await openai.files.create({
      file: file,
      purpose: "assistants",
    });

    // Create vector store for the file
    const vectorStore = await openai.vectorStores.create({
      name: `File: ${file.name}`,
      file_ids: [openaiFile.id],
    });

    // Wait for vector store to be ready
    let vectorStoreStatus = await openai.vectorStores.retrieve(
      vectorStore.id
    );
    while (vectorStoreStatus.status === "in_progress") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      vectorStoreStatus = await openai.vectorStores.retrieve(
        vectorStore.id
      );
    }

    if (vectorStoreStatus.status !== "completed") {
      return NextResponse.json(
        { error: "Failed to process file" },
        { status: 500 }
      );
    }

    // Create assistant with file search
    const assistant = await openai.beta.assistants.create({
      name: `File.energy Assistant - ${file.name}`,
      instructions: `You are an intelligent document analysis assistant. You have access to the uploaded document "${file.name}". Analyze its content and answer questions about it accurately. Be helpful, clear, and provide well-structured responses. If you're unsure about something, say so rather than making up information.`,
      model: "gpt-4o",
      tools: [{ type: "file_search" }],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id],
        },
      },
    });

    // Create thread
    const thread = await openai.beta.threads.create();

    // Create chat in database
    const chat = await prisma.chat.create({
      data: {
        userId: session.user.id,
        title: file.name,
        assistantId: assistant.id,
        threadId: thread.id,
        vectorStoreId: vectorStore.id,
        path: file.name,
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
        uuid: chat.uuid,
        title: chat.title,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
