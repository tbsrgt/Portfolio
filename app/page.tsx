import { BusinessCards } from "@/components/desk/business-cards";
import { Checklist } from "@/components/desk/checklist";
import { ContactDesk } from "@/components/desk/contact-desk";
import { DeskHero } from "@/components/desk/desk-hero";
import { IndexCards } from "@/components/desk/index-cards";
import { Letter } from "@/components/desk/letter";
import { Pains } from "@/components/desk/pains";
import { QuoteSheet } from "@/components/desk/quote-sheet";
import { Receipt } from "@/components/desk/receipt";
import { Testimonials } from "@/components/desk/testimonials";
import { WorkFolder } from "@/components/desk/work-folder";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Sites web et logiciels sur mesure à Aix-en-Provence",
  description:
    "Tobias Ringot, designer & développeur produit à Aix-en-Provence : sites web, espaces clients, logiciels métiers et ERP / CRM sur mesure pour les entreprises. Livrés en semaines.",
  path: "/",
});

/** The desk and its documents. */
export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <DeskHero />
      <BusinessCards />
      <Testimonials />
      <Pains />
      <QuoteSheet />
      <WorkFolder />
      <Checklist />
      <Receipt />
      <Letter />
      <IndexCards />
      <ContactDesk />
    </main>
  );
}
