"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

import { audio } from "./audio";
import { wind } from "./fx";
import { game, input, joystick, useGame } from "./store";
import { ArrowRight, Check } from "@/components/ui/pixel-icon";
import { MAX_DISCOUNT, missions, zones } from "@/lib/game";
import type { Locale } from "@/lib/i18n";

const HUD_COPY = {
  fr: {
    missions: "Missions",
    reward: "Remise gagnée",
    use: "Utiliser sur mon devis",
    code: "Code",
    enter: "E · monter dans le van",
    exit: "E · descendre du van",
    walk: "Flèches / ZQSD pour marcher · E pour monter dans le van",
    drive: "Flèches / ZQSD pour conduire · E pour descendre",
    touch: "Joystick pour bouger · bouton pour monter/descendre",
    max: "Remise maximale atteinte !",
    reset: "Recommencer",
    explore: "Explorer le bureau",
    sound: "Son",
    muted: "Muet",
    night: "Nuit",
    day: "Jour",
    horn: "Klaxon",
    time: "Temps",
    best: "Record",
    open: "E · ouvrir",
  },
  en: {
    missions: "Missions",
    reward: "Discount earned",
    use: "Use on my quote",
    code: "Code",
    enter: "E · get in the van",
    exit: "E · get out",
    walk: "Arrows / WASD to walk · E to get in the van",
    drive: "Arrows / WASD to drive · E to get out",
    touch: "Joystick to move · button to get in/out",
    max: "Maximum discount reached!",
    reset: "Start over",
    explore: "Explore the desk",
    sound: "Sound",
    muted: "Muted",
    night: "Night",
    day: "Day",
    horn: "Horn",
    time: "Time",
    best: "Best",
    open: "E · open",
  },
} as const;

/** Touch joystick: drives the same input the keyboard does. */
function Joystick(): ReactNode {
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const active = useRef(false);
  const RADIUS = 44;

  function move(event: PointerEvent<HTMLDivElement>): void {
    const rect = base.current?.getBoundingClientRect();
    if (!rect) return;
    let dx = event.clientX - (rect.left + rect.width / 2);
    let dy = event.clientY - (rect.top + rect.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS;
      dy = (dy / len) * RADIUS;
    }
    setKnob({ x: dx, y: dy });
    joystick.x = dx / RADIUS;
    joystick.y = dy / RADIUS;
  }

  function end(): void {
    active.current = false;
    setKnob({ x: 0, y: 0 });
    joystick.x = 0;
    joystick.y = 0;
  }

  return (
    <div
      ref={base}
      onPointerDown={(e) => {
        active.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e);
      }}
      onPointerMove={(e) => active.current && move(e)}
      onPointerUp={end}
      onPointerCancel={end}
      className="border-paper/40 bg-ink/40 relative h-32 w-32 touch-none rounded-full border-2 backdrop-blur-sm select-none"
      aria-label="Joystick"
      role="application"
    >
      <span className="bg-paper absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg" style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }} />
    </div>
  );
}

