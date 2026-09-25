"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

import { DeskObject } from "./desk-object";
import { ArrowRight, Phone } from "@/components/ui/pixel-icon";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";

export function DeskHero(): ReactNode {
  const { locale } = useLanguage();
  const copy = deskCopy[locale];
  const deskRef = useRef<HTMLDivElement>(null);

  return (
    <section aria-label="Le bureau" className="relative">
      <div ref={deskRef} className="relative mx-auto h-[100svh] min-h-[680px] w-full max-w-[90rem] overflow-hidden sm:min-h-[760px]">
        {/* Main sheet: who I am and what I sell. */}
        <DeskObject
          deskRef={deskRef}
          rotate={-1.5}
          delay={0.05}
          className="top-[13%] left-[5%] w-[90%] sm:top-[16%] sm:left-[8%] sm:w-[560px] lg:left-[10%] lg:w-[640px]"
        >
          <div className="sheet p-6 sm:p-9">
            <span className="dymo">{copy.sheetLabel}</span>
            <h1 className="display mt-6 text-[2.7rem] sm:text-[3.6rem] lg:text-[4.2rem]">
              {copy.title1}
              <br />
              <span className="text-stamp">{copy.title2}</span>
            </h1>
            <p className="text-ink/75 mt-5 max-w-[42ch] text-[15px] leading-relaxed sm:text-[17px]">{copy.lead}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/devis" className="btn btn-stamp" onPointerDown={(e) => e.stopPropagation()}>
                {copy.ctaQuote}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#contact" className="btn btn-outline" onPointerDown={(e) => e.stopPropagation()}>
                <Phone className="h-5 w-5" />
                {copy.ctaCall}
              </a>
            </div>
            <span className="stamp absolute -top-3 right-4 text-xl sm:text-2xl">{copy.stamp}</span>
          </div>
        </DeskObject>

        {/* Post-it: availability. */}
        <DeskObject deskRef={deskRef} rotate={5} delay={0.35} className="top-[7%] right-[4%] w-[150px] sm:top-[9%] sm:right-[10%] sm:w-[190px] lg:right-[22%]">
          <div className="postit hand aspect-square p-4 text-[1.35rem] leading-tight sm:text-[1.6rem]">
            <span className="relative">{copy.postitAvailable}</span>
          </div>
        </DeskObject>

        {/* Kraft folder: work. */}
        <DeskObject deskRef={deskRef} href="#realisations" label={copy.folderLabel} rotate={-4} delay={0.5} className="bottom-[9%] left-[3%] w-[190px] sm:bottom-[10%] sm:left-[6%] sm:w-[260px] lg:left-[54%]">
          <div className="kraft relative h-[150px] p-3 sm:h-[190px]">
            <span className="kraft absolute -top-4 left-0 h-6 w-[45%] rounded-b-none px-2 text-[10px] leading-6 font-bold tracking-[0.14em] uppercase shadow-none">{copy.folderLabel}</span>
            <Image src="/projects/adresse-privee-cover.webp" alt="" width={240} height={150} className="sheet absolute top-2 left-4 w-[62%] rotate-[-6deg] p-1" />
            <Image src="/projects/cogedoc-cover.webp" alt="" width={240} height={150} className="sheet absolute top-6 right-3 w-[62%] rotate-[5deg] p-1" />
            <span className="hand pen absolute bottom-2 left-3 text-lg">{copy.folderNote} →</span>
          </div>
        </DeskObject>

        {/* Phone: call back. */}
        <DeskObject deskRef={deskRef} href="#contact" label={copy.phoneLabel} rotate={7} delay={0.65} className="right-[5%] bottom-[8%] w-[120px] sm:right-[8%] sm:bottom-[12%] sm:w-[150px]">
          <div className="bg-ink text-paper flex aspect-[9/17] flex-col justify-between rounded-[14px] p-3 shadow-[0_18px_30px_-12px_rgb(0_0_0/0.7)] ring-4 ring-black/60">
            <span className="mx-auto h-1 w-10 rounded-full bg-white/20" />
            <div className="flex flex-col items-center gap-2 text-center">
              <Phone className="text-postit h-9 w-9" />
              <span className="display-md text-lg leading-none">{copy.phoneLabel}</span>
              <span className="text-paper/60 typed text-[9px]">{copy.phoneNote}</span>
            </div>
            <span className="mx-auto h-1 w-14 rounded-full bg-white/30" />
          </div>
        </DeskObject>

        {/* Small quote slip: offers. */}
        <DeskObject deskRef={deskRef} href="#offres" label={copy.offersLabel} rotate={3} delay={0.8} className="top-[63%] right-[2%] hidden w-[200px] sm:block sm:w-[220px] lg:top-[40%] lg:right-[5%]">
          <div className="sheet p-4">
            <span className="typed text-ink/60">{copy.quoteLabel}</span>
            <div className="mt-3 flex items-baseline">
              <span className="font-display text-base font-bold">{copy.quoteLine}</span>
              <span className="leader" />
              <span className="font-mono text-sm">{copy.quotePrice}</span>
            </div>
            <span className="stamp absolute right-2 -bottom-3 text-sm">{locale === "fr" ? "Le plus demandé" : "Most popular"}</span>
          </div>
        </DeskObject>

        {/* Coffee cup (decor) with its post-it. */}
        <DeskObject deskRef={deskRef} rotate={0} delay={0.95} className="top-[6%] left-[2%] hidden lg:block">
          <div className="relative h-24 w-24">
            <span className="absolute inset-0 rounded-full bg-[#5b3a21]/40 blur-[1px]" />
            <span className="absolute inset-2 rounded-full bg-[#f3ede2] shadow-[inset_0_0_0_6px_#e6dece,0_10px_20px_-8px_rgb(0_0_0/0.6)]" />
            <span className="absolute inset-[22%] rounded-full bg-[#3b2314] shadow-[inset_0_4px_8px_rgb(0_0_0/0.6)]" />
            <span className="absolute top-1/2 -right-3 h-9 w-6 -translate-y-1/2 rounded-r-full border-[6px] border-l-0 border-[#e6dece]" />
          </div>
        </DeskObject>
        <DeskObject deskRef={deskRef} rotate={-7} delay={1.05} className="top-[24%] left-[1%] hidden w-[170px] lg:block">
          <div className="postit hand p-4 text-[1.35rem] leading-tight">
            <span className="relative">{copy.postitCoffee}</span>
          </div>
        </DeskObject>

        {/* Pen (decor). */}
        <DeskObject deskRef={deskRef} rotate={-28} delay={1.1} className="right-[28%] bottom-[14%] hidden lg:block">
          <div className="h-2.5 w-44 rounded-full bg-gradient-to-r from-[#12256e] via-[#1b3ed6] to-[#12256e] shadow-[0_6px_10px_-4px_rgb(0_0_0/0.7)]">
            <span className="absolute top-0 -left-3 h-2.5 w-4 bg-[#d9c6a3] [clip-path:polygon(100%_0,100%_100%,0_50%)]" />
            <span className="absolute top-[-3px] right-6 h-4 w-8 rounded-sm bg-[#c9c2b4]" />
          </div>
        </DeskObject>

        <p className="text-paper/55 typed pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-center text-[10px] sm:text-[11px]">{copy.hint}</p>
      </div>
    </section>
  );
}
