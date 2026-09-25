"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowRight } from "@/components/ui/pixel-icon";
import { FadeIn } from "@/components/ui/motion-primitives";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

/** Guarantees printed like a till receipt. */
export function Receipt(): ReactNode {
  const { locale } = useLanguage();
  const copy = deskCopy[locale];
  const sales = salesCopy[locale];

  return (
    <section aria-labelledby="guarantees-heading" className="container-x py-12 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
        <FadeIn>
          <span className="dymo">{copy.guaranteesLabel}</span>
          <h2 id="guarantees-heading" className="display mt-5 text-5xl sm:text-7xl">
            {copy.guaranteesTitle}
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {sales.guarantees.map((item) => (
              <li key={item.label} className="border-paper/15 flex gap-4 border-t pt-4">
                <span className="display text-postit w-24 shrink-0 text-4xl">
                  {item.value}
                  {item.suffix}
                </span>
                <p className="text-paper/75 text-[15px] leading-relaxed">{item.label}</p>
              </li>
            ))}
          </ul>
          <Link href="/devis" className="btn btn-paper mt-8">
            {sales.quoteCardCta}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </FadeIn>

        <FadeIn className="flex justify-center lg:justify-end">
          <div className="receipt w-full max-w-[340px] rotate-[2deg] px-6 py-8 text-[13px] leading-relaxed">
            <p className="text-center text-base font-bold tracking-[0.2em] uppercase">Tobias Ringot</p>
            <p className="text-ink/60 text-center text-[11px]">Aix-en-Provence · {new Date().getFullYear()}</p>
            <p className="my-3 text-center">* * * * * * * * * * * * * *</p>
            {copy.receiptLines.map(([label, value]) => (
              <div key={label} className="flex items-baseline gap-2">
                <span className="uppercase">{label}</span>
                <span className="flex-1 border-b border-dotted border-ink/40" />
                <span className="font-bold whitespace-nowrap">{value}</span>
              </div>
            ))}
            <p className="my-3 text-center">* * * * * * * * * * * * * *</p>
            <div className="flex items-baseline gap-2 text-base font-bold">
              <span className="uppercase">{copy.offersTotal}</span>
              <span className="flex-1" />
              <span>{copy.offersZero}</span>
            </div>
            <p className="text-ink/70 mt-3 text-[11px]">{copy.receiptPay}</p>
            <p className="mt-4 text-center text-[11px] uppercase">{copy.receiptThanks}</p>
            <p className="mt-3 text-center text-2xl tracking-[0.3em]">▌▌ ▌ ▌▌▌ ▌ ▌▌ ▌▌▌ ▌</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
