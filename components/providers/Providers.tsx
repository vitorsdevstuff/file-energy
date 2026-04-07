"use client";

import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "@/lib/currency-context";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <CurrencyProvider>{children}</CurrencyProvider>
    </SessionProvider>
  );
}
