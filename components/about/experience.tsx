"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

type Entry = {
  company: string;
  role: string;
  period: string;
  logoUrl?: string;
  mark?: string;
  brand?: string;
};

const ENTRIES: Entry[] = [
  {
    company: "NULLL.CLUB",
    role: "Co-fondateur",
    period: "Mai 2026 - Aujourd'hui",
    brand: "#0a0a0a",
    mark: "N/",
  },
  {
    company: "COGEBAT",
    role: "Social Media Designer",
    period: "Nov. 2025 - Aujourd'hui",
    logoUrl:
      "https://le-de.cdn-website.com/ffa4b01ddf6042b7a8354606513c8c52/dms3rep/multi/opt/logo-transparent-255w.png",
  },
  {
    company: "Vimtails",
    role: "Product Designer — UX/UI & identité de marque",
    period: "Avr. 2025 - Mai 2025",
    logoUrl: "https://www.vimtails.fr/favicons/favicon-32x32.png",
  },
  {
    company: "Glass&Bio France",
    role: "Développement commercial & social media",
    period: "Nov. 2023 - Août 2024",
    logoUrl: "https://glassandbio.fr/assets/pictures/glass-and-bio-favicon.png",
  },
];

const COLLAPSED_COUNT = 2;
const ROW_HEIGHT = 64;
const ROW_GAP = 8;

export function Experience(): ReactNode {
  const { copy } = useLanguage();
  const [open, setOpen] = useState(false);
  const collapsedHeight =
    Math.floor(COLLAPSED_COUNT) * ROW_HEIGHT +
    Math.floor(COLLAPSED_COUNT) * ROW_GAP +
    (COLLAPSED_COUNT % 1) * ROW_HEIGHT;
  const hiddenCount = ENTRIES.length - Math.floor(COLLAPSED_COUNT);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-foreground text-[15px] font-semibold tracking-tight">
        {copy.about.experience}
      </h3>
      <div
        className={`border-foreground/5 bg-foreground/2 dark:bg-foreground/5 relative overflow-hidden rounded-4xl border px-2 pt-2 sm:px-4 sm:pt-4 ${
          "pb-1 sm:pb-2"
        }`}
      >
        <motion.div
          className="relative"
          initial={false}
          animate={{
            height: open ? "auto" : collapsedHeight,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: "hidden" }}
        >
          <ul className="flex flex-col gap-2">
            {ENTRIES.map((entry, index) => (
              <li
                key={`${entry.company}-${entry.period}`}
                className="bg-background border-foreground/5 flex items-center gap-4 rounded-3xl border p-2"
                style={{ minHeight: ROW_HEIGHT }}
              >
                <CompanyLogo entry={entry} />
                <div className="flex min-w-0 flex-col">
                  <span className="text-foreground text-[17px] font-semibold tracking-tight sm:text-[18px]">
                    {entry.company}
                  </span>
                  <span className="text-foreground/65 mt-0.5 text-[14px] tracking-tight sm:text-[15px]">
                    {copy.about.roles[index]}
                    <span className="text-foreground/30 mx-2">•</span>
                    <span className="text-foreground/55">
                      {copy.about.periods[index]}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>


        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="focus-ring text-foreground relative flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-transparent py-2 text-[15px] font-medium tracking-tight"
          >
            {open ? copy.about.showLess : copy.about.showMore(hiddenCount)}
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="inline-flex"
            >
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </motion.span>
          </button>
        )}
      </div>
    </div>
  );
}

function CompanyLogo({ entry }: { entry: Entry }): ReactNode {
  return (
    <span
      className="ring-foreground/8 inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-white p-1.5 ring-1 dark:ring-white/10"
      aria-hidden="true"
      style={{
        borderRadius: 14,
        ...(entry.logoUrl ? {} : { backgroundColor: entry.brand }),
      }}
    >
      {entry.logoUrl ? (
        <img
          src={entry.logoUrl}
          alt=""
          width={36}
          height={36}
          className="h-full w-full object-contain"
          draggable={false}
        />
      ) : (
        <span className="text-[16px] font-bold tracking-[-0.12em] text-white">
          {entry.mark}
        </span>
      )}
    </span>
  );
}
