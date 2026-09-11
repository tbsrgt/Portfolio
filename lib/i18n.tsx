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
      projects: "Projects",
      about: "About",
      primary: "Primary navigation",
    },
    theme: {
      light: "Switch to light theme",
      dark: "Switch to dark theme",
      toggle: "Toggle theme",
    },
    language: "Afficher le site en français",
    skip: "Skip to main content",
    hero: {
      greeting: "Hey, I'm Josh",
      titleLine1: "Design engineer &",
      titleLine2: "AI enthusiast",
      description:
        "Independent engineer focused on interfaces that feel calm, considered, and quietly fast.",
      portraitAlt: "Portrait of Josh",
      workCta: "View my work",
    },
    projects: {
      heading: "My projects",
      description:
        "From playful experiments to thoughtful systems, a look at the work I'm proud to have shipped.",
      pageHeading: "My recent work",
      pageDescription:
        "Experiments, collaborations, and projects I'm especially proud to have shipped.",
      viewAll: "View all projects",
      items: [
        {
          title:
            "An AI writing companion that thinks alongside you, allowing you to capture ideas, edits, and drafts in one focused space.",
          description:
            "I designed Loom, a focused writing surface where ideas, edits, and drafts coexist without the chat clutter.",
          meta: "Design Engineer, 2024",
          alt: "Loom AI writing companion mockup",
        },
        {
          title: "A two-week brand and product sprint for a creative studio.",
          description:
            "End-to-end identity, marketing site, and a small product surface designed to feel quietly confident across every touchpoint.",
          meta: "Product & Brand Designer, 2025",
          alt: "Atlas Studio brand and product sprint mockup",
        },
        {
          title: "Calm analytics for indie founders.",
          description:
            "A weekly digest that turns raw product data into a simple narrative. Built so you can read it on a Sunday with coffee.",
          meta: "Founder & Designer, 2024",
          alt: "Rhythm calm analytics mockup",
        },
        {
          title:
            "Reimagining the booking flow for a music school, helping thousands of students find the right lessons.",
          description:
            "I led a redesign of the lesson booking experience, cutting drop-off in half and making the schedule feel like a calendar people want to open.",
          meta: "Lead Designer, 2023",
          alt: "Groove music school booking flow mockup",
        },
        {
          title:
            "A pocket-sized research tool for design teams that want to get out of their docs and into the world.",
          description:
            "Capture quotes, tag patterns, and synthesize themes in one place. The interface stays out of the way so the thinking can happen.",
          meta: "Design Engineer, 2024",
          alt: "Fieldnote pocket-sized research tool mockup",
        },
        {
          title: "A friendlier interface for talking to language models.",
          description:
            "An exploration of how AI chat could feel less like a terminal and more like a conversation with a curious friend.",
          meta: "Independent Project, 2025",
          alt: "Talkback friendly AI chat interface mockup",
        },
      ],
    },
    contact: {
      heading: "Let's connect",
      description:
        "I'm always open to new projects, creative ideas, or opportunities to help bring a vision to life. Just reach out!",
      seeProjects: "See projects",
      button: "Contact",
      copied: "Email copied",
      copy: "Copy",
      show: "Show email",
      builtWith: "2026 © Built with Next.js",
      by: "By React Bits Pro",
    },
    about: {
      hello: "Hello! I'm",
      intro1Start: "A",
      intro1Strong1: "product designer and frontend engineer",
      intro1Middle:
        "passionate about building intuitive, human-centered digital experiences. With a background in",
      intro1Strong2: "visual craft",
      intro1And: "and",
      intro1Strong3: "interaction design",
      intro1End:
        "I bring a unique blend of design thinking and technical execution to every project.",
      intro2:
        "My journey into design began when I realized how often good user experience was missing from powerful tools. That led me to embrace user-centered design as both a mindset and a craft, balancing clarity, creativity, and functionality.",
      intro3:
        "I currently lead design in small product teams building software for creative professionals. I'm always looking for opportunities to shape thoughtful interfaces and scalable design systems.",
      experience: "Experience",
      education: "Education",
      skillsHeading: "What I do",
      stack: "Stack",
      resetStack: "Reset stack",
      showLess: "Show less",
      showMore: (count: number) => `Show ${count} more`,
      roles: [
        "Senior Design Engineer",
        "Product Designer",
        "Design Engineer",
        "UI Engineer",
        "Product Designer",
        "Design Intern",
        "Designer & Developer",
      ],
      periods: [
        "Mar 2024 - Present",
        "Aug 2022 - Feb 2024",
        "Jun 2021 - Jul 2022",
        "Sep 2019 - May 2021",
        "Jan 2018 - Aug 2019",
        "May 2017 - Dec 2017",
        "2015 - 2017",
      ],
      degrees: [
        "BFA, Graphic Design",
        "HCI Certificate, d.school",
        "WebGL & Shaders",
      ],
      skills: [
        "UI/UX Design",
        "Design Systems",
        "Prototyping & Motion",
        "Frontend Development",
        "TypeScript & React",
        "Interaction Design",
        "Performance Tuning",
        "Accessibility",
        "Visual Identity",
      ],
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      projects: "Projets",
      about: "À propos",
      primary: "Navigation principale",
    },
    theme: {
      light: "Passer au thème clair",
      dark: "Passer au thème sombre",
      toggle: "Changer de thème",
    },
    language: "Display the site in English",
    skip: "Aller au contenu principal",
    hero: {
      greeting: "Salut, moi c'est Josh",
      titleLine1: "Ingénieur design &",
      titleLine2: "passionné d'IA",
      description:
        "Ingénieur indépendant, je conçois des interfaces calmes, réfléchies et naturellement rapides.",
      portraitAlt: "Portrait de Josh",
      workCta: "Voir mes projets",
    },
    projects: {
      heading: "Mes projets",
      description:
        "Des expérimentations ludiques aux systèmes aboutis, découvrez les projets que je suis fier d'avoir réalisés.",
      pageHeading: "Mes projets récents",
      pageDescription:
        "Expérimentations, collaborations et projets que je suis particulièrement fier d'avoir réalisés.",
      viewAll: "Voir tous les projets",
      items: [
        {
          title:
            "Un compagnon d'écriture IA qui réfléchit avec vous et réunit idées, corrections et brouillons dans un espace ciblé.",
          description:
            "J'ai conçu Loom, un espace d'écriture où idées, corrections et brouillons coexistent sans l'encombrement d'un chat.",
          meta: "Ingénieur design, 2024",
          alt: "Maquette du compagnon d'écriture IA Loom",
        },
        {
          title:
            "Un sprint de deux semaines entre identité et produit pour un studio créatif.",
          description:
            "Identité complète, site marketing et interface produit, conçus pour inspirer une confiance discrète à chaque point de contact.",
          meta: "Designer produit & marque, 2025",
          alt: "Maquette du sprint marque et produit Atlas Studio",
        },
        {
          title: "Des analyses apaisées pour les créateurs indépendants.",
          description:
            "Un bilan hebdomadaire qui transforme les données produit en récit simple, à lire tranquillement le dimanche autour d'un café.",
          meta: "Fondateur & designer, 2024",
          alt: "Maquette de l'outil d'analyse Rhythm",
        },
        {
          title:
            "Repenser la réservation d'une école de musique pour aider des milliers d'élèves à trouver le bon cours.",
          description:
            "J'ai dirigé la refonte de la réservation des cours, divisant les abandons par deux et rendant le planning réellement agréable à consulter.",
          meta: "Lead designer, 2023",
          alt: "Maquette du parcours de réservation Groove",
        },
        {
          title:
            "Un outil de recherche de poche pour les équipes design qui veulent quitter leurs documents et aller sur le terrain.",
          description:
            "Capturez des citations, identifiez les tendances et synthétisez les thèmes au même endroit. L'interface laisse toute la place à la réflexion.",
          meta: "Ingénieur design, 2024",
          alt: "Maquette de l'outil de recherche Fieldnote",
        },
        {
          title:
            "Une interface plus humaine pour dialoguer avec les modèles de langage.",
          description:
            "Une exploration d'un chat IA moins proche d'un terminal et davantage d'une conversation avec un ami curieux.",
          meta: "Projet indépendant, 2025",
          alt: "Maquette de l'interface de chat IA Talkback",
        },
      ],
    },
    contact: {
      heading: "Restons en contact",
      description:
        "Je suis toujours partant pour discuter de nouveaux projets, d'idées créatives ou d'une vision à concrétiser. Écrivez-moi !",
      seeProjects: "Voir les projets",
      button: "Contact",
      copied: "E-mail copié",
      copy: "Copier",
      show: "Afficher l'e-mail",
      builtWith: "2026 © Créé avec Next.js",
      by: "Par React Bits Pro",
    },
    about: {
      hello: "Bonjour ! Moi, c'est",
      intro1Start: "Je suis",
      intro1Strong1: "designer produit et ingénieur frontend",
      intro1Middle:
        "passionné par la création d'expériences numériques intuitives et humaines. Grâce à mon expérience en",
      intro1Strong2: "création visuelle",
      intro1And: "et en",
      intro1Strong3: "design d'interaction",
      intro1End:
        "j'associe réflexion design et exécution technique dans chacun de mes projets.",
      intro2:
        "Mon parcours dans le design a commencé lorsque j'ai constaté que des outils puissants manquaient souvent d'une bonne expérience utilisateur. J'ai alors adopté le design centré sur l'utilisateur comme méthode et comme savoir-faire, en équilibrant clarté, créativité et fonctionnalité.",
      intro3:
        "Je dirige aujourd'hui le design au sein de petites équipes qui créent des logiciels pour les professionnels de la création. Je recherche toujours des occasions de concevoir des interfaces soignées et des design systems évolutifs.",
      experience: "Expérience",
      education: "Formation",
      skillsHeading: "Mes compétences",
      stack: "Outils",
      resetStack: "Réinitialiser les outils",
      showLess: "Afficher moins",
      showMore: (count: number) => `Afficher ${count} expériences de plus`,
      roles: [
        "Ingénieur design senior",
        "Designer produit",
        "Ingénieur design",
        "Ingénieur UI",
        "Designer produit",
        "Stagiaire design",
        "Designer & développeur",
      ],
      periods: [
        "Mars 2024 - Aujourd'hui",
        "Août 2022 - Fév. 2024",
        "Juin 2021 - Juil. 2022",
        "Sept. 2019 - Mai 2021",
        "Janv. 2018 - Août 2019",
        "Mai 2017 - Déc. 2017",
        "2015 - 2017",
      ],
      degrees: [
        "BFA, design graphique",
        "Certificat IHM, d.school",
        "WebGL & shaders",
      ],
      skills: [
        "Design UI/UX",
        "Design systems",
        "Prototypage & motion",
        "Développement frontend",
        "TypeScript & React",
        "Design d'interaction",
        "Optimisation des performances",
        "Accessibilité",
        "Identité visuelle",
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
  const [locale, setLocaleState] = useState<Locale>("en");

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
