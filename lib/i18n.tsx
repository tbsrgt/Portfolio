"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "fr" | "zh";

const STORAGE_KEY = "portfolio-language";

export const translations = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      projects: "Projects",
      about: "About",
      primary: "Primary navigation",
    },
    theme: {
      light: "Switch to light theme",
      dark: "Switch to dark theme",
      toggle: "Toggle theme",
    },
    language: "Choose language",
    skip: "Skip to main content",
    hero: {
      greeting: "Hi, I'm Tobias",
      titleLine1: "A better website",
      titleLine2: "for your next chapter",
      description:
        "I redesign outdated websites and create showcase sites that make your business clear and credible.",
      portraitAlt: "Portrait of Tobias Ringot",
      workCta: "See my work",
    },
    contact: {
      heading: "Let's build your website",
      description:
        "Redesigning an outdated site or starting from scratch? Tell me what you need and I'll reply personally.",
      seeProjects: "Explore my services",
      button: "Start a project",
      copied: "Email copied",
      copy: "Copy",
      show: "Show email",
      builtWith: "Designed and built by Tobias",
      by: "",
    },
    about: {
      hello: "Hello! I'm",
      intro1Start: "A",
      intro1Strong1: "designer focused on brand, content and digital experiences",
      intro1Middle:
        "helping businesses express a clear, coherent identity online. With experience in",
      intro1Strong2: "brand strategy",
      intro1And: "and",
      intro1Strong3: "web design",
      intro1End:
        "I connect creative direction, content and execution to turn a business goal into a site that performs.",
      intro2:
        "My background began in business development before moving into design. It helps me connect creative decisions to the concrete growth objectives of a business.",
      intro3:
        "I co-founded NULLL.CLUB in Aix-en-Provence and work with brands on their content, identity and digital experience. I am especially drawn to local projects, sport, hospitality and brands building a real community.",
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
      degrees: [
        "Bachelor Marketing & Digital Communication",
      ],
      skills: [
        "Website strategy",
        "Web design",
        "UX/UI design",
        "Brand identity",
        "Content strategy",
        "Social media",
        "Business development",
        "Creative direction",
        "Community building",
      ],
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      services: "Services",
      projects: "Projets",
      about: "À propos",
      primary: "Navigation principale",
    },
    theme: {
      light: "Passer au thème clair",
      dark: "Passer au thème sombre",
      toggle: "Changer de thème",
    },
    language: "Choisir la langue",
    skip: "Aller au contenu principal",
    hero: {
      greeting: "Bonjour, je suis Tobias",
      titleLine1: "Votre activité évolue.",
      titleLine2: "Votre site aussi.",
      description:
        "Je modernise les sites vieillissants et crée des sites vitrines qui rendent votre activité claire et crédible.",
      portraitAlt: "Portrait de Tobias Ringot",
      workCta: "Voir mes réalisations",
    },
    contact: {
      heading: "Créons votre site internet",
      description:
        "Votre site a vieilli ou vous partez de zéro ? Décrivez-moi votre besoin et je vous répondrai personnellement.",
      seeProjects: "Découvrir mes services",
      button: "Démarrer un projet",
      copied: "E-mail copié",
      copy: "Copier",
      show: "Afficher l'e-mail",
      builtWith: "Conçu et développé par Tobias",
      by: "",
    },
    about: {
      hello: "Bonjour ! Moi, c'est",
      intro1Start: "Je suis",
      intro1Strong1: "designer, spécialisé en marque, contenu et expérience digitale",
      intro1Middle:
        "et j'aide les entreprises à exprimer une identité claire et cohérente en ligne. Mon expérience en",
      intro1Strong2: "stratégie de marque",
      intro1And: "et en",
      intro1Strong3: "web design",
      intro1End:
        "me permet de relier direction créative, contenu et exécution pour faire avancer un objectif concret.",
      intro2:
        "Mon parcours a commencé dans le développement commercial avant de se spécialiser dans le design. Cette double lecture m'aide à connecter les décisions créatives aux objectifs de développement d'une activité.",
      intro3:
        "Je cofonde aujourd'hui NULLL.CLUB à Aix-en-Provence et j'accompagne des marques sur leur contenu, leur identité et leur expérience digitale. Je m'intéresse particulièrement aux projets locaux, au sport, aux lieux de vie et aux marques qui créent une communauté autour de leur activité.",
      experience: "Expérience",
      education: "Formation",
      skillsHeading: "Ce que j'apporte",
      stack: "Outils que je maîtrise",
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
      degrees: [
        "Bachelor Marketing & Communication Digitale",
      ],
      skills: [
        "Stratégie de site internet",
        "Web design",
        "Design UX/UI",
        "Identité de marque",
        "Stratégie de contenu",
        "Social media",
        "Développement commercial",
        "Direction créative",
        "Création de communauté",
      ],
    },
  },
  zh: {
    nav: { home: "首页", services: "服务", projects: "项目", about: "关于", primary: "主导航" },
    theme: { light: "切换至浅色主题", dark: "切换至深色主题", toggle: "切换主题" },
    language: "选择语言",
    skip: "跳至主要内容",
    hero: {
      greeting: "你好，我是 Tobias",
      titleLine1: "业务在发展，",
      titleLine2: "网站也该升级。",
      description: "我升级老旧网站，打造清晰、可信的企业展示网站。",
      portraitAlt: "Tobias Ringot 的肖像",
      workCta: "查看项目",
    },
    contact: { heading: "一起打造您的网站", description: "网站已经过时，还是从零开始？介绍您的需求，我会亲自回复。", seeProjects: "查看项目", button: "开始项目", copied: "邮箱已复制", copy: "复制", show: "显示邮箱", builtWith: "由 Tobias 精心制作", by: "" },
    about: {
      hello: "你好！我是",
      intro1Start: "一名",
      intro1Strong1: "专注于品牌、内容与数字体验的设计师",
      intro1Middle: "，帮助企业在线上表达清晰、一致的品牌形象。凭借在",
      intro1Strong2: "品牌策略",
      intro1And: "与",
      intro1Strong3: "网站设计",
      intro1End: "方面的经验，我将创意方向、内容和执行结合起来，服务于具体的业务目标。",
      intro2: "我的职业经历始于商务拓展，随后转向设计。这让我能够把创意决策与企业的发展目标联系起来。",
      intro3: "我在普罗旺斯地区共同创办了 NULLL.CLUB，也为品牌提供内容、形象和数字体验方面的支持。我特别关注本地项目、体育、酒店业及有社区文化的品牌。",
      experience: "经历",
      education: "教育",
      skillsHeading: "我能做什么",
      stack: "技术栈",
      resetStack: "重置技术栈",
      showLess: "收起",
      showMore: (count: number) => `再显示 ${count} 项`,
      roles: ["联合创始人", "社交媒体设计师", "产品设计师 — UX/UI 与品牌形象", "商务发展与社交媒体"],
      periods: ["2026 年 5 月至今", "2025 年 11 月至今", "2025 年 4 月 - 5 月", "2023 年 11 月 - 2024 年 8 月"],
      degrees: ["市场营销与数字传播学士"],
      skills: ["网站策略", "网站设计", "UX/UI 设计", "品牌形象", "内容策略", "社交媒体", "商务拓展", "创意指导", "社区建设"],
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
      if (saved === "en" || saved === "fr" || saved === "zh") setLocaleState(saved);
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
