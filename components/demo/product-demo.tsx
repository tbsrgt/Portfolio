"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  FileText,
  Kanban,
  Minus,
  Package,
  Plus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type ReactNode } from "react";

import { useLanguage, type Locale } from "@/lib/i18n";

type Tab = "pipeline" | "quotes" | "stock" | "dashboard";
type Deal = { id: number; client: string; amount: number; stage: number };
type Quote = {
  id: string;
  client: string;
  amount: number;
  status: "sent" | "accepted" | "invoiced";
};
type Item = { id: string; name: string; qty: number; min: number };

const text = {
  fr: {
    tabs: {
      pipeline: "Pipeline",
      quotes: "Devis",
      stock: "Stock",
      dashboard: "Tableau de bord",
    },
    stages: ["Prospect", "Devis envoyé", "Négociation", "Gagné"],
    next: "Étape suivante",
    won: "Gagné",
    pickDeal: "Choisissez une opportunité pour la faire avancer.",
    quoteStatus: { sent: "Envoyé", accepted: "Accepté", invoiced: "Facturé" },
    toInvoice: "Facturer",
    accept: "Accepter",
    stockMin: "Seuil",
    lowStock: "Stock bas",
    kpis: [
      "CA signé",
      "Pipeline en cours",
      "Devis à facturer",
      "Articles en alerte",
    ],
    months: ["Avr", "Mai", "Juin", "Juil", "Août", "Sept"],
    revenue: "Chiffre d'affaires mensuel",
    app: "Atelier Durance · Gestion",
    demo: "Démo · données fictives",
  },
  en: {
    tabs: {
      pipeline: "Pipeline",
      quotes: "Quotes",
      stock: "Stock",
      dashboard: "Dashboard",
    },
    stages: ["Lead", "Quote sent", "Negotiation", "Won"],
    next: "Next stage",
    won: "Won",
    pickDeal: "Pick a deal to move it forward.",
    quoteStatus: { sent: "Sent", accepted: "Accepted", invoiced: "Invoiced" },
    toInvoice: "Invoice",
    accept: "Accept",
    stockMin: "Min.",
    lowStock: "Low stock",
    kpis: [
      "Signed revenue",
      "Open pipeline",
      "Quotes to invoice",
      "Low-stock items",
    ],
    months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    revenue: "Monthly revenue",
    app: "Atelier Durance · Management",
    demo: "Demo · sample data",
  },
} as const;

const initialDeals: Deal[] = [
  { id: 1, client: "Boulangerie Marius", amount: 4200, stage: 0 },
  { id: 2, client: "SCI Les Pins", amount: 12800, stage: 1 },
  { id: 3, client: "Garage Venturi", amount: 6500, stage: 1 },
  { id: 4, client: "Hôtel du Cours", amount: 18400, stage: 2 },
  { id: 5, client: "Cave Saint-Jean", amount: 3900, stage: 3 },
];
const initialQuotes: Quote[] = [
  { id: "D-0142", client: "Hôtel du Cours", amount: 18400, status: "sent" },
  { id: "D-0141", client: "Cave Saint-Jean", amount: 3900, status: "accepted" },
  {
    id: "D-0139",
    client: "Pharmacie Mirabeau",
    amount: 2750,
    status: "accepted",
  },
  {
    id: "D-0137",
    client: "Domaine Castellas",
    amount: 9600,
    status: "invoiced",
  },
];
const initialItems: Item[] = [
  { id: "A-12", name: "Plan de travail chêne", qty: 14, min: 5 },
  { id: "A-27", name: "Charnière inox", qty: 6, min: 20 },
  { id: "A-31", name: "Poignée laiton", qty: 42, min: 15 },
  { id: "A-44", name: "Panneau MDF 19 mm", qty: 9, min: 10 },
];
const baseRevenue = [21400, 18900, 26100, 15800, 12300];

const icons = {
  pipeline: Kanban,
  quotes: FileText,
  stock: Package,
  dashboard: BarChart3,
} as const;

