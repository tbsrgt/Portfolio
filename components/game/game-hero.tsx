"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import { Hud } from "./hud";
import { ZonePanel } from "./panel";
import { useGame } from "./store";
import { DeskHero } from "@/components/desk/desk-hero";
import { ArrowRight, Phone } from "@/components/ui/pixel-icon";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage } from "@/lib/i18n";

const GameScene = dynamic(() => import("./scene").then((m) => m.GameScene), { ssr: false });

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** "La tournée" — the desk as a playable world, with the pitch as an overlay sheet. */
export function GameHero(): ReactNode {
  const { locale } = useLanguage();
  const copy = deskCopy[locale];
  const [mode, setMode] = useState<"pending" | "3d" | "2d">("pending");
  const [ready, setReady] = useState(false);
  const [folded, setFolded] = useState(false);
  const { started } = useGame();

  useEffect(() => {
    if (started) setFolded(true);
  }, [started]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(!reduced && supportsWebGL() ? "3d" : "2d");
  }, []);

  if (mode === "2d") return <DeskHero />;

  const gameLabel = locale === "fr" ? "La tournée · gagnez jusqu'à −25 % sur votre devis" : "The round · earn up to −25% on your quote";

  return (
    <section aria-label={gameLabel} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {mode === "3d" ? <GameScene locale={locale} onReady={() => setReady(true)} /> : null}

      {/* The pitch, as a sheet pinned in the corner; folds away once you play. */}
      <div className={`absolute top-20 left-3 z-10 w-[min(88vw,380px)] transition-transform duration-500 sm:top-24 sm:left-6 ${folded ? "-translate-x-[calc(100%-2.5rem)]" : ""}`}>
        <div className="sheet rotate-[-1.5deg] p-4 sm:p-6">
          <span className="dymo text-[10px]">{copy.sheetLabel}</span>
          <h1 className="display mt-3 text-[1.7rem] sm:text-[2.3rem]">
            {copy.title1}
            <br />
            <span className="text-stamp">{copy.title2}</span>
          </h1>
          <p className="text-ink/75 mt-3 hidden max-w-[40ch] text-[14px] leading-relaxed sm:block">{copy.lead}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/devis" className="btn btn-stamp h-10 text-sm">
              {copy.ctaQuote}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#contact" className="btn btn-outline h-10 text-sm">
              <Phone className="h-4 w-4" />
              {copy.ctaCall}
            </a>
          </div>
          <p className="hand pen mt-3 text-[1.15rem] leading-tight">{locale === "fr" ? "Faites le tour : chaque feuille sur le bureau est une partie du site. Le van vous fait gagner jusqu'à −25 %." : "Walk around: every sheet on the desk is a part of the site. The van earns you up to −25%."}</p>
          <button type="button" onClick={() => setFolded((f) => !f)} className="dymo absolute -top-3 left-2 cursor-pointer text-[9px]" aria-expanded={!folded}>
            {folded ? (locale === "fr" ? "Ouvrir" : "Open") : locale === "fr" ? "Replier" : "Fold"}
          </button>
        </div>
      </div>

      {ready ? <Hud locale={locale} /> : null}
      <ZonePanel locale={locale} />

      <AnimatePresence>
        {!ready ? (
          <motion.div key="loader" exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="bg-desk absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
            <span className="dymo animate-pulse">{locale === "fr" ? "Installation du bureau…" : "Setting up the desk…"}</span>
            <span className="text-paper/50 typed text-[10px]">{locale === "fr" ? "modèles 3D & physique" : "3D models & physics"}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
