"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { ArrowUpRight, Menu, X } from "@/components/ui/pixel-icon";
import { useLanguage } from "@/lib/i18n";
import { site } from "@/lib/site";

export function Nav(): ReactNode {
  const { locale, copy, setLocale } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const onGame = pathname === "/";
  const switchLabel = onGame ? (locale === "fr" ? "Site classique" : "Classic site") : locale === "fr" ? "Le bureau 3D" : "The 3D desk";
  const switchHref = onGame ? "/site" : "/";
  const items = [
    { label: switchLabel, href: switchHref },
    { label: copy.nav.home, href: "/site" },
    { label: copy.nav.services, href: "/site#offres" },
    { label: copy.nav.projects, href: "/projects" },
    { label: copy.nav.about, href: "/about" },
    { label: copy.nav.contact, href: "/site#contact" },
  ];

  useEffect(() => {
    const titles = {
      fr: { home: "Sites web et logiciels sur mesure à Aix-en-Provence", projects: "Réalisations", about: "À propos", legal: "Mentions légales", quote: "Demande de devis" },
      en: { home: "Websites and custom software in Aix-en-Provence", projects: "Work", about: "About", legal: "Legal notice", quote: "Quote request" },
    };
    const page =
      pathname === "/projects" ? "projects" : pathname === "/about" ? "about" : pathname === "/mentions-legales" ? "legal" : pathname === "/devis" ? "quote" : "home";
    document.title = `${titles[locale][page]} | Tobias Ringot`;
  }, [locale, pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${scrolled ? "bg-desk/92 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.6)] backdrop-blur-md" : ""}`}>
      <nav aria-label={copy.nav.primary} className="container-x flex h-16 items-center justify-between gap-3">
        <Link href="/" className="focus-ring dymo text-[11px] sm:text-xs">
          {site.name}
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            aria-label={copy.language}
            className="focus-ring dymo cursor-pointer text-[11px]"
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
          <Link href={switchHref} className="btn btn-paper hidden h-10 px-4 text-sm md:inline-flex">
            {switchLabel}
          </Link>
          <Link href="/devis" className="btn btn-stamp hidden h-10 px-4 text-sm sm:inline-flex">
            {locale === "fr" ? "Devis" : "Quote"}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? copy.nav.closeMenu : copy.nav.openMenu}
            aria-expanded={open}
            aria-controls="site-menu"
            className="btn btn-paper h-10 w-10 cursor-pointer px-0"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            initial={{ opacity: 0, y: -10, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="container-x mt-1 flex justify-end"
          >
            <ul className="sheet sheet-lined on-paper w-full max-w-xs p-5 pt-3">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="focus-ring hand pen flex min-h-8 items-center justify-between text-[1.7rem] leading-8">
                    {item.label}
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </li>
              ))}
              <li className="typed text-ink/50 mt-3 text-[10px]">{site.email}</li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
