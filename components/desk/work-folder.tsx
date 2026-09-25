"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowUpRight } from "@/components/ui/pixel-icon";
import { FadeIn } from "@/components/ui/motion-primitives";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";
import { projects } from "@/lib/projects";

const TILT = [-3, 2, -1.5, 3, -2.5, 1.5, -2];

/** Projects as prints spilling out of an open kraft folder. */
export function WorkFolder(): ReactNode {
  const { locale } = useLanguage();
  const copy = deskCopy[locale];

  return (
    <section id="realisations" aria-labelledby="work-heading" className="container-x scroll-mt-20 py-12 sm:py-20">
      <FadeIn className="max-w-[44rem]">
        <span className="dymo">{copy.projectsLabel}</span>
        <h2 id="work-heading" className="display mt-5 text-5xl sm:text-7xl">
          {copy.projectsTitle}
        </h2>
        <p className="text-paper/75 mt-5 text-lg leading-relaxed">{copy.projectsText}</p>
      </FadeIn>

      <div className="kraft relative mt-10 p-3 pt-10 sm:mt-14 sm:p-6 sm:pt-14">
        <span className="kraft absolute -top-5 left-4 h-8 rounded-b-none px-3 text-[11px] leading-8 font-bold tracking-[0.16em] uppercase shadow-none">{copy.projectsLabel}</span>
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {projects.map((project, index) => {
            const href = project.url ?? "/projects";
            const external = Boolean(project.url);
            return (
              <FadeIn key={project.slug} delay={index * 0.05}>
                <li style={{ rotate: `${TILT[index % TILT.length]}deg` }}>
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="focus-ring sheet group block p-2 pb-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:rotate-0"
                  >
                    <span className="relative block overflow-hidden bg-paper-2">
                      <Image
                        src={`/projects/${project.slug}-cover.webp`}
                        alt={`${project.title[locale]} — ${project.sector[locale]}`}
                        width={640}
                        height={400}
                        className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </span>
                    <span className="mt-3 flex items-end justify-between gap-3 px-1">
                      <span>
                        <span className="hand pen block text-2xl leading-none">{project.title[locale]}</span>
                        <span className="text-ink/60 mt-1 block text-xs">{project.sector[locale]} · {project.place}</span>
                      </span>
                      <ArrowUpRight className="text-ink/50 group-hover:text-stamp h-5 w-5 shrink-0 transition-colors" />
                    </span>
                  </Link>
                </li>
              </FadeIn>
            );
          })}
        </ul>
        <div className="mt-6 flex justify-end">
          <Link href="/projects" className="btn btn-ink">
            {copy.projectsAll}
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
