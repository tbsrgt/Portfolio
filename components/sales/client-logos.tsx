"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { LogoLoop } from "@/components/ui/logo-loop";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

type Client = { name: string; src?: string };

const clients: readonly Client[] = [
  { name: "COGEBAT" },
  { name: "Adresse Privée" },
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
      className="h-6 w-auto max-w-[130px] object-contain opacity-70 transition-opacity hover:opacity-100 sm:h-7"
    />
  ) : (
    <span className="font-display text-foreground/70 text-lg font-bold tracking-tight whitespace-nowrap sm:text-xl">{client.name}</span>
  ),
}));

export function ClientLogos(): ReactNode {
  const { locale } = useLanguage();
  const label = salesCopy[locale].clientsLabel;

  return (
    <section aria-label={label} className="hairline border-b py-6 sm:py-7">
      <div className="container-x flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
        <p className="label shrink-0">{label}</p>
        <LogoLoop logos={items} speed={36} gap={52} logoHeight={32} pauseOnHover fadeOut fadeOutColor="var(--paper)" ariaLabel={label} className="min-w-0 flex-1" />
      </div>
    </section>
  );
}
