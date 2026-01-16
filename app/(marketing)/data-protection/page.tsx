"use client";

import { motion } from "framer-motion";

export default function DataProtectionPage() {
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
            Data Protection Policy
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Last updated: 10/09/2025
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
              This Data Protection Policy provides detailed information about the personal data processing practices followed by BRAINBOP LTD, registration No. 15835241, legal address: 50 Gilbert Road, Smethwick, England, B66 4PY (also &quot;Company&quot; or &quot;we&quot;).
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Data Controller
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              For UK and Rest of World customers, the Data Controller is BRAINBOP LTD (UK, Reg. No. 15835241). For EEA customers, the Data Controller is БРЕЙНБОП ЕООД (Bulgaria, EIK 207653828). Both entities follow applicable data protection laws (UK GDPR and EU GDPR respectively).
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Data Collection Sources
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We collect personal data from various sources, including direct interactions where you provide information, such as when creating an account or making purchases. Additionally, we collect data automatically through cookies and similar tracking technologies. We also obtain data from third-party service providers (e.g., payment processors), state authorities, and publicly available sources.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Data Collection and Storage
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We adhere to strict data minimization principles, collecting and storing only essential information required for our services and legal compliance.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Our secure SQL database is hosted by Hostinger servers. If personal data is transferred outside the UK/EEA, we ensure compliance through Standard Contractual Clauses (SCCs). Our database contains:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li>User Account Data: Basic account information and encrypted passwords.</li>
              <li>Contact Information: Email addresses and phone numbers (if provided).</li>
              <li>Technical Data: IP addresses, device types, and browser details for security purposes.</li>
              <li>Transaction Data: Necessary order and subscription details for billing.</li>
              <li>User Support and Communication Data: Stored securely and retained only as needed.</li>
            </ul>
            <p className="mt-4 text-gray-600 dark:text-gray-400">We do not collect or store:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li>Photos, avatars, or detailed workplace information</li>
              <li>Full names, birthdates, or identification documents</li>
              <li>Payment card or bank account details</li>
              <li>Marketing preferences or loyalty program data</li>
              <li>User-uploaded documents or file contents</li>
              <li>Video surveillance data</li>
            </ul>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Data Retention
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We retain your personal data for as long as necessary to fulfill the purposes outlined in this Policy or as required by law. Specifically, we keep data to ensure compliance with legal obligations, such as anti-money laundering (AML) regulations, for a period typically up to 5 years. Additionally, in accordance with UK law (Limitation Act 1980), personal data may be retained for up to 6 years after the end of the business relationship to comply with legal requirements and defend potential claims.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              International Data Transfers
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your personal data may be transferred and processed outside the European Economic Area (EEA). When such transfers occur, we ensure compliance with data protection laws through appropriate safeguards such as Standard Contractual Clauses (SCC).
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Security Measures
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We take the security and confidentiality of your personal data very seriously and implement a range of technical and organizational measures to protect it. These measures include advanced encryption techniques, strict access controls, and ongoing training for our employees on data protection practices.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Data Subject Rights
            </h3>
            <p className="text-gray-600 dark:text-gray-400">You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li><strong>Access:</strong> You can request access to your data and obtain a copy of it.</li>
              <li><strong>Rectification:</strong> If your data is inaccurate or incomplete, you have the right to correct it.</li>
              <li><strong>Erasure:</strong> Under certain conditions, you may request the deletion of your data.</li>
              <li><strong>Restriction:</strong> You can request that we limit the processing of your data in specific situations.</li>
              <li><strong>Objection:</strong> You have the right to object to certain types of processing, such as direct marketing.</li>
              <li><strong>Portability:</strong> You can receive your data in a commonly used and machine-readable format and transfer it to another controller.</li>
              <li><strong>Withdrawal of Consent:</strong> If you have given consent for the processing of your data, you can withdraw it at any time.</li>
            </ul>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Lodging a Complaint
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any concerns about our data processing activities, please do not hesitate to contact us. Additionally, you have the right to lodge a complaint with the supervisory authority if you feel that your data protection rights have been violated. If you are a UK resident, you may lodge a complaint with the Information Commissioner&apos;s Office (ICO). If you are an EEA resident, you may lodge a complaint with the Bulgarian Commission for Personal Data Protection (CPDP).
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
              Contact Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              For any questions, contact us at:{" "}
              <a href="mailto:hello@file.energy" className="text-primary hover:underline">
                hello@file.energy
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
