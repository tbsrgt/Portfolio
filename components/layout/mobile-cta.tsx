"use client";

import { Phone } from "@/components/ui/pixel-icon";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

/** Sticky bottom bar on phones: appears once the hero CTAs have scrolled away. */
export function MobileCta(): ReactNode {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const copy = salesCopy[locale];

  useEffect(() => {
    const onScroll = (): void => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/devis") return null;
  const contactHref = pathname === "/" ? "#contact" : "/#contact";

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-50 sm:hidden"
        >
          <div className="bg-ink/95 border-paper/10 flex gap-2 border-t p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur">
            <Link href="/devis" className="btn btn-primary flex-1">
              {copy.tracks[0].cta}
            </Link>
            <a href={contactHref} className="btn bg-paper text-ink shrink-0 px-4">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {copy.heroCallbackCta}
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
