"use client";

import { useEffect, useState, type ReactNode } from "react";

const COUNT = 40;
const SCALE = ["var(--px-1)", "var(--px-2)", "var(--px-3)", "var(--px-4)", "var(--px-5)"];

/** Fixed reading-progress bar made of pixel blocks, the site's signature. */
export function ScrollPixels(): ReactNode {
  const [lit, setLit] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = (): void => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      setLit(Math.round(Math.min(1, Math.max(0, ratio)) * COUNT));
    };
    const onScroll = (): void => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] grid h-1.5"
      style={{ gridTemplateColumns: `repeat(${COUNT}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: COUNT }, (_, i) => (
        <span
          key={i}
          className="transition-opacity duration-300"
          style={{
            background: SCALE[Math.floor((i / COUNT) * SCALE.length)],
            opacity: i < lit ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}
