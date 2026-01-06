"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { pricingData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUPPORTED_CURRENCIES, type SupportedCurrency } from "@/lib/g2pay";

// Currency symbols and conversion rates (approximate)
const currencyInfo: Record<SupportedCurrency, { symbol: string; rate: number }> = {
  EUR: { symbol: "€", rate: 0.92 },
  USD: { symbol: "$", rate: 1 },
  AUD: { symbol: "A$", rate: 1.53 },
  CAD: { symbol: "C$", rate: 1.36 },
  JPY: { symbol: "¥", rate: 149 },
  SEK: { symbol: "kr", rate: 10.5 },
  PLN: { symbol: "zł", rate: 4.0 },
  BGN: { symbol: "лв", rate: 1.8 },
  DKK: { symbol: "kr", rate: 6.9 },
  CZK: { symbol: "Kč", rate: 23 },
  HUF: { symbol: "Ft", rate: 360 },
  NZD: { symbol: "NZ$", rate: 1.65 },
  NOK: { symbol: "kr", rate: 10.7 },
  GBP: { symbol: "£", rate: 0.79 },
  AED: { symbol: "د.إ", rate: 3.67 },
  JOD: { symbol: "د.ا", rate: 0.71 },
  KWD: { symbol: "د.ك", rate: 0.31 },
  BHD: { symbol: ".د.ب", rate: 0.38 },
  SAR: { symbol: "﷼", rate: 3.75 },
  QAR: { symbol: "﷼", rate: 3.64 },
  OMR: { symbol: "﷼", rate: 0.38 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

interface PricingProps {
  showHeader?: boolean;
}

export function Pricing({ showHeader = true }: PricingProps) {
  const [currency, setCurrency] = useState<SupportedCurrency>("USD");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const formatPrice = (usdPrice: string) => {
    const price = parseFloat(usdPrice) * currencyInfo[currency].rate;
    // For JPY and HUF, don't show decimals
    if (currency === "JPY" || currency === "HUF") {
      return Math.round(price).toLocaleString();
    }
    return price.toFixed(2);
  };

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        {showHeader && (
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <motion.p
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Pricing
            </motion.p>
            <motion.h2
              className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Choose the right plan for you
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Simple, transparent pricing that grows with your needs
            </motion.p>

            {/* Currency Selector */}
            <motion.div
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <span>{currencyInfo[currency].symbol}</span>
                  <span>{currency}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showCurrencyDropdown && (
                  <div className="absolute top-full left-0 z-50 mt-2 max-h-60 w-40 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {SUPPORTED_CURRENCIES.map((curr) => (
                      <button
                        key={curr}
                        onClick={() => {
                          setCurrency(curr);
                          setShowCurrencyDropdown(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700",
                          curr === currency
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        <span className="w-8">{currencyInfo[curr].symbol}</span>
                        <span>{curr}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Pricing Cards */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {pricingData.map((plan) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-8 transition-all dark:bg-gray-900",
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary"
                  : "border-gray-100 hover:border-gray-200 dark:border-gray-800"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {plan.title}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {currencyInfo[currency].symbol}{formatPrice(plan.priceMonthly)}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.priceList.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Methods */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Safe & secure payment
          </span>
          <div className="flex items-center gap-4">
            <Image
              src="/images/master-card.png"
              alt="Mastercard"
              width={60}
              height={40}
              className="h-8 w-auto"
            />
            <Image
              src="/images/visa.png"
              alt="Visa"
              width={60}
              height={40}
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
