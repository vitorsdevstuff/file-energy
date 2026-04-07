"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CURRENCY_INFO, type SupportedCurrency } from "@/lib/g2pay";
import { useCurrency } from "@/lib/currency-context";
import { cn } from "@/lib/utils";

interface CurrencySwitcherProps {
  className?: string;
  align?: "start" | "center" | "end";
}

export function CurrencySwitcher({
  className,
  align = "end",
}: CurrencySwitcherProps) {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Select currency"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800",
            className
          )}
        >
          <span className="text-gray-500 dark:text-gray-400">
            {CURRENCY_INFO[currency].symbol}
          </span>
          <span>{currency}</span>
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="max-h-80 w-56 overflow-y-auto">
        {currencies.map((curr: SupportedCurrency) => {
          const isActive = curr === currency;
          return (
            <DropdownMenuItem
              key={curr}
              onSelect={() => setCurrency(curr)}
              className={cn(
                "flex items-center justify-between gap-2",
                isActive && "bg-primary/10 text-primary focus:bg-primary/15"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex w-8 justify-center text-gray-500 dark:text-gray-400">
                  {CURRENCY_INFO[curr].symbol}
                </span>
                <span className="font-medium">{curr}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {CURRENCY_INFO[curr].label}
                </span>
              </span>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
