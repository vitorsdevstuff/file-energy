import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";

const FILE_ENERGY_API_URL = "https://file-energy-api.vercel.app";

const checkoutSchema = z.object({
  type: z.enum(["standard", "custom", "team"]).optional().default("standard"),
  currency: z.string().default("EUR"),
  // Standard plan
  planId: z.string().optional(),
  // Custom plan
  price: z.string().optional(),
  pdfs: z.string().optional(),
  questions: z.string().optional(),
  size: z.string().optional(),
  api: z.boolean().optional(),
  // Team plan
  plan: z.string().optional(),
  users: z.string().optional(),
  documents: z.string().optional(),
});

// Preset plan data (matches lib/data.ts)
const presetPlans: Record<string, { name: string; pdfs: number; questions: number; pdfSize: number; prices: Record<string, number> }> = {
  "1": { name: "Test", pdfs: 5, questions: 50, pdfSize: 10, prices: { EUR: 2.75, USD: 2.99, GBP: 2.36 } },
  "2": { name: "Basic", pdfs: 10, questions: 150, pdfSize: 15, prices: { EUR: 7.99, USD: 8.70, GBP: 6.86 } },
  "3": { name: "Intermediate", pdfs: 20, questions: 250, pdfSize: 20, prices: { EUR: 19.99, USD: 21.77, GBP: 17.15 } },
  "4": { name: "Advanced", pdfs: 40, questions: 400, pdfSize: 35, prices: { EUR: 34.99, USD: 38.11, GBP: 30.01 } },
  "5": { name: "Professional", pdfs: 70, questions: 700, pdfSize: 50, prices: { EUR: 59.99, USD: 65.35, GBP: 51.45 } },
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = checkoutSchema.parse(body);
    const { type, currency } = parsed;

    let checkoutPayload: {
      words: number;
      images: number;
      minutes: number;
      characters: number;
      userEmail: string;
      price: number;
      numberOfPDFs: number;
      numberOfQuestions: number;
      pdfSize: number;
      isFile: boolean;
      currency: string;
      planName: string;
      numberOfUsers: number;
    };

    if (type === "custom") {
      // Custom plan
      const price = parseFloat(parsed.price || "0");
      const pdfs = parseInt(parsed.pdfs || "0", 10);
      const questions = parseInt(parsed.questions || "0", 10);
      const size = parseFloat(parsed.size || "10");

      checkoutPayload = {
        words: 0,
        images: 0,
        minutes: 0,
        characters: 0,
        userEmail: session.user.email,
        price,
        numberOfPDFs: pdfs,
        numberOfQuestions: questions,
        pdfSize: size,
        isFile: true,
        currency,
        planName: "Custom Plan",
        numberOfUsers: 1,
      };
    } else if (type === "team") {
      // Team plan
      const planName = parsed.plan || "Basic";
      const users = parseInt(parsed.users || "1", 10);
      const documents = parseInt(parsed.documents || "10", 10);
      const questions = parseInt(parsed.questions || "150", 10);
      const price = parseFloat(parsed.price || "0");

      // Find base plan to get pdfSize
      const basePlan = Object.values(presetPlans).find(p => p.name === planName);
      const pdfSize = basePlan?.pdfSize || 15;

      checkoutPayload = {
        words: 0,
        images: 0,
        minutes: 0,
        characters: 0,
        userEmail: session.user.email,
        price,
        numberOfPDFs: documents,
        numberOfQuestions: questions,
        pdfSize,
        isFile: true,
        currency,
        planName: `${planName} Team`,
        numberOfUsers: users,
      };
    } else {
      // Standard preset plan
      const planId = parsed.planId;
      if (!planId || !presetPlans[planId]) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }

      const plan = presetPlans[planId];
      const price = plan.prices[currency] || plan.prices["EUR"];

      checkoutPayload = {
        words: 0,
        images: 0,
        minutes: 0,
        characters: 0,
        userEmail: session.user.email,
        price,
        numberOfPDFs: plan.pdfs,
        numberOfQuestions: plan.questions,
        pdfSize: plan.pdfSize,
        isFile: true,
        currency,
        planName: plan.name,
        numberOfUsers: 1,
      };
    }

    // Call the file-energy-api checkout endpoint
    const response = await fetch(`${FILE_ENERGY_API_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Checkout API error:", data);
      return NextResponse.json(
        { error: data.error || "Failed to create checkout session" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.url,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues;
      return NextResponse.json(
        { error: `Invalid input: ${issues[0]?.message || "Validation error"}` },
        { status: 400 }
      );
    }

    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
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
