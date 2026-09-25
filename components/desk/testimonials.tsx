"use client";

import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { useLanguage } from "@/lib/i18n";
import { testimonials } from "@/lib/testimonials";

/** Client feedback on plain sheets: the proof comes before the prices. */
export function Testimonials(): ReactNode {
  const { locale } = useLanguage();
  const [first, ...others] = testimonials;

  return (
    <section aria-labelledby="testimonials-heading" className="container-x py-12 sm:py-20">
      <FadeIn className="max-w-[40rem]">
        <span className="dymo dymo-blue">{locale === "fr" ? "Avis clients" : "Client feedback"}</span>
        <h2 id="testimonials-heading" className="display mt-5 text-5xl sm:text-7xl">
          {locale === "fr" ? "Ce qu'ils en disent." : "What they say."}
        </h2>
      </FadeIn>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_1fr] lg:gap-6">
        {first ? (
          <FadeIn>
            <figure className="sheet on-paper flex h-full flex-col p-6 sm:p-9">
              <blockquote className="display-md text-2xl leading-snug font-semibold sm:text-[1.9rem]">« {first.quote[locale]} »</blockquote>
              <figcaption className="mt-auto pt-6">
                <p className="typed text-ink/60">{first.author[locale]}</p>
                {first.result ? <p className="stamp mt-4 text-sm sm:text-base" style={{ transform: "rotate(-2deg)" }}>{first.result[locale]}</p> : null}
              </figcaption>
            </figure>
          </FadeIn>
        ) : null}
        <div className="flex flex-col gap-5">
          {others.map((item, index) => (
            <FadeIn key={item.author.fr} delay={0.08 * (index + 1)}>
              <figure className="sheet on-paper p-6 sm:p-7">
                <blockquote className="text-ink/85 text-lg leading-relaxed">« {item.quote[locale]} »</blockquote>
                <figcaption className="typed text-ink/60 mt-4">{item.author[locale]}</figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
