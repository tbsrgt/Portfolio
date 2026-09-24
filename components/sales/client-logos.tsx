"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { LogoLoop } from "@/components/ui/logo-loop";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

type Client = { name: string; src?: string };

const clients: readonly Client[] = [
  { name: "COGEBAT" },
  { name: "Adresse Privée", src: "/logos/adresse-privee.png" },
  { name: "Parentez²", src: "/logos/parentez.svg" },
  { name: "Mistral TP" },
  { name: "Vimtails" },
  { name: "Glass&Bio France" },
  { name: "NULLL.CLUB" },
];

const items = clients.map((client) => ({
  title: client.name,
  node: client.src ? (
    <Image
      src={client.src}
      alt={client.name}
      width={160}
      height={40}
      className="h-7 w-auto max-w-[140px] object-contain opacity-75 transition-opacity hover:opacity-100 sm:h-8 dark:invert"
    />
  ) : (
    <span className="text-foreground/70 text-base font-semibold tracking-tight whitespace-nowrap uppercase sm:text-lg">{client.name}</span>
  ),
}));

export function ClientLogos(): ReactNode {
  const { locale } = useLanguage();
  const label = salesCopy[locale].clientsLabel;

  return (
    <section aria-label={label} className="border-foreground/10 border-b py-7 sm:py-8">
      <div className="mx-auto flex w-full max-w-275 flex-col gap-5 px-5 sm:flex-row sm:items-center sm:gap-10 sm:px-10">
        <p className="text-foreground/55 shrink-0 text-xs font-semibold tracking-[0.18em] uppercase">{label}</p>
        <LogoLoop logos={items} speed={40} gap={56} logoHeight={36} pauseOnHover fadeOut fadeOutColor="var(--background)" ariaLabel={label} className="min-w-0 flex-1" />
      </div>
    </section>
  );
}
