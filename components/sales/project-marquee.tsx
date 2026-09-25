"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { LogoLoop } from "@/components/ui/logo-loop";
import { useLanguage } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { salesCopy } from "@/lib/sales-copy";

const items = projects.map((project) => ({
  title: project.title.fr,
  href: "/projects",
  node: (
    <span className="group/shot border-paper/15 bg-ink-2 block overflow-hidden border p-1">
      <Image
        src={`/projects/${project.slug}-cover.webp`}
        alt=""
        width={240}
        height={150}
        className="h-[112px] w-[179px] object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/shot:scale-[1.04] sm:h-[150px] sm:w-[240px]"
      />
      <span className="text-paper/70 font-mono flex items-center justify-between px-1.5 pt-1.5 pb-0.5 text-[10px] tracking-[0.12em] uppercase">
        {project.title.fr}
        <span className="text-brand">●</span>
      </span>
    </span>
  ),
}));

export function ProjectMarquee(): ReactNode {
  const { locale } = useLanguage();
  const label = salesCopy[locale].marqueeLabel;

  return (
    <section aria-label={label} className="border-paper/10 border-t py-6 sm:py-8">
      <LogoLoop
        logos={items}
        speed={30}
        gap={18}
        logoHeight={150}
        pauseOnHover
        fadeOut
        fadeOutColor="var(--ink)"
        ariaLabel={label}
      />
    </section>
  );
}
