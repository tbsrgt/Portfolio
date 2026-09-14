"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProjectCard } from "./project-card";
import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/lib/i18n";
import { liveProjects, studyProjects, type Project } from "@/lib/projects";
import { salesCopy } from "@/lib/sales-copy";

const HOME_STUDY_COUNT = 4;

function ProjectGroup({
  heading,
  description,
  items,
  as: Heading,
  className,
}: {
  heading: string;
  description: string;
  items: readonly Project[];
  as: "h2" | "h3";
  className?: string;
}): ReactNode {
  return (
    <div className={className}>
      <FadeIn className="border-foreground/10 mb-6 flex flex-wrap items-end justify-between gap-3 border-b pb-5">
        <div>
          <Heading className="text-foreground text-2xl font-medium tracking-tight sm:text-[1.75rem]">{heading}</Heading>
          <p className="text-foreground/55 mt-1.5 max-w-[60ch] text-sm leading-relaxed sm:text-base">{description}</p>
        </div>
        <span className="text-foreground/40 text-sm tabular-nums">{String(items.length).padStart(2, "0")}</span>
      </FadeIn>
      <div className="grid gap-6 md:grid-cols-2 md:gap-7">
        {items.map((project, index) => (
          <FadeIn key={project.slug} delay={Math.min(index * 0.06, 0.18)}>
            <ProjectCard project={project} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

export function Projects({ variant = "page" }: { variant?: "home" | "page" }): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];
  const isHome = variant === "home";
  const studies = isHome ? studyProjects.slice(0, HOME_STUDY_COUNT) : studyProjects;

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

        <ProjectGroup
          as={isHome ? "h3" : "h2"}
          heading={copy.liveHeading}
          description={copy.liveDescription}
          items={liveProjects}
        />
        <ProjectGroup
          as={isHome ? "h3" : "h2"}
          heading={copy.studiesHeading}
          description={copy.studiesDescription}
          items={studies}
          className="mt-16 sm:mt-20"
        />

        {isHome ? (
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
