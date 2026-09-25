"use client";

import { ArrowRight } from "@/components/ui/pixel-icon";
import Link from "next/link";
import type { ReactNode } from "react";

import { CountUp } from "@/components/ui/count-up";
import { FadeIn } from "@/components/ui/motion-primitives";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

export function Guarantees(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <section aria-labelledby="guarantees-heading" className="on-ink bg-ink text-paper relative overflow-hidden">
      <div aria-hidden="true" className="grid-ink absolute inset-0" />
      <div className="container-x relative py-16 sm:py-24">
        <FadeIn className="max-w-[40rem]">
          <p className="label">{copy.guaranteesEyebrow}</p>
          <h2 id="guarantees-heading" className="display mt-4 text-4xl sm:text-6xl">
            {copy.guaranteesHeading}
          </h2>
        </FadeIn>

        <ul className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {copy.guarantees.map((item, index) => (
            <FadeIn key={item.label} delay={index * 0.08}>
              <li className="brackets border-paper/12 bg-ink-2/60 flex h-full flex-col border p-5 sm:p-6">
                <span className="display text-brand text-5xl sm:text-6xl">
                  <CountUp to={item.value} suffix={item.suffix} />
                </span>
                <p className="text-paper/70 mt-4 text-sm leading-relaxed">{item.label}</p>
              </li>
            </FadeIn>
          ))}
        </ul>

        <FadeIn className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-paper/60 font-mono max-w-[60ch] text-xs leading-relaxed">{copy.guaranteesPayment}</p>
          <Link href="/devis" className="btn btn-primary w-full sm:w-auto">
            {copy.quoteCardCta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
