"use client";

import { MapPin, Tag } from "lucide-react";
import type { ReactNode } from "react";

import { HeroCtas } from "./hero-ctas";
import { ProductDemo } from "@/components/demo/product-demo";
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
    <section className="relative w-full px-5 sm:px-10">
      <div className="mx-auto w-full max-w-275 pt-36 pb-14 sm:pt-44">
        <FadeIn className="flex max-w-4xl flex-col gap-6">
          <p className="text-foreground/70 flex items-center gap-2.5 text-[15px] font-medium tracking-tight sm:text-base">
            <span
              className="bg-brand inline-block h-2.5 w-3.5 rounded-[2px]"
              aria-hidden="true"
            />
            {sales.heroKicker}
          </p>

          <h1 className="text-foreground text-[clamp(2.4rem,8.5vw,4.6rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance">
            <span className="block">{copy.hero.titleLine1}</span>
            <span className="text-foreground/45 block">
              {copy.hero.titleLine2}
            </span>
          </h1>

          <p className="text-foreground/65 max-w-[52ch] text-[18px] leading-[1.45] tracking-tight sm:text-[20px]">
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

        <FadeIn delay={0.15} className="mt-16 sm:mt-20">
          <div id="demo" className="scroll-mt-28">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
              <div>
                <p className="text-brand text-sm font-medium">
                  {sales.demoEyebrow}
                </p>
                <h2 className="text-foreground mt-1 text-2xl font-medium tracking-tight sm:text-[1.75rem]">
                  {sales.demoHeading}
                </h2>
              </div>
              <p className="text-foreground/55 max-w-[46ch] text-sm leading-relaxed sm:text-[15px]">
                {sales.demoDescription}
              </p>
            </div>
            <ProductDemo />
          </div>
        </FadeIn>

        <p className="text-foreground/50 mt-6 text-sm">{sales.heroNote}</p>
      </div>
    </section>
  );
}
