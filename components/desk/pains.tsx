"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { ArrowRight } from "@/components/ui/pixel-icon";
import { FadeIn } from "@/components/ui/motion-primitives";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";

const TILT = [-6, 4, -3, 7, -5, 3] as const;
const tilt = (index: number): number => TILT[index % TILT.length] ?? 0;

/** The client's mess as post-its that drop onto the desk, then the promise. */
export function Pains(): ReactNode {
  const { locale } = useLanguage();
  const copy = deskCopy[locale];
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="pains-heading" className="container-x py-12 sm:py-20">
      <FadeIn>
        <span className="dymo">{copy.painsLabel}</span>
      </FadeIn>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {copy.pains.map((pain, index) => (
          <motion.li
            key={pain}
            initial={reduced ? false : { opacity: 0, y: -120, rotate: tilt(index) * 3 }}
            whileInView={{ opacity: 1, y: 0, rotate: tilt(index) }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: index * 0.08 }}
            className="postit hand aspect-square p-4 text-[1.25rem] leading-tight sm:p-5 sm:text-[1.45rem]"
          >
            <span className="relative">{pain}</span>
          </motion.li>
        ))}
      </ul>
      <FadeIn className="mt-12 max-w-[44rem] sm:mt-16">
        <h2 id="pains-heading" className="display text-5xl sm:text-7xl">
          {copy.painsTitle}
        </h2>
        <p className="text-paper/75 mt-5 text-lg leading-relaxed sm:text-xl">{copy.painsText}</p>
        <a href="#contact" className="btn btn-paper mt-7">
          {copy.painsCta}
          <ArrowRight className="h-5 w-5" />
        </a>
      </FadeIn>
    </section>
  );
}
