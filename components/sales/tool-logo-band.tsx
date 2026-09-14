"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { LogoLoop } from "@/components/ui/logo-loop";
import { useLanguage } from "@/lib/i18n";

const tools = [
  { name: "Figma", icon: "figma" },
  { name: "GitHub", icon: "github" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "Vercel", icon: "vercel" },
] as const;

const logos = tools.map(({ name, icon }) => ({
  title: name,
  node: (
    <span className="inline-flex items-center gap-4 whitespace-nowrap text-lg font-medium tracking-tight sm:text-xl">
      <Image
        src={`https://cdn.simpleicons.org/${icon}/000000`}
        alt=""
        width={36}
        height={36}
        unoptimized
        className="h-8 w-8 object-contain dark:invert sm:h-9 sm:w-9"
      />
      {name}
    </span>
  ),
}));

const labels = {
  fr: "Outils et technologies",
  en: "Tools and technologies",
  zh: "工具与技术",
} as const;

export function ToolLogoBand(): ReactNode {
  const { locale } = useLanguage();
  const label = labels[locale];

  return (
    <section id="tools" aria-label={label} className="border-foreground/10 mt-[74px] scroll-mt-24 border-y py-7 sm:py-8">
      <LogoLoop
        logos={logos}
        speed={48}
        gap={80}
        logoHeight={44}
        pauseOnHover
        fadeOut
        ariaLabel={label}
        className="text-foreground/75"
      />
    </section>
  );
}
