"use client";

import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

export function WhyMe(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <section
      aria-labelledby="why-heading"
      className="bg-foreground text-background px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto max-w-275">
        <FadeIn>
          <p className="text-brand mb-5 text-sm font-medium">
            {copy.whyEyebrow}
          </p>
          <h2
            id="why-heading"
            className="max-w-3xl text-[2.4rem] leading-[1.05] font-medium tracking-[-0.03em] text-balance md:text-[3.2rem]"
          >
            {copy.whyHeading}
          </h2>
        </FadeIn>
        <ul className="border-background/12 mt-14 grid border-t sm:grid-cols-2">
          {copy.whyPoints.map((point, index) => (
            <li
              key={point.title}
              className={`border-background/12 border-b py-8 sm:pr-10 ${index % 2 === 1 ? "sm:border-l sm:pl-10" : ""}`}
            >
              <FadeIn delay={index * 0.06}>
                <span
                  className="bg-brand mb-5 block h-2 w-3 rounded-[2px]"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-medium tracking-tight">
                  {point.title}
                </h3>
                <p className="text-background/60 mt-3 max-w-[46ch] leading-relaxed">
                  {point.description}
                </p>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
