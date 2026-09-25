"use client";

import { ArrowUpRight, Mail } from "@/components/ui/pixel-icon";
import Link from "next/link";
import type { ReactNode } from "react";

import { CallbackForm } from "./callback-form";
import { ContactForm } from "./contact-form";
import { FadeIn } from "@/components/ui/motion-primitives";
import { Linkedin as LinkedinIcon } from "@/components/ui/pixel-icon";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";
import { site } from "@/lib/site";

export function ContactCard(): ReactNode {
  const { copy, locale } = useLanguage();
  const sales = salesCopy[locale];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="on-ink bg-ink text-paper relative scroll-mt-16 overflow-hidden">
      <div aria-hidden="true" className="grid-ink absolute inset-0" />
      <div className="container-x relative py-16 sm:py-24">
        <FadeIn className="max-w-[44rem]">
          <p className="label">{copy.nav.contact}</p>
          <h2 id="contact-heading" className="display mt-4 text-4xl sm:text-6xl">
            {copy.contact.heading}
          </h2>
          <p className="text-paper/70 mt-5 text-lg leading-relaxed">{copy.contact.description}</p>
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-2 lg:gap-6">
          <div className="flex flex-col gap-4">
            <FadeIn>
              <Link
                href="/devis"
                className="focus-ring group bg-paper text-ink brackets flex flex-col p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 sm:p-7"
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="bg-brand px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-white uppercase">{sales.quoteCardTag}</span>
                  <span className="bg-ink text-paper inline-flex h-10 w-10 items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </span>
                <span className="display-md mt-6 text-3xl">{sales.quoteCardTitle}</span>
                <span className="text-ink/70 mt-3 text-[15px] leading-relaxed">{sales.quoteCardText}</span>
                <span className="text-ink/60 font-mono mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] tracking-[0.08em] uppercase">
                  {sales.quoteCardMeta.map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="bg-brand h-1.5 w-1.5" />
                      {item}
                    </span>
                  ))}
                </span>
                <span className="sr-only">{sales.quoteCardCta}</span>
              </Link>
            </FadeIn>
            <FadeIn delay={0.08}>
              <CallbackForm />
            </FadeIn>
            <FadeIn delay={0.12} className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              <a href={`mailto:${site.email}`} className="focus-ring text-paper/75 hover:text-paper inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {sales.directEmail}
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="focus-ring text-paper/75 hover:text-paper inline-flex min-h-11 items-center gap-2 text-sm">
                <LinkedinIcon className="h-4 w-4" />
                LinkedIn
              </a>
              <span className="text-paper/55 font-mono inline-flex min-h-11 items-center text-xs tracking-[0.1em] uppercase">{copy.contact.location}</span>
            </FadeIn>
          </div>
          <FadeIn delay={0.1}>
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
