"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { coreFeatures } from "@/lib/data";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const iconHover = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: [0, -10, 10, 0],
    transition: { duration: 0.4 },
  },
};

export function Features() {
  return (
    <section className="relative bg-gray-50 py-20 dark:bg-gray-900/50 lg:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -left-20 bottom-20 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <motion.p
            className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Core Features
          </motion.p>
          <motion.h2
            className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Everything you need to work with{" "}
            <motion.span
              className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              documents
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Powerful AI capabilities to help you extract insights, visualize
            data, and automate your document workflows.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {coreFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:border-primary/20 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900",
                feature.new && "ring-2 ring-primary/20"
              )}
            >
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                initial={false}
              />

              {feature.new && (
                <motion.span
                  className="absolute right-4 top-4 rounded-full bg-primary px-2 py-1 text-xs font-medium text-white"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  NEW
                </motion.span>
              )}

              <motion.div
                className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20"
                variants={iconHover}
                initial="initial"
                whileHover="hover"
              >
                <Image
                  src={feature.iconLight}
                  alt={feature.title}
                  width={32}
                  height={32}
                  className="dark:hidden"
                />
                <Image
                  src={feature.iconDark}
                  alt={feature.title}
                  width={32}
                  height={32}
                  className="hidden dark:block"
                />
              </motion.div>

              <motion.h3
                className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                {feature.title}
              </motion.h3>

              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>

              {/* Animated underline on hover */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-purple-500"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
