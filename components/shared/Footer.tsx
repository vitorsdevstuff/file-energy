"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { footerData } from "@/lib/data";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo className="mb-4" />
            <p className="mb-6 max-w-xs text-sm text-gray-500 dark:text-gray-400">
              {footerData.footerText}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerData.explore.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.link}
                    className="text-sm text-gray-500 transition-colors hover:text-primary dark:text-gray-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerData.resources.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.link}
                    className="text-sm text-gray-500 transition-colors hover:text-primary dark:text-gray-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerData.legal.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.link}
                    className="text-sm text-gray-500 transition-colors hover:text-primary dark:text-gray-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Contact us:
              </p>
              <a
                href={`mailto:${footerData.email}`}
                className="text-sm text-primary hover:underline"
              >
                {footerData.email}
              </a>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="mt-12 border-t border-gray-100 pt-8 dark:border-gray-800">
          <div className="space-y-4 text-center text-xs text-gray-500 dark:text-gray-400">
            <p className="font-medium">
              &copy; 2026 BRAINBOP LTD
            </p>
            <p>
              For UK and ROW customers, services are provided by{" "}
              <span className="font-medium">BRAINBOP LTD</span> | 50 Gilbert Road, Smethwick, England, B66 4PY (15835241)
            </p>
            <p>
              For EEA customers, services are provided by{" "}
              <span className="font-medium">БРЕЙНБОП ЕООД</span> | Bulgaria, Sofia (city), Triaditsa district, 48 Vitosha Blvd, Ground floor, 1000 Sofia (EIK 207653828) |{" "}
              <a href="mailto:support@file.energy" className="text-primary hover:underline">
                support@file.energy
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
