// Custom Plan pricing logic — shared between the Pricing page and the admin
// "Create transaction" form. Distribution and rates derive from the Test Pack
// baseline (€2.75 / 5 PDFs / 50 questions / 10 MB), see customPricingRates in
// lib/data.ts.

import {
  customPricingRates,
  currencyConversionRates,
} from "@/lib/data";

export const CUSTOM_PLAN_DEFAULTS = {
  defaultSizeMB: 10, // 10 MB/pdf included by default
  minPDFs: 1, // minimum 1 PDF
  minQuestions: 10, // minimum 10 questions
  apiMultiplier: 1.1, // +10% for API access
  fallbackBudget: 3, // sensible default for the input
} as const;

export type CustomPriorityKey = "pdfs" | "size" | "questions";

// Budget weights match Test Pack allocation: 40% PDFs, 35% Questions, 25% Size.
const WEIGHTS: Record<CustomPriorityKey, number> = {
  pdfs: 0.4,
  questions: 0.35,
  size: 0.25,
};

export type CustomPlanResult = {
  pdfs: number;
  questions: number;
  pdfSize: number; // MB/pdf
  basePriceEUR: number;
  // Per-unit rates in the chosen currency, useful for UI hints.
  perPDF: number;
  perQuestion: number;
  perMB: number;
};

export type CustomPlanParams = {
  /** Budget in the user-selected currency */
  budget: number;
  /** Currency code (EUR / USD / GBP / …) */
  currency: string;
  /** Selected priorities; empty array = "balance" (40/35/25 split). */
  priorities: CustomPriorityKey[];
  /** Whether API access is enabled (+10% to the total). */
  apiAccess?: boolean;
};

/**
 * Given a budget, currency, and priorities, compute how many PDFs / Questions /
 * MB-per-pdf the user gets — identical to the Pricing page.
 */
export function calculateCustomPlan({
  budget,
  currency,
  priorities,
  apiAccess = false,
}: CustomPlanParams): CustomPlanResult {
  const rate = currencyConversionRates[currency] || 1;
  const perPDF = customPricingRates.perPDFBase * rate;
  const perQuestion = customPricingRates.perQuestionBase * rate;
  const perMB = customPricingRates.perMBBase * rate;

  // Convert budget to EUR base, account for API surcharge
  const budgetEUR = budget / rate;
  const basePriceEUR = apiAccess
    ? budgetEUR / CUSTOM_PLAN_DEFAULTS.apiMultiplier
    : budgetEUR;

  // In "balance" mode (no priorities picked), the full 40/35/25 split applies.
  // In "custom" mode, the chosen subset gets a share; unselected resources
  // fall back to their minimum value.
  const activeKeys: CustomPriorityKey[] =
    priorities.length === 0
      ? ["pdfs", "size", "questions"]
      : priorities;

  const selectedWeightSum = activeKeys.reduce(
    (sum, key) => sum + WEIGHTS[key],
    0
  );

  const shareFor = (key: CustomPriorityKey) =>
    activeKeys.includes(key)
      ? basePriceEUR * (WEIGHTS[key] / selectedWeightSum)
      : 0;

  // PDFs
  const pdfsBudgetEUR = shareFor("pdfs");
  const pdfs = activeKeys.includes("pdfs")
    ? Math.max(
        CUSTOM_PLAN_DEFAULTS.minPDFs,
        Math.floor(pdfsBudgetEUR / customPricingRates.perPDFBase)
      )
    : CUSTOM_PLAN_DEFAULTS.minPDFs;

  // Document size (10 MB included; extra MB costs €0.06875)
  const sizeBudgetEUR = shareFor("size");
  const pdfSize = activeKeys.includes("size")
    ? Math.max(
        CUSTOM_PLAN_DEFAULTS.defaultSizeMB,
        CUSTOM_PLAN_DEFAULTS.defaultSizeMB +
          Math.floor(sizeBudgetEUR / customPricingRates.perMBBase)
      )
    : CUSTOM_PLAN_DEFAULTS.defaultSizeMB;

  // Questions
  const questionsBudgetEUR = shareFor("questions");
  const questions = activeKeys.includes("questions")
    ? Math.max(
        CUSTOM_PLAN_DEFAULTS.minQuestions,
        Math.floor(questionsBudgetEUR / customPricingRates.perQuestionBase)
      )
    : CUSTOM_PLAN_DEFAULTS.minQuestions;

  return {
    pdfs,
    questions,
    pdfSize,
    basePriceEUR,
    perPDF,
    perQuestion,
    perMB,
  };
}
