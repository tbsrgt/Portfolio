"use client";

import { ArrowRight, RefreshCw, PanelsTopLeft, MousePointerClick, Wrench } from "lucide-react";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

const icons = [RefreshCw, PanelsTopLeft, MousePointerClick, Wrench] as const;

export function Services(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-24 px-6 sm:px-10">
      <div className="mx-auto max-w-275">
        <FadeIn className="max-w-2xl">
          <p className="text-foreground/50 mb-5 text-xs font-semibold tracking-[0.18em] uppercase">{locale === "fr" ? "MES SERVICES" : locale === "en" ? "MY SERVICES" : "我的服务"}</p>
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
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {copy.services.map((service, index) => {
            const Icon = icons[index] ?? RefreshCw;
            return (
              <FadeIn key={service.title} delay={Math.min(index * 0.06, 0.18)}>
                <article className="border-foreground/8 bg-background/85 h-full rounded-3xl border p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="border-foreground/10 inline-flex h-10 w-10 items-center justify-center rounded-xl border"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="text-foreground/45 text-xs font-medium">{service.tag}</span>
                  </div>
                  <h3 className="text-foreground mt-7 text-2xl font-medium tracking-tight">{service.title}</h3>
                  <p className="text-foreground/60 mt-3 max-w-[40ch] text-sm leading-relaxed sm:text-base">{service.description}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
        <a href="#contact" className="focus-ring text-foreground mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium underline underline-offset-4">
          {copy.servicesCta}<ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
