"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";
import { site } from "@/lib/site";

const linkClass = "focus-ring text-paper/70 hover:text-paper transition-colors";

/** The edge of the desk. */
export function Footer(): ReactNode {
  const { copy, locale } = useLanguage();
  const desk = deskCopy[locale];
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="bg-desk-deep relative z-[1] border-t-4 border-black/30">
      <div className="container-x grid gap-8 pt-10 pb-28 sm:grid-cols-[1.4fr_1fr_1fr] sm:pb-12">
        <div>
          <p className="display text-4xl">{site.name}</p>
          <p className="hand text-postit mt-2 text-2xl">{desk.footerTag}</p>
        </div>
        <nav aria-label={copy.footer.navigation}>
          <span className="dymo">{copy.footer.navigation}</span>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li><Link href="/" className={linkClass}>{locale === "fr" ? "Le bureau 3D" : "The 3D desk"}</Link></li>
            <li><Link href="/site" className={linkClass}>{copy.nav.home}</Link></li>
            <li><Link href="/site#offres" className={linkClass}>{copy.nav.services}</Link></li>
            <li><Link href="/projects" className={linkClass}>{copy.nav.projects}</Link></li>
            <li><Link href="/about" className={linkClass}>{copy.nav.about}</Link></li>
          </ul>
        </nav>
        <div>
          <span className="dymo">{copy.footer.contact}</span>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li><a href={`mailto:${site.email}`} className={`${linkClass} break-all`}>{copy.contact.emailLabel}</a></li>
            <li><a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>LinkedIn</a></li>
            <li className="text-paper/70">{copy.contact.location}</li>
          </ul>
        </div>
        <div className="text-paper/50 typed flex flex-wrap items-center justify-between gap-3 text-[10px] sm:col-span-3">
          <p>© 2026 {site.name}. {copy.footer.rights}</p>
          <Link href="/mentions-legales" className="focus-ring hover:text-paper underline underline-offset-4">{copy.footer.legal}</Link>
        </div>
      </div>
    </footer>
  );
}
