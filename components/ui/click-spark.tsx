"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

import { useReducedMotion } from "@/lib/motion";

type Easing = "linear" | "ease-in" | "ease-in-out" | "ease-out";

type Spark = {
  x: number;
  y: number;
  angle: number;
  startTime: number;
};

type ClickSparkProps = {
  children: ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: Easing;
  extraScale?: number;
};

function ease(progress: number, easing: Easing): number {
  switch (easing) {
    case "linear":
      return progress;
    case "ease-in":
      return progress * progress;
    case "ease-in-out":
      return progress < 0.5
        ? 2 * progress * progress
        : 1 - ((-2 * progress + 2) ** 2) / 2;
    default:
      return progress * (2 - progress);
  }
}

function resolveCanvasColor(color: string): string {
  if (!color.startsWith("var(")) return color;
  const variable = color.slice(4, -1).trim();
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || "#ffffff";
}

export function ClickSpark({
  children,
  sparkColor = "var(--foreground)",
  sparkSize = 10,
  sparkRadius = 16,
  sparkCount = 8,
  duration = 650,
  easing = "ease-out",
  extraScale = 1,
}: ClickSparkProps): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const frameRef = useRef<number | null>(null);
  const drawRef = useRef<(timestamp: number) => void>(() => undefined);
  const reducedMotion = useReducedMotion();

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== Math.round(width * pixelRatio) || canvas.height !== Math.round(height * pixelRatio)) {
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.strokeStyle = resolveCanvasColor(sparkColor);
    context.lineWidth = 1.5;
    context.lineCap = "round";

    sparksRef.current = sparksRef.current.filter((spark) => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= duration) return false;

      const progress = elapsed / duration;
      const eased = ease(progress, easing);
      const distance = eased * sparkRadius * extraScale;
      const lineLength = sparkSize * (1 - eased);
      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      context.globalAlpha = 1 - progress;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      return true;
    });
    context.globalAlpha = 1;

    frameRef.current = sparksRef.current.length > 0
      ? requestAnimationFrame(drawRef.current)
      : null;
  }, [duration, easing, extraScale, sparkColor, sparkRadius, sparkSize]);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  function handleClick(event: MouseEvent<HTMLDivElement>): void {
    if (reducedMotion) return;

    const target = event.target as HTMLElement;
    const targetBounds = target.getBoundingClientRect();
    const x = event.clientX || targetBounds.left + targetBounds.width / 2;
    const y = event.clientY || targetBounds.top + targetBounds.height / 2;
    const now = performance.now();
    sparksRef.current.push(
      ...Array.from({ length: sparkCount }, (_, index) => ({
        x,
        y,
        angle: (2 * Math.PI * index) / sparkCount,
        startTime: now,
      }))
    );

    if (frameRef.current === null) frameRef.current = requestAnimationFrame(draw);
  }

  return (
    <div className="relative min-h-screen" onClick={handleClick}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] block select-none"
      />
      {children}
    </div>
  );
}
