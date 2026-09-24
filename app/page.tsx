import { ContactCard } from "@/components/contact/contact-card";
import { Hero } from "@/components/hero/hero";
import { Projects } from "@/components/projects/projects";
import { AboutTeaser } from "@/components/sales/about-teaser";
import { Approach } from "@/components/sales/approach";
import { Faq } from "@/components/sales/faq";
import { Services } from "@/components/sales/services";
import { WhyMe } from "@/components/sales/why-me";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Sites web et logiciels sur mesure à Aix-en-Provence",
  description: "Tobias Ringot, designer & développeur produit à Aix-en-Provence : sites web, espaces clients, logiciels métiers et ERP / CRM sur mesure pour les entreprises. Livrés en semaines.",
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-20 sm:gap-28">
      <Hero />
      <Services />
      <Projects variant="home" />
      <WhyMe />
      <Approach />
      <AboutTeaser />
      <Faq />
      <ContactCard />
    </main>
  );
}
