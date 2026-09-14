"use client";

import { MapPin, Tag } from "lucide-react";
import type { ReactNode } from "react";

import { HeroCtas } from "./hero-ctas";
import { FadeIn } from "@/components/ui/motion-primitives";
import { LinkedinIcon } from "@/components/ui/linkedin-icon";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";
import { site } from "@/lib/site";

const pillClass =
  "border-foreground/8 bg-background/70 text-foreground/75 inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium backdrop-blur-md sm:text-sm";

export function Hero(): ReactNode {
  const { copy, locale } = useLanguage();
  const sales = salesCopy[locale];

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-4xl px-5 pt-36 pb-20 sm:px-10 sm:pt-44 sm:pb-22">
        <div className="flex justify-center">
          <FadeIn className="flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="text-foreground text-[16px] leading-tight font-medium tracking-tight sm:text-[18px]">
              {sales.heroKicker}
            </p>

            <h1 className="text-foreground text-balance text-[clamp(2.25rem,11vw,2.75rem)] leading-[1.05] font-medium tracking-tight md:text-[2.5rem] lg:text-[3.65rem]">
              <span className="block">{copy.hero.titleLine1}</span>
              <span className="block">{copy.hero.titleLine2}</span>
            </h1>

            <p className="text-foreground/65 max-w-[40ch] text-[18px] leading-[1.4] tracking-tight sm:text-[22px]">
              {copy.hero.description}
            </p>

            <HeroCtas />

            <ul className="mt-3 flex flex-wrap items-center justify-center gap-2">
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

            <p className="text-foreground/50 max-w-[50ch] text-sm leading-relaxed sm:text-base">{sales.heroNote}</p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
