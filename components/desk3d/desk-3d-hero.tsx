"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";

import { DeskHero } from "@/components/desk/desk-hero";
import { useLanguage } from "@/lib/i18n";

const DeskScene = dynamic(() => import("./desk-scene").then((m) => m.DeskScene), { ssr: false });

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The desk in 3D, with the 2D desk as a fallback (no WebGL, reduced motion,
 * or a scene that fails to load).
 */
export function Desk3DHero(): ReactNode {
  const { locale } = useLanguage();
  const [mode, setMode] = useState<"pending" | "3d" | "2d">("pending");
  const [ready, setReady] = useState(false);
  const [baskets, setBaskets] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(!reduced && supportsWebGL() ? "3d" : "2d");
  }, []);

  if (mode === "2d") return <DeskHero />;

  const hint = locale === "fr" ? "Attrapez, lancez. Une boulette dans la corbeille = café offert." : "Grab, throw. A paper ball in the bin = coffee's on me.";

  return (
    <section aria-label="Le bureau" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {mode === "3d" ? <DeskScene onReady={() => setReady(true)} onScore={() => setBaskets((b) => b + 1)} /> : null}

      <AnimatePresence>
        {!ready ? (
          <motion.div key="loader" exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="bg-desk absolute inset-0 z-20 flex items-center justify-center">
            <span className="dymo animate-pulse">{locale === "fr" ? "Installation du bureau…" : "Setting up the desk…"}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <p className="text-paper/60 typed pointer-events-none absolute bottom-3 left-1/2 z-10 w-[90%] -translate-x-1/2 text-center text-[10px] sm:text-[11px]">{hint}</p>

      <AnimatePresence>
        {baskets > 0 ? (
          <motion.div
            key={baskets}
            initial={{ opacity: 0, y: 40, rotate: -12, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, rotate: -4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="postit hand pointer-events-none absolute top-24 right-4 z-10 w-[160px] p-4 text-[1.4rem] leading-tight sm:right-10 sm:w-[190px] sm:text-[1.6rem]"
          >
            <span className="relative">
              {locale === "fr" ? `Panier ! ${baskets > 1 ? `×${baskets} ` : ""}Café offert ✓` : `Basket! ${baskets > 1 ? `×${baskets} ` : ""}Coffee's on me ✓`}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
