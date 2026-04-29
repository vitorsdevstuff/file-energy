// Static data for marketing pages - migrated from file.landing

export const menuData = {
  logoLight: "/images/logo.svg",
  logoDark: "/images/logo-light.svg",
  menuContent: [
    { id: 1, title: "Home", href: "/", newTab: false },
    { id: 2, title: "Pricing", href: "/pricing", newTab: false },
    { id: 3, title: "Playground", href: "/playground", newTab: false },
    { id: 4, title: "Contact", href: "/contact", newTab: false },
  ],
};

export const clientData = [
  { id: 1, imageLight: "/images/google.svg", imageDark: "/images/clients/group-dark.svg" },
  { id: 2, imageLight: "/images/zapier.svg", imageDark: "/images/clients/infinity-dark.svg" },
  { id: 3, imageLight: "/images/hubspot.svg", imageDark: "/images/clients/artifact-dark.svg" },
  { id: 4, imageLight: "/images/trello.svg", imageDark: "/images/clients/caudile-dark.svg" },
  { id: 5, imageLight: "/images/salesforce.svg", imageDark: "/images/clients/axeptio-dark.svg" },
  { id: 6, imageLight: "/images/slack.svg", imageDark: "/images/clients/mfinity-dark.svg" },
];

export const counterData = [
  { id: 1, number: ".PDF", rightIcon: "K+", text: "Summary" },
  { id: 2, number: ".CSV", rightIcon: "K+", text: "Visualisation" },
  { id: 3, number: ".DOCX", rightIcon: "K+", text: "Analysis Report" },
];

export const faqData = [
  {
    id: 1,
    type: ["general", "getting started"],
    question: "What is File.energy?",
    answer:
      "File.energy is an AI-powered platform that helps you manage your documents more efficiently by allowing you to chat with your files and extract valuable insights quickly.",
  },
  {
    id: 2,
    type: ["general", "features"],
    question: "What types of files does File.energy support?",
    answer:
      "File.energy supports a wide range of file types, including PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, and CSV.",
  },
  {
    id: 3,
    type: ["general", "security"],
    question: "Is my data secure with File.energy?",
    answer:
      "Yes, at File.energy, we take data security seriously. We use the latest encryption and compliance measures to ensure your information is protected at all times.",
  },
  {
    id: 4,
    type: ["general", "pricing"],
    question: "How much does File.energy cost?",
    answer:
      "We offer a variety of pricing plans to suit different needs. Please visit our pricing page for more information on our current plans and pricing.",
  },
  {
    id: 5,
    type: ["getting started", "features"],
    question: "How do I get started with File.energy?",
    answer:
      "Getting started with File.energy is easy. Simply sign up for an account, upload your files, and start chatting with your documents right away.",
  },
];

export const testimonialData = [
  {
    id: 1,
    testimonial:
      "File.Energy has revolutionized the way I handle my research papers. It's like having an intelligent assistant who understands exactly what I need from my documents. A game changer!",
    author: { name: "Dr. Emily Tran", designation: "Research Scientist" },
  },
  {
    id: 2,
    testimonial:
      "As a busy professional, finding time for thorough document analysis is challenging. File.Energy has made it possible for me to get the insights I need without spending hours on paperwork.",
    author: { name: "Mark Robertson", designation: "Business Analyst" },
  },
  {
    id: 3,
    testimonial:
      "I was skeptical about how much an AI tool could really help with document management, but File.Energy has exceeded my expectations. It's intuitive, efficient, and incredibly powerful.",
    author: { name: "Sarah Johnson", designation: "PhD Candidate" },
  },
  {
    id: 4,
    testimonial:
      "Using File.Energy has allowed our team to decrease our project turnaround times dramatically. The AI's ability to interact with documents and extract relevant information is unmatched.",
    author: { name: "Carlos Mendez", designation: "Project Manager" },
  },
  {
    id: 5,
    testimonial:
      "I recommend File.Energy to anyone who feels overwhelmed by the amount of reading required in their studies or work. It enhances your understanding by focusing on what's important.",
    author: { name: "Jessica Li", designation: "Graduate Student" },
  },
];

