import type { Locale } from "@/lib/i18n";

type Localized = Record<Locale, string>;

/** `price` is added to the estimate in euros; `factor` multiplies the total (deadline). */
export type QuoteOption = {
  value: string;
  label: Localized;
  price?: number;
  factor?: number;
};

export type QuoteField = {
  name: string;
  label: Localized;
  placeholder?: Localized;
  type?: "text" | "email" | "url" | "textarea";
  autoComplete?: string;
  required?: boolean;
  maxLength: number;
};

export type QuoteAnswers = Record<string, string | string[]>;

type StepBase = {
  id: string;
  question: Localized;
  help?: Localized;
  showIf?: (answers: QuoteAnswers) => boolean;
};

export type QuoteStep =
  | (StepBase & { kind: "single"; options: readonly QuoteOption[] })
  | (StepBase & { kind: "multi"; options: readonly QuoteOption[] })
  | (StepBase & { kind: "fields"; fields: readonly QuoteField[] })
  | (StepBase & { kind: "estimate" });

export const QUOTE_MIN = 900;
export const QUOTE_MAX = 7990;

const o = (
  value: string,
  fr: string,
  en: string,
  extra: Partial<QuoteOption> = {}
): QuoteOption => ({ value, label: { fr, en }, ...extra });

const isBuild = (answers: QuoteAnswers): boolean =>
  answers.need !== "maintenance" && answers.need !== "software";
const hasPages = (answers: QuoteAnswers): boolean =>
  isBuild(answers) && answers.need !== "landing";

