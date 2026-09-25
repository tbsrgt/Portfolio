"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Portrait drawn as big pixels that resolve into the photo on hover/tap.
 * Signature object: a low-res photo becomes the brand's pixel motif.
 */
export function PixelPortrait({
  src,
  alt,
  size = 320,
  className = "",
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [sharp, setSharp] = useState(false);
  const cellsRef = useRef(22);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageRef.current = img;
      draw(cellsRef.current);
    };
  }, [src]);

  function draw(cells: number): void {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.imageSmoothingEnabled = false;
    // Downscale to `cells` then scale back up without smoothing.
    const tiny = document.createElement("canvas");
    tiny.width = cells;
    tiny.height = cells;
    const tctx = tiny.getContext("2d");
    if (!tctx) return;
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - side) / 2;
    const sy = (img.naturalHeight - side) / 2;
    tctx.drawImage(img, sx, sy, side, side, 0, 0, cells, cells);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tiny, 0, 0, cells, cells, 0, 0, canvas.width, canvas.height);
  }

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = sharp ? 160 : 22;
    if (reduced) {
      cellsRef.current = target;
      draw(target);
      return;
    }
    let frame = 0;
    const step = (): void => {
      const current = cellsRef.current;
      const next = sharp ? Math.min(target, Math.round(current * 1.28) + 1) : Math.max(target, Math.round(current / 1.28) - 1);
      cellsRef.current = next;
      draw(next);
      if (next !== target) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharp, size]);

  return (
    <button
      type="button"
      onPointerEnter={() => setSharp(true)}
      onPointerLeave={() => setSharp(false)}
      onClick={() => setSharp((v) => !v)}
      aria-label={alt}
      aria-pressed={sharp}
      className={`focus-ring brackets group relative block cursor-pointer p-2 ${className}`}
    >
      <canvas ref={canvasRef} role="img" aria-label={alt} style={{ width: "100%", aspectRatio: "1 / 1" }} className="block" />
      <span className="text-paper/60 font-mono absolute right-3 bottom-3 text-[10px] tracking-[0.14em] uppercase transition-opacity group-hover:opacity-0">
        hover
      </span>
    </button>
  );
}
