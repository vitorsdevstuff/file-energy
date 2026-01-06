"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, FileText, BarChart3, type LucideIcon } from "lucide-react";
import { ThreeBackground } from "@/components/three/ThreeBackground";

const fadeUpAnimation: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const floatingAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const pulseGlow: Variants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

function FloatingBadge({
  icon: Icon,
  label,
  className,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg backdrop-blur-sm dark:bg-gray-800/90 dark:text-gray-200 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.5, duration: 0.5 }}
    >
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 lg:pb-32 lg:pt-40">
      {/* Three.js Background */}
      <ThreeBackground />

      {/* Gradient overlays */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl"
          variants={pulseGlow}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl"
          variants={pulseGlow}
          initial="initial"
          animate="animate"
          transition={{ delay: 1.5 }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <motion.div
            className="text-center lg:text-left"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
              variants={fadeUpAnimation}
            >
              <Zap className="h-4 w-4" />
              FILE ENERGY
            </motion.div>

            <motion.h1
              className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl"
              variants={fadeUpAnimation}
            >
              Interact with your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary to-primary/70 bg-clip-text italic text-transparent">
                  Documents
                </span>
                <motion.span
                  className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-primary/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                />
              </span>
              <br />
              powered by{" "}
              <span className="inline-flex items-center">
                <Zap className="inline h-10 w-10 text-yellow-500 md:h-12 md:w-12" />
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-300 lg:mx-0 lg:text-xl"
              variants={fadeUpAnimation}
            >
              2025: When AI is changing the world, let File.energy{" "}
              <span className="inline-block">⚡</span> help you save your time
              on documents, and give your energy to things that really matter.
            </motion.p>

            <motion.div
              className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
              variants={fadeUpAnimation}
            >
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="xl" className="group w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/pricing">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full sm:w-auto"
                  >
                    View Pricing
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start"
              variants={fadeUpAnimation}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-gray-200 to-gray-300 dark:border-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                  />
                ))}
              </div>
              <motion.div
                className="text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  1,000+
                </span>{" "}
                professionals trust File.energy
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image with floating badges */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]"
              variants={pulseGlow}
              initial="initial"
              animate="animate"
            />

            {/* Floating badges */}
            <FloatingBadge
              icon={FileText}
              label="PDF Analysis"
              className="left-0 top-1/4"
              delay={0}
            />
            <FloatingBadge
              icon={BarChart3}
              label="Data Viz"
              className="right-0 top-1/3"
              delay={0.2}
            />
            <FloatingBadge
              icon={Zap}
              label="Instant Insights"
              className="bottom-1/4 left-10"
              delay={0.4}
            />

            <motion.div
              className="relative mx-auto max-w-lg lg:max-w-none"
              variants={floatingAnimation}
              initial="initial"
              animate="animate"
            >
              <Image
                src="/images/robot.png"
                alt="AI Document Assistant"
                width={600}
                height={600}
                className="w-full drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