export const quoteSteps: readonly QuoteStep[] = [
  {
    id: "need",
    kind: "single",
    question: { fr: "De quoi avez-vous besoin ?", en: "What do you need?" },
    options: [
      o(
        "redesign",
        "Refonte de mon site actuel",
        "A redesign of my current website",
        { price: 1800 }
      ),
      o("showcase", "Un premier site vitrine", "A first showcase website", {
        price: 2000,
      }),
      o(
        "landing",
        "Une landing page (offre, saison, lancement)",
        "A landing page (offer, season, launch)",
        { price: 900 }
      ),
      o(
        "shop",
        "Un site avec une petite boutique en ligne",
        "A website with a small online shop",
        { price: 3490 }
      ),
      o(
        "software",
        "Un logiciel métier, un espace client ou un ERP / CRM",
        "Custom software, a client portal or an ERP / CRM"
      ),
      o(
        "maintenance",
        "La maintenance d'un site existant",
        "Maintenance of an existing website"
      ),
      o("other", "Autre chose", "Something else", { price: 1800 }),
    ],
  },
  {
    id: "business",
    kind: "fields",
    question: {
      fr: "Parlez-moi de votre entreprise.",
      en: "Tell me about your business.",
    },
    fields: [
      {
        name: "company",
        label: { fr: "Nom de l'entreprise", en: "Business name" },
        autoComplete: "organization",
        required: true,
        maxLength: 120,
      },
      {
        name: "activity",
        label: { fr: "Votre activité", en: "What you do" },
        placeholder: {
          fr: "Ex. : cabinet d'architecture, boulangerie, plombier…",
          en: "E.g. architecture studio, bakery, plumber…",
        },
        required: true,
        maxLength: 160,
      },
      {
        name: "city",
        label: { fr: "Ville", en: "City" },
        autoComplete: "address-level2",
        maxLength: 80,
      },
    ],
  },
  {
    id: "website",
    kind: "fields",
    question: {
      fr: "Avez-vous déjà un site ?",
      en: "Do you already have a website?",
    },
    help: {
      fr: "Laissez vide si vous n'en avez pas encore.",
      en: "Leave empty if you don't have one yet.",
    },
    fields: [
      {
        name: "website",
        label: { fr: "Adresse du site actuel", en: "Current website address" },
        placeholder: { fr: "www.mon-entreprise.fr", en: "www.my-business.com" },
        type: "url",
        maxLength: 300,
      },
    ],
  },
  {
    id: "pages",
    kind: "single",
    showIf: hasPages,
    question: {
      fr: "Combien de pages imaginez-vous ?",
      en: "How many pages do you have in mind?",
    },
    help: {
      fr: "Accueil, services, réalisations, contact… une estimation suffit.",
      en: "Home, services, work, contact… a rough idea is enough.",
    },
    options: [
      o("1", "Une seule page", "A single page", { price: 0 }),
      o("2-5", "2 à 5 pages", "2 to 5 pages", { price: 400 }),
      o("6-10", "6 à 10 pages", "6 to 10 pages", { price: 1100 }),
      o("10+", "Plus de 10 pages", "More than 10 pages", { price: 2000 }),
      o("unknown", "Je ne sais pas encore", "Not sure yet", { price: 400 }),
    ],
  },
  {
    id: "features",
    kind: "multi",
    showIf: isBuild,
    question: {
      fr: "Quelles fonctionnalités vous seraient utiles ?",
      en: "Which features would be useful?",
    },
    help: {
      fr: "Plusieurs réponses possibles. Le formulaire de contact est toujours inclus.",
      en: "Choose as many as you like. A contact form is always included.",
    },
    options: [
      o("gallery", "Galerie de réalisations", "Project gallery", {
        price: 300,
      }),
      o(
        "booking",
        "Réservation ou prise de rendez-vous",
        "Booking or appointments",
        { price: 500 }
      ),
      o("blog", "Actualités / blog", "News / blog", { price: 400 }),
      o("cms", "Modifier les contenus moi-même", "Edit the content myself", {
        price: 400,
      }),
      o("multilingual", "Plusieurs langues", "Several languages", {
        price: 700,
      }),
      o("shop", "Vente en ligne", "Online sales", { price: 1200 }),
      o("none", "Rien de particulier", "Nothing specific", { price: 0 }),
    ],
  },
  {
    id: "extras",
    kind: "multi",
    showIf: isBuild,
    question: {
      fr: "De quoi aurez-vous besoin en plus ?",
      en: "What else will you need?",
    },
    help: {
      fr: "Je peux m'occuper de ce qui manque.",
      en: "I can take care of what's missing.",
    },
    options: [
      o("copywriting", "Rédaction des textes", "Copywriting", { price: 390 }),
      o("logo", "Création ou modernisation du logo", "Logo design or refresh", {
        price: 490,
      }),
      o("seo", "Optimisation pour Google (SEO local)", "Local SEO for Google", {
        price: 300,
      }),
      o(
        "photos",
        "Sélection de photos professionnelles",
        "Professional photo selection",
        { price: 150 }
      ),
      o("nothing", "Rien, j'ai déjà tout", "Nothing, I have everything", {
        price: 0,
      }),
    ],
  },
  {
    id: "deadline",
    kind: "single",
    showIf: isBuild,
    question: { fr: "Pour quand ?", en: "When do you need it?" },
    help: {
      fr: "Un délai court m'oblige à tout prioriser : le prix augmente.",
      en: "A short deadline means prioritising your project: the price goes up.",
    },
    options: [
      o(
        "urgent",
        "En urgence, sous 3 semaines (+30 %)",
        "Urgent, within 3 weeks (+30%)",
        { factor: 1.3 }
      ),
      o("1-2m", "D'ici 1 à 2 mois (+15 %)", "Within 1 to 2 months (+15%)", {
        factor: 1.15,
      }),
      o("3m+", "Dans 3 mois ou plus", "In 3 months or more", { factor: 1 }),
      o("flexible", "Pas de date précise", "No fixed date", { factor: 1 }),
    ],
  },
  {
    id: "estimate",
    kind: "estimate",
    question: { fr: "Votre estimation", en: "Your estimate" },
  },
  {
    id: "contact",
    kind: "fields",
    question: {
      fr: "Où dois-je envoyer votre devis détaillé ?",
      en: "Where should I send your detailed quote?",
    },
    help: {
      fr: "Tout se passe par e-mail.",
      en: "Everything happens by email.",
    },
    fields: [
      {
        name: "name",
        label: { fr: "Votre nom", en: "Your name" },
        autoComplete: "name",
        required: true,
        maxLength: 100,
      },
      {
        name: "email",
        label: { fr: "Votre e-mail", en: "Your email" },
        type: "email",
        autoComplete: "email",
        required: true,
        maxLength: 254,
      },
      {
        name: "message",
        label: {
          fr: "Des précisions sur votre projet ? (facultatif)",
          en: "Any details about your project? (optional)",
        },
        placeholder: {
          fr: "Sites que vous aimez, contraintes, idées…",
          en: "Websites you like, constraints, ideas…",
        },
        type: "textarea",
        maxLength: 3000,
      },
    ],
  },
];

export function visibleSteps(answers: QuoteAnswers): QuoteStep[] {
  return quoteSteps.filter((step) => !step.showIf || step.showIf(answers));
}

export type EstimateLine = { label: Localized; amount: number };
export type Estimate =
  | { kind: "price"; amount: number; lines: EstimateLine[]; factor: number }
  | { kind: "custom"; reason: "maintenance" | "scope" | "software" };

/** Rounds to a "…90" price, e.g. 2 530 → 2 490. */
function roundPrice(value: number): number {
  return Math.round(value / 100) * 100 - 10;
}

