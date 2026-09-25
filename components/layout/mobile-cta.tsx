"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Phone } from "@/components/ui/pixel-icon";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";

/** Sticky bottom strip on phones once the desk has scrolled away. */
export function MobileCta(): ReactNode {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const copy = deskCopy[locale];

  useEffect(() => {
    const onScroll = (): void => setVisible(window.scrollY > 640);
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
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-50 sm:hidden"
        >
          <div className="sheet on-paper mx-3 mb-[calc(0.5rem+env(safe-area-inset-bottom))] flex gap-2 p-2">
            <Link href="/devis" className="btn btn-stamp flex-1">
              {copy.ctaQuote}
            </Link>
            <a href={contactHref} className="btn btn-ink shrink-0 px-4">
              <Phone className="h-5 w-5" />
              {copy.ctaCall}
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
