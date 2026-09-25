"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";

const clients = [
  { name: "COGEBAT", trade: "Bâtiment" },
  { name: "Adresse Privée", trade: "Immobilier" },
  { name: "Parentez²", trade: "Architecture", src: "/logos/parentez.svg" },
  { name: "Mistral TP", trade: "Terrassement" },
  { name: "Vimtails", trade: "Produit" },
  { name: "Glass&Bio", trade: "Industrie" },
  { name: "NULLL.CLUB", trade: "Collectif" },
];

/** Clients as a fan of business cards left on the desk. */
export function BusinessCards(): ReactNode {
  const { locale } = useLanguage();
  const copy = deskCopy[locale];

  return (
    <section aria-label={copy.trustLabel} className="container-x py-10 sm:py-14">
      <FadeIn>
        <span className="dymo dymo-blue">{copy.trustLabel}</span>
      </FadeIn>
      <ul className="mt-6 flex gap-3 overflow-x-auto pb-4 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
        {clients.map((client, index) => (
          <FadeIn key={client.name} delay={index * 0.05}>
            <li
              className="sheet flex h-[92px] w-[164px] shrink-0 flex-col justify-between p-3 transition-transform duration-500 hover:-translate-y-1 hover:rotate-0"
              style={{ rotate: `${((index % 3) - 1) * 1.6}deg` }}
            >
              {client.src ? (
                <Image src={client.src} alt={client.name} width={140} height={32} className="h-6 w-auto object-contain object-left" />
              ) : (
                <span className="font-display text-lg leading-none font-bold tracking-tight">{client.name}</span>
              )}
              <span className="typed text-ink/55 text-[10px]">{client.trade}</span>
            </li>
          </FadeIn>
        ))}
      </ul>
    </section>
  );
}
