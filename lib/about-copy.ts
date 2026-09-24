import type { Locale } from "@/lib/i18n";

export type Chapter = { year: string; place: string; logo: string; logoFill?: boolean; title: string; text: string };

export const aboutCopy = {
  fr: {
    availability: "Disponible pour de nouveaux projets",
    heading: "Je dessine et je développe des sites pour les entreprises de Provence.",
    lead: "Artisans, commerces, restaurants, PME : je m'occupe de tout, du premier message à la mise en ligne. Un seul interlocuteur, et un site qui fait son travail.",
    ctaQuote: "Demander un devis",
    ctaWork: "Voir les réalisations",
    principlesHeading: "Ma façon de travailler",
    principles: [
      { title: "Un site doit rapporter.", text: "J'ai commencé dans la vente. Chaque page a donc un rôle précis : rassurer, expliquer, puis donner envie d'appeler ou d'écrire." },
      { title: "Vous parlez à une seule personne.", text: "Design, textes, développement, mise en ligne : pas d'agence, pas d'intermédiaire. Vous échangez directement avec moi, par écrit, du début à la fin." },
      { title: "Le téléphone d'abord.", text: "La plupart de vos visiteurs arrivent depuis leur mobile. Je conçois pour eux en premier, puis j'adapte à l'ordinateur." },
      { title: "Vos contenus, en mieux.", text: "Je pars de ce que vous avez déjà, je réorganise et je réécris. Votre image est modernisée sans être trahie." },
    ],
    storyHeading: "Du commerce au web",
    storyLead: "Mon parcours explique ma méthode : j'ai vendu, étudié le marketing, conçu des produits, puis j'ai réuni tout ça dans la création de sites.",
    chapters: [
      { year: "2023", place: "Glass&Bio France", logo: "/logos/glass-and-bio.png", title: "Apprendre à vendre", text: "Au développement commercial, j'ai compris ce qui décide un client à décrocher son téléphone. C'est la base de chaque site que je fais." },
      { year: "2023 – 2026", place: "Aix Ynov Campus", logo: "", title: "Marketing et communication digitale", text: "Un bachelor pour structurer tout ça : stratégie de contenu, identité de marque, acquisition." },
      { year: "2025", place: "Vimtails", logo: "/logos/vimtails.png", logoFill: true, title: "Concevoir un produit", text: "Designer produit UX/UI et identité de marque : penser les parcours avant de penser aux couleurs." },
      { year: "Depuis 2025", place: "COGEBAT", logo: "/logos/cogebat.png", logoFill: true, title: "Parler aux clients du bâtiment", text: "Je crée les contenus social media d'une entreprise du BTP. Je connais les questions que se posent vos clients." },
      { year: "Depuis 2026", place: "NULLL.CLUB", logo: "/logos/nulll-club.png", logoFill: true, title: "Cofonder un projet à Aix", text: "J'ai cofondé NULLL.CLUB à Aix-en-Provence. Lancer un projet de zéro m'a appris à avancer vite sans bâcler." },
    ] satisfies Chapter[],
    toolsHeading: "Des outils modernes, un site qui vous appartient",
    toolsText: "Figma pour dessiner, Next.js pour construire, Vercel pour mettre en ligne. Le résultat : un site rapide, sécurisé, livré à votre nom.",
    workHeading: "Quelques projets récents",
    allWork: "Toutes les réalisations",
  },
  en: {
    availability: "Available for new projects",
    heading: "I design and build websites for businesses across Provence.",
    lead: "Trades, shops, restaurants, small companies: I handle everything from the first message to launch. One point of contact, and a website that does its job.",
    ctaQuote: "Request a quote",
    ctaWork: "See the work",
    principlesHeading: "How I work",
    principles: [
      { title: "A website should pay for itself.", text: "I started in sales. So every page has a clear job: reassure, explain, then make people want to call or write." },
      { title: "You talk to one person.", text: "Design, copy, development, launch: no agency, no middleman. You deal with me directly, in writing, from start to finish." },
      { title: "Mobile first.", text: "Most of your visitors arrive on their phone. I design for them first, then adapt to desktop." },
      { title: "Your content, made better.", text: "I start from what you already have, then reorganise and rewrite it. Your image is modernised, not lost." },
    ],
    storyHeading: "From sales to the web",
    storyLead: "My background explains my method: I sold, studied marketing, designed products, then brought it all together in building websites.",
    chapters: [
      { year: "2023", place: "Glass&Bio France", logo: "/logos/glass-and-bio.png", title: "Learning to sell", text: "In business development I learned what makes a customer pick up the phone. It's the foundation of every site I build." },
      { year: "2023 – 2026", place: "Aix Ynov Campus", logo: "", title: "Marketing and digital communication", text: "A bachelor's degree to structure it all: content strategy, brand identity, acquisition." },
      { year: "2025", place: "Vimtails", logo: "/logos/vimtails.png", logoFill: true, title: "Designing a product", text: "UX/UI product design and brand identity: thinking about journeys before thinking about colours." },
      { year: "Since 2025", place: "COGEBAT", logo: "/logos/cogebat.png", logoFill: true, title: "Talking to construction clients", text: "I create social media content for a construction company. I know the questions your customers ask." },
      { year: "Since 2026", place: "NULLL.CLUB", logo: "/logos/nulll-club.png", logoFill: true, title: "Co-founding a project in Aix", text: "I co-founded NULLL.CLUB in Aix-en-Provence. Starting from scratch taught me to move fast without cutting corners." },
    ] satisfies Chapter[],
    toolsHeading: "Modern tools, a website you own",
    toolsText: "Figma to design, Next.js to build, Vercel to launch. The result: a fast, secure website delivered in your name.",
    workHeading: "A few recent projects",
    allWork: "All projects",
  },
} as const satisfies Record<Locale, object>;
