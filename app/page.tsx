import { ContactCard } from "@/components/contact/contact-card";
import { Hero } from "@/components/hero/hero";
import { Projects } from "@/components/projects/projects";
import { AboutTeaser } from "@/components/sales/about-teaser";
import { Approach } from "@/components/sales/approach";
import { ClientLogos } from "@/components/sales/client-logos";
import { Faq } from "@/components/sales/faq";
import { Guarantees } from "@/components/sales/guarantees";
import { Services } from "@/components/sales/services";
import { WordTicker } from "@/components/sales/word-ticker";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Sites web et logiciels sur mesure à Aix-en-Provence",
  description:
    "Tobias Ringot, designer & développeur produit à Aix-en-Provence : sites web, espaces clients, logiciels métiers et ERP / CRM sur mesure pour les entreprises. Livrés en semaines.",
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <Hero />
      <ClientLogos />
      <Services />
      <Projects variant="home" />
      <WordTicker />
      <Guarantees />
      <Approach />
      <AboutTeaser />
      <Faq />
      <ContactCard />
    </main>
  );
}