export function Hud({ locale }: { locale: Locale }): ReactNode {
  const t = HUD_COPY[locale];
  const { mode, done, discount, code, nearVan, lastEvent, started, night, startedAt, finishedAt, best, zone, panel } = useGame();
  const zoneHere = zone && !panel ? zones.find((z) => z.id === zone) : null;
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (startedAt === null || finishedAt !== null) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [startedAt, finishedAt]);
  const elapsed = startedAt === null ? null : (finishedAt ?? now) - startedAt;
  const fmt = (ms: number): string => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}`;
  const [touch, setTouch] = useState(false);
  const [toast, setToast] = useState<typeof lastEvent>(null);
  const [explore, setExplore] = useState(false);
  const [muted, setMuted] = useState(false);
  useEffect(() => setMuted(audio.muted), []);

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!lastEvent) return;
    setToast(lastEvent);
    const id = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(id);
  }, [lastEvent]);

  const next = missions.find((m) => !done.includes(m.id));
  const toastMission = toast ? missions.find((m) => m.id === toast.id) : null;

  return (
    <>
      {/* Mission post-it */}
      <div className="pointer-events-none absolute right-3 bottom-24 z-10 w-[168px] sm:top-36 sm:right-6 sm:bottom-auto sm:w-[240px]">
        <div className="postit hand rotate-[3deg] p-3 text-[1rem] leading-tight sm:p-4 sm:text-[1.35rem]">
          <p className="typed relative mb-2 flex items-center justify-between text-[10px] font-bold">
            <span>{t.missions}</span>
            {elapsed !== null && elapsed > 0 ? (
              <span className="font-mono tabular-nums">
                {fmt(elapsed)}
                {best !== null ? ` · ${t.best} ${fmt(best)}` : ""}
              </span>
            ) : null}
          </p>
          <ul className="relative flex flex-col gap-1">
            {missions.map((m) => {
              const isDone = done.includes(m.id);
              return (
                <li key={m.id} className={`flex items-start gap-2 ${isDone ? "text-ink/45 line-through" : ""}`}>
                  <span className="border-ink mt-1 flex h-4 w-4 shrink-0 items-center justify-center border-2">{isDone ? <Check className="text-pen h-4 w-4" /> : null}</span>
                  <span>
                    {m.title[locale]} <span className="text-stamp font-bold">−{m.percent} %</span>
                  </span>
                </li>
              );
            })}
          </ul>
          {next ? (
            <p className="pen relative mt-2 hidden text-[1.1rem] leading-tight sm:block">{next.brief[locale]}</p>
          ) : (
            <p className="pen relative mt-2 flex items-center justify-between gap-2">
              <span>{t.max}</span>
              <button type="button" onClick={() => game.reset()} className="dymo pointer-events-auto cursor-pointer text-[9px]">
                {t.reset}
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Explorer: every part of the site, one tap away */}
      <div className="pointer-events-auto absolute top-20 right-3 z-10 sm:top-24 sm:right-6">
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={() => game.toggleNight()} className="dymo cursor-pointer text-[10px]" aria-pressed={night}>
            {night ? t.day : t.night} {night ? "☀" : "☾"}
          </button>
          <button
            type="button"
            onClick={() => {
              audio.unlock();
              audio.horn();
              wind.burst = 1;
            }}
            className="dymo dymo-red cursor-pointer text-[10px]"
          >
            {t.horn} · H
          </button>
          <button
            type="button"
            onClick={() => {
              audio.unlock();
              audio.setMuted(!muted);
              setMuted(!muted);
            }}
            className="dymo cursor-pointer text-[10px]"
            aria-pressed={muted}
          >
            {muted ? t.muted : t.sound} {muted ? "×" : "♪"}
          </button>
          <button type="button" onClick={() => setExplore((v) => !v)} className="dymo dymo-blue cursor-pointer text-[10px]" aria-expanded={explore}>
            {t.explore} {explore ? "−" : "+"}
          </button>
        </div>
        <AnimatePresence>
          {explore ? (
            <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="sheet mt-2 w-[200px] rotate-[1deg] p-3">
              {zones.map((z) => (
                <li key={z.id}>
                  <button
                    type="button"
                    onClick={() => {
                      game.openPanel(z.id);
                      setExplore(false);
                    }}
                    className="focus-ring hand pen flex w-full cursor-pointer items-center justify-between text-left text-[1.35rem] leading-8"
                  >
                    {z.title[locale]} <span aria-hidden="true">→</span>
                  </button>
                </li>
              ))}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Discount stamp + code */}
      <AnimatePresence>
        {discount > 0 ? (
          <motion.div key={discount} initial={{ scale: 2.4, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: -8 }} transition={{ type: "spring", stiffness: 380, damping: 16 }} className="pointer-events-auto absolute bottom-24 left-3 z-10 sm:bottom-8 sm:left-6">
            <div className="sheet p-3 sm:p-4">
              <span className="stamp text-2xl sm:text-3xl">−{discount} %</span>
              <p className="typed text-ink/60 mt-2 text-[10px]">
                {t.reward} · {t.code} <strong className="text-ink">{code}</strong>
                {discount < MAX_DISCOUNT ? ` · max −${MAX_DISCOUNT} %` : ""}
              </p>
              <Link href={`/devis?code=${code ?? ""}`} className="btn btn-stamp mt-2 h-10 text-sm">
                {t.use}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Mission toast */}
      <AnimatePresence>
        {toastMission ? (
          <motion.div key={toast?.at} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pointer-events-none absolute top-20 left-1/2 z-10 w-[86%] max-w-md -translate-x-1/2 sm:top-24">
            <div className="sheet p-4 text-center">
              <span className="stamp text-lg">−{toastMission.percent} %</span>
              <p className="display-md mt-2 text-xl">{toastMission.done[locale]}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-end justify-between px-3 sm:px-6">
        {touch ? (
          <div className="pointer-events-auto">
            <Joystick />
          </div>
        ) : (
          <span />
        )}
        <p className="dymo hidden text-[10px] sm:inline-flex">{started ? (mode === "drive" ? t.drive : t.walk) : t.walk}</p>
        {touch ? (
          <button
            type="button"
            onPointerDown={() => {
              input.action = true;
            }}
            onPointerUp={() => {
              input.action = false;
            }}
            onPointerCancel={() => {
              input.action = false;
            }}
            className={`btn pointer-events-auto h-16 w-16 rounded-full text-xl ${nearVan || mode === "drive" || zoneHere ? "btn-stamp" : "btn-paper opacity-70"}`}
            aria-label={mode === "drive" ? t.exit : t.enter}
          >
            E
          </button>
        ) : (
          <AnimatePresence>
            {zoneHere && !(nearVan && mode === "walk") ? (
              <motion.span key={`zone-${zoneHere.id}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="dymo dymo-blue">
                {t.open} {zoneHere.title[locale]}
              </motion.span>
            ) : nearVan && mode === "walk" ? (
              <motion.span key="enter" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="dymo dymo-red">
                {t.enter}
              </motion.span>
            ) : mode === "drive" ? (
              <motion.span key="exit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="dymo">
                {t.exit}
              </motion.span>
            ) : (
              <span key="none" />
            )}
          </AnimatePresence>
        )}
      </div>
    </>
  );
}
