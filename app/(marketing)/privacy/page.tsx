"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
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
            Privacy Notice
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Effective Date: 10/09/2025
          </motion.p>
        </div>

        {/* Content */}
        <motion.div
          className="prose prose-lg dark:prose-invert max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-8 rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400">
              This Privacy Notice (also &quot;Notice&quot;) provides detailed information about the personal data processing practices followed by BRAINBOP LTD, registration No. 15835241, legal address: 50 Gilbert Road, Smethwick, England, B66 4PY (also &quot;Company&quot; or &quot;we&quot;). Here you will find information about the types of personal data being processed, respective purposes and legal bases, how personal data is protected, as well as other important information related to the processing of your personal data. Please review this document carefully to understand our practices related to personal data processing.
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              If you have any questions, contact us as indicated in the last section (&quot;CONTACT INFORMATION&quot;) of this document.
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              By using our services, you agree to the provisions stipulated by this Notice. For any inquiries, please contact us. If you disagree with anything stated in this document, please discontinue the use of our services.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Data Controller
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              For UK and Rest of World customers, the Data Controller is BRAINBOP LTD (UK, Reg. No. 15835241). For EEA customers, the Data Controller is БРЕЙНБОП ЕООД (Bulgaria, EIK 207653828). Both entities follow applicable data protection laws (UK GDPR and EU GDPR respectively).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Data Collection Sources
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We collect personal data from various sources, including direct interactions where you provide information, such as when creating an account or making purchases. Additionally, we collect data automatically through cookies and similar tracking technologies. We also obtain data from third-party service providers (e.g., payment processors), state authorities, and publicly available sources.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
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

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Purposes and Legal Bases for Processing
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We utilize your personal data to ensure you receive the highest quality experience with our services. The following outlines how and why we process your data:
            </p>
            <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-400">
              <li>Providing Services: To deliver the services you request, in accordance with our agreement with you.</li>
              <li>Setting Up and Managing Your Account: To establish and administer your user account, as it is essential for fulfilling our contractual obligations to you.</li>
              <li>Processing Orders: To process and manage your orders, as it is integral to our contractual obligations.</li>
              <li>Managing Transactions: To conduct and oversee transactions, in line with our agreement and legitimate interests.</li>
              <li>Complying with Laws: To adhere to legal and regulatory requirements, as it is a legal obligation.</li>
              <li>Engaging with You: To communicate with you, provide support, and deliver service-related information, which is essential for fulfilling our contractual obligations and safeguarding our legitimate interests.</li>
              <li>Managing Risks: To assess and manage risks and make informed business decisions, in accordance with our contractual obligations, legal requirements, and legitimate interests.</li>
              <li>Marketing and Personalization: We will send marketing communications only with your explicit consent, as required under the UK Privacy and Electronic Communications Regulations (PECR). You can withdraw your consent at any time.</li>
              <li>Troubleshooting: To identify and resolve technical issues with our website and services, as it is essential for fulfilling our contractual obligations.</li>
              <li>Preventing Fraud: To prevent fraud and misuse of our services, which is necessary for compliance with legal requirements and to protect our legitimate interests.</li>
              <li>Handling Disputes: To manage claims and resolve disputes, in line with our contractual obligations, legal requirements, and legitimate interests.</li>
              <li>Ensuring Security: To protect our information and assets, in line with our contractual obligations, legal requirements, and legitimate interests.</li>
              <li>Improving Services: To enhance and develop our services, in accordance with our legitimate interests.</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recipients of Personal Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We may share your personal data with trusted partners for the provision of our services, such as payment processors. Additionally, we may disclose your data to state authorities if required by law.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Data Retention
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We retain your personal data for as long as necessary to fulfill the purposes outlined in this Privacy Notice or as required by law. Specifically, we keep data to ensure compliance with legal obligations, such as anti-money laundering (AML) regulations, for a period typically up to 5 years. Additionally, in accordance with UK law (Limitation Act 1980), personal data may be retained for up to 6 years after the end of the business relationship to comply with legal requirements and defend potential claims.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Once your personal data no longer serves any legitimate purpose, we ensure it is securely deleted or anonymized to protect your privacy.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any questions or concerns about our data retention practices, please feel free to contact us.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              International Data Transfers
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your personal data may be transferred and processed outside the European Economic Area (EEA). When such transfers occur, we ensure compliance with data protection laws through appropriate safeguards such as Standard Contractual Clauses (SCC).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Security Measures
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We take the security and confidentiality of your personal data very seriously and implement a range of technical and organizational measures to protect it. These measures include advanced encryption techniques, strict access controls, and ongoing training for our employees on data protection practices.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              We also actively monitor the use of our services to detect and prevent any prohibited activities or violations of our policies. This includes the use of automated systems and manual reviews to ensure compliance with our Terms and Conditions and to protect against malicious activities such as uploading hate speech, offensive content, or any other prohibited materials.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              We encourage you to play a role in maintaining the security of your personal data. You can help by using strong, unique passwords and staying vigilant against potential online threats.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any questions or concerns about our security measures, please feel free to contact us. Your privacy and data security are of the utmost importance to us.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Please note that these rights are not absolute and may be subject to legal preconditions. Additionally, to protect your privacy and security, we may need to verify your identity before processing your request.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              To exercise any of these rights, please contact us using contact information provided in this Notice.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Automated Decisions and Profiling
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We do not make automated decisions with legal effects. However, profiling may be used to provide personalized content and recommendations.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Prohibited Content and Third-Party Consent
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              While our Privacy Notice primarily focuses on the handling of personal data, it is important to highlight our policies regarding prohibited content and third-party consent:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li>
                <strong>Prohibited Content:</strong> We strictly prohibit the uploading, creation, or distribution of any media that contains expressions of hate, abuse, offensive images or conduct, obscenity, pornography, or sexually explicit material. Any attempt to upload such content will result in immediate termination of your account and potential legal action.
              </li>
              <li>
                <strong>Third-Party Consent:</strong> If you upload a document or picture that includes a third-party individual, you must have obtained written authorization or consent from that person to depict them in the content. By uploading such content, you warrant that you have the necessary rights and permissions to do so, and you agree to indemnify the Company against any claims arising from unauthorized use of third-party content.
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400">
              These policies are designed to ensure the responsible use of our services and to protect the rights and privacy of all individuals. We encourage all users to adhere strictly to these guidelines.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Monitoring and Enforcement
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The Company actively monitors the use of our services to detect and prevent any prohibited activities or violations of our policies. This includes the use of automated systems and manual reviews to ensure compliance with our Terms and Conditions and to protect against malicious activities such as uploading hate speech, offensive content, or any other prohibited materials.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              If any prohibited activity is detected, we reserve the right to take appropriate action, including suspending or terminating user accounts and reporting unlawful activities to relevant authorities.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              By using our services, you acknowledge and agree to these monitoring practices and the associated consequences for violations.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Lodging a Complaint
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any concerns about our data processing activities, please do not hesitate to contact us. We are committed to addressing your concerns and ensuring your satisfaction. Additionally, you have the right to lodge a complaint with the supervisory authority if you feel that your data protection rights have been violated. If you are a UK resident, you may lodge a complaint with the Information Commissioner&apos;s Office (ICO). If you are an EEA resident, you may lodge a complaint with the Bulgarian Commission for Personal Data Protection (CPDP).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Changes to the Privacy Notice
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We may update this Privacy Notice to reflect changes in our practices. The updated version will be published on our website. Significant changes will be communicated to you separately through appropriate communication channels.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
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
