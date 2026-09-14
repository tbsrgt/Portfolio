"use client";

import { Mail } from "lucide-react";
import type { ReactNode } from "react";

import { ContactForm } from "./contact-form";
import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ShaderFlow } from "@/components/shaders/shader-flow";
import { useLanguage } from "@/lib/i18n";

export function ContactCard(): ReactNode {
  const { copy } = useLanguage();

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
                textClassName="text-foreground/65 max-w-[31ch] text-lg leading-relaxed"
              >
                {copy.contact.description}
              </ScrollReveal>
              <a href="mailto:tobiasringot13@gmail.com" className="focus-ring text-foreground/70 mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm underline underline-offset-4 hover:text-foreground">
                <Mail className="h-4 w-4" aria-hidden="true" />
                tobiasringot13@gmail.com
              </a>
              <p className="text-foreground/45 mt-auto pt-8 text-xs">{copy.contact.builtWith}</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
