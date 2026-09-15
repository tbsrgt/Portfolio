"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProjectCard } from "./project-card";
import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { salesCopy } from "@/lib/sales-copy";

const HOME_PROJECT_COUNT = 4;

export function Projects({ variant = "page" }: { variant?: "home" | "page" }): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];
  const isHome = variant === "home";
  const items = isHome ? projects.slice(0, HOME_PROJECT_COUNT) : projects;

  return (
    <section
      id={isHome ? "realisations" : undefined}
      aria-labelledby={isHome ? "projects-heading" : undefined}
      className="relative w-full scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {isHome ? (
          <FadeIn className="flex flex-col items-center gap-5 pb-12 text-center sm:pb-16">
            <p className="text-foreground/50 text-xs font-semibold tracking-[0.18em] uppercase">{copy.projectsEyebrow}</p>
            <ScrollReveal
              as="h2"
              id="projects-heading"
              textClassName="text-foreground font-serif text-balance text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem] lg:text-[3.5rem]"
            >
              {copy.projectsHeading}
            </ScrollReveal>
            <ScrollReveal textClassName="text-foreground/65 max-w-[48ch] text-[18px] leading-[1.45] sm:text-[20px]">
              {copy.projectsDescription}
            </ScrollReveal>
          </FadeIn>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 md:gap-7">
          {items.map((project, index) => (
            <FadeIn key={project.slug} delay={Math.min(index * 0.06, 0.18)}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>

        {isHome && projects.length > HOME_PROJECT_COUNT ? (
          <FadeIn className="mt-12 flex justify-center">
            <Link
              href="/projects"
              className="focus-ring group border-foreground/8 bg-background text-foreground hover:bg-foreground/4 inline-flex min-h-11 items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium shadow-2xl transition-colors"
            >
              {copy.allProjects}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
