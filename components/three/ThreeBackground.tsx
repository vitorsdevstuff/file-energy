"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const FloatingDocuments = dynamic(
  () =>
    import("./FloatingDocuments").then((mod) => mod.FloatingDocuments),
  {
    ssr: false,
    loading: () => null,
  }
);

export function ThreeBackground() {
  return (
    <Suspense fallback={null}>
      <FloatingDocuments />
    </Suspense>
  );
}
