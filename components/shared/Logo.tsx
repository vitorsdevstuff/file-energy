"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  asLink?: boolean;
}

export function Logo({ variant = "light", className, asLink = true }: LogoProps) {
  const logoImage = (
    <Image
      src={variant === "light" ? "/images/logo.svg" : "/images/logo-light.svg"}
      alt="File.energy"
      width={140}
      height={40}
      className="h-10 w-auto"
      priority
    />
  );

  if (!asLink) {
    return <div className={className}>{logoImage}</div>;
  }

  return (
    <Link href="/" className={className}>
      {logoImage}
    </Link>
  );
}
