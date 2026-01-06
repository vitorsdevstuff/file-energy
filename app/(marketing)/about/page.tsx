"use client";

import { motion } from "framer-motion";
import { Lightbulb, Eye, Target, Users, Zap, Shield } from "lucide-react";
import { aboutFeaturesData } from "@/lib/data";

const stats = [
  { label: "Documents Processed", value: "1M+" },
  { label: "Active Users", value: "50K+" },
  { label: "Countries", value: "120+" },
  { label: "Uptime", value: "99.9%" },
];

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We constantly push boundaries to deliver cutting-edge AI solutions that transform how you interact with documents.",
  },
  {
    icon: Users,
    title: "User-Centric",
    description:
      "Every feature we build starts with understanding our users' needs and solving their real problems.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description:
      "Your data security is our priority. We implement enterprise-grade security measures to protect your documents.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.p
            className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            About Us
          </motion.p>
          <motion.h1
            className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Empowering document intelligence through AI
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            File.energy was founded with a simple mission: make document
            interaction effortless and insightful. We leverage cutting-edge AI
            to transform how you work with your files.
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          className="mb-20 grid grid-cols-2 gap-8 md:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="mb-1 text-3xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Core Values from data.ts */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 dark:text-white">
            What drives us
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {aboutFeaturesData.map((feature) => {
              const IconComponent =
                feature.id === 1
                  ? Lightbulb
                  : feature.id === 2
                    ? Eye
                    : Target;
              return (
                <div
                  key={feature.id}
                  className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Our values
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
