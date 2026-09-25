import type { Locale } from "@/lib/i18n";

type Localized<T> = Record<Locale, T>;

export type Testimonial = {
  quote: Localized<string>;
  author: Localized<string>;
  /** A measurable result, shown as a stamp. */
  result?: Localized<string>;
};

/** Real client feedback, reworded lightly and anonymised at their request. */
export const testimonials: readonly Testimonial[] = [
  {
    quote: {
      fr: "Le sur-mesure nous a permis de regrouper tous nos outils en un seul. Chacun a une application adaptée à son poste et à ses informations : notre commerciale a même un mode vocabulaire simplifié pour tout comprendre en direct. Et côté sécurité, c'est du solide. Franchement, top.",
      en: "Going custom let us bring all our tools into one. Everyone has an app suited to their role and their own data: our sales rep even has a simplified-vocabulary mode to follow everything live. And security is rock solid. Honestly, great.",
    },
    author: { fr: "Dirigeant · entreprise générale du bâtiment", en: "Managing director · general building contractor" },
    result: { fr: "1 logiciel au lieu de 3 · plusieurs centaines d'euros économisés chaque mois", en: "1 tool instead of 3 · several hundred euros saved every month" },
  },
  {
    quote: {
      fr: "On retrouve vraiment l'univers de chaque maison, et le site a ce côté premium, très architecte, qu'on cherchait. Très contente.",
      en: "You really feel the character of each home, and the site has that premium, architectural touch we were after. Very happy.",
    },
    author: { fr: "Studio d'architecture intérieure · Aix-en-Provence", en: "Interior architecture studio · Aix-en-Provence" },
  },
  {
    quote: {
      fr: "Simple, efficace : on y trouve tout ce qu'on doit y trouver. Parfait.",
      en: "Simple and effective: everything you need is right there. Perfect.",
    },
    author: { fr: "Terrassement & travaux publics · Lançon-de-Provence", en: "Earthworks & public works · Lançon-de-Provence" },
  },
];
