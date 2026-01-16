"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
}> = {
  "ai-revolutionizing-document-management": {
    title: "How AI is Revolutionizing Document Management",
    excerpt: "Discover how artificial intelligence is transforming the way businesses handle and analyze their documents, saving time and unlocking new insights.",
    category: "AI & Technology",
    author: "Sarah Johnson",
    date: "January 5, 2025",
    readTime: "5 min read",
    content: `
      <p>Artificial intelligence is transforming every aspect of how we work with documents. From automated data extraction to intelligent summarization, AI-powered tools are helping businesses save countless hours while gaining deeper insights from their data.</p>

      <h2>The Rise of Intelligent Document Processing</h2>
      <p>Traditional document management systems required manual effort to organize, categorize, and extract information. With AI, these processes are now automated, allowing teams to focus on higher-value tasks.</p>

      <h2>Key Benefits of AI Document Management</h2>
      <ul>
        <li><strong>Automated Data Extraction:</strong> AI can identify and extract key information from documents automatically, reducing manual data entry by up to 80%.</li>
        <li><strong>Intelligent Search:</strong> Natural language processing enables semantic search, allowing users to find documents based on meaning rather than exact keywords.</li>
        <li><strong>Document Summarization:</strong> AI can summarize lengthy documents in seconds, providing quick overviews without losing critical information.</li>
        <li><strong>Pattern Recognition:</strong> Machine learning algorithms can identify patterns and anomalies across large document sets.</li>
      </ul>

      <h2>The Future of Document Intelligence</h2>
      <p>As AI continues to evolve, we can expect even more sophisticated capabilities. From predictive analytics to automated decision-making support, the possibilities are endless.</p>

      <p>At File.energy, we're at the forefront of this revolution, bringing cutting-edge AI technology to document management in an accessible, user-friendly platform.</p>
    `
  },
  "boost-productivity-with-file-energy": {
    title: "5 Ways to Boost Productivity with File.energy",
    excerpt: "Learn practical tips and tricks to maximize your efficiency when working with documents using our AI-powered platform.",
    category: "Productivity",
    author: "Mark Robertson",
    date: "January 3, 2025",
    readTime: "4 min read",
    content: `
      <p>In today's fast-paced work environment, finding ways to work smarter is essential. Here are five powerful ways to boost your productivity using File.energy.</p>

      <h2>1. Use Quick Questions for Instant Insights</h2>
      <p>Instead of reading through entire documents, use our Quick Questions feature to get instant answers. Simply upload your document and ask specific questions - our AI will find the relevant information in seconds.</p>

      <h2>2. Leverage Batch Processing</h2>
      <p>When working with multiple documents, use our batch processing feature to analyze several files at once. This is perfect for comparing contracts, analyzing reports, or extracting data from multiple sources.</p>

      <h2>3. Create Custom Templates</h2>
      <p>Set up custom question templates for recurring tasks. Whether you're reviewing contracts, analyzing research papers, or processing invoices, templates save time and ensure consistency.</p>

      <h2>4. Use Data Visualization</h2>
      <p>Transform complex data into clear visualizations. Our AI can create charts and graphs from your documents, making it easier to spot trends and present findings.</p>

      <h2>5. Integrate with Your Workflow</h2>
      <p>Connect File.energy with your existing tools through our API. Automate document processing as part of your larger workflow to save even more time.</p>

      <p>By implementing these strategies, you can significantly reduce the time spent on document-related tasks and focus on what matters most.</p>
    `
  },
  "future-of-data-visualization": {
    title: "The Future of Data Visualization",
    excerpt: "Explore how AI-driven data visualization is making complex information more accessible and actionable for everyone.",
    category: "Data Science",
    author: "Emily Chen",
    date: "December 28, 2024",
    readTime: "6 min read",
    content: `
      <p>Data visualization has always been crucial for understanding complex information. With AI, we're entering a new era where creating meaningful visualizations is more accessible than ever.</p>

      <h2>AI-Powered Visualization Generation</h2>
      <p>Traditional data visualization required expertise in both data analysis and design tools. AI is changing this by automatically generating appropriate visualizations based on the data and the questions being asked.</p>

      <h2>Key Trends in AI Visualization</h2>
      <ul>
        <li><strong>Automatic Chart Selection:</strong> AI can analyze your data and suggest the most appropriate visualization type.</li>
        <li><strong>Natural Language Queries:</strong> Ask questions in plain language and receive visual answers.</li>
        <li><strong>Interactive Dashboards:</strong> AI can create dynamic dashboards that update in real-time.</li>
        <li><strong>Anomaly Highlighting:</strong> Machine learning can automatically highlight outliers and interesting patterns.</li>
      </ul>

      <h2>Democratizing Data Insights</h2>
      <p>Perhaps the most exciting aspect of AI-driven visualization is its ability to democratize data insights. You no longer need to be a data scientist to create compelling visualizations and extract meaningful insights from your data.</p>

      <h2>What This Means for Your Business</h2>
      <p>With tools like File.energy, anyone can transform their documents into actionable visualizations. This means faster decision-making, better communication, and more data-driven organizations.</p>
    `
  },
  "security-best-practices-document-management": {
    title: "Security Best Practices for Document Management",
    excerpt: "Understanding the importance of security when handling sensitive documents and how File.energy keeps your data safe.",
    category: "Security",
    author: "James Wilson",
    date: "December 20, 2024",
    readTime: "7 min read",
    content: `
      <p>In an era of increasing cyber threats, document security has never been more important. Here's what you need to know about protecting your sensitive documents.</p>

      <h2>The Importance of Document Security</h2>
      <p>Documents often contain sensitive information - from financial data to personal details to proprietary business information. A security breach can result in financial loss, reputational damage, and legal consequences.</p>

      <h2>Key Security Measures</h2>
      <ul>
        <li><strong>Encryption:</strong> All documents should be encrypted both in transit and at rest. File.energy uses AES-256 encryption to protect your data.</li>
        <li><strong>Access Control:</strong> Implement role-based access to ensure only authorized users can view sensitive documents.</li>
        <li><strong>Audit Trails:</strong> Maintain logs of who accessed what documents and when.</li>
        <li><strong>Data Minimization:</strong> Only collect and store the data you actually need.</li>
      </ul>

      <h2>How File.energy Protects Your Data</h2>
      <p>At File.energy, security is built into everything we do:</p>
      <ul>
        <li>Documents are processed transiently and not stored after analysis</li>
        <li>All connections are encrypted with TLS 1.2+</li>
        <li>We comply with GDPR and other data protection regulations</li>
        <li>Regular security audits and penetration testing</li>
      </ul>

      <h2>Best Practices for Users</h2>
      <p>While we take care of the technical security, there are steps you can take too:</p>
      <ul>
        <li>Use strong, unique passwords</li>
        <li>Enable two-factor authentication when available</li>
        <li>Be cautious about which documents you upload</li>
        <li>Regularly review access permissions</li>
      </ul>

      <p>By combining robust platform security with good user practices, you can confidently use AI-powered document tools while keeping your data safe.</p>
    `
  }
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Post not found</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="mt-8 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Back Link */}
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {post.category}
          </span>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </motion.div>

        {/* Featured Image Placeholder */}
        <motion.div
          className="mb-12 aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl font-bold text-primary/30">
              {post.category.charAt(0)}
            </span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.article
          className="prose prose-lg dark:prose-invert max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <motion.div
          className="mt-16 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Ready to transform your document workflow?
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Try File.energy today and experience the power of AI document management.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90"
          >
            Get Started Free
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
