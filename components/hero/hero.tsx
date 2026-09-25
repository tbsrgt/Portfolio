"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProjectMarquee } from "@/components/sales/project-marquee";
import { PixelBand } from "@/components/ui/pixel-band";
import { ArrowRight, Phone } from "@/components/ui/pixel-icon";
import { PixelPortrait } from "@/components/ui/pixel-portrait";
import { SplitText } from "@/components/ui/split-text";
import { useLanguage } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { salesCopy } from "@/lib/sales-copy";
import { site } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero(): ReactNode {
  const { copy, locale } = useLanguage();
  const sales = salesCopy[locale];
  const proof =
    locale === "fr"
      ? [
          { value: `${projects.length}`, label: "projets livrés" },
          { value: "24 h", label: "de réponse maximum" },
          { value: "100 %", label: "du code à votre nom" },
        ]
      : [
          { value: `${projects.length}`, label: "projects delivered" },
          { value: "24 h", label: "maximum response time" },
          { value: "100 %", label: "of the code in your name" },
        ];

  return (
    <section className="on-ink bg-ink text-paper relative overflow-hidden" aria-labelledby="hero-heading">
      <div aria-hidden="true" className="grid-ink absolute inset-0" />
      <div className="container-x relative pt-24 pb-10 sm:pt-32 sm:pb-14 lg:grid lg:grid-cols-[1fr_auto] lg:items-start lg:gap-12">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col gap-1.5"
          >
            <div className="contents">
              <span className="label text-paper/60">{sales.heroKicker}</span>
              <span className="text-paper/70 font-mono inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="bg-sun absolute inline-flex h-full w-full animate-ping opacity-60" />
                  <span className="bg-sun relative inline-flex h-2 w-2" />
                </span>
                {sales.heroAvailability}
              </span>
            </div>
          </motion.div>

          <h1 id="hero-heading" className="display mt-8 text-[2.85rem] sm:text-7xl lg:text-[6.2rem]">
            <span className="block">
              <SplitText text={copy.hero.titleLine1} delay={0.1} />
            </span>
            <span className="text-paper/85 block">
              <SplitText text={copy.hero.titleLine2} delay={0.35} />
              <span aria-hidden="true" className="cursor-blink" />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            className="text-paper/70 mt-7 max-w-[46ch] text-lg leading-relaxed sm:text-xl"
          >
            {copy.hero.description}
          </motion.p>

          <motion.div
            id="hero-ctas"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link href="/devis" className="btn btn-primary h-13 px-6 text-base">
              {sales.tracks[0].cta}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#contact" className="btn btn-ghost h-13 px-6 text-base">
              <Phone className="h-5 w-5" />
              {sales.heroCallbackCta}
            </a>
            <span className="text-paper/55 font-mono text-xs tracking-[0.08em] sm:ml-3">{sales.heroPrice}</span>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="brackets mt-14 grid grid-cols-3 gap-2 py-4 sm:mt-20 sm:w-fit sm:gap-10 sm:px-6"
            aria-label={locale === "fr" ? "Repères" : "Key facts"}
          >
            {proof.map((item) => (
              <li key={item.label} className="flex flex-col px-2">
                <span className="display-md text-2xl sm:text-4xl">{item.value}</span>
                <span className="text-paper/55 mt-1 text-xs leading-snug sm:text-sm">{item.label}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        {site.photo ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="hidden pt-2 lg:block"
          >
            <PixelPortrait src={site.photo} alt={copy.about.photoAlt} size={400} className="w-[260px] xl:w-[320px]" />
          </motion.div>
        ) : null}
      </div>

      <ProjectMarquee />

      <div className="relative flex justify-end">
        <PixelBand align="right" className="w-[70%] sm:w-[46%]" />
      </div>
    </section>
  );
}
