"use client";

import { Plus } from "@/components/ui/pixel-icon";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Faq(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="container-x scroll-mt-24 py-16 sm:py-24"
    >
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <FadeIn>
          <p className="label mb-5">
            {copy.faqEyebrow}
          </p>
          <ScrollReveal
            as="h2"
            id="faq-heading"
            textClassName="display text-4xl sm:text-6xl"
          >
            {copy.faqHeading}
          </ScrollReveal>
        </FadeIn>

        <div className="border-foreground/10 border-t">
          {copy.faq.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            return (
              <div key={item.q} className="border-foreground/10 border-b">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="focus-ring text-foreground flex min-h-11 w-full cursor-pointer items-center justify-between gap-6 rounded-lg py-5 text-left font-display text-lg font-bold tracking-tight"
                  >
                    {item.q}
                    <Plus
                      aria-hidden="true"
                      className={`text-foreground/60 h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="text-foreground/65 max-w-[60ch] pb-6 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
