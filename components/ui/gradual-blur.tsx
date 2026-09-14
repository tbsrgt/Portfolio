"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";

import "./gradual-blur.css";

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";

type GradualBlurProps = {
  target?: "parent" | "page";
  position?: Position;
  height?: string;
  strength?: number;
  divCount?: number;
  curve?: Curve;
  exponential?: boolean;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
};

const curves: Record<Curve, (progress: number) => number> = {
  linear: (progress) => progress,
  bezier: (progress) => progress * progress * (3 - 2 * progress),
  "ease-in": (progress) => progress * progress,
  "ease-out": (progress) => 1 - (1 - progress) ** 2,
  "ease-in-out": (progress) => progress < 0.5
    ? 2 * progress * progress
    : 1 - (-2 * progress + 2) ** 2 / 2,
};

const directions: Record<Position, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

export function GradualBlur({
  target = "parent",
  position = "bottom",
  height = "6rem",
  strength = 2,
  divCount = 5,
  curve = "linear",
  exponential = false,
  opacity = 1,
  className = "",
  style,
}: GradualBlurProps): ReactNode {
  const count = Math.max(1, Math.min(12, Math.floor(divCount)));
  const layers = useMemo(() => Array.from({ length: count }, (_, index) => {
    const step = index + 1;
    const increment = 100 / count;
    const progress = curves[curve](step / count);
    const blur = exponential
      ? 2 ** (progress * 4) * 0.0625 * strength
      : 0.0625 * (progress * count + 1) * strength;
    const p1 = Math.round(increment * (step - 1) * 10) / 10;
    const p2 = Math.round(increment * step * 10) / 10;
    const p3 = Math.round(increment * (step + 1) * 10) / 10;
    const p4 = Math.round(increment * (step + 2) * 10) / 10;
    const stops = [`transparent ${p1}%`, `black ${p2}%`];
    if (p3 <= 100) stops.push(`black ${p3}%`);
    if (p4 <= 100) stops.push(`transparent ${p4}%`);
    const mask = `linear-gradient(${directions[position]}, ${stops.join(", ")})`;

    return (
      <div
        key={step}
        className="gradual-blur__layer"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          backdropFilter: `blur(${blur.toFixed(3)}rem)`,
          WebkitBackdropFilter: `blur(${blur.toFixed(3)}rem)`,
          opacity,
        }}
      />
    );
  }), [count, strength, curve, exponential, position, opacity]);

  const vertical = position === "top" || position === "bottom";
  const containerStyle: CSSProperties = {
    position: target === "page" ? "fixed" : "absolute",
    height: vertical ? height : "100%",
    width: vertical ? "100%" : height,
    [position]: 0,
    ...(vertical ? { left: 0, right: 0 } : { top: 0, bottom: 0 }),
    ...style,
  };

  return (
    <div
      aria-hidden="true"
      className={`gradual-blur ${className}`.trim()}
      style={containerStyle}
    >
      {layers}
    </div>
  );
}
