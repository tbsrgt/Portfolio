"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, type ReactNode } from "react";

import { game, useGame } from "./store";
import { BusinessCards } from "@/components/desk/business-cards";
import { Checklist } from "@/components/desk/checklist";
import { ContactDesk } from "@/components/desk/contact-desk";
import { IndexCards } from "@/components/desk/index-cards";
import { Letter } from "@/components/desk/letter";
import { Pains } from "@/components/desk/pains";
import { QuoteSheet } from "@/components/desk/quote-sheet";
import { Receipt } from "@/components/desk/receipt";
import { WorkFolder } from "@/components/desk/work-folder";
import { X } from "@/components/ui/pixel-icon";
import { zones, type ZoneId } from "@/lib/game";
import type { Locale } from "@/lib/i18n";

const CONTENT: Record<ZoneId, () => ReactNode> = {
  offers: () => <QuoteSheet />,
  work: () => <WorkFolder />,
  about: () => <Letter />,
  method: () => <Checklist />,
  guarantees: () => <Receipt />,
  faq: () => <IndexCards />,
  contact: () => <ContactDesk />,
  pains: () => (
    <>
      <BusinessCards />
      <Pains />
    </>
  ),
};

/** The document you just walked onto, opened as a drawer over the desk. */
export function ZonePanel({ locale }: { locale: Locale }): ReactNode {
  const { panel } = useGame();
  const zone = panel ? zones.find((z) => z.id === panel) : null;

  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") game.closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  return (
    <AnimatePresence>
      {zone && panel ? (
        <motion.aside
          key={panel}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          aria-label={zone.title[locale]}
          className="bg-desk/95 absolute inset-x-0 bottom-0 z-30 h-[78svh] overflow-y-auto border-t-4 border-black/30 shadow-[0_-20px_60px_rgb(0_0_0/0.5)] backdrop-blur-md sm:inset-y-0 sm:right-0 sm:left-auto sm:h-auto sm:w-[min(640px,60vw)] sm:border-t-0 sm:border-l-4"
        >
          <div className="bg-desk/95 sticky top-0 z-10 flex items-center justify-between gap-3 px-4 pt-3 pb-2 sm:px-6 sm:pt-20">
            <span className="dymo">{zone.title[locale]}</span>
            <button type="button" onClick={() => game.closePanel()} className="btn btn-paper h-10 w-10 px-0" aria-label={locale === "fr" ? "Fermer" : "Close"}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="[&_.container-x]:px-4 [&_.container-x]:sm:px-6 [&_section]:py-6 [&_section]:sm:py-8">{CONTENT[panel]()}</div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
