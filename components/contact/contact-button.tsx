"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

export function ContactButton(): ReactNode {
  const { copy } = useLanguage();

  return (
    <Link
      href="/devis"
      className="focus-ring bg-foreground text-background inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
    >
      {copy.contact.button}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
