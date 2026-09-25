import { AboutPage as AboutContent } from "@/components/about/about-page";
import { ContactDesk } from "@/components/desk/contact-desk";
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
      <div className="mx-auto w-full max-w-[86rem] px-3 pt-20 sm:px-8 sm:pt-24">
        <div className="sheet on-paper overflow-hidden">
          <AboutContent />
        </div>
      </div>
      <ContactDesk />
    </main>
  );
}
