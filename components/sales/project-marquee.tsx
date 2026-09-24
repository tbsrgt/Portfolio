"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { LogoLoop } from "@/components/ui/logo-loop";
import { useLanguage } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { salesCopy } from "@/lib/sales-copy";

const items = projects.map((project) => ({
  title: project.title.fr,
  node: (
    <span className="border-foreground/8 bg-background block overflow-hidden rounded-2xl border p-1 shadow-sm">
      <Image
        src={`/projects/${project.slug}-cover.webp`}
        alt=""
        width={240}
        height={150}
        className="h-[112px] w-[179px] rounded-xl object-cover object-top sm:h-[150px] sm:w-[240px]"
      />
    </span>
  ),
}));

export function ProjectMarquee(): ReactNode {
  const { locale } = useLanguage();
  const label = salesCopy[locale].marqueeLabel;

  return (
    <section
      aria-label={label}
      className="border-foreground/10 mt-[74px] border-y py-6 sm:py-7"
    >
      <LogoLoop
        logos={items}
        speed={32}
        gap={20}
        logoHeight={120}
        pauseOnHover
        fadeOut
        ariaLabel={label}
      />
    </section>
  );
}
