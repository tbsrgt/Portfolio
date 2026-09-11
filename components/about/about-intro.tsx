"use client";

import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { useLanguage } from "@/lib/i18n";

const strongClass = "font-semibold text-foreground";

export function AboutIntro(): ReactNode {
  const { copy } = useLanguage();
  const about = copy.about;

  return (
    <FadeIn delay={0.5}>
      <div className="border-foreground/5 bg-foreground/1.5 dark:bg-foreground/3 rounded-4xl border p-8 sm:p-12">
        <h1 className="text-foreground font-serif text-[1.75rem] font-medium tracking-tight sm:text-[2rem]">
          {about.hello}{" "}
          <span className="border-foreground/30 border-b pb-0.5">
            Tobias Ringot
          </span>
          {"."}
        </h1>
        <div className="text-foreground/75 mt-8 space-y-6 text-[17px] leading-[1.7] tracking-tight sm:text-[18px]">
          <p>
            {about.intro1Start}{" "}
            <strong className={strongClass}>{about.intro1Strong1}</strong>{" "}
            {about.intro1Middle}{" "}
            <strong className={strongClass}>{about.intro1Strong2}</strong>{" "}
            {about.intro1And}{" "}
            <strong className={strongClass}>{about.intro1Strong3}</strong>
            {",\u00A0"}
            {about.intro1End}
          </p>
          <p>{about.intro2}</p>
          <p>{about.intro3}</p>
        </div>
      </div>
    </FadeIn>
  );
}
