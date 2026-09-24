"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

/** Counts from 0 to `to` when scrolled into view (after React Bits "CountUp"). */
export function CountUp({
  to,
  suffix = "",
  duration = 1.4,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}): ReactNode {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduced) {
      node.textContent = `${to}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        node.textContent = `${Math.round(value)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
