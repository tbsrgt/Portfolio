"use client";

import { MapPin, Tag } from "lucide-react";
import type { ReactNode } from "react";

import { HeroCtas } from "./hero-ctas";
import { Portrait } from "@/components/about/portrait";
import { FadeIn } from "@/components/ui/motion-primitives";
import { LinkedinIcon } from "@/components/ui/linkedin-icon";
import { PixelBand } from "@/components/ui/pixel-band";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";
import { site } from "@/lib/site";

const pillClass =
  "border-foreground/10 bg-background/70 text-foreground/75 inline-flex min-h-9 items-center gap-2 rounded-md border px-3 py-1.5 text-[13px] font-medium backdrop-blur-md sm:text-sm";

export function Hero(): ReactNode {
  const { copy, locale } = useLanguage();
  const sales = salesCopy[locale];

  return (
    <section className="relative w-full">
      <div className="mx-auto grid w-full max-w-275 gap-12 px-5 pt-32 pb-14 sm:px-10 sm:pt-44 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
        <FadeIn className="flex max-w-3xl flex-col gap-6">
          <p className="text-foreground/70 flex items-center gap-2.5 text-[15px] font-medium tracking-tight sm:text-base">
            <span
              className="bg-brand inline-block h-3 w-3"
              aria-hidden="true"
            />
            {sales.heroKicker}
          </p>

          <h1 className="text-foreground text-[clamp(2.3rem,6.8vw,3.9rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance">
            <span className="block">{copy.hero.titleLine1}</span>
            <span className="text-brand block">{copy.hero.titleLine2}</span>
          </h1>

          <p className="text-foreground/70 max-w-[52ch] text-[18px] leading-[1.45] tracking-tight sm:text-[20px]">
            {copy.hero.description}
          </p>

          <HeroCtas />

          <ul className="flex flex-wrap items-center gap-2">
            <li className={pillClass}>
              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
              {sales.heroPrice}
            </li>
            <li className={pillClass}>
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {copy.contact.location}
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`${pillClass} focus-ring hover:text-foreground transition-colors`}
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            </li>
          </ul>
        </FadeIn>

        <FadeIn
          delay={0.12}
          className="flex items-end gap-5 lg:flex-col lg:items-start lg:gap-4"
        >
          <div className="relative shrink-0">
            <span
              aria-hidden="true"
              className="bg-brand absolute -right-2.5 -bottom-2.5 h-full w-full"
            />
            <Portrait
              alt={copy.about.photoAlt}
              className="relative aspect-square w-28 sm:w-40 lg:w-52"
            />
          </div>
          <div className="text-sm leading-snug">
            <p className="text-foreground text-base font-medium">{site.name}</p>
            <p className="text-foreground/60">{site.role}</p>
            <p className="text-foreground/70 mt-2 inline-flex items-center gap-2 text-xs">
              <span aria-hidden="true" className="h-2 w-2 bg-emerald-500" />
              {sales.heroAvailability}
            </p>
          </div>
        </FadeIn>
      </div>

      <div className="mx-auto w-full max-w-275 px-5 sm:px-10">
        <p className="text-foreground/55 pb-6 text-sm">{sales.heroNote}</p>
      </div>
      <PixelBand />
    </section>
  );
}
