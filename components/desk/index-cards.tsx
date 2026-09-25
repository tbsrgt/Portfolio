"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

import { Plus } from "@/components/ui/pixel-icon";
import { FadeIn } from "@/components/ui/motion-primitives";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

const EASE = [0.22, 1, 0.36, 1] as const;

/** FAQ as a stack of index cards; one opens at a time. */
export function IndexCards(): ReactNode {
  const { locale } = useLanguage();
  const copy = deskCopy[locale];
  const faq = salesCopy[locale].faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="container-x py-12 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <FadeIn>
          <span className="dymo">{copy.faqLabel}</span>
          <h2 id="faq-heading" className="display mt-5 text-5xl sm:text-7xl">
            {copy.faqTitle}
          </h2>
        </FadeIn>
        <ul className="flex flex-col gap-3">
          {faq.map((item, index) => {
            const isOpen = open === index;
            const id = `faq-panel-${index}`;
            return (
              <FadeIn key={item.q} delay={index * 0.04}>
                <li className="bristol" style={{ rotate: `${((index % 2) * 2 - 1) * 0.5}deg` }}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => setOpen(isOpen ? null : index)}
                      className="focus-ring flex h-[3.4rem] w-full cursor-pointer items-center justify-between gap-4 px-5 text-left font-display text-lg leading-tight font-bold"
                    >
                      {item.q}
                      <Plus className={`text-stamp h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={id}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="hand pen px-5 pt-2 pb-4 text-[1.35rem] leading-[1.75rem]">{item.a}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              </FadeIn>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
