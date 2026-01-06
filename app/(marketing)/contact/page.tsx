"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Send, Building2, Globe } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent successfully! We'll get back to you soon.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <motion.p
            className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Contact Us
          </motion.p>
          <motion.h1
            className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Get in touch
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Have questions? We&apos;d love to hear from you. Send us a message
            and we&apos;ll respond as soon as possible.
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <Input placeholder="John" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <Input placeholder="Doe" required />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <Input type="email" placeholder="john@example.com" required />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subject
                </label>
                <Input placeholder="How can we help?" required />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Your message..."
                  required
                  className="flex w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-gray-500"
                />
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="flex flex-col justify-center space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                  Email
                </h3>
                <a
                  href="mailto:support@file.energy"
                  className="text-primary hover:underline"
                >
                  support@file.energy
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                  UK & ROW Office
                </h3>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  BRAINBOP LTD
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  50 Gilbert Road, Smethwick
                  <br />
                  England, B66 4PY
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Company No: 15835241
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                  EEA Office
                </h3>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  БРЕЙНБОП ЕООД
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  48 Vitosha Blvd, Ground floor
                  <br />
                  Triaditsa district, 1000 Sofia
                  <br />
                  Bulgaria
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  EIK: 207653828
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                  Service Coverage
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  UK, EEA, and Rest of World
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
