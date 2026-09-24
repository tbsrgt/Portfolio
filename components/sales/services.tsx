"use client";

import { ArrowRight, Boxes, Globe } from "lucide-react";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

const icons = { web: Globe, software: Boxes } as const;

export function Services(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="scroll-mt-24 px-6 sm:px-10"
    >
      <div className="mx-auto max-w-275">
        <FadeIn className="max-w-2xl">
          <p className="text-foreground/50 mb-5 text-xs font-semibold tracking-[0.18em] uppercase">
            {copy.servicesEyebrow}
          </p>
          <ScrollReveal
            as="h2"
            id="services-heading"
            textClassName="text-foreground text-[2.4rem] leading-[1.05] font-medium tracking-[-0.03em] md:text-[3rem] lg:text-[3.4rem]"
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

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {copy.tracks.map((track, index) => {
            const Icon = icons[track.id as keyof typeof icons] ?? Globe;
            const software = track.id === "software";
            return (
              <FadeIn
                key={track.id}
                delay={0.05 + index * 0.08}
                className="h-full"
              >
                <article
                  className={`flex h-full flex-col rounded-4xl border p-6 sm:p-8 ${software ? "bg-foreground text-background border-transparent" : "border-foreground/8 bg-background/85"}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${software ? "border-background/15" : "border-foreground/10"}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span
                      className={`text-sm font-medium ${software ? "text-brand" : "text-foreground/60"}`}
                    >
                      {track.eyebrow}
                    </span>
                  </div>
                  <h3 className="mt-7 text-[1.65rem] leading-tight font-medium tracking-tight sm:text-[1.9rem]">
                    {track.title}
                  </h3>
                  <p
                    className={`mt-3 max-w-[48ch] leading-relaxed ${software ? "text-background/65" : "text-foreground/65"}`}
                  >
                    {track.description}
                  </p>

                  <ul
                    className={`mt-8 flex flex-col border-t ${software ? "border-background/12" : "border-foreground/8"}`}
                  >
                    {track.offers.map((offer) => (
                      <li
                        key={offer.title}
                        className={`grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b py-4 ${software ? "border-background/12" : "border-foreground/8"}`}
                      >
                        <span className="font-medium tracking-tight">
                          {offer.title}
                        </span>
                        <span className="text-right font-medium tabular-nums">
                          {offer.price}
                        </span>
                        <span
                          className={`col-span-2 text-sm leading-relaxed ${software ? "text-background/55" : "text-foreground/55"}`}
                        >
                          {offer.description}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={track.href}
                    className={`focus-ring mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5 ${software ? "bg-background text-foreground" : "bg-foreground text-background"}`}
                  >
                    {track.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </article>
              </FadeIn>
            );
          })}
        </div>
        <p className="text-foreground/50 mt-5 text-sm">{copy.pricesNote}</p>
      </div>
    </section>
  );
}
