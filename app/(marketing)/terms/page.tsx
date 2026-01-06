"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
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
            Legal
          </motion.p>
          <motion.h1
            className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Last updated: January 2025
          </motion.p>
        </div>

        {/* Content */}
        <motion.div
          className="prose prose-lg dark:prose-invert max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400">
              At File.energy, we take your privacy seriously. This privacy policy explains how we collect, use, and protect your personal information.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Information We Collect
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We collect personal information that you provide to us such as your name, email address, and phone number when you submit a contact form or sign up for our newsletter. We also collect information about your visit to our website, including your IP address, browser type, and the pages you visit.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Use of Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We use the information we collect to provide you with our services, respond to your inquiries, and send you marketing communications. We may also use your information to improve our website and to comply with legal obligations.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Protection of Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We take appropriate measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. We use industry-standard security measures such as SSL encryption to protect your data during transmission.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Disclosure of Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We do not share your personal information with third parties except as required by law or as necessary to provide our services. We may share your information with our trusted partners who assist us in operating our website or providing our services.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Cookies
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We use cookies and other similar technologies to collect information about your visit to our website. You may disable cookies in your browser settings, but please note that some features of our website may not function properly without cookies.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Your Rights
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You have the right to access, update, and delete your personal information. You may also object to our use of your personal information for marketing purposes. If you wish to exercise any of these rights, please contact us using the information below.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Updates to Terms & Conditions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We may update these terms and conditions from time to time. We will notify you of any changes by posting the new terms on our website. You are advised to review these terms periodically for any changes.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Contact Us
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any questions or concerns about these terms and conditions or our use of your personal information, please contact us at{" "}
              <a
                href="mailto:support@file.energy"
                className="text-primary hover:underline"
              >
                support@file.energy
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
