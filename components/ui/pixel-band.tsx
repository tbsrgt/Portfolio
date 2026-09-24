import type { CSSProperties, ReactNode } from "react";

/**
 * Stepped band of warm pixel blocks (yellow → red), the site's signature.
 * Each row is one colour; rows get wider towards the bottom, like a staircase.
 */
const COLUMNS = 24;
const ROWS = [
  "var(--px-1)",
  "var(--px-2)",
  "var(--px-3)",
  "var(--px-4)",
  "var(--px-5)",
] as const;

export function PixelBand({
  className = "",
  align = "left",
}: {
  className?: string;
  align?: "left" | "right";
}): ReactNode {
  return (
    <div
      aria-hidden="true"
      className={`grid w-full ${className}`}
      style={
        {
          gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
        } as CSSProperties
      }
    >
      {ROWS.map((color, row) => {
        const span = 4 * (row + 2);
        const start = align === "left" ? 1 : COLUMNS - span + 1;
        return (
          <div
            key={color}
            className="h-3 sm:h-4 lg:h-5"
            style={
              {
                gridColumn: `${start} / span ${span}`,
                gridRow: row + 1,
                background: color,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
