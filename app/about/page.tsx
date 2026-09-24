import { AboutPage as AboutContent } from "@/components/about/about-page";
import { ContactCard } from "@/components/contact/contact-card";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "À propos de Tobias Ringot",
  description: "Tobias Ringot, designer & développeur produit à Aix-en-Provence : sites web et logiciels sur mesure, du cadrage à la mise en production.",
  path: "/about",
});

export default function AboutPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <AboutContent />
      <ContactCard />
    </main>
  );
}
