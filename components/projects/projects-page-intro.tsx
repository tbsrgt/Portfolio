"use client";

import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

export function ProjectsPageIntro(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <FadeIn className="flex flex-col items-center gap-5 text-center">
      <h1 className="text-foreground text-[2.75rem] leading-[1.05] font-medium tracking-tight md:text-[3.25rem] lg:text-[3.75rem]">
        {copy.projectsPageHeading}
      </h1>
      <p className="text-foreground/65 max-w-[33ch] text-[20px] leading-[1.4] tracking-tight sm:text-[22px]">
        {copy.projectsPageDescription}
      </p>
    </FadeIn>
  );
}
