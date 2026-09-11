"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

type Entry = {
  school: string;
  degree: string;
  period: string;
  logoUrl: string;
};

const ENTRIES: Entry[] = [
  {
    school: "Aix Ynov Campus",
    degree: "Bachelor Marketing & Communication Digitale",
    period: "2023 - 2026",
    logoUrl:
      "https://eliobot.com/cdn/shop/files/logo-ynov-campus.webp?v=1692711533&width=3200",
  },
];

const ROW_HEIGHT = 64;

export function Education(): ReactNode {
  const { copy } = useLanguage();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-foreground text-[15px] font-semibold tracking-tight">
        {copy.about.education}
      </h3>
      <div className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 relative rounded-4xl border p-2 sm:p-4">
        <ul className="flex flex-col gap-2">
          {ENTRIES.map((entry, index) => (
            <li
              key={`${entry.school}-${entry.period}`}
              className="bg-background border-foreground/5 flex items-center gap-4 rounded-3xl border p-2"
              style={{ minHeight: ROW_HEIGHT }}
            >
              <SchoolLogo entry={entry} />
              <div className="flex min-w-0 flex-col">
                <span className="text-foreground text-[17px] font-semibold tracking-tight sm:text-[18px]">
                  {entry.school}
                </span>
                <span className="text-foreground/65 mt-0.5 text-[14px] tracking-tight sm:text-[15px]">
                  {copy.about.degrees[index]}
                  <span className="text-foreground/30 mx-2">•</span>
                  <span className="text-foreground/55">{entry.period}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SchoolLogo({ entry }: { entry: Entry }): ReactNode {
  return (
    <span
      className="border-foreground/15 bg-white inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border p-1.5"
      aria-hidden="true"
      style={{ borderRadius: 14 }}
    >
      <img
        src={entry.logoUrl}
        alt=""
        width={36}
        height={36}
        className="h-full w-full object-contain"
        draggable={false}
      />
    </span>
  );
}
