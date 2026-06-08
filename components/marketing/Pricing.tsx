"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { pricingData, teamPricingData, teamUserMultipliers, customPricingRates, currencyConversionRates } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCY_INFO } from "@/lib/g2pay";
import { CurrencySwitcher } from "@/components/shared/CurrencySwitcher";
import { useCurrency } from "@/lib/currency-context";
import {
  calculateCustomPlan,
  CUSTOM_PLAN_DEFAULTS,
  type CustomPriorityKey,
} from "@/lib/custom-plan";

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
  // hidden: { opacity: 0, y: 30 },
  hidden: { opacity: 1, y: 30 },
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
  const { currency } = useCurrency();
  const currencySymbol = CURRENCY_INFO[currency].symbol;
  const [isCustom, setIsCustom] = useState(false);
  const [customBudget, setCustomBudget] = useState<number | string>(
    CUSTOM_PLAN_DEFAULTS.fallbackBudget
  );
  const [apiAccess, setApiAccess] = useState(false);
  const [priorities, setPriorities] = useState<CustomPriorityKey[]>([]);
  // "balance" = default Test Pack distribution (40/35/25). Switching to any specific
  // priority turns this off; clearing all priorities re-enables it.
  const mode: "balance" | "custom" = priorities.length === 0 ? "balance" : "custom";
  const [teamUserCounts, setTeamUserCounts] = useState<Record<string, number>>({
    Basic: 1,
    Intermediate: 1,
    Advanced: 1,
    Professional: 1,
  });

  const getPrice = (plan: typeof pricingData[0]) => {
    const priceObj = plan.priceMonthly as Record<string, string>;
    return priceObj[currency] || priceObj["EUR"];
  };

  const togglePriority = (key: CustomPriorityKey) => {
    setPriorities((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const switchToBalance = () => setPriorities([]);

  const customBudgetNumber = Number(customBudget) || 0;
  const {
    pdfs: customPDFs,
    questions: customQuestions,
    pdfSize: customSize,
    perPDF,
    perQuestion,
    perMB,
  } = calculateCustomPlan({
    budget: customBudgetNumber,
    currency,
    priorities,
    apiAccess,
  });

  const activeKeys: CustomPriorityKey[] =
    mode === "balance" ? ["pdfs", "size", "questions"] : priorities;

  const calculateTeamPrice = (basePrice: Record<string, number>, planTitle: string) => {
    const userCount = teamUserCounts[planTitle] || 1;
    const price = basePrice[currency] || basePrice["EUR"];
    const multiplier = teamUserMultipliers[userCount as keyof typeof teamUserMultipliers] || 1;
    return (price * multiplier).toFixed(2);
  };

  const calculateTeamDocuments = (baseDocuments: number, planTitle: string) => {
    return Math.floor(baseDocuments * (teamUserCounts[planTitle] || 1));
  };

  const calculateTeamQuestions = (baseQuestions: number, planTitle: string) => {
    return Math.floor(baseQuestions * (teamUserCounts[planTitle] || 1));
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
              <CurrencySwitcher align="center" />
            </motion.div>

            {/* Preset/Custom Toggle */}
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <label className="relative inline-flex cursor-pointer items-center">
                <span className={cn(
                  "mr-3 text-sm font-semibold",
                  !isCustom ? "text-primary" : "text-gray-500 dark:text-gray-400"
                )}>
                  Preset Packs
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isCustom}
                    onChange={() => setIsCustom(!isCustom)}
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-primary dark:bg-gray-700"></div>
                  <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
                </div>
                <span className={cn(
                  "ml-3 text-sm font-semibold",
                  isCustom ? "text-primary" : "text-gray-500 dark:text-gray-400"
                )}>
                  Custom Pack
                </span>
              </label>
            </motion.div>
          </div>
        )}

        {/* Custom Pack */}
        {isCustom ? (
          <motion.div
            className="mx-auto max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Custom Plan
              </h3>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                Set your budget — we'll show you what you get
              </p>

              {/* Budget Input */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={customBudget}
                    onChange={(e) => setCustomBudget(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Priorities */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  What matters most to you?
                </label>
                <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Balance</span> uses the standard 40 / 35 / 25 split (matches Test Pack). Pick specific options to override it.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {/* Balance — radio-style, default selected */}
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                      mode === "balance"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white hover:border-primary/50 dark:border-gray-700 dark:bg-gray-800"
                    )}
                    onClick={(e) => {
                      // Prevent default checkbox/radio behavior — we handle state manually
                      e.preventDefault();
                      switchToBalance();
                    }}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2",
                        mode === "balance"
                          ? "border-primary"
                          : "border-gray-300 dark:border-gray-600"
                      )}
                    >
                      {mode === "balance" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Balance
                        </span>
                        {mode === "balance" && (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        40% PDFs · 35% Questions · 25% Size
                      </p>
                    </div>
                  </label>

                  {/* Specific priorities — multi-select */}
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                      priorities.includes("pdfs")
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white hover:border-primary/50 dark:border-gray-700 dark:bg-gray-800"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={priorities.includes("pdfs")}
                      onChange={() => togglePriority("pdfs")}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        PDFs (more documents)
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {currencySymbol}{perPDF.toFixed(2)} per extra PDF
                      </p>
                    </div>
                  </label>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                      priorities.includes("size")
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white hover:border-primary/50 dark:border-gray-700 dark:bg-gray-800"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={priorities.includes("size")}
                      onChange={() => togglePriority("size")}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Document size (bigger files)
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        10 MB included · {currencySymbol}{perMB.toFixed(2)} per extra MB
                      </p>
                    </div>
                  </label>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                      priorities.includes("questions")
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white hover:border-primary/50 dark:border-gray-700 dark:bg-gray-800"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={priorities.includes("questions")}
                      onChange={() => togglePriority("questions")}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Questions (more queries)
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        10 included · {currencySymbol}{perQuestion.toFixed(2)} per extra question
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Info Block: what the user gets */}
              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  You'll get:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      PDFs
                      {activeKeys.includes("pdfs") && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                          {mode === "balance" ? "Included" : "Priority"}
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {customPDFs} {customPDFs === 1 ? 'document' : 'documents'}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      Document size
                      {activeKeys.includes("size") && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                          {mode === "balance" ? "Included" : "Priority"}
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {customSize} MB/pdf
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      Questions
                      {activeKeys.includes("questions") && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                          {mode === "balance" ? "Included" : "Priority"}
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {customQuestions} questions
                    </span>
                  </li>
                </ul>
                <div className="mt-3 border-t border-primary/20 pt-3 text-xs text-gray-600 dark:text-gray-400">
                  {mode === "balance" ? (
                    <p>Standard 40 / 35 / 25 split — matches the Test Pack.</p>
                  ) : (
                    <p>Selected priorities get their share, scaled to the chosen subset.</p>
                  )}
                </div>
              </div>

              {/* API Access Checkbox */}
              <div className="mb-8">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={apiAccess}
                    onChange={(e) => setApiAccess(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    API Access (+10%)
                  </span>
                </label>
              </div>

              <Link
                href={`/checkout?custom=true&price=${customBudgetNumber.toFixed(2)}&pdfs=${customPDFs}&questions=${customQuestions}&size=${customSize}&api=${apiAccess}&currency=${currency}`}
              >
                <Button className="w-full" disabled={customBudgetNumber <= 0}>
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Pricing Cards */
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
                    {currencySymbol}{getPrice(plan)}
                  </span>
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

              <Link href={`/checkout?plan=${plan.id}&currency=${currency}`}>
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
        )}

        {/* Team Pricing Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Buying for a team?
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {teamPricingData.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {plan.title}
                </h3>
                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currencySymbol}{calculateTeamPrice(plan.basePrice, plan.title)}
                  </span>
                </div>

                {/* User Count Selector */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Number of Users:
                  </label>
                  <select
                    value={teamUserCounts[plan.title] || 1}
                    onChange={(e) => setTeamUserCounts(prev => ({
                      ...prev,
                      [plan.title]: Number(e.target.value)
                    }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <ul className="mb-6 space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {calculateTeamDocuments(plan.baseDocuments, plan.title)} Documents
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Max document size: {plan.maxSize}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {calculateTeamQuestions(plan.baseQuestions, plan.title)} document questions
                    </span>
                  </li>
                </ul>

                <Link href={`/checkout?team=${plan.title}&users=${teamUserCounts[plan.title] || 1}&documents=${calculateTeamDocuments(plan.baseDocuments, plan.title)}&questions=${calculateTeamQuestions(plan.baseQuestions, plan.title)}&price=${calculateTeamPrice(plan.basePrice, plan.title)}&currency=${currency}`}>
                  <Button variant="outline" className="w-full">
                    Buy
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Information Block */}
        <motion.div
          className="mx-auto mt-12 max-w-2xl rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Pricing Information
          </h4>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            All prices shown are final and include applicable VAT or sales tax, calculated based on your location.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Each plan is a one-time purchase.<br />
            No subscriptions or recurring charges apply.
          </p>
        </motion.div>

        {/* Payment Methods */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
