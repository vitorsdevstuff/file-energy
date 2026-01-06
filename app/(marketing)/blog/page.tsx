"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How AI is Revolutionizing Document Management",
    excerpt:
      "Discover how artificial intelligence is transforming the way businesses handle and analyze their documents, saving time and unlocking new insights.",
    category: "AI & Technology",
    author: "Sarah Johnson",
    date: "January 5, 2025",
    readTime: "5 min read",
    image: "/images/blog/ai-document.jpg",
  },
  {
    id: 2,
    title: "5 Ways to Boost Productivity with File.energy",
    excerpt:
      "Learn practical tips and tricks to maximize your efficiency when working with documents using our AI-powered platform.",
    category: "Productivity",
    author: "Mark Robertson",
    date: "January 3, 2025",
    readTime: "4 min read",
    image: "/images/blog/productivity.jpg",
  },
  {
    id: 3,
    title: "The Future of Data Visualization",
    excerpt:
      "Explore how AI-driven data visualization is making complex information more accessible and actionable for everyone.",
    category: "Data Science",
    author: "Emily Chen",
    date: "December 28, 2024",
    readTime: "6 min read",
    image: "/images/blog/data-viz.jpg",
  },
  {
    id: 4,
    title: "Security Best Practices for Document Management",
    excerpt:
      "Understanding the importance of security when handling sensitive documents and how File.energy keeps your data safe.",
    category: "Security",
    author: "James Wilson",
    date: "December 20, 2024",
    readTime: "7 min read",
    image: "/images/blog/security.jpg",
  },
];

export default function BlogPage() {
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
            Blog
          </motion.p>
          <motion.h1
            className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Insights & Updates
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Stay up to date with the latest in AI document management,
            productivity tips, and company news.
          </motion.p>
        </div>

        {/* Blog Grid */}
        <motion.div
          className="grid gap-8 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {/* Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20">
                <div className="flex h-full items-center justify-center">
                  <span className="text-4xl font-bold text-primary/30">
                    {post.category.charAt(0)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Category */}
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {post.category}
                </span>

                {/* Title */}
                <h2 className="mt-4 text-xl font-semibold text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {post.excerpt}
                </p>

                {/* Meta */}
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

                {/* Read More */}
                <Link
                  href="#"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Coming Soon Notice */}
        <motion.div
          className="mt-16 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            More content coming soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;re working on bringing you more insights and tutorials.
            Check back regularly for updates!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
