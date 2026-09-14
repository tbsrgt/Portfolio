"use client";

import { Globe2, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { flushSync } from "react-dom";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useLanguage } from "@/lib/i18n";

type NavItem = {
  label: string;
  href: string;
};

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function runCircularViewTransition(
  event: React.MouseEvent<HTMLButtonElement>,
  update: () => void
): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!document.startViewTransition || prefersReducedMotion) {
    update();
    return;
  }

  const rect = event.currentTarget.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const radius = Math.hypot(
    Math.max(cx, window.innerWidth - cx),
    Math.max(cy, window.innerHeight - cy)
  );
  const root = document.documentElement;
  root.style.setProperty("--theme-cx", `${cx}px`);
  root.style.setProperty("--theme-cy", `${cy}px`);
  root.style.setProperty("--theme-r", `${radius}px`);
  root.dataset.themeAnim = "1";

  // React state updates are normally deferred. The view transition must see
  // the new language before taking its second snapshot.
  const transition = document.startViewTransition(() => {
    flushSync(update);
  });
  transition.finished.finally(() => {
    delete root.dataset.themeAnim;
  });
}

function NavThemeToggle(): ReactNode {
  const mounted = useIsMounted();
  const { setTheme, resolvedTheme } = useTheme();
  const { copy } = useLanguage();
  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const next = isDark ? "light" : "dark";
    runCircularViewTransition(event, () => setTheme(next));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? copy.theme.light
            : copy.theme.dark
          : copy.theme.toggle
      }
      aria-pressed={mounted ? isDark : undefined}
      className="focus-ring bg-background ring-foreground/8 relative inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full ring-1 transition-colors sm:h-8 sm:w-8"
    >
      <span aria-hidden="true" className="relative h-4 w-4">
        <Sun
          className={`text-foreground absolute inset-0 h-4 w-4 transition-all duration-300 ${
            mounted && isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 -rotate-90 opacity-0"
          }`}
        />
        <Moon
          className={`text-foreground absolute inset-0 h-4 w-4 transition-all duration-300 ${
            mounted && !isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 rotate-90 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}

function LanguageSwitcher(): ReactNode {
  const { locale, copy, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent): void => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const languages = [
    { code: "fr", label: "FR", name: "Français" },
    { code: "en", label: "EN", name: "English" },
  ] as const;

  return (
    <div
      ref={menuRef}
      className="border-foreground/8 bg-background flex h-10 items-center overflow-hidden rounded-full border shadow-sm sm:h-11"
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={copy.language}
        aria-expanded={isOpen}
        aria-controls="language-menu"
        className="focus-ring text-foreground inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-transform duration-200 hover:scale-[1.04] active:scale-[0.96] sm:h-11 sm:w-11"
      >
        <Globe2 aria-hidden="true" className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="language-menu"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 80 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="flex h-full shrink-0 items-center gap-1 overflow-hidden pr-1.5"
          >
            {languages.map((language) => {
              const isSelected = locale === language.code;
              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => {
                    setLocale(language.code);
                    setIsOpen(false);
                  }}
                  aria-pressed={isSelected}
                  title={language.name}
                  className={`focus-ring inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-full px-2 text-[11px] font-semibold transition-colors duration-200 sm:h-8 sm:min-w-8 ${
                    isSelected
                      ? "bg-foreground text-background"
                      : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {language.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Nav(): ReactNode {
  const { locale, copy } = useLanguage();
  const navItems: readonly NavItem[] = [
    { label: copy.nav.home, href: "/" },
    { label: copy.nav.services, href: "/#services" },
    { label: copy.nav.projects, href: "/projects" },
    { label: copy.nav.about, href: "/about" },
  ];
  const pathname = usePathname();
  const contactHref = pathname === "/mentions-legales" ? "/#contact" : "#contact";
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [pillRect, setPillRect] = useState<{
    x: number;
    width: number;
  } | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const activeIndex = navItems.findIndex((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  useEffect(() => {
    const titles = {
      fr: { home: "Refonte de site internet à Aix-en-Provence", projects: "Réalisations", about: "À propos", legal: "Mentions légales" },
      en: { home: "Website redesign in Aix-en-Provence", projects: "Work", about: "About", legal: "Legal notice" },
    };
    const page =
      pathname === "/projects" ? "projects" : pathname === "/about" ? "about" : pathname === "/mentions-legales" ? "legal" : "home";
    document.title = `${titles[locale][page]} | Tobias Ringot`;
  }, [locale, pathname]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent): void => {
      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      const list = listRef.current;
      const activeEl = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
      if (!list || !activeEl) {
        setPillRect(null);
        return;
      }
      const listRect = list.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setPillRect({
        x: itemRect.left - listRect.left,
        width: itemRect.width,
      });
    });

    return () => cancelAnimationFrame(id);
  }, [activeIndex, locale, pathname]);

  useEffect(() => {
    if (!pillRect) return;
    const id = requestAnimationFrame(() => setHasMeasured(true));
    return () => cancelAnimationFrame(id);
  }, [pillRect]);

  const contactButtonClass =
    "focus-ring bg-foreground text-background inline-flex h-11 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:scale-95";

  return (
    <nav
      aria-label={copy.nav.primary}
      className="fixed top-3 right-3 z-50 max-w-[calc(100vw-1.5rem)] sm:top-6 sm:right-auto sm:left-1/2 sm:-translate-x-1/2"
    >
      <div className="flex items-center gap-2 sm:hidden">
        <a href={contactHref} className={contactButtonClass}>
          {copy.nav.contact}
        </a>
        <div ref={mobileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? copy.nav.closeMenu : copy.nav.openMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="focus-ring border-foreground/8 bg-background text-foreground inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border shadow-sm transition-transform duration-200 active:scale-95"
          >
            <motion.span
              initial={false}
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              {mobileMenuOpen ? (
                <X aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" />
              )}
            </motion.span>
          </button>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-navigation"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 430, damping: 32 }}
                className="border-foreground/8 bg-background absolute top-full right-0 mt-2 w-56 overflow-hidden rounded-3xl border p-2 shadow-lg"
              >
                <ul className="flex flex-col gap-1">
                  {navItems.map((item, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <li key={`mobile-${item.href}`}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`focus-ring flex min-h-11 items-center rounded-2xl px-4 text-[15px] font-medium transition-colors ${
                            isActive
                              ? "bg-foreground text-background"
                              : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-foreground/8 mt-2 flex items-center justify-between border-t pt-2">
                  <NavThemeToggle />
                  <LanguageSwitcher />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <div className="bg-background border-foreground/8 flex items-center gap-0.5 rounded-full border p-1 shadow-sm sm:gap-1 sm:p-1.5">
          <ul ref={listRef} className="relative flex items-center gap-0.5 sm:gap-1">
            {pillRect && (
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ x: pillRect.x, width: pillRect.width }}
                transition={
                  hasMeasured
                    ? { type: "spring", stiffness: 380, damping: 32 }
                    : { duration: 0 }
                }
                style={{ left: 0, top: 0, bottom: 0 }}
                className="bg-foreground/5 ring-foreground/8 absolute rounded-full ring-1"
              />
            )}
            {navItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={item.href}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className="focus-ring relative inline-flex cursor-pointer items-center justify-center rounded-full px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-300 sm:px-4 sm:text-sm"
                  >
                    <span
                      className={
                        isActive
                          ? "text-foreground relative z-10"
                          : "text-foreground/60 hover:text-foreground relative z-10"
                      }
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <NavThemeToggle />
        </div>
        <LanguageSwitcher />
        <a href={contactHref} className={`${contactButtonClass} hidden md:inline-flex`}>
          {copy.nav.contact}
        </a>
      </div>
    </nav>
  );
}
