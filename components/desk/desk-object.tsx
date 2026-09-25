"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import type { ReactNode, RefObject } from "react";

/**
 * Something lying on the desk: it drops in, can be dragged around, and a tap
 * opens the part of the site it stands for.
 */
export function DeskObject({
  children,
  deskRef,
  href,
  label,
  rotate = 0,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  deskRef: RefObject<HTMLDivElement | null>;
  href?: string;
  label?: string;
  rotate?: number;
  delay?: number;
  className?: string;
}): ReactNode {
  const router = useRouter();
  const reduced = useReducedMotion();

  function open(): void {
    if (!href) return;
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    } else {
      router.push(href);
    }
  }

  return (
    <motion.div
      drag
      dragConstraints={deskRef}
      dragElastic={0.12}
      dragMomentum={false}
      whileHover={{ scale: 1.02, boxShadow: "var(--shadow-lift)" }}
      whileDrag={{ scale: 1.04, zIndex: 40, boxShadow: "var(--shadow-lift)" }}
      initial={reduced ? { opacity: 1, rotate } : { opacity: 0, y: -60, rotate: rotate - 6 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay }}
      onTap={open}
      role={href ? "link" : undefined}
      tabIndex={href ? 0 : undefined}
      aria-label={label}
      onKeyDown={(event) => {
        if (href && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          open();
        }
      }}
      className={`focus-ring absolute touch-none select-none ${href ? "cursor-grab active:cursor-grabbing" : "cursor-grab"} ${className}`}
    >
      {children}
    </motion.div>
  );
}
