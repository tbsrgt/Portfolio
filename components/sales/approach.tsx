"use client";

import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

export function Approach(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <section aria-labelledby="approach-heading" className="px-6 sm:px-10">
      <div className="mx-auto max-w-275">
        <FadeIn>
          <p className="text-foreground/50 mb-5 text-xs font-semibold tracking-[0.18em] uppercase">
            {copy.approachEyebrow}
          </p>
          <ScrollReveal
            as="h2"
            id="approach-heading"
            textClassName="text-foreground max-w-2xl text-[2.4rem] leading-[1.05] font-medium tracking-[-0.03em] md:text-[3rem]"
          >
            {copy.approachHeading}
          </ScrollReveal>
        </FadeIn>
        <ol className="border-foreground/10 mt-10 grid border-t md:grid-cols-2 lg:grid-cols-4">
          {copy.approachSteps.map((step, index) => (
            <li key={step.title} className="h-full">
              <FadeIn delay={index * 0.08} className="h-full">
                <div className="border-foreground/10 h-full border-b py-6 md:pr-8">
                  <span className="text-foreground/40 text-sm tabular-nums">
                    0{index + 1}
                  </span>
                  <h3 className="text-foreground mt-5 text-xl font-medium">
                    {step.title}
                  </h3>
                  <p className="text-foreground/60 mt-3 text-sm leading-relaxed sm:text-base">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
