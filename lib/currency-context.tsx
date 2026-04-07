"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  CURRENCY_INFO,
  SUPPORTED_CURRENCIES,
  isSupportedCurrency,
  type SupportedCurrency,
} from "@/lib/g2pay";

const STORAGE_KEY = "file-energy:currency";
const DEFAULT_CURRENCY: SupportedCurrency = "EUR";

type Listener = () => void;
const listeners = new Set<Listener>();

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): SupportedCurrency {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isSupportedCurrency(stored)) return stored;
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_CURRENCY;
}

function getServerSnapshot(): SupportedCurrency {
  return DEFAULT_CURRENCY;
}

function writeCurrency(next: SupportedCurrency): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore write errors (private mode, quota, etc.)
  }
  // Notify subscribers in the same tab (storage event only fires cross-tab)
  listeners.forEach((listener) => listener());
}

interface CurrencyContextValue {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  currencies: readonly SupportedCurrency[];
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const currency = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setCurrency = useCallback((next: SupportedCurrency) => {
    writeCurrency(next);
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      currencies: SUPPORTED_CURRENCIES,
      symbol: CURRENCY_INFO[currency].symbol,
    }),
    [currency, setCurrency]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
