"use client";

import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Portrait } from "@/components/about/portrait";
import { FadeIn } from "@/components/ui/motion-primitives";
import { LinkedinIcon } from "@/components/ui/linkedin-icon";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";
import { site } from "@/lib/site";

export function AboutTeaser(): ReactNode {
  const { locale, copy } = useLanguage();
  const sales = salesCopy[locale];

  return (
    <section aria-labelledby="about-teaser-heading" className="px-6 sm:px-10">
      <FadeIn className="mx-auto max-w-275">
        <div className="border-foreground/8 bg-background/85 flex flex-col gap-8 rounded-4xl border p-6 sm:p-10 md:flex-row md:items-center md:gap-12">
          <Portrait
            alt={copy.about.photoAlt}
            className="aspect-square w-32 sm:w-44"
          />
          <div className="flex flex-col">
            <p className="text-foreground/50 mb-4 text-xs font-semibold tracking-[0.18em] uppercase">
              {sales.aboutEyebrow}
            </p>
            <h2
              id="about-teaser-heading"
              className="text-foreground text-[2rem] leading-[1.1] font-medium tracking-tight sm:text-[2.5rem]"
            >
              {sales.aboutHeading}
            </h2>
            <p className="text-foreground/65 mt-4 max-w-[58ch] text-[17px] leading-relaxed">
              {sales.aboutText}
            </p>
            <p className="text-foreground/50 mt-4 inline-flex items-center gap-1.5 text-sm">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {copy.contact.location}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/about"
                className="focus-ring group bg-foreground text-background inline-flex min-h-11 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
              >
                {sales.aboutCta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring border-foreground/10 text-foreground hover:bg-foreground/4 inline-flex min-h-11 items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
