import { ContactCard } from "@/components/contact/contact-card";
import { Hero } from "@/components/hero/hero";
import { Projects } from "@/components/projects/projects";
import { AboutTeaser } from "@/components/sales/about-teaser";
import { Approach } from "@/components/sales/approach";
import { Faq } from "@/components/sales/faq";
import { ProjectMarquee } from "@/components/sales/project-marquee";
import { Services } from "@/components/sales/services";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Refonte de site internet à Aix-en-Provence",
  description: "Tobias Ringot, web designer à Aix-en-Provence, modernise les sites internet des entreprises de Provence. Refonte et site vitrine à partir de 1 500 €.",
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-20 sm:gap-28">
      <div className="flex flex-col">
        <Hero />
        <ProjectMarquee />
      </div>
      <Services />
      <Projects variant="home" />
      <Approach />
      <AboutTeaser />
      <Faq />
      <ContactCard />
    </main>
  );
}
