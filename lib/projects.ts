import type { Locale } from "@/lib/i18n";

type Localized<T> = Record<Locale, T>;

export type Project = {
  slug: string;
  /** "live": client site online, named. "study": anonymised redesign study, never named. */
  kind: "live" | "study";
  title: Localized<string>;
  sector: Localized<string>;
  place: string;
  summary: Localized<string>;
  highlights: Localized<readonly string[]>;
  url?: string;
  accent: string;
};

export const projects: readonly Project[] = [
  {
    slug: "parentez",
    kind: "live",
    title: { fr: "Parentez²", en: "Parentez²" },
    sector: { fr: "Architecture intérieure", en: "Interior architecture" },
    place: "Aix-en-Provence",
    summary: {
      fr: "Le site d'un studio qui transforme maisons, villas et appartements en Provence.",
      en: "The website of a studio transforming houses, villas and apartments in Provence.",
    },
    highlights: {
      fr: ["Les projets présentés en grand", "Le studio et ses services expliqués simplement", "Une demande de projet dès l'accueil"],
      en: ["Projects shown large", "The studio and its services explained simply", "A project enquiry right from the homepage"],
    },
    url: "https://parentez.vercel.app/",
    accent: "#8a7a66",
  },
  {
    slug: "mistral-tp",
    kind: "live",
    title: { fr: "Mistral TP", en: "Mistral TP" },
    sector: { fr: "Terrassement & travaux publics", en: "Earthworks & public works" },
    place: "Lançon-de-Provence",
    summary: {
      fr: "Le site d'une entreprise de terrassement, VRD, aménagement extérieur et démolition.",
      en: "The website of an earthworks, utilities, landscaping and demolition company.",
    },
    highlights: {
      fr: ["Les métiers compris en un coup d'œil", "La méthode de chantier étape par étape", "Les questions fréquentes déjà répondues"],
      en: ["Services understood at a glance", "The site method step by step", "Common questions already answered"],
    },
    url: "https://mistraltp.vercel.app/",
    accent: "#e8590c",
  },
  {
    slug: "aqua-concept",
    kind: "study",
    title: { fr: "Pisciniste", en: "Pool builder" },
    sector: { fr: "Piscines sur mesure", en: "Custom pools" },
    place: "Aix-en-Provence",
    summary: {
      fr: "Une vitrine haut de gamme pour un constructeur de piscines en béton armé.",
      en: "A premium showcase for a reinforced-concrete pool builder.",
    },
    highlights: {
      fr: ["Les réalisations mises en valeur", "La démarche 3D en trois étapes", "Une demande de projet en trois informations"],
      en: ["Completed pools put forward", "The 3D process in three steps", "A project request in three fields"],
    },
    accent: "#a8925c",
  },
  {
    slug: "partner-menuiseries",
    kind: "study",
    title: { fr: "Fabricant de menuiseries", en: "Window manufacturer" },
    sector: { fr: "Menuiseries alu & PVC", en: "Aluminium & PVC joinery" },
    place: "Bouches-du-Rhône",
    summary: {
      fr: "Un site clair pour un groupe familial avec plusieurs agences et ses propres ateliers.",
      en: "A clear website for a family group with several branches and its own workshops.",
    },
    highlights: {
      fr: ["Chaque agence joignable en un geste", "Les ateliers de fabrication mis en avant", "Un devis en quatre informations"],
      en: ["Every branch reachable in one tap", "In-house workshops put forward", "A quote request in four fields"],
    },
    accent: "#01b5e2",
  },
  {
    slug: "optic-iris",
    kind: "study",
    title: { fr: "Opticien indépendant", en: "Independent optician" },
    sector: { fr: "Commerce de proximité", en: "Local shop" },
    place: "Pays d'Aix",
    summary: {
      fr: "Une boutique de centre-ville qui se découvre et se réserve depuis le téléphone.",
      en: "A town-centre shop that can be discovered and booked from a phone.",
    },
    highlights: {
      fr: ["La prise de rendez-vous en ligne", "Les horaires du jour dès l'arrivée", "L'appel et l'itinéraire en un geste"],
      en: ["Online appointment booking", "Today's opening hours up front", "Call and directions in one tap"],
    },
    accent: "#4bc4dd",
  },
  {
    slug: "sgabtp",
    kind: "study",
    title: { fr: "Fabricant d'armatures", en: "Rebar manufacturer" },
    sector: { fr: "Industrie du BTP", en: "Construction industry" },
    place: "Bouches-du-Rhône",
    summary: {
      fr: "Un site industriel lisible pour les conducteurs de travaux, jusque sur le chantier.",
      en: "An industrial website that site managers can read, even on site.",
    },
    highlights: {
      fr: ["Un bouton pour appeler, partout", "Les six prestations en un coup d'œil", "Le catalogue lisible sur téléphone"],
      en: ["A call button everywhere", "Six services at a glance", "A catalogue that reads well on a phone"],
    },
    accent: "#ffa54a",
  },
  {
    slug: "sanitor",
    kind: "study",
    title: { fr: "Négoce sanitaire", en: "Plumbing supplier" },
    sector: { fr: "Sanitaire & chauffage", en: "Plumbing & heating" },
    place: "Marseille",
    summary: {
      fr: "Un négoce professionnel où les installateurs trouvent l'univers et la marque qu'ils cherchent.",
      en: "A trade supplier where installers find the range and brand they need.",
    },
    highlights: {
      fr: ["Treize univers lisibles d'un coup d'œil", "Les grandes marques en toutes lettres", "L'adresse et l'itinéraire en un clic"],
      en: ["Thirteen ranges at a glance", "Major brands spelled out", "Address and directions in one click"],
    },
    accent: "#f0309c",
  },
  {
    slug: "marine-industrial-supplies",
    kind: "study",
    title: { fr: "Négoce de pièces marines", en: "Marine parts trader" },
    sector: { fr: "Industrie · site en anglais", en: "Industry · English website" },
    place: "Marseille",
    summary: {
      fr: "Un site international pour des armateurs qui cherchent une pièce moteur rapidement.",
      en: "An international website for ship owners looking for an engine part fast.",
    },
    highlights: {
      fr: ["Une recherche instantanée des moteurs", "Une demande de pièce en quelques champs", "Des gammes claires"],
      en: ["Instant engine search", "A part request in a few fields", "Clear product ranges"],
    },
    accent: "#e3892f",
  },
];

export const liveProjects = projects.filter((project) => project.kind === "live");
export const studyProjects = projects.filter((project) => project.kind === "study");