export function estimateQuote(answers: QuoteAnswers): Estimate {
  if (answers.need === "maintenance")
    return { kind: "custom", reason: "maintenance" };
  if (answers.need === "software")
    return { kind: "custom", reason: "software" };

  const lines: EstimateLine[] = [];
  let factor = 1;

  for (const step of visibleSteps(answers)) {
    if (step.kind !== "single" && step.kind !== "multi") continue;
    const raw = answers[step.id];
    const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
    for (const value of values) {
      const option = step.options.find((item) => item.value === value);
      if (!option) continue;
      if (option.factor) factor = option.factor;
      // A shop project already includes online sales.
      const price =
        step.id === "features" && value === "shop" && answers.need === "shop"
          ? 0
          : (option.price ?? 0);
      if (price > 0) lines.push({ label: option.label, amount: price });
    }
  }

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const amount = Math.max(QUOTE_MIN, roundPrice(subtotal * factor));
  if (amount > QUOTE_MAX) return { kind: "custom", reason: "scope" };
  return { kind: "price", amount, lines, factor };
}

export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const quoteCopy = {
  fr: {
    title: "Estimez le prix de votre site",
    intro:
      "Quelques questions sur votre projet, et vous obtenez une estimation tout de suite. Je vous envoie ensuite le devis détaillé par e-mail.",
    introMeta: ["2 minutes", "Prix affiché à la fin", "Sans engagement"],
    start: "Commencer",
    next: "Continuer",
    back: "Retour",
    toContact: "Recevoir mon devis par e-mail",
    submit: "Envoyer ma demande",
    sending: "Envoi en cours…",
    pressEnter: "ou appuyez sur Entrée",
    required: "Ce champ est nécessaire pour continuer.",
    invalidEmail: "Cette adresse e-mail ne semble pas valide.",
    pickOne: "Choisissez au moins une réponse.",
    step: (current: number, total: number) => `Étape ${current} sur ${total}`,
    estimateFrom: "Estimation",
    estimateCustom: "Sur devis",
    estimateCustomScope:
      "Votre projet dépasse mes formules standard : je vous prépare un devis sur mesure, envoyé par e-mail.",
    estimateCustomMaintenance:
      "La maintenance dépend du site et du volume de mises à jour : je vous envoie une proposition adaptée par e-mail.",
    estimateCustomSoftware:
      "Un logiciel se chiffre après un court échange sur vos process. Repères : espace client dès 8 000 €, logiciel métier dès 12 000 €, ERP + CRM dès 20 000 € HT.",
    estimateBreakdown: "Détail",
    estimateDeadline: (percent: number) => `Délai court (+${percent} %)`,
    estimateNote:
      "Estimation indicative, arrondie. Le prix final est confirmé dans le devis détaillé.",
    successTitle: "Merci, c'est bien reçu.",
    successText:
      "Je lis votre demande et je vous envoie le devis détaillé par e-mail, avec mes éventuelles questions sur le projet.",
    backHome: "Retour à l'accueil",
    seeWork: "Voir les réalisations",
    error:
      "L'envoi n'a pas abouti. Vous pouvez réessayer ou m'écrire directement.",
    directEmail: "Écrire directement",
    privacy: "Vos réponses servent uniquement à préparer votre devis.",
  },
  en: {
    title: "Estimate your website price",
    intro:
      "A few questions about your project and you get an estimate right away. I then email you the detailed quote.",
    introMeta: ["2 minutes", "Price shown at the end", "No commitment"],
    start: "Start",
    next: "Continue",
    back: "Back",
    toContact: "Get my quote by email",
    submit: "Send my request",
    sending: "Sending…",
    pressEnter: "or press Enter",
    required: "This field is needed to continue.",
    invalidEmail: "This email address doesn't look valid.",
    pickOne: "Choose at least one answer.",
    step: (current: number, total: number) => `Step ${current} of ${total}`,
    estimateFrom: "Estimate",
    estimateCustom: "Custom quote",
    estimateCustomScope:
      "Your project goes beyond my standard packages: I'll prepare a tailored quote and email it to you.",
    estimateCustomMaintenance:
      "Maintenance depends on the site and how often it changes: I'll email you a suitable proposal.",
    estimateCustomSoftware:
      "Software is priced after a short conversation about your processes. Benchmarks: client portal from €8,000, business software from €12,000, ERP + CRM from €20,000 excl. VAT.",
    estimateBreakdown: "Breakdown",
    estimateDeadline: (percent: number) => `Short deadline (+${percent}%)`,
    estimateNote:
      "Indicative, rounded estimate. The final price is confirmed in the detailed quote.",
    successTitle: "Thank you, it's in.",
    successText:
      "I'll read your request and email you the detailed quote, along with any questions about the project.",
    backHome: "Back to home",
    seeWork: "See the work",
    error:
      "The request could not be sent. You can try again or email me directly.",
    directEmail: "Email me directly",
    privacy: "Your answers are only used to prepare your quote.",
  },
} as const;
