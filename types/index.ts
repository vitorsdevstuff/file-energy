import { User as PrismaUser, Chat, Subscription, Plan, Invoice } from "@prisma/client";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

// User types
export type UserWithRelations = PrismaUser & {
  chats?: Chat[];
  subscriptions?: Subscription[];
  invoices?: Invoice[];
};

// Chat types
export interface ChatMessage {
  type: "human" | "ai";
  content: string;
  timestamp?: string;
}

export type ChatWithRelations = Chat & {
  user?: PrismaUser;
};

// Subscription types
export type SubscriptionWithPlan = Subscription & {
  plan: Plan;
};

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Checkout types
export interface CheckoutRequest {
  words?: number;
  images?: number;
  minutes?: number;
  characters?: number;
  userEmail: string;
  price: number;
  numberOfPDFs: number;
  numberOfQuestions: number;
  pdfSize: number;
  isFile?: boolean;
  currency?: string;
  planName?: string;
  numberOfUsers?: number;
}

// File upload types
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

// Marketing page types
export interface MenuItem {
  id: number;
  title: string;
  href: string;
  newTab?: boolean;
}

export interface Feature {
  id: number;
  title: string;
  iconLight: string;
  iconDark: string;
  desc: string;
  new?: boolean;
}

export interface PricingPlan {
  id: number;
  title: string;
  priceMonthly: string;
  priceList: { name: string }[];
  popular?: boolean;
}

export interface Testimonial {
  id: number;
  testimonial: string;
  author: {
    name: string;
    designation: string;
    image?: string;
  };
}

export interface FAQItem {
  id: number;
  type: string[];
  question: string;
  answer: string;
}

export interface Client {
  id: number;
  imageLight: string;
  imageDark: string;
}
