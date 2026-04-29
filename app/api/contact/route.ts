import { NextRequest, NextResponse } from "next/server";
import { sendEmail, renderContactAutoReplyHtml, renderContactAutoReplyText } from "@/lib/email";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // 1. Send notification to support
    const supportEmailResult = await sendEmail({
      to: "support@file.energy",
      subject: `Contact Form: ${data.subject}`,
      text: `New message from ${data.firstName} ${data.lastName} (${data.email})\n\nMessage:\n${data.message}`,
      html: `<p><strong>New message from:</strong> ${data.firstName} ${data.lastName} (${data.email})</p><p><strong>Subject:</strong> ${data.subject}</p><p><strong>Message:</strong><br/>${data.message.replace(/\n/g, "<br/>")}</p>`,
    });

    if (!supportEmailResult.ok) {
      console.error("[contact] Failed to send support notification:", supportEmailResult.error);
      // We continue to try and send the auto-reply even if the support notification fails
    }

    // 2. Send auto-reply to the user
    const autoReplyResult = await sendEmail({
      to: data.email,
      subject: "Thank you for contacting File.energy",
      text: renderContactAutoReplyText({ firstName: data.firstName, subject: data.subject }),
      html: renderContactAutoReplyHtml({ firstName: data.firstName, subject: data.subject }),
    });

    if (!autoReplyResult.ok) {
      console.error("[contact] Failed to send auto-reply:", autoReplyResult.error);
    }

    return NextResponse.json(
      { success: true, message: "Your message has been sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
