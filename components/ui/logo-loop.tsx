"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { useReducedMotion } from "@/lib/motion";

import "./logo-loop.css";

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

type LogoItem = {
  node: ReactNode;
  title?: string;
  ariaLabel?: string;
  href?: string;
};

type LogoLoopProps = {
  logos: readonly LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, index: number) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

type LoopStyle = CSSProperties & {
  "--logoloop-gap": string;
  "--logoloop-logoHeight": string;
  "--logoloop-fadeColor"?: string;
};

function toCssLength(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

export const LogoLoop = memo(function LogoLoop({
  logos,
  speed = 120,
  direction = "left",
  width = "100%",
  logoHeight = 28,
  gap = 32,
  pauseOnHover = false,
  hoverSpeed,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  ariaLabel = "Logos",
  className,
  style,
}: LogoLoopProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const [seqSize, setSeqSize] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const reducedMotion = useReducedMotion();
  const isVertical = direction === "up" || direction === "down";

  const updateDimensions = useCallback(() => {
    const container = containerRef.current;
    const sequence = seqRef.current;
    if (!container || !sequence) return;

    const sequenceRect = sequence.getBoundingClientRect();
    const size = isVertical ? sequenceRect.height : sequenceRect.width;
    if (size <= 0) return;

    const viewport = isVertical ? container.clientHeight : container.clientWidth;
    setSeqSize(size);
    setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(viewport / size) + ANIMATION_CONFIG.COPY_HEADROOM));
  }, [isVertical]);

  useEffect(() => {
    const container = containerRef.current;
    const sequence = seqRef.current;
    if (!container || !sequence) return;

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateDimensions);
    observer?.observe(container);
    observer?.observe(sequence);
    const images = Array.from(sequence.querySelectorAll("img"));
    images.forEach((image) => {
      image.addEventListener("load", updateDimensions);
      image.addEventListener("error", updateDimensions);
    });
    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => {
      observer?.disconnect();
      images.forEach((image) => {
        image.removeEventListener("load", updateDimensions);
        image.removeEventListener("error", updateDimensions);
      });
      window.removeEventListener("resize", updateDimensions);
    };
  }, [logos, gap, logoHeight, updateDimensions]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(Boolean(entry?.isIntersecting)));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const targetVelocity = useMemo(() => {
    const multiplier = direction === "left" || direction === "up" ? 1 : -1;
    return Math.abs(speed) * multiplier * (speed < 0 ? -1 : 1);
  }, [direction, speed]);
  const effectiveHoverSpeed = hoverSpeed ?? (pauseOnHover ? 0 : undefined);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (reducedMotion) {
      track.style.transform = "none";
      return;
    }
    if (!isVisible || seqSize <= 0) return;

    let frame = 0;
    let lastTimestamp: number | null = null;
    const animate = (timestamp: number): void => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      const target = isHovered && effectiveHoverSpeed !== undefined ? effectiveHoverSpeed : targetVelocity;
      velocityRef.current += (target - velocityRef.current) * (1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU));
      offsetRef.current = ((offsetRef.current + velocityRef.current * deltaTime) % seqSize + seqSize) % seqSize;
      track.style.transform = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [targetVelocity, seqSize, isHovered, effectiveHoverSpeed, isVertical, isVisible, reducedMotion]);

  const rootClassName = [
    "logoloop",
    isVertical ? "logoloop--vertical" : "logoloop--horizontal",
    fadeOut && "logoloop--fade",
    scaleOnHover && "logoloop--scale-hover",
    className,
  ].filter(Boolean).join(" ");

  const containerStyle: LoopStyle = {
    width: isVertical && width === "100%" ? undefined : toCssLength(width),
    "--logoloop-gap": `${gap}px`,
    "--logoloop-logoHeight": `${logoHeight}px`,
    ...(fadeOutColor ? { "--logoloop-fadeColor": fadeOutColor } : {}),
    ...style,
  };

  return (
    <div ref={containerRef} className={rootClassName} style={containerStyle} role="region" aria-label={ariaLabel}>
      <div
        ref={trackRef}
        className="logoloop__track"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            key={copyIndex}
            ref={copyIndex === 0 ? seqRef : undefined}
            className="logoloop__list"
            aria-hidden={copyIndex > 0}
            inert={copyIndex > 0}
          >
            {logos.map((item, itemIndex) => (
              <li key={`${copyIndex}-${itemIndex}`} className="logoloop__item">
                {renderItem ? renderItem(item, itemIndex) : item.href ? (
                  <a
                    className="logoloop__link"
                    href={item.href}
                    aria-label={item.ariaLabel ?? item.title}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.node}
                  </a>
                ) : item.node}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
});

LogoLoop.displayName = "LogoLoop";
