"use client";

import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { Portrait } from "@/components/about/portrait";
import { FadeIn } from "@/components/ui/motion-primitives";
import { LinkedinIcon } from "@/components/ui/linkedin-icon";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";
import { site } from "@/lib/site";

export function AboutIntro(): ReactNode {
  const { copy, locale } = useLanguage();
  const about = copy.about;

  return (
    <FadeIn delay={0.2}>
      <div className="border-foreground/5 bg-foreground/1.5 dark:bg-foreground/3 rounded-4xl border p-8 sm:p-12">
        <Portrait alt={about.photoAlt} className="aspect-square w-24 sm:w-28" />
        <h1 className="text-foreground mt-8 font-serif text-[1.75rem] font-medium tracking-tight sm:text-[2rem]">
          {about.hello}{" "}
          <span className="border-foreground/30 border-b pb-0.5">{site.name}</span>
          {"."}
        </h1>
        <div className="text-foreground/75 mt-8 space-y-6 text-[17px] leading-[1.7] tracking-tight sm:text-[18px]">
          <p>{about.intro1}</p>
          <p>{about.intro2}</p>
          <p>{about.intro3}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            className="focus-ring group bg-foreground text-background inline-flex min-h-11 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
          >
            {salesCopy[locale].featured.cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring border-foreground/10 bg-background text-foreground hover:bg-foreground/4 inline-flex min-h-11 items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            <LinkedinIcon className="h-4 w-4" />
            {about.linkedin}
          </a>
        </div>
      </div>
    </FadeIn>
  );
}
