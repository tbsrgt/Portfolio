import type { Locale } from "@/lib/i18n";

export type Chapter = {
  place: string;
  logo: string;
  logoFill?: boolean;
  title: string;
  text: string;
};

export const aboutCopy = {
  fr: {
    availability: "Disponible pour de nouveaux projets",
    heading:
      "Je conçois les sites et les outils que vos équipes ont envie d'utiliser.",
    lead: "Je suis Tobias, basé à Aix-en-Provence. Je dessine l'interface, je la développe et je la mets en production : sites web, espaces clients et logiciels de gestion. Vous avez un seul interlocuteur, qui comprend votre métier avant de toucher à l'écran.",
    ctaQuote: "Démarrer un projet",
    ctaWork: "Voir les réalisations",
    principlesHeading: "Ma façon de travailler",
    principles: [
      {
        title: "Un outil doit rapporter.",
        text: "Je viens de la vente. Un site doit faire venir des clients, un logiciel doit faire gagner des heures. Si ce n'est pas mesurable, ce n'est pas fini.",
      },
      {
        title: "Le métier avant l'écran.",
        text: "Je commence par comprendre qui fait quoi, avec quels outils, et où ça coince. L'interface vient ensuite, pas l'inverse.",
      },
      {
        title: "Vous parlez à une seule personne.",
        text: "Cadrage, design, développement, mise en ligne : pas d'intermédiaire. Ce que vous me dites est ce qui est construit.",
      },
      {
        title: "Tout vous appartient.",
        text: "Code, données, nom de domaine et comptes d'hébergement sont à votre nom. Vous restez libre, avec ou sans moi.",
      },
    ],
    storyHeading: "Ce que j'apporte à votre projet",
    storyLead:
      "Pas de CV : voici ce que chaque expérience m'a appris, et ce que vous y gagnez.",
    chapters: [
      {
        place: "COGEBAT",
        logo: "/logos/cogebat.png",
        logoFill: true,
        title: "Le terrain du bâtiment",
        text: "J'accompagne une entreprise générale du bâtiment au quotidien, et j'ai conçu puis développé son logiciel de gestion, COGEDOC. Je connais vos contraintes de chantier et de relance.",
      },
      {
        place: "Glass&Bio France",
        logo: "/logos/glass-and-bio.png",
        title: "Le sens de la vente",
        text: "Au développement commercial, j'ai appris ce qui décide un client à décrocher son téléphone. Chaque page que je fais part de là.",
      },
      {
        place: "Vimtails",
        logo: "/logos/vimtails.png",
        logoFill: true,
        title: "La conception produit",
        text: "En design produit UX/UI, j'ai appris à penser les parcours avant les couleurs. C'est ce qui rend un outil simple à prendre en main.",
      },
      {
        place: "NULLL.CLUB",
        logo: "/logos/nulll-club.png",
        logoFill: true,
        title: "L'esprit d'entreprise",
        text: "J'ai cofondé un projet à Aix-en-Provence. Lancer de zéro m'a appris à avancer vite sans bâcler.",
      },
    ] satisfies Chapter[],
    toolsHeading: "Des outils modernes, un résultat qui vous appartient",
    toolsText:
      "Figma pour concevoir, Next.js et Supabase pour construire, Vercel pour mettre en ligne, et des outils de développement assistés par IA pour livrer plus vite. Le résultat est rapide, sécurisé et livré à votre nom.",
    workHeading: "Quelques projets récents",
    allWork: "Toutes les réalisations",
  },
  en: {
    availability: "Available for new projects",
    heading: "I design the websites and tools your teams actually want to use.",
    lead: "I'm Tobias, based in Aix-en-Provence. I design the interface, build it and put it into production: websites, client portals and management software. You get one point of contact who understands your business before touching the screen.",
    ctaQuote: "Start a project",
    ctaWork: "See the work",
    principlesHeading: "How I work",
    principles: [
      {
        title: "A tool should pay for itself.",
        text: "I come from sales. A website should bring in clients, software should save hours. If it can't be measured, it isn't finished.",
      },
      {
        title: "The trade before the screen.",
        text: "I start by understanding who does what, with which tools, and where it hurts. The interface comes after, not the other way round.",
      },
      {
        title: "You talk to one person.",
        text: "Scoping, design, development, launch: no middleman. What you tell me is what gets built.",
      },
      {
        title: "You own everything.",
        text: "Code, data, domain name and hosting accounts are in your name. You stay free, with or without me.",
      },
    ],
    storyHeading: "What I bring to your project",
    storyLead:
      "No CV: here is what each experience taught me, and what you gain from it.",
    chapters: [
      {
        place: "COGEBAT",
        logo: "/logos/cogebat.png",
        logoFill: true,
        title: "Knowing the building trade",
        text: "I work day to day with a general building contractor, and I designed and built its management software, COGEDOC. I know your site and follow-up constraints.",
      },
      {
        place: "Glass&Bio France",
        logo: "/logos/glass-and-bio.png",
        title: "A sense of sales",
        text: "In business development I learned what makes a customer pick up the phone. Every page I make starts from there.",
      },
      {
        place: "Vimtails",
        logo: "/logos/vimtails.png",
        logoFill: true,
        title: "Product design",
        text: "In UX/UI product design I learned to think about journeys before colours. That's what makes a tool easy to pick up.",
      },
      {
        place: "NULLL.CLUB",
        logo: "/logos/nulll-club.png",
        logoFill: true,
        title: "An entrepreneurial mindset",
        text: "I co-founded a project in Aix-en-Provence. Starting from scratch taught me to move fast without cutting corners.",
      },
    ] satisfies Chapter[],
    toolsHeading: "Modern tools, a result you own",
    toolsText:
      "Figma to design, Next.js and Supabase to build, Vercel to launch, and AI-assisted development tools to deliver faster. The result is fast, secure and delivered in your name.",
    workHeading: "A few recent projects",
    allWork: "All projects",
  },
} as const satisfies Record<Locale, object>;