export const coreFeatures = [
  {
    id: 1,
    title: "Chat with documents",
    iconLight: "/images/payment/invoice.svg",
    iconDark: "/images/payment/invoice-dark.svg",
    desc: "Upload your document then start interacting with it immediately",
  },
  {
    id: 2,
    title: "Visualise your data",
    iconLight: "/images/payment/insight.svg",
    iconDark: "/images/payment/insight-dark.svg",
    desc: "Instead of hiring a data scientist, you can use our AI to present your data as a graph",
  },
  {
    id: 3,
    title: "Chat History",
    iconLight: "/images/payment/inventory.svg",
    iconDark: "/images/payment/inventory-dark.svg",
    desc: "Simple and intuitive chat history to keep track of your conversations",
  },
  {
    id: 4,
    title: "API Integration",
    iconLight: "/images/api.png",
    iconDark: "/images/payment/expens-dark.svg",
    desc: "Integrate our API into your existing system to automate processes around your documents",
    new: true,
  },
];

// Pricing data with EUR as base currency and pre-calculated prices for all currencies
export const pricingData = [
  {
    id: 1,
    title: "Test",
    priceMonthly: {
      EUR: "2.75",
      USD: "2.99",
      GBP: "2.36",
      AUD: "4.59",
      NZD: "5.09",
      CHF: "2.64",
      PLN: "12.20",
      CZK: "72.45",
      HUF: "1188",
      AED: "10.98",
    },
    priceList: [
      { name: "5 Documents" },
      { name: "Max document size: 10MB/pdf" },
      { name: "50 document questions" },
    ],
  },
  {
    id: 2,
    title: "Basic",
    priceMonthly: {
      EUR: "7.99",
      USD: "8.70",
      GBP: "6.86",
      AUD: "13.33",
      NZD: "14.81",
      CHF: "7.67",
      PLN: "35.50",
      CZK: "210.80",
      HUF: "3459",
      AED: "31.96",
    },
    priceList: [
      { name: "10 Documents" },
      { name: "Max document size: 15MB/pdf" },
      { name: "150 document questions" },
    ],
  },
  {
    id: 3,
    title: "Intermediate",
    priceMonthly: {
      EUR: "19.99",
      USD: "21.77",
      GBP: "17.15",
      AUD: "33.34",
      NZD: "37.03",
      CHF: "19.19",
      PLN: "88.76",
      CZK: "526.99",
      HUF: "8646",
      AED: "79.90",
    },
    priceList: [
      { name: "20 Documents" },
      { name: "Max document size: 20MB/pdf" },
      { name: "250 document questions" },
    ],
  },
  {
    id: 4,
    title: "Advanced",
    priceMonthly: {
      EUR: "34.99",
      USD: "38.11",
      GBP: "30.01",
      AUD: "58.36",
      NZD: "64.80",
      CHF: "33.59",
      PLN: "155.33",
      CZK: "922.23",
      HUF: "15131",
      AED: "139.82",
    },
    popular: true,
    priceList: [
      { name: "40 Documents" },
      { name: "Max document size: 35MB/pdf" },
      { name: "400 document questions" },
    ],
  },
  {
    id: 5,
    title: "Professional",
    priceMonthly: {
      EUR: "59.99",
      USD: "65.35",
      GBP: "51.45",
      AUD: "100.12",
      NZD: "111.19",
      CHF: "57.59",
      PLN: "266.43",
      CZK: "1582.42",
      HUF: "25962",
      AED: "239.94",
    },
    priceList: [
      { name: "70 Documents" },
      { name: "Max document size: 50MB/pdf" },
      { name: "700 document questions" },
    ],
  },
];

// Team pricing data with user multipliers
export const teamPricingData = [
  {
    id: 1,
    title: "Basic",
    basePrice: {
      EUR: 7.99,
      USD: 8.70,
      GBP: 6.86,
      AUD: 13.33,
      NZD: 14.81,
      CHF: 7.67,
      PLN: 35.50,
      CZK: 210.80,
      HUF: 3459,
      AED: 31.96,
    },
    baseDocuments: 10,
    baseQuestions: 150,
    maxSize: "15MB/pdf",
  },
  {
    id: 2,
    title: "Intermediate",
    basePrice: {
      EUR: 19.99,
      USD: 21.77,
      GBP: 17.15,
      AUD: 33.34,
      NZD: 37.03,
      CHF: 19.19,
      PLN: 88.76,
      CZK: 526.99,
      HUF: 8646,
      AED: 79.90,
    },
    baseDocuments: 20,
    baseQuestions: 250,
    maxSize: "20MB/pdf",
  },
  {
    id: 3,
    title: "Advanced",
    basePrice: {
      EUR: 34.99,
      USD: 38.11,
      GBP: 30.01,
      AUD: 58.36,
      NZD: 64.80,
      CHF: 33.59,
      PLN: 155.33,
      CZK: 922.23,
      HUF: 15131,
      AED: 139.82,
    },
    baseDocuments: 40,
    baseQuestions: 400,
    maxSize: "35MB/pdf",
  },
  {
    id: 4,
    title: "Professional",
    basePrice: {
      EUR: 59.99,
      USD: 65.35,
      GBP: 51.45,
      AUD: 100.12,
      NZD: 111.19,
      CHF: 57.59,
      PLN: 266.43,
      CZK: 1582.42,
      HUF: 25962,
      AED: 239.94,
    },
    baseDocuments: 70,
    baseQuestions: 700,
    maxSize: "50MB/pdf",
  },
];

