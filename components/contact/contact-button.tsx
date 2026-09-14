"use client";

import { Mail } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

export function ContactButton(): ReactNode {
  const { copy } = useLanguage();

  return (
    <a
      href="#contact"
      className="focus-ring bg-foreground text-background inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
    >
      <Mail className="h-4 w-4" aria-hidden="true" />
      {copy.contact.button}
    </a>
  );
}
