"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { LinkedinIcon } from "@/components/ui/linkedin-icon";
import { PixelBand } from "@/components/ui/pixel-band";
import { useLanguage } from "@/lib/i18n";
import { site } from "@/lib/site";

const linkClass =
  "focus-ring text-foreground/65 hover:text-foreground rounded transition-colors";

export function Footer(): ReactNode {
  const { copy } = useLanguage();

  return (
    <>
      <PixelBand align="right" />
      <footer className="mx-auto w-full max-w-275 px-6 pt-10 pb-32 sm:px-10">
        <div className="border-foreground/10 grid gap-10 border-t pt-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-foreground text-lg font-medium tracking-tight">
              {site.name}
            </p>
            <p className="text-foreground/55 mt-2 max-w-[36ch] text-sm leading-relaxed">
              {copy.footer.tagline}
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="focus-ring border-foreground/10 text-foreground hover:bg-foreground/5 inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${site.email}`}
                aria-label={site.email}
                className="focus-ring border-foreground/10 text-foreground hover:bg-foreground/5 inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label={copy.footer.navigation}>
            <p className="text-foreground text-sm font-semibold">
              {copy.footer.navigation}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/" className={linkClass}>
                  {copy.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/#services" className={linkClass}>
                  {copy.nav.services}
                </Link>
              </li>
              <li>
                <Link href="/projects" className={linkClass}>
                  {copy.nav.projects}
                </Link>
              </li>
              <li>
                <Link href="/about" className={linkClass}>
                  {copy.nav.about}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-foreground text-sm font-semibold">
              {copy.footer.contact}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className={`${linkClass} break-all`}
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  LinkedIn
                </a>
              </li>
              <li className="text-foreground/65">{copy.contact.location}</li>
            </ul>
          </div>
        </div>

        <div className="text-foreground/45 mt-10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p>
            © 2026 {site.name}. {copy.footer.rights}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/mentions-legales"
              className="focus-ring hover:text-foreground rounded underline underline-offset-4"
            >
              {copy.footer.legal}
            </Link>
            <span>{copy.contact.builtWith}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