// Team user multipliers for pricing
export const teamUserMultipliers: Record<number, number> = {
  1: 1, 2: 1.7, 3: 2.4, 4: 3, 5: 3.5, 6: 3.9, 7: 4.19, 8: 4.4
};

// Custom pricing base rates (in EUR) Backup
// export const customPricingRates = {
//   perPDFBase: 10.99 / 5,
//   perQuestionBase: 10.99 / 103,
//   sizePrice: {
//     upTo9MB: 10.99 / 9.7,
//     upTo30MB: (29.99 - 10.99) / (30 - 9.7),
//     upTo50MB: (49.99 - 29.99) / (50 - 30),
//   }
// };

// Custom pricing base rates (in EUR), derived from Test Pack baseline (€2.75 / 5 PDFs / 50 questions / 10MB)
// Weight distribution: 40% PDFs, 35% questions, 25% size
export const customPricingRates = {
  perPDFBase: 0.22,
  perQuestionBase: 0.01925,
  perMBBase: 0.06875,
};

// Currency conversion rates from EUR
export const currencyConversionRates: Record<string, number> = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.86,
  AUD: 1.67,
  NZD: 1.85,
  CHF: 0.96,
  PLN: 4.44,
  CZK: 26.35,
  HUF: 432.5,
  AED: 4.00,
};

export const aboutFeaturesData = [
  {
    id: 1,
    iconLight: "/images/about/passion.svg",
    iconDark: "/images/about/passion-dark.svg",
    title: "Our Passion",
    desc: "At File.Energy, our passion is to empower individuals and organizations by making document interaction simple and insightful. We're driven by the belief that technology should enhance efficiency and clarity, transforming how you interact with your data",
  },
  {
    id: 2,
    iconLight: "/images/about/transparency.svg",
    iconDark: "/images/about/transparency-dark.svg",
    title: "Transparency",
    desc: "We pledge complete transparency in all our operations. This means open communication, clear processes, and straightforward pricing. With File.Energy, what you see is what you get—there are no hidden fees or surprises",
  },
  {
    id: 3,
    iconLight: "/images/about/mission.svg",
    iconDark: "/images/about/mission-dark.svg",
    title: "Our Mission",
    desc: "Our mission is to revolutionize document management with cutting-edge AI technology. We aim to provide tools that not only save time but also increase the depth of understanding and insight across all levels of data interaction",
  },
];

export const footerData = {
  logo: "/images/logo.svg",
  logoDark: "/images/logo-light.svg",
  footerText:
    "AI-powered document interaction that saves you time and gives your energy to things that really matter.",
  copyright: `${new Date().getFullYear()} File.energy. All Rights Reserved`,
  email: "support@file.energy",
  explore: [
    { id: 1, name: "About", link: "/about" },
    { id: 2, name: "Pricing", link: "/pricing" },
    { id: 3, name: "FAQ", link: "/faq" },
    { id: 4, name: "Contact", link: "/contact" },
  ],
  resources: [
    { id: 1, name: "Playground", link: "/playground" },
    { id: 2, name: "Blog", link: "/blog" },
    { id: 3, name: "Log In", link: "/login" },
    { id: 4, name: "Sign Up", link: "/register" },
  ],
  legal: [
    { id: 1, name: "Privacy Policy", link: "/privacy" },
    { id: 2, name: "Terms of Service", link: "/terms" },
    { id: 3, name: "Data Protection Policy", link: "/data-protection" },
  ],
};
