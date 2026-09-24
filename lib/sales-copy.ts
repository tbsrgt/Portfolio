import type { Locale } from "@/lib/i18n";

/** Values sent by the contact form, in the same order as `formServices`. */
export const serviceValues = [
  "redesign",
  "visual-refresh",
  "showcase",
  "landing",
  "maintenance",
  "portal",
  "business-software",
  "erp-crm",
] as const;

export const salesCopy = {
  fr: {
    heroKicker: "Designer & développeur produit · Aix-en-Provence",
    heroNote:
      "Pour les PME, artisans, industriels et réseaux B2B qui veulent un outil à leur mesure.",
    heroPrice: "Sites dès 500 € · Logiciels dès 8 000 € HT",
    marqueeLabel: "Aperçu des réalisations",
    servicesEyebrow: "Offres",
    servicesHeading: "Deux métiers, un seul interlocuteur.",
    servicesDescription:
      "Le site qui fait venir vos clients, et le logiciel qui fait tourner votre entreprise. Chaque projet est chiffré ligne par ligne, sans surprise.",
    pricesNote:
      "Prix HT indicatifs. Le prix final est fixé dans un devis détaillé, lot par lot.",
    tracks: [
      {
        id: "web",
        eyebrow: "Sites web",
        title: "Un site qui inspire confiance et génère des demandes.",
        description:
          "Design sur mesure, pensé d'abord pour le téléphone, rapide et bien référencé.",
        offers: [
          {
            title: "Refonte de site",
            price: "dès 1 800 €",
            description:
              "Vos contenus et votre identité, modernisés et réorganisés.",
            badge: "Le plus demandé",
            included: [
              "Nouveau design sur mesure",
              "Contenus réorganisés et réécrits",
              "Pensé d'abord pour le téléphone",
              "Référencement Google de base",
            ],
          },
          {
            title: "Refonte visuelle",
            price: "dès 500 €",
            description:
              "Je modernise simplement le look de votre site : mêmes pages, mêmes contenus, un rendu actuel sur mobile.",
          },
          {
            title: "Site vitrine",
            price: "dès 2 000 €",
            description:
              "5 à 8 pages pour présenter clairement votre activité.",
          },
          {
            title: "Landing page",
            price: "dès 900 €",
            description: "Une page dédiée à une offre, pensée pour convertir.",
          },
          {
            title: "Hébergement & maintenance",
            price: "dès 49 €/mois",
            description:
              "Mises à jour, sauvegardes, surveillance et petites évolutions.",
          },
        ],
        cta: "Estimer mon site",
        href: "/devis",
      },
      {
        id: "software",
        eyebrow: "Logiciels sur mesure",
        title: "Un outil taillé pour vos process, pas l'inverse.",
        description:
          "Fini les tableurs qui se croisent et les logiciels trop gros. Vos équipes ont un seul outil, simple, qui fait exactement ce dont elles ont besoin.",
        offers: [
          {
            title: "Atelier de cadrage",
            price: "dès 1 500 €",
            description:
              "Besoins, règles de gestion, spécifications et chiffrage précis.",
          },
          {
            title: "Espace client / portail B2B",
            price: "dès 8 000 €",
            description: "Connexion, documents, suivi de commandes, paiement.",
          },
          {
            title: "Logiciel métier / ERP",
            price: "dès 12 000 €",
            description:
              "Devis, stock, planning, production : les modules dont vous avez besoin.",
          },
          {
            title: "Logiciel de gestion ERP + CRM",
            price: "dès 20 000 €",
            description:
              "Clients, ventes, facturation, achats et pilotage réunis.",
          },
        ],
        cta: "Parler de mon logiciel",
        href: "#contact",
      },
    ],
    projectsEyebrow: "Réalisations",
    projectsHeading: "Des projets pensés pour leur métier",
    projectsDescription:
      "Architecture, travaux publics, restaurant, domaine viticole : chaque projet part du métier du client. Survolez une capture pour la faire défiler.",
    projectsPageHeading: "Réalisations",
    projectsPageDescription:
      "Des projets conçus et développés de A à Z, chacun pensé pour son métier.",
    visitProject: "Visiter le site",
    previewOnRequest:
      "Site de démonstration, aperçu envoyé sur demande par e-mail.",
    allProjects: "Voir toutes les réalisations",
    hoverHint: "Survolez pour faire défiler",
    whyEyebrow: "Pourquoi moi",
    whyHeading: "La réactivité d'un freelance, la rigueur d'une agence.",
    whyPoints: [
      {
        title: "Livré en semaines, pas en mois",
        description:
          "Je travaille avec les meilleurs outils de développement assistés par IA. Vous payez un résultat, et vous l'avez plus vite.",
      },
      {
        title: "Un seul interlocuteur",
        description:
          "Je fais le cadrage, le design, le développement et la mise en ligne. Rien ne se perd entre un commercial, un chef de projet et un développeur.",
      },
      {
        title: "Tout est à vous",
        description:
          "Code source, données et comptes d'hébergement à votre nom, en Europe. Vous n'êtes jamais prisonnier de votre prestataire.",
      },
      {
        title: "Un devis sans zone grise",
        description:
          "Chaque fonctionnalité est décrite, chiffrée et datée. Vous savez exactement ce que vous achetez.",
      },
    ],
    approachEyebrow: "Méthode",
    approachHeading:
      "Un projet clair, du premier échange à la mise en production.",
    approachSteps: [
      {
        title: "Cadrer",
        description:
          "On part de vos process réels : qui fait quoi, avec quels outils, où ça coince. Vous recevez un chiffrage précis.",
      },
      {
        title: "Spécifier",
        description:
          "Chaque écran, règle et droit d'accès est écrit noir sur blanc et validé par vous avant le développement.",
      },
      {
        title: "Construire",
        description:
          "Une démonstration toutes les deux semaines sur un environnement de test : vous voyez le projet avancer.",
      },
      {
        title: "Lancer et suivre",
        description:
          "Mise en production, reprise de vos données, formation de vos équipes, puis maintenance si vous le souhaitez.",
      },
    ],
    aboutEyebrow: "Qui suis-je",
    aboutHeading: "Designer de formation, développeur par passion.",
    aboutText:
      "Je suis Tobias Ringot, basé à Aix-en-Provence. Je conçois des interfaces claires et je les développe jusqu'au bout : sites, espaces clients et logiciels de gestion. Mon obsession : que vos équipes aient envie d'utiliser l'outil.",
    aboutCta: "En savoir plus sur moi",
    faqEyebrow: "Questions fréquentes",
    faqHeading: "Ce qu'on me demande souvent",
    faq: [
      {
        q: "Combien coûte un logiciel sur mesure ?",
        a: "Un espace client démarre à 8 000 € HT, un logiciel métier à 12 000 € HT et un ERP + CRM complet à 20 000 € HT. Le prix dépend du nombre de modules et d'utilisateurs. Tout commence par un atelier de cadrage, qui débouche sur un devis détaillé ligne par ligne.",
      },
      {
        q: "Pourquoi du sur mesure plutôt qu'un logiciel du marché ?",
        a: "Un logiciel du marché vous oblige à adapter vos process à l'outil, et vous payez un abonnement par utilisateur pour des fonctions que vous n'utilisez pas. Le sur mesure fait exactement ce dont vous avez besoin, et il vous appartient.",
      },
      {
        q: "Combien de temps faut-il ?",
        a: "Un site : 2 à 4 semaines. Un logiciel métier : généralement 8 à 14 semaines selon le périmètre. Le planning est fixé dans le devis, avec une démonstration toutes les deux semaines.",
      },
      {
        q: "À qui appartiennent le code et les données ?",
        a: "À vous. Le code source vous est remis, et l'hébergement, la base de données et le nom de domaine sont ouverts à votre nom, dans l'Union européenne.",
      },
      {
        q: "Vous utilisez l'IA ?",
        a: "Oui, comme outil de développement, pour aller plus vite. Chaque ligne est relue, testée et validée par moi. L'IA ne remplace ni le cadrage, ni la conception, ni la responsabilité : c'est moi qui m'engage.",
      },
      {
        q: "Et après la mise en ligne ?",
        a: "Une garantie couvre les anomalies pendant 3 mois. Ensuite, une formule de maintenance assure les mises à jour de sécurité, les sauvegardes et les évolutions, avec un tarif mensuel fixe.",
      },
    ],
    quoteCardTag: "Sites web",
    quoteCardTitle: "Estimer le prix de mon site",
    quoteCardText:
      "Quelques questions sur votre projet, et une estimation de prix à la fin. Pour un logiciel, choisissez « logiciel métier » : je vous recontacte pour un échange de cadrage.",
    quoteCardMeta: [
      "3 minutes",
      "Sans engagement",
      "Devis détaillé par e-mail",
    ],
    quoteCardCta: "Commencer ma demande",
    formHeading: "Plutôt un message rapide ?",
    formDescription:
      "Quelques lignes suffisent : votre activité, votre besoin, et les outils que vous utilisez aujourd'hui.",
    formName: "Votre nom",
    formEmail: "Votre e-mail",
    formCompany: "Entreprise / activité",
    formWebsite: "Site actuel (facultatif)",
    formService: "Votre besoin",
    formServicePlaceholder: "Choisir un besoin",
    formServices: [
      "Refonte de site",
      "Refonte visuelle",
      "Site vitrine",
      "Landing page",
      "Maintenance",
      "Espace client / portail B2B",
      "Logiciel métier / ERP",
      "ERP + CRM",
    ],
    formMessage: "Votre projet en quelques mots",
    formSend: "Envoyer ma demande",
    formSending: "Envoi en cours…",
    formSuccess:
      "Merci ! Votre message a bien été envoyé. Je vous réponds personnellement.",
    formError:
      "L'envoi n'a pas abouti. Vous pouvez aussi m'écrire directement par e-mail.",
    formPrivacy: "Vos informations servent uniquement à vous répondre.",
    directEmail: "Écrire directement",
  },
  en: {
    heroKicker: "Product designer & developer · Aix-en-Provence",
    heroNote:
      "For SMEs, trades, manufacturers and B2B networks that want tools built around them.",
    heroPrice: "Websites from €500 · Software from €8,000 excl. VAT",
    marqueeLabel: "Work preview",
    servicesEyebrow: "Services",
    servicesHeading: "Two crafts, one point of contact.",
    servicesDescription:
      "The website that brings clients in, and the software that runs your business. Every project is priced line by line, with no surprises.",
    pricesNote:
      "Indicative prices excl. VAT. The final price is set in a detailed quote, phase by phase.",
    tracks: [
      {
        id: "web",
        eyebrow: "Websites",
        title: "A website that builds trust and brings in enquiries.",
        description: "Tailored design, mobile-first, fast and search-friendly.",
        offers: [
          {
            title: "Website redesign",
            price: "from €1,800",
            description:
              "Your content and identity, modernised and reorganised.",
            badge: "Most popular",
            included: [
              "New tailored design",
              "Content reorganised and rewritten",
              "Mobile-first",
              "Basic Google SEO",
            ],
          },
          {
            title: "Visual refresh",
            price: "from €500",
            description:
              "I simply modernise the look of your website: same pages, same content, a current feel on mobile.",
          },
          {
            title: "Showcase website",
            price: "from €2,000",
            description: "5 to 8 pages that present your business clearly.",
          },
          {
            title: "Landing page",
            price: "from €900",
            description: "One page for one offer, built to convert.",
          },
          {
            title: "Hosting & maintenance",
            price: "from €49/month",
            description: "Updates, backups, monitoring and small improvements.",
          },
        ],
        cta: "Estimate my website",
        href: "/devis",
      },
      {
        id: "software",
        eyebrow: "Custom software",
        title: "A tool shaped around your processes, not the other way round.",
        description:
          "No more tangled spreadsheets or bloated software. Your teams get one simple tool that does exactly what they need.",
        offers: [
          {
            title: "Scoping workshop",
            price: "from €1,500",
            description:
              "Needs, business rules, specifications and a precise estimate.",
          },
          {
            title: "Client portal / B2B portal",
            price: "from €8,000",
            description: "Login, documents, order tracking, payment.",
          },
          {
            title: "Business software / ERP",
            price: "from €12,000",
            description:
              "Quotes, stock, planning, production: the modules you need.",
          },
          {
            title: "ERP + CRM management software",
            price: "from €20,000",
            description:
              "Clients, sales, invoicing, purchasing and reporting in one place.",
          },
        ],
        cta: "Talk about my software",
        href: "#contact",
      },
    ],
    projectsEyebrow: "Work",
    projectsHeading: "Projects shaped around their trade",
    projectsDescription:
      "Architecture, public works, restaurant, wine estate: each project starts from the client's trade. Hover a screenshot to scroll through it.",
    projectsPageHeading: "Work",
    projectsPageDescription:
      "Projects designed and built end to end, each one shaped around its trade.",
    visitProject: "Visit website",
    previewOnRequest: "Demo website, preview available on request by email.",
    allProjects: "See all work",
    hoverHint: "Hover to scroll",
    whyEyebrow: "Why me",
    whyHeading: "The speed of a freelancer, the rigour of an agency.",
    whyPoints: [
      {
        title: "Delivered in weeks, not months",
        description:
          "I work with the best AI-assisted development tools. You pay for a result, and you get it sooner.",
      },
      {
        title: "One point of contact",
        description:
          "I handle scoping, design, development and launch. Nothing gets lost between a salesperson, a project manager and a developer.",
      },
      {
        title: "You own everything",
        description:
          "Source code, data and hosting accounts in your name, in Europe. You're never locked in with your provider.",
      },
      {
        title: "A quote with no grey areas",
        description:
          "Every feature is described, priced and scheduled. You know exactly what you're buying.",
      },
    ],
    approachEyebrow: "Process",
    approachHeading: "A clear project, from first conversation to production.",
    approachSteps: [
      {
        title: "Scope",
        description:
          "We start from your real processes: who does what, with which tools, where it hurts. You get a precise estimate.",
      },
      {
        title: "Specify",
        description:
          "Every screen, rule and access right is written down and approved by you before development.",
      },
      {
        title: "Build",
        description:
          "A demo every two weeks on a test environment: you see the project take shape.",
      },
      {
        title: "Launch and support",
        description:
          "Go-live, data migration, team training, then maintenance if you wish.",
      },
    ],
    aboutEyebrow: "About",
    aboutHeading: "A designer by training, a developer by passion.",
    aboutText:
      "I'm Tobias Ringot, based in Aix-en-Provence. I design clear interfaces and build them all the way: websites, client portals and management software. My obsession: making your teams want to use the tool.",
    aboutCta: "More about me",
    faqEyebrow: "FAQ",
    faqHeading: "Questions I often get",
    faq: [
      {
        q: "How much does custom software cost?",
        a: "A client portal starts at €8,000, business software at €12,000 and a full ERP + CRM at €20,000, excl. VAT. The price depends on the number of modules and users. Everything starts with a scoping workshop that leads to a detailed, line-by-line quote.",
      },
      {
        q: "Why custom rather than off-the-shelf software?",
        a: "Off-the-shelf software makes you adapt your processes to the tool, and you pay per user for features you never use. Custom software does exactly what you need, and you own it.",
      },
      {
        q: "How long does it take?",
        a: "A website: 2 to 4 weeks. Business software: usually 8 to 14 weeks depending on scope. The schedule is set in the quote, with a demo every two weeks.",
      },
      {
        q: "Who owns the code and the data?",
        a: "You do. The source code is handed over, and hosting, database and domain name are opened in your name, within the European Union.",
      },
      {
        q: "Do you use AI?",
        a: "Yes, as a development tool, to move faster. Every line is reviewed, tested and approved by me. AI doesn't replace scoping, design or accountability: I'm the one who commits.",
      },
      {
        q: "What happens after launch?",
        a: "A 3-month warranty covers defects. After that, a maintenance plan handles security updates, backups and improvements at a fixed monthly price.",
      },
    ],
    quoteCardTag: "Websites",
    quoteCardTitle: "Estimate my website price",
    quoteCardText:
      'A few questions about your project, with a price estimate at the end. For software, choose "business software": I\'ll get back to you for a scoping call.',
    quoteCardMeta: ["3 minutes", "No commitment", "Detailed quote by email"],
    quoteCardCta: "Start my request",
    formHeading: "Just a quick message?",
    formDescription:
      "A few lines are enough: your business, what you need, and the tools you use today.",
    formName: "Your name",
    formEmail: "Your email",
    formCompany: "Business / activity",
    formWebsite: "Current website (optional)",
    formService: "What do you need?",
    formServicePlaceholder: "Choose a need",
    formServices: [
      "Website redesign",
      "Visual refresh",
      "Showcase website",
      "Landing page",
      "Maintenance",
      "Client portal / B2B portal",
      "Business software / ERP",
      "ERP + CRM",
    ],
    formMessage: "Your project in a few words",
    formSend: "Send my enquiry",
    formSending: "Sending…",
    formSuccess:
      "Thank you! Your message has been sent. I'll reply personally.",
    formError: "The message could not be sent. You can also email me directly.",
    formPrivacy: "Your information is used only to reply to you.",
    directEmail: "Email me directly",
  },
} as const satisfies Record<Locale, object>;
