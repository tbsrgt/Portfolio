"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowRight, Check } from "@/components/ui/pixel-icon";
import { FadeIn } from "@/components/ui/motion-primitives";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

/** The offers, laid out as a real quote on an A4 sheet. */
export function QuoteSheet(): ReactNode {
  const { locale } = useLanguage();
  const copy = deskCopy[locale];
  const sales = salesCopy[locale];

  return (
    <section id="offres" aria-labelledby="offers-heading" className="container-x scroll-mt-20 py-12 sm:py-20">
      <FadeIn className="max-w-[40rem]">
        <span className="dymo dymo-red">{copy.offersLabel}</span>
        <h2 id="offers-heading" className="display mt-5 text-5xl sm:text-7xl">
          {copy.offersTitle}
        </h2>
      </FadeIn>

      <FadeIn className="mt-10 sm:mt-14">
        <article className="sheet on-paper mx-auto max-w-[56rem] rotate-[0.6deg] p-5 sm:p-10 lg:p-14">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-ink pb-5">
            <div>
              <p className="display text-3xl sm:text-4xl">{locale === "fr" ? "DEVIS" : "QUOTE"}</p>
              <p className="typed text-ink/60 mt-2">N° 2026-09-TR · {copy.offersDate}</p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold">Tobias Ringot</p>
              <p className="text-ink/60 text-sm">Aix-en-Provence</p>
              <p className="hand pen mt-1 text-xl">{copy.offersClient}</p>
            </div>
          </header>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
            {sales.tracks.map((track) => (
              <div key={track.id}>
                <h3 className="display-md text-2xl sm:text-3xl">{track.eyebrow}</h3>
                <p className="text-ink/65 mt-2 text-sm leading-relaxed">{track.description}</p>
                <ul className="mt-5 flex flex-col">
                  {track.offers.map((offer) => (
                    <li key={offer.title} className="relative border-t border-ink/15 py-3.5">
                      <div className="flex items-baseline">
                        <span className="font-display text-[1.05rem] leading-tight font-bold">{offer.title}</span>
                        <span className="leader" />
                        <span className="font-mono shrink-0 text-sm">{offer.price}</span>
                      </div>
                      <p className="text-ink/60 mt-1 text-[13px] leading-snug">{offer.description}</p>
                      {"priceNote" in offer && offer.priceNote ? <p className="hand pen mt-1 text-lg">{offer.priceNote}</p> : null}
                      {"included" in offer && offer.included ? (
                        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                          {offer.included.map((item) => (
                            <li key={item} className="flex items-start gap-1.5 text-[13px]">
                              <Check className="text-stamp mt-0.5 h-4 w-4 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {"badge" in offer && offer.badge ? <span className="stamp mt-2 text-xs">{offer.badge}</span> : null}
                    </li>
                  ))}
                </ul>
                <Link href={track.href} className={`btn mt-6 w-full sm:w-auto ${track.id === "web" ? "btn-stamp" : "btn-ink"}`}>
                  {track.cta}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            ))}
          </div>

          <footer className="mt-10 border-t-2 border-ink pt-5">
            <div className="flex items-baseline font-mono text-sm">
              <span className="font-bold uppercase">{copy.offersTotal}</span>
              <span className="leader" />
              <span className="font-bold">{copy.offersZero}</span>
            </div>
            <p className="text-ink/55 mt-3 text-xs leading-relaxed">{copy.offersNote} {sales.guaranteesPayment}</p>
            <p className="hand pen mt-6 text-3xl">{copy.offersSign}</p>
          </footer>
        </article>
      </FadeIn>
    </section>
  );
}
