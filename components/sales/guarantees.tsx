"use client";

import type { ReactNode } from "react";

import { CountUp } from "@/components/ui/count-up";
import { FadeIn } from "@/components/ui/motion-primitives";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

export function Guarantees(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <section aria-labelledby="guarantees-heading" className="px-5 sm:px-10">
      <div className="border-foreground/10 bg-background mx-auto max-w-275 border">
        <FadeIn className="border-foreground/10 border-b p-6 sm:p-8">
          <p className="text-brand mb-3 text-sm font-medium">{copy.guaranteesEyebrow}</p>
          <h2 id="guarantees-heading" className="text-foreground max-w-3xl text-[1.9rem] leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-[2.5rem]">
            {copy.guaranteesHeading}
          </h2>
        </FadeIn>
        <ul className="divide-foreground/10 grid divide-y sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {copy.guarantees.map((item, index) => (
            <li key={item.label} className={`p-6 sm:p-8 ${index > 0 ? "lg:border-l" : ""} ${index % 2 === 1 ? "sm:border-l lg:border-l" : ""} border-foreground/10`}>
              <FadeIn delay={index * 0.06}>
                <p className="text-foreground text-[2.6rem] leading-none font-medium tracking-[-0.03em] tabular-nums">
                  <CountUp to={item.value} suffix={item.suffix} />
                </p>
                <p className="text-foreground/65 mt-4 text-sm leading-relaxed sm:text-[15px]">{item.label}</p>
              </FadeIn>
            </li>
          ))}
        </ul>
        <p className="text-foreground/60 border-foreground/10 border-t px-6 py-4 text-sm sm:px-8">{copy.guaranteesPayment}</p>
      </div>
    </section>
  );
}
