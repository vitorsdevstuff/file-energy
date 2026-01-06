"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { clientData } from "@/lib/data";

export function Clients() {
  return (
    <section className="border-y border-gray-100 py-12 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <motion.p
          className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Trusted by teams at
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {clientData.map((client) => (
            <div
              key={client.id}
              className="grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100"
            >
              <Image
                src={client.imageLight}
                alt="Client logo"
                width={120}
                height={40}
                className="h-8 w-auto dark:hidden"
              />
              <Image
                src={client.imageDark}
                alt="Client logo"
                width={120}
                height={40}
                className="hidden h-8 w-auto dark:block"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
