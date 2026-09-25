"use client";

import { ArrowUpRight } from "@/components/ui/pixel-icon";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";
import { site } from "@/lib/site";

/** "Why me" arguments next to the portrait; one block instead of two. */
export function AboutTeaser(): ReactNode {
  const { locale, copy: ui } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <section aria-labelledby="about-heading" className="bg-paper-2 hairline relative border-y">
      <div className="container-x grid gap-10 py-16 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <FadeIn>
          <p className="label">{copy.whyEyebrow}</p>
          <h2 id="about-heading" className="display mt-4 text-4xl sm:text-6xl">
            {copy.whyHeading}
          </h2>
          <div className="mt-8 flex items-center gap-5">
            {site.photo ? (
              <span className="brackets block p-1.5">
                <Image
                  src={site.photo}
                  alt={ui.about.photoAlt}
                  width={200}
                  height={200}
                  className="h-24 w-24 object-cover grayscale transition-[filter] duration-500 hover:grayscale-0 sm:h-28 sm:w-28"
                />
              </span>
            ) : null}
            <div>
              <p className="font-display text-xl font-bold tracking-tight">{site.name}</p>
              <p className="text-foreground/60 font-mono mt-1 text-xs tracking-[0.12em] uppercase">{site.role}</p>
              <p className="text-foreground/70 mt-3 max-w-[34ch] text-sm leading-relaxed">{copy.aboutText}</p>
            </div>
          </div>
          <Link href="/about" className="focus-ring group mt-6 inline-flex items-center gap-2 font-semibold underline decoration-2 underline-offset-4">
            {copy.aboutCta}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </FadeIn>

        <ul className="hairline flex flex-col border-t">
          {copy.whyPoints.map((point, index) => (
            <FadeIn key={point.title} delay={index * 0.06}>
              <li className="hairline grid gap-2 border-b py-6 sm:grid-cols-[1fr_1.3fr] sm:gap-8">
                <h3 className="display-md text-2xl">{point.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{point.description}</p>
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
