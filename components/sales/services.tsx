"use client";

import { ArrowRight, Check, MousePointerClick, PanelsTopLeft, RefreshCw, Wrench } from "lucide-react";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

const icons = [PanelsTopLeft, MousePointerClick, Wrench] as const;

export function Services(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];
  const featured = copy.featured;

  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-24 px-6 sm:px-10">
      <div className="mx-auto max-w-275">
        <FadeIn className="max-w-2xl">
          <p className="text-foreground/50 mb-5 text-xs font-semibold tracking-[0.18em] uppercase">{copy.servicesEyebrow}</p>
          <ScrollReveal
            as="h2"
            id="services-heading"
            textClassName="text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem] lg:text-[3.5rem]"
          >
            {copy.servicesHeading}
          </ScrollReveal>
          <ScrollReveal
            containerClassName="mt-5"
            textClassName="text-foreground/65 text-[18px] leading-relaxed sm:text-[20px]"
          >
            {copy.servicesDescription}
          </ScrollReveal>
        </FadeIn>

        <FadeIn delay={0.05}>
          <article className="border-foreground/8 bg-background/85 mt-12 grid gap-8 rounded-4xl border p-6 sm:p-8 md:grid-cols-[1.1fr_1fr] md:gap-10 lg:p-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="border-foreground/10 inline-flex h-10 w-10 items-center justify-center rounded-xl border">
                  <RefreshCw className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="bg-foreground text-background rounded-full px-2.5 py-1 text-xs font-medium">{featured.tag}</span>
              </div>
              <h3 className="text-foreground mt-7 text-3xl font-medium tracking-tight sm:text-[2.25rem]">{featured.title}</h3>
              <p className="text-foreground/65 mt-3 max-w-[44ch] leading-relaxed">{featured.description}</p>
              <p className="mt-8 flex items-baseline gap-2">
                <span className="text-foreground/50 text-sm">{featured.priceFrom}</span>
                <span className="text-foreground text-5xl font-medium tracking-tight">{featured.price}</span>
              </p>
              <p className="text-foreground/50 mt-2 text-sm">{featured.priceNote}</p>
              <a
                href="#contact"
                className="focus-ring bg-foreground text-background mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
              >
                {featured.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <ul className="border-foreground/8 bg-foreground/2 flex flex-col gap-1.5 self-start rounded-3xl border p-2.5 sm:p-3">
              {featured.included.map((item) => (
                <li
                  key={item}
                  className="border-foreground/5 bg-background text-foreground/85 flex items-center gap-3 rounded-2xl border px-4 py-3 text-[15px] tracking-tight"
                >
                  <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </FadeIn>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {copy.services.map((service, index) => {
            const Icon = icons[index] ?? PanelsTopLeft;
            return (
              <FadeIn key={service.title} delay={0.08 + index * 0.06}>
                <article className="border-foreground/8 bg-background/85 h-full rounded-3xl border p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="border-foreground/10 inline-flex h-10 w-10 items-center justify-center rounded-xl border">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-foreground/50 text-xs font-medium">{service.tag}</span>
                  </div>
                  <h3 className="text-foreground mt-6 text-xl font-medium tracking-tight">{service.title}</h3>
                  <p className="text-foreground/60 mt-2.5 text-sm leading-relaxed sm:text-[15px]">{service.description}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
