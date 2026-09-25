"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowUpRight } from "@/components/ui/pixel-icon";
import { FadeIn } from "@/components/ui/motion-primitives";
import { PixelPortrait } from "@/components/ui/pixel-portrait";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";
import { site } from "@/lib/site";

/** About: a framed photo and a letter on lined paper. */
export function Letter(): ReactNode {
  const { locale, copy: ui } = useLanguage();
  const copy = deskCopy[locale];
  const points = salesCopy[locale].whyPoints;

  return (
    <section aria-labelledby="about-heading" className="container-x py-12 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
        <FadeIn className="flex flex-col items-start gap-5">
          <span className="dymo">{copy.aboutLabel}</span>
          {site.photo ? (
            <div className="bg-ink w-[220px] rotate-[-3deg] p-3 shadow-[0_20px_40px_-16px_rgb(0_0_0/0.7)] sm:w-[280px]">
              <PixelPortrait src={site.photo} alt={ui.about.photoAlt} size={320} className="w-full p-0" />
            </div>
          ) : null}
          <p className="hand text-postit max-w-[24ch] text-2xl">{copy.aboutNote}</p>
        </FadeIn>

        <FadeIn>
          <article className="sheet sheet-lined on-paper rotate-[0.8deg] p-6 sm:p-10">
            <h2 id="about-heading" className="display text-4xl sm:text-6xl">
              {copy.aboutTitle}
            </h2>
            <p className="text-ink/80 mt-5 text-[17px] leading-[2rem]">{copy.aboutText}</p>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {points.map((point) => (
                <li key={point.title} className="py-2">
                  <h3 className="display-md text-xl">{point.title}</h3>
                  <p className="text-ink/65 mt-1 text-sm leading-relaxed">{point.description}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <Link href="/about" className="focus-ring group inline-flex items-center gap-2 font-display font-bold underline decoration-2 underline-offset-4">
                {copy.aboutCta}
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <span className="hand pen text-3xl">Tobias</span>
            </div>
          </article>
        </FadeIn>
      </div>
    </section>
  );
}
