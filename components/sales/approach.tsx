"use client";

import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

export function Approach(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <section aria-labelledby="approach-heading" className="container-x py-16 sm:py-24">
      <FadeIn className="max-w-[40rem]">
        <p className="label">{copy.approachEyebrow}</p>
        <h2 id="approach-heading" className="display mt-4 text-4xl sm:text-6xl">
          {copy.approachHeading}
        </h2>
      </FadeIn>

      <ol className="rail mt-10 sm:mt-14 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
        {copy.approachSteps.map((step, index) => (
          <FadeIn key={step.title} delay={index * 0.08} className="h-full">
            <li className="bg-paper-2 hairline flex h-full flex-col border p-5 sm:p-6">
              <span className="display text-brand text-6xl">{index + 1}</span>
              <h3 className="display-md mt-6 text-2xl">{step.title}</h3>
              <p className="text-foreground/70 mt-3 text-sm leading-relaxed">{step.description}</p>
            </li>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
