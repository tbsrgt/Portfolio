"use client";

import type { ReactNode } from "react";

import { HeroCtas } from "./hero-ctas";
import { FadeIn } from "@/components/ui/motion-primitives";
import { useLanguage } from "@/lib/i18n";

export function Hero(): ReactNode {
  const { copy } = useLanguage();

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-4xl px-5 pt-36 pb-16 sm:px-10 sm:pt-56 sm:pb-32">
        <div className="flex justify-center">
          <FadeIn className="flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="text-foreground text-[20px] leading-tight font-medium tracking-tight">
              {copy.hero.greeting}
              <span aria-hidden="true" className="ml-1">
                👋
              </span>
            </p>

            <h1 className="text-foreground text-balance text-[clamp(2.25rem,11vw,2.75rem)] leading-[1.05] font-medium tracking-tight md:text-[2.5rem] lg:text-[3.65rem]">
              <span className="block">
                {copy.hero.titleLine1}
              </span>
              <span className="block">
                {copy.hero.titleLine2}
              </span>
            </h1>

            <p className="text-foreground/65 max-w-[38ch] text-[18px] leading-[1.4] tracking-tight sm:text-[22px]">
              {copy.hero.description}
            </p>

            <HeroCtas />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
