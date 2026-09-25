"use client";

import type { ReactNode } from "react";

import { CallbackForm } from "@/components/contact/callback-form";
import { ContactForm } from "@/components/contact/contact-form";
import { Linkedin, Mail } from "@/components/ui/pixel-icon";
import { FadeIn } from "@/components/ui/motion-primitives";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Contact: the phone slip and the message sheet, side by side on the desk. */
export function ContactDesk(): ReactNode {
  const { locale, copy: ui } = useLanguage();
  const copy = deskCopy[locale];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="container-x scroll-mt-16 py-12 sm:py-20">
      <FadeIn className="max-w-[44rem]">
        <span className="dymo dymo-red">{copy.contactLabel}</span>
        <h2 id="contact-heading" className="display mt-5 text-5xl sm:text-7xl">
          {copy.contactTitle}
        </h2>
        <p className="text-paper/75 mt-5 text-lg leading-relaxed">{copy.contactText}</p>
      </FadeIn>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <FadeIn>
          <div className="sheet on-paper -rotate-[1deg] p-2 [&>form]:mt-0 [&>form]:border-0 [&>form]:shadow-none">
            <CallbackForm />
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href={`mailto:${site.email}`} className="focus-ring text-paper/80 hover:text-paper inline-flex min-h-11 items-center gap-2 font-display font-bold underline decoration-2 underline-offset-4">
                <Mail className="h-5 w-5" />
                {copy.contactEmail}
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="focus-ring text-paper/80 hover:text-paper inline-flex min-h-11 items-center gap-2 font-display font-bold">
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
            </li>
            <li className="text-paper/55 typed inline-flex min-h-11 items-center">{ui.contact.location}</li>
          </ul>
        </FadeIn>
        <FadeIn delay={0.08}>
          <div className="sheet on-paper rotate-[0.8deg] p-1 [&>form]:border-0 [&>form]:shadow-none">
            <ContactForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
