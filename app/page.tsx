import { GameHero } from "@/components/game/game-hero";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Sites web et logiciels sur mesure à Aix-en-Provence",
  description:
    "Tobias Ringot, designer & développeur produit à Aix-en-Provence : sites web, espaces clients, logiciels métiers et ERP / CRM sur mesure pour les entreprises. Livrés en semaines.",
  path: "/",
});

/** The 3D desk fills the screen; every part of the site lives inside it. */
export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="h-[100svh] overflow-hidden">
      <GameHero />
    </main>
  );
}
