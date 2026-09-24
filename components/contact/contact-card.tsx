"use client";

import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ContactForm } from "./contact-form";
import { FadeIn } from "@/components/ui/motion-primitives";
import { LinkedinIcon } from "@/components/ui/linkedin-icon";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ShaderFlow } from "@/components/shaders/shader-flow";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";
import { site } from "@/lib/site";

const detailClass =
  "focus-ring text-foreground/70 hover:text-foreground inline-flex min-h-11 items-center gap-2.5 rounded-lg text-sm transition-colors";

export function ContactCard(): ReactNode {
  const { copy, locale } = useLanguage();
  const sales = salesCopy[locale];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="mx-auto my-12 w-full max-w-275 scroll-mt-24 px-6 sm:my-20 sm:px-10">
      <FadeIn>
        <div className="border-foreground/8 bg-background relative overflow-hidden rounded-4xl border p-1.5 shadow-sm">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-15">
            <ShaderFlow scale={3} brightness={3} />
          </div>
          <div className="relative grid gap-8 rounded-[1.6rem] p-5 sm:p-7 md:grid-cols-2 md:gap-7 lg:gap-10 lg:p-8">
            <div className="flex flex-col items-start py-3 lg:py-5">
              <ScrollReveal
                as="h2"
                id="contact-heading"
                textClassName="text-foreground text-[2.5rem] leading-[1.05] font-medium tracking-tight sm:text-[3rem]"
              >
                {copy.contact.heading}
              </ScrollReveal>
              <ScrollReveal
                containerClassName="mt-5"
                textClassName="text-foreground/65 max-w-[34ch] text-lg leading-relaxed"
              >
                {copy.contact.description}
              </ScrollReveal>
              <Link
                href="/devis"
                className="focus-ring group bg-foreground text-background mt-8 flex w-full flex-col rounded-3xl p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 sm:p-7"
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="bg-background/12 rounded-full px-3 py-1 text-xs font-medium">{sales.quoteCardTag}</span>
                  <span className="bg-background text-foreground inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-6 text-[1.75rem] leading-tight font-medium tracking-tight">{sales.quoteCardTitle}</span>
                <span className="text-background/70 mt-2 text-[15px] leading-relaxed">{sales.quoteCardText}</span>
                <span className="text-background/60 mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {sales.quoteCardMeta.map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="bg-background/50 h-1 w-1 rounded-full" />
                      {item}
                    </span>
                  ))}
                </span>
                <span className="sr-only">{sales.quoteCardCta}</span>
              </Link>
              <p className="text-foreground/60 mt-5 text-sm">{sales.heroPrice}</p>
              <ul className="mt-4 flex flex-col">
                <li>
                  <a href={`mailto:${site.email}`} className={`${detailClass} underline underline-offset-4`}>
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {site.email}
                  </a>
                </li>
                <li>
                  <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={detailClass}>
                    <LinkedinIcon className="h-4 w-4" />
                    LinkedIn
                  </a>
                </li>
                <li className="text-foreground/70 inline-flex min-h-11 items-center gap-2.5 text-sm">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {copy.contact.location}
                </li>
              </ul>
            </div>
            <ContactForm />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
