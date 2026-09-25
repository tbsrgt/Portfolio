"use client";

import type { ReactNode } from "react";

import { ArrowRight, Phone } from "@/components/ui/pixel-icon";
import { deskCopy } from "@/lib/desk-copy";
import type { Locale } from "@/lib/i18n";

/** The main sheet's HTML, rendered inside the 3D scene so it stays real, readable text.
 * drei's <Html> mounts a separate React root, so the locale comes in as a prop. */
export function SheetContent({ locale }: { locale: Locale }): ReactNode {
  const copy = deskCopy[locale];

  return (
    <div className="sheet w-[620px] p-9" style={{ boxShadow: "none" }}>
      <span className="dymo">{copy.sheetLabel}</span>
      <h1 className="display mt-6 text-[4rem]">
        {copy.title1}
        <br />
        <span className="text-stamp">{copy.title2}</span>
      </h1>
      <p className="text-ink/75 mt-5 max-w-[42ch] text-[17px] leading-relaxed">{copy.lead}</p>
      <div className="mt-6 flex gap-3">
        <a href="/devis" className="btn btn-stamp">
          {copy.ctaQuote}
          <ArrowRight className="h-5 w-5" />
        </a>
        <a href="#contact" className="btn btn-outline">
          <Phone className="h-5 w-5" />
          {copy.ctaCall}
        </a>
      </div>
      <span className="stamp absolute -top-3 right-4 text-2xl">{copy.stamp}</span>
    </div>
  );
}
