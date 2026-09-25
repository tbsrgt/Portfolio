"use client";

import type { ReactNode } from "react";

import { LogoLoop } from "@/components/ui/logo-loop";
import { useLanguage } from "@/lib/i18n";

const WORDS = {
  fr: ["Sites vitrines", "Refontes", "Espaces clients", "Logiciels métier", "ERP + CRM", "Landing pages", "Maintenance"],
  en: ["Showcase sites", "Redesigns", "Client portals", "Business software", "ERP + CRM", "Landing pages", "Maintenance"],
} as const;

/** Big display-type ticker of what I build, with a pixel square between words. */
export function WordTicker({ tone = "paper" }: { tone?: "paper" | "ink" }): ReactNode {
  const { locale } = useLanguage();
  const items = WORDS[locale].map((word) => ({
    title: word,
    node: (
      <span className="ticker-word inline-flex items-center gap-8">
        {word}
        <span aria-hidden="true" className="bg-brand inline-block h-[0.35em] w-[0.35em]" />
      </span>
    ),
  }));

  return (
    <div aria-hidden="true" className={`hairline border-y py-5 sm:py-7 ${tone === "ink" ? "on-ink bg-ink text-paper" : "bg-paper-2"}`}>
      <LogoLoop logos={items} speed={60} gap={32} logoHeight={72} fadeOut={false} ariaLabel="" />
    </div>
  );
}
