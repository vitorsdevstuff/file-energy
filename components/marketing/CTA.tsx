"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Sparkles } from "lucide-react";

const floatingParticles = [
  { x: "10%", y: "20%", size: 4, delay: 0 },
  { x: "85%", y: "15%", size: 6, delay: 0.5 },
  { x: "20%", y: "80%", size: 5, delay: 1 },
  { x: "90%", y: "70%", size: 4, delay: 1.5 },
  { x: "50%", y: "10%", size: 3, delay: 2 },
  { x: "70%", y: "85%", size: 5, delay: 0.8 },
];

export function CTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)",
            "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #a855f7 100%)",
            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Pattern overlay */}
      <div className="absolute inset-0 -z-10 bg-[url('/images/pattern.svg')] opacity-10" />

      {/* Floating particles */}
      {floatingParticles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/30"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated rings */}
      <motion.div
        className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full border border-white/10"
        animate={{ scale: [1, 1.2, 1], rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full border border-white/10"
        animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(255,255,255,0.1)",
                "0 0 40px rgba(255,255,255,0.2)",
                "0 0 20px rgba(255,255,255,0.1)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-4 w-4" />
            </motion.div>
            Start for free today
          </motion.div>

          <motion.h2
            className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Ready to{" "}
            <motion.span
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
            >
              transform
              <motion.span
                className="absolute -bottom-1 left-0 h-1 w-full bg-white/50"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </motion.span>{" "}
            your document workflow?
          </motion.h2>

          <motion.p
            className="mb-10 text-lg text-white/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join{" "}
            <motion.span
              className="font-semibold text-white"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              thousands
            </motion.span>{" "}
            of professionals who are saving hours every week with AI-powered
            document analysis.
          </motion.p>

          <motion.div
            className="flex flex-col justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="xl"
                  className="group relative w-full overflow-hidden bg-white text-primary hover:bg-gray-100 sm:w-auto"
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                  <span className="relative flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Started Free
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </Link>
            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full border-white/30 text-white hover:bg-white/10 sm:w-auto"
                >
                  Contact Sales
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
