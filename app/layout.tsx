import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "File.energy - AI-Powered Document Interaction",
    template: "%s | File.energy",
  },
  description:
    "Interact with your documents using AI. Save time on document analysis, extract insights, and visualize your data with File.energy.",
  keywords: [
    "AI",
    "document analysis",
    "PDF",
    "chat with documents",
    "file.energy",
  ],
  authors: [{ name: "File.energy" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://file.energy",
    title: "File.energy - AI-Powered Document Interaction",
    description:
      "Interact with your documents using AI. Save time on document analysis.",
    siteName: "File.energy",
  },
  twitter: {
    card: "summary_large_image",
    title: "File.energy - AI-Powered Document Interaction",
    description:
      "Interact with your documents using AI. Save time on document analysis.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "10px",
            },
          }}
        />
        </Providers>
      </body>
    </html>
  );
}
