"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

const projects = [
  {
    id: "parentez",
    url: "https://parentez.vercel.app/",
    image: "https://parentez.vercel.app/og.jpg",
  },
  {
    id: "mistral-tp",
    url: "https://mistraltp.vercel.app/",
    image: "https://mistraltp.vercel.app/opengraph-image",
  },
] as const;

export function Projects({ withHeadline = false }: { withHeadline?: boolean }): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];

  return (
    <section aria-labelledby={withHeadline ? "projects-heading" : undefined} className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-center gap-5 pt-12 pb-10 text-center sm:pt-20 sm:pb-14">
            <ScrollReveal
              as="h2"
              id="projects-heading"
              textClassName="text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem] lg:text-[3.5rem]"
            >
              {copy.projectsHeading}
            </ScrollReveal>
            <ScrollReveal
              textClassName="text-foreground/65 max-w-[45ch] text-[18px] leading-[1.45] sm:text-[20px]"
            >
              {copy.projectsDescription}
            </ScrollReveal>
          </FadeIn>
        ) : (
          <h2 className="sr-only">{copy.projectsHeading}</h2>
        )}

        <div className="grid gap-6 md:grid-cols-2 md:gap-7">
          {projects.map((project, index) => {
            const item = copy.projects[index];
            if (!item) return null;

            return (
              <FadeIn key={project.id} delay={index * 0.08}>
                <article className="project-card border-foreground/8 bg-background flex h-full flex-col overflow-hidden rounded-3xl border p-3.5">
                  <div className="bg-foreground/5 relative aspect-[1200/630] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={project.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 510px, (min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 px-2 pt-5 pb-2">
                    <p className="text-foreground/50 text-xs font-medium tracking-wide uppercase">{item.category}</p>
                    <h3 className="text-foreground text-2xl font-medium tracking-tight">{item.title}</h3>
                    <p className="text-foreground/65 text-sm leading-relaxed sm:text-base">{item.description}</p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring text-foreground mt-auto inline-flex min-h-11 w-fit items-center gap-2 rounded-lg pt-3 text-sm font-medium underline underline-offset-4"
                    >
                      {copy.visitProject}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </FadeIn>
            );
          })}

          <FadeIn delay={0.16}>
            <article className="border-foreground/15 bg-background/70 flex h-full min-h-70 flex-col justify-center rounded-3xl border border-dashed p-8 sm:p-10">
              <p className="text-foreground/50 text-xs font-medium tracking-wide uppercase">{copy.placeholderCategory}</p>
              <h3 className="text-foreground mt-4 text-2xl font-medium tracking-tight">{copy.placeholderTitle}</h3>
              <p className="text-foreground/55 mt-3 max-w-[38ch] text-sm leading-relaxed">{copy.placeholderDescription}</p>
            </article>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
