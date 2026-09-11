"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

export function SkipToContent(): ReactNode {
  const { copy } = useLanguage();

  return (
    <a href="#main-content" className="skip-to-content">
      {copy.skip}
    </a>
  );
}
