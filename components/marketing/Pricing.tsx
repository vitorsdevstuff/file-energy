"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { pricingData, teamPricingData, teamUserMultipliers, customPricingRates, currencyConversionRates } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUPPORTED_CURRENCIES, type SupportedCurrency } from "@/lib/g2pay";

// Currency symbols (no conversion rates needed - prices are pre-calculated)
const currencyInfo: Record<SupportedCurrency, { symbol: string; flag: string }> = {
  EUR: { symbol: "€", flag: "" },
  USD: { symbol: "$", flag: "" },
  AUD: { symbol: "A$", flag: "" },
  CAD: { symbol: "C$", flag: "" },
  JPY: { symbol: "¥", flag: "" },
  SEK: { symbol: "kr", flag: "" },
  PLN: { symbol: "zł", flag: "" },
  BGN: { symbol: "лв", flag: "" },
  DKK: { symbol: "kr", flag: "" },
  CZK: { symbol: "Kč", flag: "" },
  HUF: { symbol: "Ft", flag: "" },
  NZD: { symbol: "NZ$", flag: "" },
  NOK: { symbol: "kr", flag: "" },
  GBP: { symbol: "£", flag: "" },
  AED: { symbol: "د.إ", flag: "" },
  JOD: { symbol: "د.ا", flag: "" },
  KWD: { symbol: "د.ك", flag: "" },
  BHD: { symbol: ".د.ب", flag: "" },
  SAR: { symbol: "﷼", flag: "" },
  QAR: { symbol: "﷼", flag: "" },
  OMR: { symbol: "﷼", flag: "" },
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
  const [currency, setCurrency] = useState<SupportedCurrency>("EUR");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customPDFs, setCustomPDFs] = useState(5);
  const [customQuestions, setCustomQuestions] = useState(50);
  const [customSize, setCustomSize] = useState(10);
  const [apiAccess, setApiAccess] = useState(false);
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

  const calculateCustomPrice = () => {
    const rate = currencyConversionRates[currency] || 1;
    const perPDFPrice = customPricingRates.perPDFBase * rate;
    const perQuestionPrice = customPricingRates.perQuestionBase * rate;

    let pdfPrice = customPDFs * perPDFPrice;
    let questionPrice = customQuestions * perQuestionPrice;
    let sizePrice = 0;

    if (customSize <= 9.7) {
      sizePrice = customSize * customPricingRates.sizePrice.upTo9MB * rate;
    } else if (customSize <= 30) {
      sizePrice = (9.7 * customPricingRates.sizePrice.upTo9MB + (customSize - 9.7) * customPricingRates.sizePrice.upTo30MB) * rate;
    } else if (customSize <= 50) {
      sizePrice = (9.7 * customPricingRates.sizePrice.upTo9MB + 20.3 * customPricingRates.sizePrice.upTo30MB + (customSize - 30) * customPricingRates.sizePrice.upTo50MB) * rate;
    } else {
      sizePrice = (9.7 * customPricingRates.sizePrice.upTo9MB + 20.3 * customPricingRates.sizePrice.upTo30MB + 20 * customPricingRates.sizePrice.upTo50MB + (customSize - 50) * customPricingRates.sizePrice.upTo50MB) * rate;
    }

    let total = pdfPrice + questionPrice + sizePrice;
    if (apiAccess) total *= 1.1;

    return total;
  };

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
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {currencyInfo[currency].symbol}{calculateCustomPrice().toFixed(2)}
                </span>
              </div>

              {/* PDF Slider */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {customPDFs} PDFs
                </label>
                <input
                  type="range"
                  min="1"
                  max="300"
                  value={customPDFs}
                  onChange={(e) => setCustomPDFs(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary dark:bg-gray-700"
                />
              </div>

              {/* Questions Slider */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {customQuestions} Questions
                </label>
                <input
                  type="range"
                  min="10"
                  max="3000"
                  step="10"
                  value={customQuestions}
                  onChange={(e) => setCustomQuestions(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary dark:bg-gray-700"
                />
              </div>

              {/* Size Slider */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {customSize} MB/pdf
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={customSize}
                  onChange={(e) => setCustomSize(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary dark:bg-gray-700"
                />
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

              <Link href={`/checkout?custom=true&price=${calculateCustomPrice().toFixed(2)}&pdfs=${customPDFs}&questions=${customQuestions}&size=${customSize}&api=${apiAccess}&currency=${currency}`}>
                <Button className="w-full">Get Started</Button>
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
                    {currencyInfo[currency].symbol}{getPrice(plan)}
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
                    {currencyInfo[currency].symbol}{calculateTeamPrice(plan.basePrice, plan.title)}
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
