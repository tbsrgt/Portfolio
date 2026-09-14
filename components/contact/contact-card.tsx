"use client";

import { Mail, MapPin } from "lucide-react";
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
          <div className="relative grid gap-8 rounded-[1.6rem] p-5 sm:p-7 md:grid-cols-[0.8fr_1.2fr] md:gap-7 lg:gap-10 lg:p-8">
            <div className="flex flex-col items-start py-3 lg:py-5">
              <ScrollReveal
                as="h2"
                id="contact-heading"
                textClassName="text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight sm:text-[3rem]"
              >
                {copy.contact.heading}
              </ScrollReveal>
              <ScrollReveal
                containerClassName="mt-5"
                textClassName="text-foreground/65 max-w-[34ch] text-lg leading-relaxed"
              >
                {copy.contact.description}
              </ScrollReveal>
              <p className="border-foreground/8 bg-background/80 text-foreground mt-6 rounded-full border px-3.5 py-1.5 text-sm font-medium backdrop-blur-md">
                {sales.heroPrice}
              </p>
              <ul className="mt-6 flex flex-col">
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
