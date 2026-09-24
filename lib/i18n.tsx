"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "fr";

const STORAGE_KEY = "portfolio-language";

export const translations = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      projects: "Work",
      about: "About",
      contact: "Contact",
      primary: "Primary navigation",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    theme: {
      light: "Switch to light theme",
      dark: "Switch to dark theme",
      toggle: "Toggle theme",
    },
    language: "Choose language",
    skip: "Skip to main content",
    hero: {
      titleLine1: "Websites that convince.",
      titleLine2: "Software that saves hours.",
      description:
        "I design and build websites, client portals and custom business software for companies. One point of contact from scoping to production, delivered in weeks rather than months.",
      workCta: "See my work",
    },
    contact: {
      heading: "Let's talk about your project",
      description:
        "Website, client portal or software: describe what you need in a few lines. I reply personally by email.",
      button: "Start a project",
      builtWith: "Designed and built by Tobias Ringot",
      location: "Based in Aix-en-Provence",
    },
    footer: {
      tagline: "Websites and custom software for businesses, from Aix-en-Provence.",
      navigation: "Navigation",
      contact: "Contact",
      legal: "Legal notice",
      rights: "All rights reserved.",
    },
    about: {
      photoAlt: "Portrait of Tobias Ringot",
      resetStack: "Reset tools",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      services: "Services",
      projects: "Réalisations",
      about: "À propos",
      contact: "Contact",
      primary: "Navigation principale",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
    },
    theme: {
      light: "Passer au thème clair",
      dark: "Passer au thème sombre",
      toggle: "Changer de thème",
    },
    language: "Choisir la langue",
    skip: "Aller au contenu principal",
    hero: {
      titleLine1: "Des sites qui convainquent.",
      titleLine2: "Des logiciels qui font gagner des heures.",
      description:
        "Je conçois et développe des sites web, des espaces clients et des logiciels de gestion sur mesure pour les entreprises. Un seul interlocuteur, du cadrage à la mise en production, livré en semaines plutôt qu'en mois.",
      workCta: "Voir mes réalisations",
    },
    contact: {
      heading: "Parlons de votre projet",
      description:
        "Site, espace client ou logiciel : décrivez votre besoin en quelques lignes. Je vous réponds personnellement par e-mail.",
      button: "Démarrer un projet",
      builtWith: "Conçu et développé par Tobias Ringot",
      location: "Basé à Aix-en-Provence",
    },
    footer: {
      tagline: "Sites web et logiciels sur mesure pour les entreprises, depuis Aix-en-Provence.",
      navigation: "Navigation",
      contact: "Contact",
      legal: "Mentions légales",
      rights: "Tous droits réservés.",
    },
    about: {
      photoAlt: "Portrait de Tobias Ringot",
      resetStack: "Réinitialiser les outils",
    },
  },
} as const;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "fr") setLocaleState(saved);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(() => {
    const setLocale = (next: Locale): void => {
      setLocaleState(next);
      window.localStorage.setItem(STORAGE_KEY, next);
    };

    return {
      locale,
      setLocale,
      toggleLocale: () => setLocale(locale === "en" ? "fr" : "en"),
    };
  }, [locale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return {
    ...context,
    copy: translations[context.locale],
  };
}
