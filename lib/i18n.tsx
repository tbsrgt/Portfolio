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
      titleLine1: "Your business grows.",
      titleLine2: "Your website should too.",
      description:
        "I redesign business websites so they build trust from the very first second, on every screen.",
      workCta: "See my work",
    },
    contact: {
      heading: "Let's talk about your website",
      description:
        "Tell me about your business and your current website. I reply personally and we can set up a 20-minute video call.",
      button: "Start a project",
      builtWith: "Designed and built by Tobias Ringot",
      location: "Based in Aix-en-Provence",
    },
    footer: {
      tagline: "Website redesign and showcase websites in Aix-en-Provence and across Provence.",
      navigation: "Navigation",
      contact: "Contact",
      legal: "Legal notice",
      rights: "All rights reserved.",
    },
    about: {
      hello: "Hello! I'm",
      intro1:
        "I'm a web designer based in Aix-en-Provence. I design and build redesigns and showcase websites for businesses in the region: trades, industry, shops and independents.",
      intro2:
        "Before the web, I worked in business development. It taught me that a website's first job is to reassure and bring in enquiries, and I keep that in mind on every page.",
      intro3:
        "I have also worked as a UX/UI product designer, I create social media content for COGEBAT and I co-founded NULLL.CLUB in Aix-en-Provence.",
      photoAlt: "Portrait of Tobias Ringot",
      linkedin: "See my LinkedIn profile",
      experience: "Experience",
      education: "Education",
      skillsHeading: "What I bring",
      stack: "Tools I use",
      resetStack: "Reset tools",
      showLess: "Show less",
      showMore: (count: number) => `Show ${count} more`,
      roles: [
        "Co-founder",
        "Social Media Designer",
        "Product Designer — UX/UI & brand identity",
        "Business development & social media",
      ],
      periods: [
        "May 2026 - Present",
        "Nov 2025 - Present",
        "Apr 2025 - May 2025",
        "Nov 2023 - Aug 2024",
      ],
      degrees: ["Bachelor Marketing & Digital Communication"],
      skills: [
        "Website redesign",
        "Showcase websites",
        "Web design",
        "UX/UI design",
        "Build & launch",
        "Brand identity",
        "Content strategy",
        "Business development",
      ],
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
      titleLine1: "Votre activité évolue.",
      titleLine2: "Votre site aussi.",
      description:
        "Je modernise les sites internet des entreprises pour qu'ils inspirent confiance dès la première seconde, sur tous les écrans.",
      workCta: "Voir mes réalisations",
    },
    contact: {
      heading: "Parlons de votre site",
      description:
        "Présentez-moi votre activité et votre site actuel. Je vous réponds personnellement et on peut en parler 20 minutes en visio.",
      button: "Démarrer un projet",
      builtWith: "Conçu et développé par Tobias Ringot",
      location: "Basé à Aix-en-Provence",
    },
    footer: {
      tagline: "Refonte et création de sites vitrines à Aix-en-Provence et partout en Provence.",
      navigation: "Navigation",
      contact: "Contact",
      legal: "Mentions légales",
      rights: "Tous droits réservés.",
    },
    about: {
      hello: "Bonjour ! Moi, c'est",
      intro1:
        "Je suis web designer à Aix-en-Provence. Je conçois et développe des refontes et des sites vitrines pour les entreprises de la région : artisans, industriels, commerces et indépendants.",
      intro2:
        "Avant le web, j'ai travaillé dans le développement commercial. J'y ai appris qu'un site sert d'abord à rassurer et à faire venir des demandes, et je garde cette idée en tête à chaque page.",
      intro3:
        "J'ai aussi été designer produit (UX/UI), je crée les contenus social media de COGEBAT et j'ai cofondé NULLL.CLUB à Aix-en-Provence.",
      photoAlt: "Portrait de Tobias Ringot",
      linkedin: "Voir mon profil LinkedIn",
      experience: "Expérience",
      education: "Formation",
      skillsHeading: "Ce que j'apporte",
      stack: "Outils que j'utilise",
      resetStack: "Réinitialiser les outils",
      showLess: "Afficher moins",
      showMore: (count: number) => `Afficher ${count} expériences de plus`,
      roles: [
        "Co-fondateur",
        "Social Media Designer",
        "Product Designer — UX/UI & identité de marque",
        "Développement commercial & social media",
      ],
      periods: [
        "Mai 2026 - Aujourd'hui",
        "Nov. 2025 - Aujourd'hui",
        "Avr. 2025 - Mai 2025",
        "Nov. 2023 - Août 2024",
      ],
      degrees: ["Bachelor Marketing & Communication Digitale"],
      skills: [
        "Refonte de site internet",
        "Site vitrine",
        "Web design",
        "Design UX/UI",
        "Développement et mise en ligne",
        "Identité de marque",
        "Stratégie de contenu",
        "Développement commercial",
      ],
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
