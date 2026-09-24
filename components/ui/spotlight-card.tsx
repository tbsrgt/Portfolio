"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

/** A card with a soft radial highlight that follows the pointer (after React Bits "SpotlightCard"). */
export function SpotlightCard({
  children,
  className = "",
  color = "color-mix(in srgb, var(--brand) 22%, transparent)",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}): ReactNode {
  const ref = useRef<HTMLDivElement>(null);

  function move(event: PointerEvent<HTMLDivElement>): void {
    const node = ref.current;
    if (!node || event.pointerType !== "mouse") return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    node.style.setProperty("--spot-o", "1");
  }

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => ref.current?.style.setProperty("--spot-o", "0")}
      className={`relative overflow-hidden ${className}`}
      style={{ "--spot-color": color, "--spot-o": 0 } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: "var(--spot-o)",
          background: "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--spot-color), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
