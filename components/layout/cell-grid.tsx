"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Spreadsheet-like cell grid behind the hero: hairline cells, a few "data" cells
 * that fill and fade in the brand colour, and a selection outline that follows
 * the pointer. Inspired by React Bits "Squares", rebuilt for this concept.
 */
const CELL = 48;
const ROW_HEIGHT = 32;

type Pulse = {
  col: number;
  row: number;
  start: number;
  life: number;
  color: number;
};

export function CellGrid(): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let width = 0;
    let height = 0;
    let line = "rgba(0,0,0,0.07)";
    let brand = "#f0561d";
    let palette: string[] = [brand];
    let pointer: { x: number; y: number } | null = null;
    let pulses: Pulse[] = [];
    let frame = 0;

    const readColors = (): void => {
      const styles = getComputedStyle(document.documentElement);
      const dark = document.documentElement.classList.contains("dark");
      line = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.065)";
      brand = styles.getPropertyValue("--brand").trim() || brand;
      palette = ["--px-1", "--px-2", "--px-3", "--px-4", "--px-5"].map(
        (name) => styles.getPropertyValue(name).trim() || brand
      );
    };

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (now: number): void => {
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / ROW_HEIGHT);
      pulses.push({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows * 0.7),
        start: now,
        life: 2600 + Math.random() * 2200,
        color: Math.floor(Math.random() * 5),
      });
    };

    const draw = (now: number): void => {
      ctx.clearRect(0, 0, width, height);
      const offsetX = (width % CELL) / 2;

      ctx.strokeStyle = line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = offsetX; x <= width; x += CELL) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, height);
      }
      for (let y = 0; y <= height; y += ROW_HEIGHT) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();

      pulses = pulses.filter((p) => now - p.start < p.life);
      for (const p of pulses) {
        const t = (now - p.start) / p.life;
        ctx.globalAlpha = Math.sin(t * Math.PI) * 0.35;
        ctx.fillStyle = palette[p.color] ?? brand;
        ctx.fillRect(
          offsetX + p.col * CELL + 1,
          p.row * ROW_HEIGHT + 1,
          CELL - 1,
          ROW_HEIGHT - 1
        );
      }
      ctx.globalAlpha = 1;

      if (pointer) {
        const col = Math.floor((pointer.x - offsetX) / CELL);
        const row = Math.floor(pointer.y / ROW_HEIGHT);
        ctx.strokeStyle = brand;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(
          offsetX + col * CELL + 0.75,
          row * ROW_HEIGHT + 0.75,
          CELL - 0.5,
          ROW_HEIGHT - 0.5
        );
      }
    };

    let last = 0;
    const loop = (now: number): void => {
      if (now - last > 420 && pulses.length < 14) {
        spawn(now);
        last = now;
      }
      draw(now);
      frame = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer =
        x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
          ? { x, y }
          : null;
      if (reduced) draw(performance.now());
    };

    const observer = new MutationObserver(readColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    readColors();
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    if (reduced) draw(performance.now());
    else frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full [mask-image:radial-gradient(90%_75%_at_50%_0%,black_35%,transparent_85%)]"
    />
  );
}
