import { ContactCard } from "@/components/contact/contact-card";
import { Projects } from "@/components/projects/projects";
import { ProjectsPageIntro } from "@/components/projects/projects-page-intro";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Réalisations",
  description: "Réalisations de Tobias Ringot, designer & développeur produit à Aix-en-Provence : sites sur mesure et outils métiers.",
  path: "/projects",
});

export default function ProjectsPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-275 px-6 pt-44 pb-16 sm:px-10 sm:pt-56 sm:pb-20">
        <ProjectsPageIntro />
      </section>
      <Projects />
      <ContactCard />
    </main>
  );
}
