"use client";

import {
  motion,
  useInView,
} from "motion/react";
import {
  useMemo,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";

import { useReducedMotion } from "@/lib/motion";

type ScrollRevealProps = {
  children: string;
  as?: ElementType;
  id?: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
};

type RevealWordProps = {
  children: string;
  index: number;
  baseOpacity: number;
  blurStrength: number;
  enableBlur: boolean;
  reducedMotion: boolean;
  isVisible: boolean;
};

function RevealWord({
  children,
  index,
  baseOpacity,
  blurStrength,
  enableBlur,
  reducedMotion,
  isVisible,
}: RevealWordProps): ReactNode {
  return (
    <motion.span
      className="inline-block will-change-[filter,opacity]"
      initial={reducedMotion ? false : { opacity: baseOpacity, filter: enableBlur ? `blur(${blurStrength}px)` : "blur(0px)" }}
      {...(reducedMotion || isVisible ? { animate: { opacity: 1, filter: "blur(0px)" } } : {})}
      transition={{ duration: 0.58, delay: Math.min(index * 0.035, 0.42), ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

function splitText(text: string): string[] {
  if (/[㐀-鿿]/.test(text)) return Array.from(text);
  return text.split(/(\s+)/);
}

export function ScrollReveal({
  children,
  as: Tag = "p",
  id,
  enableBlur = true,
  baseOpacity = 0.16,
  baseRotation = 2,
  blurStrength = 4,
  containerClassName,
  textClassName,
}: ScrollRevealProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isVisible = useInView(containerRef, { amount: 0.15, once: true });
  const parts = useMemo(() => splitText(children), [children]);
  let wordIndex = 0;

  return (
    <motion.div
      ref={containerRef}
      className={containerClassName}
      initial={reducedMotion ? false : { rotate: baseRotation }}
      {...(reducedMotion || isVisible ? { animate: { rotate: 0 } } : {})}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "0% 50%" }}
    >
      <Tag id={id} className={textClassName}>
        {parts.map((part, index) => {
          if (/^\s+$/.test(part)) return part;
          const currentWordIndex = wordIndex++;
          return (
            <RevealWord
              key={`${part}-${index}`}
              index={currentWordIndex}
              baseOpacity={baseOpacity}
              blurStrength={blurStrength}
              enableBlur={enableBlur}
              reducedMotion={reducedMotion}
              isVisible={isVisible}
            >
              {part}
            </RevealWord>
          );
        })}
      </Tag>
    </motion.div>
  );
}
