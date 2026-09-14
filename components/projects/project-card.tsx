"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { useLanguage } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { salesCopy } from "@/lib/sales-copy";

export function ProjectCard({ project }: { project: Project }): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];
  const isLive = project.kind === "live";
  const title = project.title[locale];
  const host = project.url ? new URL(project.url).host : copy.studyBadge;
  const alt = isLive
    ? `${locale === "fr" ? "Aperçu du site" : "Preview of the website"} ${title}`
    : `${copy.studyBadge} : ${title}`;

  return (
    <article className="project-card group border-foreground/8 bg-background flex h-full flex-col overflow-hidden rounded-3xl border p-3.5">
      <div className="relative pb-7 sm:pb-9">
        <div className="border-foreground/8 bg-foreground/3 overflow-hidden rounded-2xl border">
          <div className="border-foreground/8 flex h-8 items-center gap-1.5 border-b px-3" aria-hidden="true">
            <span className="bg-foreground/15 h-2 w-2 rounded-full" />
            <span className="bg-foreground/15 h-2 w-2 rounded-full" />
            <span className="bg-foreground/15 h-2 w-2 rounded-full" />
            <span className="bg-foreground/5 text-foreground/45 mx-auto max-w-[60%] truncate rounded-md px-3 py-0.5 text-[10px] font-medium">
              {host}
            </span>
            <span className="w-7" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={`/projects/${project.slug}-desktop.webp`}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 520px, (min-width: 768px) 46vw, 92vw"
              className="object-cover object-top transition-[object-position] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:object-bottom group-hover:duration-[7000ms] motion-reduce:transition-none motion-reduce:group-hover:object-top"
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute right-5 bottom-0 w-[21%] min-w-16 overflow-hidden rounded-[14px] border-[3px] border-neutral-900 bg-neutral-900 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.35)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 sm:rounded-[20px] sm:border-4"
        >
          <div className="relative aspect-[390/844]">
            <Image
              src={`/projects/${project.slug}-mobile.webp`}
              alt=""
              fill
              sizes="130px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-2 pt-2 pb-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${
              isLive
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-foreground/5 text-foreground/60"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-emerald-500" : "bg-foreground/40"}`} />
            {isLive ? copy.liveBadge : copy.studyBadge}
          </span>
          <span className="text-foreground/50">
            {project.sector[locale]} · {project.place}
          </span>
        </div>
        <h3 className="text-foreground text-2xl font-medium tracking-tight">{title}</h3>
        <p className="text-foreground/65 text-sm leading-relaxed sm:text-base">{project.summary[locale]}</p>
        <ul className="mt-1 flex flex-col gap-1.5">
          {project.highlights[locale].map((highlight) => (
            <li key={highlight} className="text-foreground/75 flex gap-2 text-sm">
              <span aria-hidden="true" className="font-semibold" style={{ color: project.accent }}>
                +
              </span>
              {highlight}
            </li>
          ))}
        </ul>
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring text-foreground mt-auto inline-flex min-h-11 w-fit items-center gap-2 rounded-lg pt-3 text-sm font-medium underline underline-offset-4"
          >
            {copy.visitProject}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
