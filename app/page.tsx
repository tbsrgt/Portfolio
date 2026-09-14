import { ContactCard } from "@/components/contact/contact-card";
import { Hero } from "@/components/hero/hero";
import { Projects } from "@/components/projects/projects";
import { Services } from "@/components/sales/services";
import { Approach } from "@/components/sales/approach";
import { Testimonials } from "@/components/sales/testimonials";
import { ToolLogoBand } from "@/components/sales/tool-logo-band";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Refonte et création de sites internet",
  description: "Tobias Ringot modernise les sites vieillissants et crée des sites vitrines clairs, rapides et sur mesure pour les écoles, commerces et professionnels de l'immobilier.",
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-20 sm:gap-28">
      <div className="flex flex-col">
        <Hero />
        <ToolLogoBand />
      </div>
      <Services />
      <Projects withHeadline />
      <Approach />
      <Testimonials />
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
