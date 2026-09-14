"use client";

import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

export function Testimonials(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <section aria-labelledby="testimonial-heading" className="px-6 sm:px-10">
      <div className="mx-auto max-w-275">
        <FadeIn>
          <ScrollReveal
            as="h2"
            id="testimonial-heading"
            textClassName="text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem]"
          >
            {copy.testimonialHeading}
          </ScrollReveal>
          <ScrollReveal
            containerClassName="mt-4"
            textClassName="text-foreground/55 max-w-xl text-sm leading-relaxed"
          >
            {copy.testimonialNote}
          </ScrollReveal>
        </FadeIn>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {copy.testimonialExamples.map((quote, index) => (
            <FadeIn key={quote} delay={index * 0.08}>
              <div className="border-foreground/10 bg-background/80 h-full rounded-3xl border p-6 sm:p-8">
                <p className="text-foreground/65 text-lg leading-relaxed">“{quote}”</p>
                <p className="text-foreground/40 mt-6 text-xs font-semibold tracking-wide uppercase">{copy.placeholderCategory}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
