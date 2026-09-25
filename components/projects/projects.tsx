"use client";

import { ArrowRight } from "@/components/ui/pixel-icon";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProjectCard } from "./project-card";
import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { salesCopy } from "@/lib/sales-copy";

const HOME_PROJECT_COUNT = 3;

export function Projects({
  variant = "page",
}: {
  variant?: "home" | "page";
}): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];
  const isHome = variant === "home";
  const items = isHome ? projects.slice(0, HOME_PROJECT_COUNT) : projects;

  return (
    <section
      id={isHome ? "realisations" : undefined}
      aria-labelledby={isHome ? "projects-heading" : undefined}
      className="relative w-full scroll-mt-24 py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-300 px-4 sm:px-8">
        {isHome ? (
          <FadeIn className="flex max-w-[40rem] flex-col items-start gap-5 pb-12 sm:pb-16">
            <p className="label">
              {copy.projectsEyebrow}
            </p>
            <ScrollReveal
              as="h2"
              id="projects-heading"
              textClassName="display text-4xl sm:text-6xl"
            >
              {copy.projectsHeading}
            </ScrollReveal>
            <ScrollReveal textClassName="text-foreground/65 max-w-[48ch] text-[18px] leading-[1.45] sm:text-[20px]">
              {copy.projectsDescription}
            </ScrollReveal>
          </FadeIn>
        ) : null}

        <ol className="flex flex-col gap-5 lg:gap-8">
          {items.map((project, index) => (
            <li
              key={project.slug}
              className="project-stack-item"
              style={{ top: `calc(6rem + ${index} * 1.25rem)` }}
            >
              <ProjectCard
                project={project}
                index={index}
                total={items.length}
              />
            </li>
          ))}
        </ol>

        {isHome && projects.length > HOME_PROJECT_COUNT ? (
          <FadeIn className="mt-10 flex">
            <Link
              href="/projects"
              className="btn btn-ink"
            >
              {copy.allProjects}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
