import { Pricing } from "@/components/marketing/Pricing";
import { FAQ } from "@/components/marketing/FAQ";
import { CTA } from "@/components/marketing/CTA";

export const metadata = {
  title: "Pricing - File.energy",
  description:
    "Simple, transparent pricing for File.energy. Choose the plan that fits your document analysis needs.",
};

export default function PricingPage() {
  return (
    <div className="pt-20">
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  );
}
