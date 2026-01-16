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
            Terms and Conditions
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
          <div className="space-y-8 rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to our website https://file.energy (referred to as the &quot;Website&quot;)!
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              For UK and ROW customers, services are provided by BRAINBOP LTD | 50 Gilbert Road, Smethwick, England, B66 4PY (15835241)
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              For EEA customers, services are provided by БРЕЙНБОП ЕООД | Bulgaria, Sofia (city), Triaditsa district, 48 Vitosha Blvd, Ground floor, 1000 Sofia (EIK 207653828) | support@file.energy
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              For UK and Rest of World customers, the contracting entity and service provider is BRAINBOP LTD (UK, Reg. No. 15835241). For EEA customers, the contracting entity and service provider is БРЕЙНБОП ЕООД (Bulgaria, EIK 207653828). These Terms and Conditions (referred to as the &quot;Terms&quot;) govern the contractual relationship between the applicable entity (referred to as &quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or the &quot;Company&quot;) and the users who utilize the services of the Company (referred to as &quot;you,&quot; &quot;your,&quot; or &quot;user&quot;). These Terms define the conditions under which our services are utilized.
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              These Terms are applicable to the use of the Website and the purchase of any products or services with us via the Website (referred to as &quot;Services&quot;). By accessing, using, or making purchases via our Website, you agree to be bound by these Terms, the Privacy Notice (also referred to as the &quot;Privacy Policy&quot;), and any other additional terms, conditions, and policies referenced here and/or available by hyperlink on the Website (hereinafter collectively referred to as the &quot;Terms of Use&quot;).
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              Please carefully read our Terms of Use before accessing, using, or obtaining any materials, information, products, or services. If you do not agree to any provisions of Terms of Use, then you may not use the Website or any of our services.
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              A binding contract is formed when you create an account and accept these Terms. If you use the Service without an account, a contract is formed when you first access any functionality after being presented with these Terms. If you do not accept these terms, do not create an account or use the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              1. Our Services
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our Website aims to provide you with an AI-driven platform designed to transform the way you interact with your documents. File Energy offers a range of services including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li>Chat with documents: Upload your document and start interacting with it immediately</li>
              <li>Visualize your data: Use our AI to present your data as a graph without hiring a data scientist</li>
              <li>Chat History: Keep track of your conversations with a simple and intuitive chat history</li>
              <li>API Integration: Integrate our API into your existing system to automate processes around your documents</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400">
              Our platform supports various file formats including PDF, CSV, and DOCX, allowing you to summarize, visualize, and analyze your documents efficiently.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              2. Eligibility Requirements
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access to our Website is available only to individuals who are 18 years of age or older. If the legal age of adulthood in your jurisdiction is attained at a later date, that age requirement will apply accordingly. If you are under the minimum age required by the laws of your country to access and use our Website or Services, you affirm that your legal guardian has reviewed and consents to these Terms on your behalf. Additionally, you confirm that you are not prohibited from using our Website and Services under any applicable laws.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              To be eligible to use and access to our Website and Content you must not be located, incorporated, otherwise established in, or resident of, or have business operations: 1) in jurisdiction where it would be illegal under applicable law to this Terms or 2) in any of the following jurisdictions: Afghanistan, Cuba, Iran, North Korea, Syria, Russian Federation, Belarus, Regions of Ukraine: Crimea, Donetsk and Luhansk, Myanmar (Burma), Central African Republic, China, Congo DR, Lebanon, Libya, Mali, Nicaragua, Somalia, Sudan, Venezuela, Yemen, Zimbabwe.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              3. Profile Registration
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You are permitted to use our Website, Services and Content solely for lawful purposes and in compliance with all applicable laws and regulations. In order to use our Services, you may need to create a user account and furnish us with precise and comprehensive details such as your first name, last name, country of residence and email address. During registration, we collect your first and last name and email. See our Privacy Notice for full details. It is your responsibility to safeguard the confidentiality of your account and password, and you agree to assume liability for all actions undertaken under your account.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              The contract between user and the Company is established when user registers on the Company&apos;s Website. Registration is free and involves completing a registration form, during which certain user profile data is stored in the Company&apos;s database.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              By creating an account on our Website, you consent to providing accurate information. You also agree to promptly update your account and other details, including email address and billing details (e.g., billing address) in your account, to facilitate transactions and ensure we can contact you when necessary. Payment card details are handled by our payment processor; we do not store full card numbers. Any information you provide during registration will be handled in accordance with our Privacy Policy. It&apos;s important to maintain the secrecy of your password.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              The Company reserves the right to decline user registrations based on valid and objective reasons. These reasons may include, but are not limited to, violation of the Terms of Use, implementation of fraud prevention measures, doubts about the user&apos;s identity, suspicion of spamming activities, uncertainty regarding the user&apos;s age, fraudulent behavior, or attempts to register in markets where the Company&apos;s services are unavailable.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              4. User Profile Policy
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You bear sole responsibility for all activities carried out under your profile. You agree not to utilize another user&apos;s profile, username, or password at any point, nor to disclose your password to any third party, or engage in any actions that could compromise the security of your profile. Promptly inform us of any unauthorized use of your profile.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              If we have valid reasons to suspect a violation of these Terms or if the registration information provided by you is believed to be untrue, inaccurate, outdated, or incomplete, we reserve the right to terminate your user profile and deny current or future access to any or all features.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              We disclaim any responsibility for any loss or damage incurred by you or any third party due to unauthorized access and/or use of your profile, or for any other reason.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              5. Data Collection, Storage, and Usage
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We adhere to strict data minimization principles, collecting and storing only essential information required for our services and legal compliance.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Data hosting locations and international transfer safeguards (e.g., SCCs) are set out in our Privacy Notice. We process personal data in accordance with applicable UK/EU data-protection law. Our secure SQL database contains:
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
              <li>Government ID numbers or copies of identification documents. We do collect account identifiers (e.g., name, email) required to provide the Service</li>
              <li>Payment card or bank account details</li>
              <li>Marketing preferences or loyalty program data</li>
              <li>User-uploaded documents or file contents</li>
              <li>Video surveillance data</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Document Processing and AI Integration
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              When you upload documents, their content is processed transiently to provide the Service and may be transmitted to our AI provider(s) acting as our data processor(s). We do not retain your documents after processing, except for short-lived caching strictly necessary to deliver the Service. See our Privacy Notice for details.
            </p>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fair Usage and Prohibited Content
            </h4>
            <p className="text-gray-600 dark:text-gray-400">We prohibit the use of our services for:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li>Uploading or processing any illegal content</li>
              <li>Academic dishonesty or plagiarism</li>
              <li>Attempting to reverse-engineer our systems</li>
              <li>Uploading content that infringes on copyrights or intellectual property rights</li>
              <li>Generating harmful or malicious content</li>
              <li>Uploading and creating any media containing expressions of hate, abuse, offensive images or conduct, obscenity, pornography, or sexually explicit material</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400">
              Fair Use: The Service includes usage limits. We may adjust limits with prior notice. Specific limits include reasonable usage of API calls, file uploads, and processing requests to ensure service availability for all users.
            </p>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Copyright Infringement Mitigation
            </h4>
            <p className="text-gray-600 dark:text-gray-400">To mitigate the risk of copyright infringement, we:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li>Clearly state in our terms that users must have the right to use any content they upload</li>
              <li>Do not store or retain uploaded documents after processing</li>
              <li>Provide insights and answers based on uploaded content without reproducing or distributing the original material</li>
              <li>Have a clear process for copyright holders to submit takedown notices</li>
              <li>Implement prompts to remind users about copyright responsibilities before uploads</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Document Upload Restrictions
            </h4>
            <p className="text-gray-600 dark:text-gray-400">To enhance security and prevent misuse, we are implementing:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li>File type restrictions to allow only common document formats (e.g., .pdf, .docx, .txt)</li>
              <li>File size limits to prevent system abuse</li>
              <li>Content scanning to flag potentially problematic uploads for review</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400">
              We&apos;re also exploring the implementation of a content classification system to automatically detect and block uploads of sensitive or inappropriate material.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              These measures reflect our commitment to responsible AI use, legal compliance, and the protection of our users&apos; privacy and intellectual property rights. We continuously refine our policies and technical safeguards to ensure the ethical use of our platform.
            </p>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confidentiality of User-Uploaded Information
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              We are committed to maintaining the confidentiality and security of all information uploaded by our users. We hereby affirm that any documents, data, or information you upload to our platform will not be shared, sold, or disclosed to any third parties, except as required by law or with your explicit consent. Your uploaded content is processed solely for the purpose of providing our AI-driven services and is not retained on our servers beyond the duration necessary for processing. We implement strict security measures to protect your information from unauthorized access or disclosure. By using our services, you acknowledge and agree that while we take all reasonable precautions to safeguard your data, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              6. Payment Policy
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All prices are inclusive of applicable VAT/sales taxes unless explicitly stated otherwise. Any additional fees will be shown before you place your order. We retain the right to adjust, suspend, or discontinue any Service at our discretion. We bear no responsibility for any losses or damages resulting from such alterations.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Payments must be executed through the designated payment methods available on the Website. By proceeding with a purchase, you affirm that you have the authority to utilize the chosen payment method. It is your responsibility to furnish accurate and comprehensive information necessary for the transaction, including billing address and payment particulars.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              For secure and reliable transactions, we enlist trusted payment processors to oversee transactions on our Website. Upon making a purchase, you grant us permission to share requisite information with these third-party payment processors to facilitate the transaction. We neither retain nor have access to your complete payment details.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              7. Refund Policy
            </h3>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              7.1 General Policy
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Unless otherwise specified below or required by applicable law, purchases made through our Website are final once the Service has been fully performed. The Company may provide refunds at its discretion, subject to our policies that may be published from time to time.
            </p>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              7.2 Statutory Right of Withdrawal
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              If you are a consumer in the UK/EEA, you have a 14-day right to cancel. If you request immediate access and we begin supplying the Service during the cancellation period, you acknowledge you may lose your right to cancel once the Service is fully performed, and we may deduct a pro-rata amount for use before cancellation.
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li>You have the right to withdraw from the contract within 14 calendar days without providing reasons</li>
              <li>The withdrawal period starts from the date of entering into contract when purchasing any packs</li>
              <li>For continuous services (such as credit packs), by signing up you expressly request immediate access</li>
              <li>If you exercise your right of withdrawal, we will deduct from your refund an amount proportionate to the service used before withdrawal</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              7.3 Refund Process
            </h4>
            <p className="text-gray-600 dark:text-gray-400">To request a refund:</p>
            <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-400">
              <li>Contact us via email at support@file.energy</li>
              <li>Include your:
                <ul className="list-disc pl-6">
                  <li>Name</li>
                  <li>Order number</li>
                  <li>Reason for refund</li>
                  <li>Any relevant details</li>
                </ul>
              </li>
              <li>We will respond within 10 Business Days</li>
              <li>Approved refunds will be processed via the original payment method</li>
              <li>Please allow 15 Business Days for processing (up to 1 month depending on payment provider)</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              8. Intellectual Property
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All information, data, text, graphics, images, software, code, metadata, links, audio and video files, online tools, and all other Content comprising the Website are the exclusive property of the Company or its licensors, unless explicitly stated otherwise. The Content is safeguarded by copyright laws and other applicable regulations.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Certain names, graphics, logos, icons, designs, words, titles, or phrases showcased on this Website may also be considered trade names, trademarks, or service marks registered elsewhere. The presence of these trademarks on the Website does not imply any authorization for their use has been extended to you. Any unauthorized utilization, reproduction, or alteration of trademarks and/or any of the Content contained herein may constitute a violation of applicable laws, as well as trademark and/or copyright statutes, and may result in legal repercussions.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              9. Restricted Use
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Company maintains the right to suspend or prohibit your access to the Services at any time and for any reason. Your usage of the Website and its Content is restricted to lawful purposes and adherence to the stated Terms. You are prohibited from using the Services to develop or offer competitive products or services. Additionally, reverse engineering of the Services is strictly prohibited. Reselling or redistributing the Services is also forbidden. Only one user is permitted to use the Services per registered account, and each user may only have one account.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Usage of the Service to infringe upon the intellectual property rights of others, including copyright, patent, or trademark rights, is not allowed. Violation of this provision may result in penalties, including legal action or a permanent ban from the Service.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              We retain the right to investigate complaints or reported violations of our Terms and to take any action we deem appropriate. This may include reporting any suspected unlawful activity to law enforcement officials, regulators, or other third parties, as well as disclosing any information necessary or appropriate to such persons or entities.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              10. Indemnifications
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              By accessing our Website you agree to defend, indemnify, and hold harmless the Company and any of its affiliates (if applicable) against any and all legal claims and demands, including reasonable attorney&apos;s fees, which may arise from or relate to your use or misuse of the Website or Content, your breach of these Terms, or your conduct or actions. You agree that the Company shall have the right to select its own legal counsel and may participate in its own defense if it wishes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              11. Disclaimer
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The information and any other Content available on the Website are provided on an &quot;as is&quot; and &quot;as available&quot; basis. The Company does not make any representations or warranties of any kind, whether express or implied, regarding the operation of this Website or the information, content, or materials available on it. You acknowledge and agree that your use of our Website is at your own discretion.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              12. Limitation of Liability
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Nothing in these Terms limits or excludes liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any rights which cannot be excluded under the Consumer Rights Act 2015. For consumers, we will provide the Service with reasonable care and skill. These Terms do not affect your statutory rights.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              To the fullest extent permitted by applicable law we (and our affiliates) shall not be liable to you or any third party for any lost profit or any indirect, consequential, exemplary, incidental, special, or punitive damages arising from these Terms or your use of, or inability to use, the Service (including its content), or third-party ads, even if we have been advised of the possibility of such damages. This includes, without limitation, any damages resulting from the user&apos;s reliance on any information obtained from the Company, as well as damages arising from mistakes, omissions, interruptions, deletion of files or email, errors, defects, viruses, delays in operation or transmission, or any failure of performance. Such damages may occur irrespective of whether they result from acts of God, communication failures, theft, destruction, fraud, or unauthorized access to the Company&apos;s records, programs, platforms, or services.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Your access to, and use of, the Service (including the content, and user content), and third-party ads are at your own discretion and risk, and you will be solely responsible for any damage to your computing system or loss of data resulting therefrom.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Regardless of anything to the contrary contained herein, you agree that the aggregate liability of the Company to you for any and all claims arising from the use of the app, content, service, or products, is limited to the amounts you have paid to the Company for access to and use of the service. The limitations of damages set forth above are fundamental elements of the basis of the terms between the Company and you.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              13. Modifications and Amendments
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The Company retains the right to occasionally modify, suspend, or cease this Website, Services and/or its Content without prior notice, at its sole discretion. It is your responsibility to regularly review these Terms. Your continued use of or access to our Website following any changes to these Terms indicates your acceptance of those changes. If you disagree with any provision of the Terms or become dissatisfied with the Website in any manner, your only recourse is to promptly discontinue use of the Website.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              14. Governing Law and Dispute Resolution
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              These Terms are governed by the laws of England and Wales. If you are a consumer resident in the EEA, you also benefit from any mandatory consumer protections of your country of residence. Nothing in these Terms shall deprive you of the protection afforded to consumers by the mandatory rules of law of the country in which you live.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              If you are residing in EEA or Switzerland, you may use the EU ODR platform located at{" "}
              <a href="http://ec.europa.eu/consumers/odr" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                http://ec.europa.eu/consumers/odr
              </a>{" "}
              to raise complaints.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              15. No Waiver
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              If we fail to enforce any provision of these Terms, such failure shall not constitute a waiver of any future enforcement of that provision or of any other provision. Waiver of any part or sub-part of these Terms will not constitute a waiver of any other part or sub-part.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              16. No Partnership
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You acknowledge that no joint venture, partnership, employment, or agency relationship exists between you and the Company as a result of these Terms or your access to and use of the Website.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              17. Entire Agreement
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              These Terms constitute the entire agreement between you and us, representing the complete and entire understanding of the parties regarding the subject matter of this agreement. This agreement supersedes any other agreement or understanding between the parties, whether written or oral.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              18. Severability
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              In the event that any term or provision of this agreement is held by a court of competent jurisdiction to be unenforceable, the remaining provisions of this agreement shall remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              19. Survival
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You agree that the provisions in sections 8, 9, 10, 11, 12, 14 herein shall survive for 10 (ten) years after any termination of your profile at our Website, agreements between us, or your access to the Services.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              20. Prohibited Content and Third-Party Consent
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You are strictly prohibited from uploading, creating, or distributing any media that contains expressions of hate, abuse, offensive images or conduct, obscenity, pornography, or sexually explicit material. Any attempt to upload such content will result in immediate termination of your account and potential legal action.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              If you upload a document or picture that includes a third-party individual, you must have obtained written authorization or consent from that person to depict them in the content. By uploading such content, you warrant that you have the necessary rights and permissions to do so, and you agree to indemnify the Company against any claims arising from unauthorized use of third-party content.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              The Company actively monitors the use of our services to detect and prevent any prohibited activities or violations of these Terms. We employ automated systems and manual reviews to ensure compliance with our policies. If any prohibited activity is detected, we reserve the right to take appropriate action, including suspending or terminating user accounts and reporting unlawful activities to relevant authorities.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              21. Contact Us
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Should you have any questions or concerns about these Terms, please contact us at{" "}
              <a href="mailto:hello@file.energy" className="text-primary hover:underline">
                hello@file.energy
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
