"use client";

import { ArrowRight, Check } from "@/components/ui/pixel-icon";
import Link from "next/link";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

/** Both offer tracks, priced like a menu: title, dotted leader, price. */
export function Services(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <section id="services" aria-labelledby="services-heading" className="container-x scroll-mt-20 py-16 sm:py-24">
      <FadeIn className="max-w-[40rem]">
        <p className="label">{copy.servicesEyebrow}</p>
        <h2 id="services-heading" className="display mt-4 text-4xl sm:text-6xl">
          {copy.servicesHeading}
        </h2>
        <p className="text-foreground/70 mt-5 text-lg leading-relaxed">{copy.servicesDescription}</p>
      </FadeIn>

      <div className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-2 lg:gap-6">
        {copy.tracks.map((track, trackIndex) => {
          const ink = track.id === "software";
          return (
            <FadeIn key={track.id} delay={trackIndex * 0.1}>
              <SpotlightCard
                className={`brackets h-full ${ink ? "on-ink bg-ink text-paper" : "bg-background hairline border"}`}
                color={ink ? "color-mix(in srgb, var(--brand) 28%, transparent)" : "color-mix(in srgb, var(--sun) 35%, transparent)"}
              >
                <div className="flex h-full flex-col p-5 sm:p-8">
                  <p className="label">{track.eyebrow}</p>
                  <h3 className="display-md mt-4 text-[1.9rem] sm:text-4xl">{track.title}</h3>
                  <p className="text-foreground/70 mt-3 leading-relaxed">{track.description}</p>

                  <ul className="mt-7 flex flex-col">
                    {track.offers.map((offer) => (
                      <li key={offer.title} className="hairline border-t py-4">
                        <div className="flex items-baseline">
                          <span className="font-display text-lg font-bold tracking-tight">{offer.title}</span>
                          <span aria-hidden="true" className="leader" />
                          <span className="font-mono shrink-0 text-sm font-medium whitespace-nowrap">{offer.price}</span>
                        </div>
                        {"badge" in offer && offer.badge ? (
                          <span className="bg-brand mt-2 inline-block px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-white uppercase">
                            {offer.badge}
                          </span>
                        ) : null}
                        <p className="text-foreground/65 mt-2 text-sm leading-relaxed">{offer.description}</p>
                        {"priceNote" in offer && offer.priceNote ? (
                          <p className="text-foreground/50 font-mono mt-1 text-xs">{offer.priceNote}</p>
                        ) : null}
                        {"included" in offer && offer.included ? (
                          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                            {offer.included.map((item) => (
                              <li key={item} className="text-foreground/80 flex items-start gap-2 text-sm">
                                <Check className="text-brand mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>

                  <div className="hairline mt-auto border-t pt-6">
                    <Link href={track.href} className={`btn w-full sm:w-auto ${ink ? "btn-primary" : "btn-ink"}`}>
                      {track.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </FadeIn>
          );
        })}
      </div>
      <p className="text-foreground/50 font-mono mt-5 text-xs">{copy.pricesNote}</p>
    </section>
  );
}
