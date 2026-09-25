"use client";

import { ArrowUpRight, Menu, X } from "@/components/ui/pixel-icon";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { useLanguage } from "@/lib/i18n";
import { site } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Nav(): ReactNode {
  const { locale, copy, setLocale } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const items = [
    { label: copy.nav.services, href: "/#services" },
    { label: copy.nav.projects, href: "/projects" },
    { label: copy.nav.about, href: "/about" },
  ];
  const contactHref = pathname === "/" ? "#contact" : "/#contact";

  useEffect(() => {
    const titles = {
      fr: { home: "Sites web et logiciels sur mesure à Aix-en-Provence", projects: "Réalisations", about: "À propos", legal: "Mentions légales", quote: "Demande de devis" },
      en: { home: "Websites and custom software in Aix-en-Provence", projects: "Work", about: "About", legal: "Legal notice", quote: "Quote request" },
    };
    const page =
      pathname === "/projects" ? "projects" : pathname === "/about" ? "about" : pathname === "/mentions-legales" ? "legal" : pathname === "/devis" ? "quote" : "home";
    document.title = `${titles[locale][page]} | Tobias Ringot`;
  }, [locale, pathname]);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-ink/92 backdrop-blur-md" : "bg-ink"
      }`}
    >
      <nav aria-label={copy.nav.primary} className="on-ink container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3">
          <span aria-hidden="true" className="bg-brand h-3 w-3" />
          <span className="text-paper font-display text-lg font-bold tracking-tight whitespace-nowrap">
            {site.name}
          </span>
          <span className="text-paper/50 font-mono hidden text-[11px] tracking-[0.14em] uppercase md:inline">
            {site.city}
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="focus-ring text-paper/75 hover:text-paper text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            aria-label={copy.language}
            className="focus-ring text-paper/60 hover:text-paper font-mono h-10 px-2 text-xs tracking-[0.14em] uppercase transition-colors"
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
          <a href={contactHref} className="btn btn-primary hidden h-10 px-4 text-sm md:inline-flex">
            {copy.nav.contact}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? copy.nav.closeMenu : copy.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="focus-ring text-paper inline-flex h-10 w-10 items-center justify-center md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="on-ink bg-ink border-paper/10 fixed inset-x-0 top-16 bottom-0 border-t md:hidden"
          >
            <div className="container-x flex h-full flex-col py-8">
              <ul className="flex flex-col">
                {[{ label: copy.nav.home, href: "/" }, ...items].map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.05, duration: 0.4, ease: EASE }}
                    className="border-paper/10 border-b"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="focus-ring text-paper display flex items-center justify-between py-5 text-4xl"
                    >
                      {item.label}
                      <ArrowUpRight className="text-brand h-6 w-6" aria-hidden="true" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-3">
                <a href={contactHref} onClick={() => setOpen(false)} className="btn btn-primary w-full">
                  {copy.nav.contact}
                </a>
                <a href={`mailto:${site.email}`} className="text-paper/60 font-mono text-center text-xs tracking-[0.12em] uppercase">
                  {site.email}
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
