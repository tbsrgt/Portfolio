"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { Check } from "@/components/ui/pixel-icon";
import { FadeIn } from "@/components/ui/motion-primitives";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

/** The method as a lined sheet with boxes that get ticked as you scroll. */
export function Checklist(): ReactNode {
  const { locale } = useLanguage();
  const copy = deskCopy[locale];
  const steps = salesCopy[locale].approachSteps;
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="method-heading" className="container-x py-12 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <FadeIn>
          <span className="dymo">{copy.methodLabel}</span>
          <h2 id="method-heading" className="display mt-5 text-5xl sm:text-7xl">
            {copy.methodTitle}
          </h2>
        </FadeIn>
        <FadeIn>
          <ol className="sheet sheet-lined on-paper -rotate-[0.8deg] p-6 sm:p-9">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4 py-3 sm:gap-5">
                <motion.span
                  initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-20% 0px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.2 + index * 0.25 }}
                  className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center border-2 border-ink"
                >
                  <Check className="text-pen h-6 w-6" />
                </motion.span>
                <div>
                  <h3 className="display-md text-2xl sm:text-3xl">
                    <span className="text-ink/40 mr-2 font-mono text-base">{index + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="text-ink/70 mt-1.5 text-[15px] leading-relaxed">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </section>
  );
}
