"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { faqData } from "@/lib/data";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(1);

  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.p
            className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            FAQ
          </motion.p>
          <motion.h1
            className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Everything you need to know about File.energy
          </motion.p>
        </div>

        {/* Search */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search questions..."
              className="pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <button
                className="flex w-full items-center justify-between p-6 text-left"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              >
                <span className="pr-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openId === faq.id && (
                <div className="border-t border-gray-100 px-6 pb-6 pt-4 dark:border-gray-800">
                  <p className="text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}

          {filteredFAQs.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No questions found matching your search.
              </p>
            </div>
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="mt-16 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Still have questions?
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Can&apos;t find the answer you&apos;re looking for? Our support team
            is here to help.
          </p>
          <Link href="/contact">
            <Button>Contact Support</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
