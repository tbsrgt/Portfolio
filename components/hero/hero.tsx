"use client";

import type { ReactNode } from "react";

import { HeroCtas } from "./hero-ctas";
import { FadeIn, ScaleUnblur } from "@/components/ui/motion-primitives";
import { PortraitMorph } from "./portrait-morph";
import { useLanguage } from "@/lib/i18n";

const PORTRAIT_SRC = "/josh.webp";
const PORTRAIT_HOVER_SRC = "/josh_wave.webp";

export function Hero(): ReactNode {
  const { copy } = useLanguage();

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-5 pt-36 pb-16 sm:px-10 sm:pt-56 sm:pb-32">
        <div className="grid grid-cols-1 items-center gap-7 md:grid-cols-2 md:gap-8">
          <FadeIn className="flex flex-col gap-4">
            <p className="text-foreground text-[20px] leading-tight font-medium tracking-tight">
              {copy.hero.greeting}
              <span aria-hidden="true" className="ml-1">
                👋
              </span>
            </p>

            <h1 className="text-foreground text-[clamp(2.25rem,11vw,2.75rem)] leading-[1.05] font-medium tracking-tight md:text-[2.5rem] lg:text-[3.65rem]">
              <span className="block lg:whitespace-nowrap">
                {copy.hero.titleLine1}
              </span>
              <span className="block lg:whitespace-nowrap">
                {copy.hero.titleLine2}
              </span>
            </h1>

            <p className="text-foreground/65 max-w-[34ch] text-[18px] leading-[1.4] tracking-tight sm:text-[22px]">
              {copy.hero.description}
            </p>

            <HeroCtas />
          </FadeIn>

          <ScaleUnblur className="flex justify-stretch md:justify-end">
            <div className="border-foreground/8 bg-background relative aspect-square w-full overflow-hidden rounded-4xl border p-1.5 shadow-sm md:max-w-105">
              <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
                <PortraitMorph
                  srcA={PORTRAIT_SRC}
                  srcB={PORTRAIT_HOVER_SRC}
                  alt={copy.hero.portraitAlt}
                />
              </div>
            </div>
          </ScaleUnblur>
        </div>
      </div>
    </section>
  );
}
