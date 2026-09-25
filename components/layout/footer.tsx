"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { PixelBand } from "@/components/ui/pixel-band";
import { useLanguage } from "@/lib/i18n";
import { site } from "@/lib/site";

const linkClass = "focus-ring text-paper/65 hover:text-paper transition-colors";

export function Footer(): ReactNode {
  const { copy } = useLanguage();

  return (
    <footer className="on-ink bg-ink text-paper">
      <PixelBand align="left" className="w-[70%] sm:w-[46%]" />
      <div className="container-x border-paper/10 grid gap-8 border-t pt-10 pb-28 sm:grid-cols-[1.4fr_1fr_1fr] sm:pb-12">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight">{site.name}</p>
          <p className="text-paper/55 mt-2 max-w-[36ch] text-sm leading-relaxed">{copy.footer.tagline}</p>
        </div>
        <nav aria-label={copy.footer.navigation}>
          <p className="label">{copy.footer.navigation}</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li><Link href="/" className={linkClass}>{copy.nav.home}</Link></li>
            <li><Link href="/#services" className={linkClass}>{copy.nav.services}</Link></li>
            <li><Link href="/projects" className={linkClass}>{copy.nav.projects}</Link></li>
            <li><Link href="/about" className={linkClass}>{copy.nav.about}</Link></li>
          </ul>
        </nav>
        <div>
          <p className="label">{copy.footer.contact}</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li><a href={`mailto:${site.email}`} className={`${linkClass} break-all`}>{copy.contact.emailLabel}</a></li>
            <li><a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>LinkedIn</a></li>
            <li className="text-paper/65">{copy.contact.location}</li>
          </ul>
        </div>
        <div className="text-paper/45 font-mono flex flex-wrap items-center justify-between gap-3 text-[11px] tracking-[0.06em] sm:col-span-3">
          <p>© 2026 {site.name}. {copy.footer.rights}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/mentions-legales" className="focus-ring hover:text-paper underline underline-offset-4">{copy.footer.legal}</Link>
            <span>{copy.contact.builtWith}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
