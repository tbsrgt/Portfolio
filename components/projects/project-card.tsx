"use client";

import { ArrowUpRight } from "@/components/ui/pixel-icon";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import Image from "next/image";
import {
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

import { useLanguage } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { salesCopy } from "@/lib/sales-copy";

type Props = { project: Project; index: number; total: number };

export function ProjectCard({ project, index, total }: Props): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];
  const title = project.title[locale];
  const host = project.url ? new URL(project.url).host : null;
  const software = project.kind === "software";
  const alt = software
    ? `${locale === "fr" ? "Tableau de bord du logiciel" : "Dashboard of the software"} ${title}`
    : `${locale === "fr" ? "Aperçu du site" : "Preview of the website"} ${title}`;
  const flipped = index % 2 === 1;

  return (
    <article
      className="project-panel border-foreground/8 relative overflow-hidden rounded-lg border"
      style={{ "--accent": project.accent } as CSSProperties}
    >
      <div className="grid items-center gap-6 p-3 sm:p-5 lg:grid-cols-[1.35fr_1fr] lg:gap-12 lg:p-8">
        <div className={flipped ? "lg:order-2" : undefined}>
          <Preview
            project={project}
            alt={alt}
            host={host}
            visitLabel={copy.visitProject}
          />
        </div>

        <div className="flex flex-col px-3 pb-4 sm:px-2 lg:py-4">
          <div className="text-foreground/55 flex items-center justify-between gap-4 text-sm">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[var(--accent)]"
              />
              {project.sector[locale]}
            </span>
            <span className="tabular-nums">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>

          <h3 className="display-md mt-5 text-[2.5rem] sm:text-[3.25rem]">
            {title}
          </h3>
          <p className="text-foreground/55 mt-2 text-sm">{project.place}</p>

          <p className="text-foreground/75 mt-6 text-[17px] leading-relaxed">
            {project.summary[locale]}
          </p>

          <ul className="border-foreground/10 mt-6 flex flex-col border-t">
            {project.highlights[locale].map((highlight) => (
              <li
                key={highlight}
                className="border-foreground/10 text-foreground/80 flex gap-3 border-b py-3 text-[15px]"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.7em] h-px w-3 shrink-0 bg-[var(--accent)]"
                />
                {highlight}
              </li>
            ))}
          </ul>

          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group/cta mt-8 inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-[var(--accent)] py-2 pr-2 pl-5 text-sm font-medium text-white transition-[filter] hover:brightness-110"
            >
              {copy.visitProject}
              <span className="hidden text-white/70 sm:inline">{host}</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover/cta:rotate-45">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Preview({
  project,
  alt,
  host,
  visitLabel,
}: {
  project: Project;
  alt: string;
  host: string | null;
  visitLabel: string;
}): ReactNode {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 32 });
  const springY = useSpring(y, { stiffness: 400, damping: 32 });

  function track(event: PointerEvent<HTMLElement>): void {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const frame = (
    <>
      <div className="border-foreground/10 bg-background overflow-hidden rounded-xl border shadow-[0_30px_60px_-30px_rgb(0_0_0/0.4)] sm:rounded-2xl">
        <div
          className="border-foreground/8 flex h-7 items-center gap-1.5 border-b px-3 sm:h-8"
          aria-hidden="true"
        >
          <span className="bg-foreground/15 h-2 w-2 rounded-full" />
          <span className="bg-foreground/15 h-2 w-2 rounded-full" />
          <span className="bg-foreground/15 h-2 w-2 rounded-full" />
          <span className="bg-foreground/5 text-foreground/50 mx-auto max-w-[60%] truncate rounded-md px-3 py-0.5 text-[10px] font-medium">
            {host ?? project.title.fr}
          </span>
          <span className="w-7" />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={`/projects/${project.slug}-desktop.webp`}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 640px, 92vw"
            className="object-cover object-top transition-[object-position] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/preview:object-bottom group-hover/preview:duration-[9000ms] motion-reduce:transition-none"
          />
        </div>
      </div>
      {project.kind === "software" ? (
        <div
          aria-hidden="true"
          className="border-foreground/10 bg-background absolute right-3 bottom-3 w-[46%] overflow-hidden rounded-lg border shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/preview:-translate-y-3 sm:right-6"
        >
          <div className="relative aspect-[16/10]">
            <Image
              src={`/projects/${project.slug}-detail.webp`}
              alt=""
              fill
              sizes="320px"
              className="object-cover object-top"
            />
          </div>
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="absolute right-5 bottom-3 w-[21%] min-w-14 overflow-hidden rounded-[12px] border-[3px] border-neutral-900 bg-neutral-900 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/preview:-translate-y-3 sm:right-8 sm:rounded-[22px] sm:border-4"
        >
          <div className="relative aspect-[390/844]">
            <Image
              src={`/projects/${project.slug}-mobile.webp`}
              alt=""
              fill
              sizes="140px"
              className="object-cover object-top"
            />
          </div>
        </div>
      )}
    </>
  );

  const stage =
    "project-stage group/preview relative block rounded-lg px-4 pt-4 pb-12 sm:px-8 sm:pt-8 sm:pb-16";

  if (!project.url) return <div className={stage}>{frame}</div>;

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}
      aria-hidden="true"
      className={`${stage} md:cursor-none`}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        track(event);
        springX.jump(x.get());
        springY.jump(y.get());
        setHovered(true);
      }}
      onPointerMove={track}
      onPointerLeave={() => setHovered(false)}
    >
      {frame}
      <motion.span
        className="pointer-events-none absolute top-0 left-0 z-10 hidden items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white shadow-lg md:inline-flex"
        style={{
          x: reduceMotion ? x : springX,
          y: reduceMotion ? y : springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
      >
        {visitLabel}
        <ArrowUpRight className="h-4 w-4" />
      </motion.span>
    </a>
  );
}