function eur(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

const panelClass = "border-foreground/8 bg-background rounded-2xl border";

export function ProductDemo(): ReactNode {
  const { locale } = useLanguage();
  const t = text[locale];
  const [tab, setTab] = useState<Tab>("pipeline");
  const [deals, setDeals] = useState(initialDeals);
  const [selected, setSelected] = useState<number | null>(4);
  const [quotes, setQuotes] = useState(initialQuotes);
  const [items, setItems] = useState(initialItems);

  const stats = useMemo(() => {
    const signed = deals
      .filter((d) => d.stage === 3)
      .reduce((sum, d) => sum + d.amount, 0);
    const open = deals
      .filter((d) => d.stage < 3)
      .reduce((sum, d) => sum + d.amount, 0);
    const toInvoice = quotes.filter((q) => q.status === "accepted").length;
    const low = items.filter((i) => i.qty < i.min).length;
    return { signed, open, toInvoice, low };
  }, [deals, quotes, items]);

  const advance = (id: number): void =>
    setDeals((all) =>
      all.map((d) =>
        d.id === id ? { ...d, stage: Math.min(3, d.stage + 1) } : d
      )
    );
  const nextQuote = (id: string): void =>
    setQuotes((all) =>
      all.map((q) =>
        q.id === id
          ? { ...q, status: q.status === "sent" ? "accepted" : "invoiced" }
          : q
      )
    );
  const moveStock = (id: string, delta: number): void =>
    setItems((all) =>
      all.map((i) =>
        i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i
      )
    );

  const current = deals.find((d) => d.id === selected);

  return (
    <div className="border-foreground/10 bg-foreground/[0.03] overflow-hidden rounded-3xl border shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]">
      <div className="border-foreground/8 flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="bg-foreground/15 h-2.5 w-2.5 rounded-full" />
          <span className="bg-foreground/15 h-2.5 w-2.5 rounded-full" />
          <span className="bg-foreground/15 h-2.5 w-2.5 rounded-full" />
        </div>
        <p className="text-foreground/70 truncate text-xs font-medium sm:text-sm">
          {t.app}
        </p>
        <p className="text-foreground/45 hidden text-xs sm:block">{t.demo}</p>
      </div>

      <div className="grid md:grid-cols-[180px_1fr]">
        <div
          role="tablist"
          aria-label={t.app}
          className="border-foreground/8 flex gap-1 overflow-x-auto border-b p-2 md:flex-col md:border-r md:border-b-0 md:p-3"
        >
          {(Object.keys(t.tabs) as Tab[]).map((key) => {
            const Icon = icons[key];
            const active = tab === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(key)}
                className={`focus-ring flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${active ? "bg-foreground text-background" : "text-foreground/65 hover:bg-foreground/5 hover:text-foreground"}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {t.tabs[key]}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="min-h-[300px] p-3 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "pipeline" ? (
                <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {t.stages.map((stage, index) => {
                      const column = deals.filter((d) => d.stage === index);
                      return (
                        <div
                          key={stage}
                          className="bg-foreground/[0.03] rounded-xl p-2"
                        >
                          <p className="text-foreground/55 flex items-center justify-between px-1 pb-2 text-xs font-medium">
                            {stage}
                            <span className="tabular-nums">
                              {column.length}
                            </span>
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {column.map((deal) => (
                              <motion.li
                                key={deal.id}
                                layout
                                transition={{
                                  duration: 0.35,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              >
                                <button
                                  onClick={() => setSelected(deal.id)}
                                  className={`focus-ring w-full rounded-lg border px-2.5 py-2 text-left transition-colors ${selected === deal.id ? "border-foreground/40 bg-background" : "border-foreground/8 bg-background hover:border-foreground/20"}`}
                                >
                                  <span className="text-foreground block truncate text-xs font-medium">
                                    {deal.client}
                                  </span>
                                  <span className="text-foreground/55 text-xs tabular-nums">
                                    {eur(deal.amount, locale)}
                                  </span>
                                </button>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                  <div className={`${panelClass} flex flex-col p-4`}>
                    {current ? (
                      <>
                        <p className="text-foreground/50 text-xs">
                          {t.stages[current.stage]}
                        </p>
                        <p className="text-foreground mt-1 font-medium">
                          {current.client}
                        </p>
                        <p className="text-foreground mt-3 text-2xl font-medium tabular-nums">
                          {eur(current.amount, locale)}
                        </p>
                        <button
                          onClick={() => advance(current.id)}
                          disabled={current.stage === 3}
                          className="focus-ring bg-foreground text-background mt-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 pt-2 pb-2 text-sm font-medium transition-opacity disabled:opacity-40 lg:mt-6"
                        >
                          {current.stage === 3 ? t.won : t.next}
                          {current.stage < 3 ? (
                            <ArrowRight
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          ) : null}
                        </button>
                      </>
                    ) : (
                      <p className="text-foreground/55 text-sm">{t.pickDeal}</p>
                    )}
                  </div>
                </div>
              ) : null}

              {tab === "quotes" ? (
                <ul className={`${panelClass} divide-foreground/8 divide-y`}>
                  {quotes.map((q) => (
                    <li
                      key={q.id}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
                    >
                      <span className="text-foreground/45 w-14 text-xs tabular-nums">
                        {q.id}
                      </span>
                      <span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
                        {q.client}
                      </span>
                      <span className="text-foreground text-sm tabular-nums">
                        {eur(q.amount, locale)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${q.status === "invoiced" ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400" : q.status === "accepted" ? "bg-sky-500/12 text-sky-700 dark:text-sky-400" : "bg-foreground/6 text-foreground/60"}`}
                      >
                        {t.quoteStatus[q.status]}
                      </span>
                      {q.status !== "invoiced" ? (
                        <button
                          onClick={() => nextQuote(q.id)}
                          className="focus-ring border-foreground/12 hover:bg-foreground/5 rounded-lg border px-2.5 py-1 text-xs font-medium"
                        >
                          {q.status === "sent" ? t.accept : t.toInvoice}
                        </button>
                      ) : (
                        <span className="w-[62px]" aria-hidden="true" />
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}

              {tab === "stock" ? (
                <ul className={`${panelClass} divide-foreground/8 divide-y`}>
                  {items.map((item) => {
                    const low = item.qty < item.min;
                    return (
                      <li
                        key={item.id}
                        className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
                      >
                        <span className="text-foreground/45 w-10 text-xs tabular-nums">
                          {item.id}
                        </span>
                        <span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
                          {item.name}
                        </span>
                        {low ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                            <AlertTriangle
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                            {t.lowStock}
                          </span>
                        ) : null}
                        <span className="text-foreground/45 text-xs">
                          {t.stockMin} {item.min}
                        </span>
                        <span className="flex items-center gap-1">
                          <button
                            onClick={() => moveStock(item.id, -1)}
                            aria-label={`− ${item.name}`}
                            className="focus-ring border-foreground/12 hover:bg-foreground/5 rounded-md border p-1"
                          >
                            <Minus className="h-3 w-3" aria-hidden="true" />
                          </button>
                          <span className="text-foreground w-8 text-center text-sm font-medium tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => moveStock(item.id, 5)}
                            aria-label={`+5 ${item.name}`}
                            className="focus-ring border-foreground/12 hover:bg-foreground/5 rounded-md border p-1"
                          >
                            <Plus className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : null}

              {tab === "dashboard" ? (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {[
                      eur(stats.signed, locale),
                      eur(stats.open, locale),
                      String(stats.toInvoice),
                      String(stats.low),
                    ].map((value, index) => (
                      <div key={t.kpis[index]} className={`${panelClass} p-3`}>
                        <p className="text-foreground/50 text-xs">
                          {t.kpis[index]}
                        </p>
                        <p className="text-foreground mt-1 text-lg font-medium tabular-nums sm:text-xl">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className={`${panelClass} p-4`}>
                    <p className="text-foreground/50 text-xs">{t.revenue}</p>
                    <RevenueChart
                      values={[...baseRevenue, 8200 + stats.signed]}
                      labels={t.months}
                      locale={locale}
                    />
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function RevenueChart({
  values,
  labels,
  locale,
}: {
  values: number[];
  labels: readonly string[];
  locale: Locale;
}): ReactNode {
  const max = Math.max(...values, 1);
  return (
    <div className="mt-4 flex h-36 items-end gap-2 sm:gap-3">
      {values.map((value, index) => {
        const last = index === values.length - 1;
        return (
          <div
            key={labels[index]}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span
              className={`text-[10px] tabular-nums sm:text-xs ${last ? "text-foreground font-medium" : "text-foreground/45"}`}
            >
              {eur(value, locale)
                .replace(/\s?€|€\s?/, "")
                .trim()}
            </span>
            <motion.div
              className={`w-full rounded-t-md ${last ? "bg-foreground" : "bg-foreground/15"}`}
              animate={{ height: `${Math.max(4, (value / max) * 100)}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="text-foreground/50 text-[10px] sm:text-xs">
              {labels[index]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
