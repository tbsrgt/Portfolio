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
      titleLine1: "Websites that",
      titleLine2: "make your brand grow",
      description:
        "I design and build clear, fast websites that turn visitors into customers.",
      portraitAlt: "Portrait of Tobias Ringot",
      workCta: "Explore my services",
    },
    projects: {
      heading: "Websites built to convince",
      description:
        "Showcase sites, landing pages and digital identities built to make your offer stand out.",
      pageHeading: "My web services",
      pageDescription:
        "A focused approach to turn your brand, offer and content into a website that works.",
      viewAll: "Explore my services",
      items: [
        {
          title:
            "A showcase website that makes your business instantly clear and credible.",
          description:
            "A tailored structure, refined design and clear calls to action designed around your goals.",
          meta: "Showcase website",
          alt: "Showcase website mockup",
        },
        {
          title: "A landing page built to turn attention into enquiries.",
          description:
            "A focused page that presents one offer, makes it memorable and guides visitors to take action.",
          meta: "Landing page",
          alt: "Landing page mockup",
        },
        {
          title: "A visual identity and website that speak with one voice.",
          description:
            "From positioning to visual direction, your brand becomes coherent across every digital touchpoint.",
          meta: "Brand identity & website",
          alt: "Brand website mockup",
        },
        {
          title:
            "A website redesign that makes your offer easier to understand and choose.",
          description:
            "I simplify the navigation, messages and experience so your site feels as professional as your work.",
          meta: "Website redesign",
          alt: "Website redesign mockup",
        },
        {
          title:
            "A fast, responsive website that works beautifully on every screen.",
          description:
            "Performance, accessibility and a precise responsive layout are considered from the start.",
          meta: "Web design & development",
          alt: "Responsive website mockup",
        },
        {
          title: "A site you can update, evolve and be proud to share.",
          description:
            "A solid technical foundation, hosting support and the right tools to keep your site growing.",
          meta: "Launch & support",
          alt: "Website launch mockup",
        },
      ],
    },
    contact: {
      heading: "Let's build your website",
      description:
        "Tell me about your business, your goals and the website you want to create. I'll get back to you to discuss the right approach.",
      seeProjects: "Explore my services",
      button: "Start a project",
      copied: "Email copied",
      copy: "Copy",
      show: "Show email",
      builtWith: "Fait avec le <3 par Tobias",
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
      titleLine1: "Des sites internet",
      titleLine2: "qui font grandir votre marque",
      description:
        "Je conçois des sites clairs, rapides et sur mesure, pensés pour transformer vos visiteurs en clients.",
      portraitAlt: "Portrait de Tobias Ringot",
      workCta: "Découvrir mes services",
    },
    projects: {
      heading: "Des sites conçus pour convaincre",
      description:
        "Sites vitrines, landing pages et identités digitales : chaque projet rend votre offre plus claire et votre marque plus visible.",
      pageHeading: "Mes services web",
      pageDescription:
        "Une approche précise pour transformer votre marque, votre offre et vos contenus en un site qui travaille pour vous.",
      viewAll: "Découvrir mes services",
      items: [
        {
          title:
            "Un site vitrine qui rend votre activité immédiatement claire et crédible.",
          description:
            "Une structure sur mesure, un design soigné et des appels à l'action construits autour de vos objectifs.",
          meta: "Site vitrine",
          alt: "Maquette de site vitrine",
        },
        {
          title:
            "Une landing page pensée pour transformer l'attention en prises de contact.",
          description:
            "Une page ciblée qui présente une offre, la rend mémorable et guide naturellement vers l'action.",
          meta: "Landing page",
          alt: "Maquette de landing page",
        },
        {
          title: "Une identité et un site qui parlent d'une seule voix.",
          description:
            "Du positionnement à la direction visuelle, votre marque devient cohérente sur tous ses points de contact digitaux.",
          meta: "Identité & site internet",
          alt: "Maquette de site de marque",
        },
        {
          title:
            "Une refonte qui rend votre offre plus simple à comprendre et à choisir.",
          description:
            "Je simplifie la navigation, les messages et l'expérience pour que votre site soit à la hauteur de votre savoir-faire.",
          meta: "Refonte de site",
          alt: "Maquette de refonte de site",
        },
        {
          title:
            "Un site rapide et responsive, performant sur chaque écran.",
          description:
            "Performance, accessibilité et mise en page précise sont intégrées dès les premières maquettes.",
          meta: "Web design & développement",
          alt: "Maquette de site responsive",
        },
        {
          title:
            "Un site que vous pouvez faire évoluer et partager avec fierté.",
          description:
            "Une base technique solide, un hébergement adapté et les bons outils pour accompagner votre activité dans la durée.",
          meta: "Mise en ligne & accompagnement",
          alt: "Maquette de lancement de site",
        },
      ],
    },
    contact: {
      heading: "Créons votre site internet",
      description:
        "Parlez-moi de votre activité, de vos objectifs et du site que vous souhaitez créer. Je vous répondrai pour définir la meilleure approche.",
      seeProjects: "Découvrir mes services",
      button: "Démarrer un projet",
      copied: "E-mail copié",
      copy: "Copier",
      show: "Afficher l'e-mail",
      builtWith: "Fait avec le <3 par Tobias",
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
    nav: { home: "首页", projects: "项目", about: "关于", primary: "主导航" },
    theme: { light: "切换至浅色主题", dark: "切换至深色主题", toggle: "切换主题" },
    language: "选择语言",
    skip: "跳至主要内容",
    hero: {
      greeting: "你好，我是 Tobias",
      titleLine1: "让品牌成长的",
      titleLine2: "网站",
      description: "我为企业设计清晰、快速且量身定制的网站，将访客转化为客户。",
      portraitAlt: "Tobias Ringot 的肖像",
      workCta: "了解我的服务",
    },
    projects: {
      heading: "为说服客户而设计的网站",
      description: "展示网站、落地页与数字品牌形象，让您的服务更清晰、品牌更突出。",
      pageHeading: "我的网站服务",
      pageDescription: "将品牌、内容和业务目标转化为真正有效的网站。",
      viewAll: "了解我的服务",
      items: [
        { title: "一位能与你共同思考的 AI 写作伙伴，让你在专注的空间里捕捉灵感、编辑内容和撰写草稿。", description: "我设计了 Loom：一个让灵感、编辑和草稿共存，却没有聊天干扰的写作界面。", meta: "设计工程师，2024", alt: "Loom AI 写作伙伴模型图" },
        { title: "为创意工作室完成的两周品牌与产品冲刺。", description: "从品牌识别、营销网站到小型产品界面，每个触点都传递从容的自信。", meta: "产品与品牌设计师，2025", alt: "Atlas Studio 品牌与产品冲刺模型图" },
        { title: "为独立创始人提供平静的数据分析。", description: "每周简报将原始产品数据转化为简洁的故事，适合周日伴着咖啡阅读。", meta: "创始人与设计师，2024", alt: "Rhythm 数据分析模型图" },
        { title: "重新设计音乐学校的预约流程，帮助数千名学生找到合适的课程。", description: "我主导了课程预约体验的改版，将流失率减半，让日程表变得真正令人愿意打开。", meta: "首席设计师，2023", alt: "Groove 音乐学校预约流程模型图" },
        { title: "为希望走出文档、深入真实世界的设计团队打造的口袋研究工具。", description: "收集引语、标记模式并在同一个地方梳理主题；界面退居幕后，让思考自然发生。", meta: "设计工程师，2024", alt: "Fieldnote 口袋研究工具模型图" },
        { title: "一种更友好的语言模型对话界面。", description: "探索如何让 AI 聊天少一些终端感，多一些与好奇朋友交谈的感觉。", meta: "独立项目，2025", alt: "Talkback AI 聊天界面模型图" },
      ],
    },
    contact: { heading: "一起打造您的网站", description: "告诉我您的业务、目标以及您想创建的网站。我会回复您并一起确定合适的方法。", seeProjects: "了解我的服务", button: "开始项目", copied: "邮箱已复制", copy: "复制", show: "显示邮箱", builtWith: "Fait avec le <3 par Tobias", by: "" },
    about: {
      hello: "你好！我是",
      intro1Start: "一名",
      intro1Strong1: "产品设计师和前端工程师",
      intro1Middle: "，热衷于打造直观、以人为本的数字体验。凭借在",
      intro1Strong2: "视觉设计",
      intro1And: "与",
      intro1Strong3: "交互设计",
      intro1End: "方面的背景，我将设计思维与技术执行融入每一个项目。",
      intro2: "我进入设计领域的起点，是发现许多强大的工具往往缺少优秀的用户体验。这让我将以用户为中心的设计视为一种思维方式和手艺，在清晰、创造力与功能之间找到平衡。",
      intro3: "目前，我在为创意专业人士打造软件的小型产品团队中负责设计。我一直期待有机会塑造周到的界面和可扩展的设计系统。",
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
      skills: ["UI/UX 设计", "设计系统", "原型与动效", "前端开发", "TypeScript 与 React", "交互设计", "性能优化", "无障碍设计", "视觉识别"],
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
