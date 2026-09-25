import type { Locale } from "@/lib/i18n";

/** Missions of "La tournée": deliver websites and software to clients on the desk. */
export type MissionId = "racines" | "cogebat" | "adresse" | "basket";

export type Mission = {
  id: MissionId;
  percent: number;
  title: Record<Locale, string>;
  brief: Record<Locale, string>;
  done: Record<Locale, string>;
};

export const missions: readonly Mission[] = [
  {
    id: "racines",
    percent: 10,
    title: { fr: "Livrer le site de Racines", en: "Deliver Racines' website" },
    brief: { fr: "Le restaurant n'a pas de site. Montez dans le van (E) et roulez jusqu'à la maquette Racines.", en: "The restaurant has no website. Get in the van (E) and drive to the Racines model." },
    done: { fr: "Site livré. Racines prend des réservations en ligne.", en: "Website delivered. Racines takes bookings online." },
  },
  {
    id: "cogebat",
    percent: 5,
    title: { fr: "Apporter le logiciel au chantier", en: "Bring the software to the site" },
    brief: { fr: "COGEBAT perd ses devis dans Excel. Livrez le logiciel de gestion au chantier.", en: "COGEBAT loses quotes in Excel. Deliver the management software to the site." },
    done: { fr: "Logiciel livré. Plus de devis_v12_FINAL_ok.xlsx.", en: "Software delivered. No more quote_v12_FINAL_ok.xlsx." },
  },
  {
    id: "adresse",
    percent: 5,
    title: { fr: "L'espace client de l'agence", en: "The agency's client portal" },
    brief: { fr: "Adresse Privée attend son espace client. Passez à la villa.", en: "Adresse Privée is waiting for its client portal. Drive to the villa." },
    done: { fr: "Espace client en ligne. Les acheteurs signent depuis leur canapé.", en: "Client portal live. Buyers sign from their sofa." },
  },
  {
    id: "basket",
    percent: 5,
    title: { fr: "Boulette dans la corbeille", en: "Paper ball in the bin" },
    brief: { fr: "Une boulette traîne sur le bureau. Poussez-la ou lancez-la dans la corbeille.", en: "A paper ball is lying around. Push or throw it into the bin." },
    done: { fr: "Panier ! Le bureau est rangé.", en: "Basket! The desk is tidy." },
  },
];

export const MAX_DISCOUNT = 25;

/** Total discount for a set of completed missions, capped. */
export function discountFor(done: readonly MissionId[]): number {
  const total = missions.filter((m) => done.includes(m.id)).reduce((sum, m) => sum + m.percent, 0);
  return Math.min(MAX_DISCOUNT, total);
}

export function codeFor(percent: number): string | null {
  return percent > 0 ? `TOURNEE${percent}` : null;
}

/** Reads a discount percent back from a code such as TOURNEE15. */
export function discountFromCode(code: string | null | undefined): number {
  if (!code) return 0;
  const match = /^TOURNEE(10|15|20|25)$/i.exec(code.trim());
  return match ? Number(match[1]) : 0;
}

export const STORAGE_KEY = "tournee-missions";

export function loadMissions(): MissionId[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is MissionId => missions.some((m) => m.id === id)) : [];
  } catch {
    return [];
  }
}

export function saveMissions(done: readonly MissionId[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  } catch {
    /* storage unavailable */
  }
}
