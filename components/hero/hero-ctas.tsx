"use client";

import { PhoneCall } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import type { ReactNode } from "react";

import { ContactButton } from "@/components/contact/contact-button";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroCtas(): ReactNode {
  const { locale } = useLanguage();

  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{ layout: { duration: 0.55, ease: EASE } }}
        className="mt-2 flex flex-wrap items-center gap-3"
      >
        <ContactButton />

        <motion.div
          layout
          transition={{ layout: { duration: 0.55, ease: EASE } }}
        >
          <a
            href="#rappel"
            className="border-foreground/20 focus-ring group bg-background text-foreground hover:bg-foreground/5 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            {salesCopy[locale].heroCallbackCta}
          </a>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
