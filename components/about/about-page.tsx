"use client";

import { ArrowRight, ArrowUpRight } from "@/components/ui/pixel-icon";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Portrait } from "@/components/about/portrait";
import { Stack } from "@/components/about/stack";
import { FadeIn, Reveal } from "@/components/ui/motion-primitives";
import { aboutCopy } from "@/lib/about-copy";
import { useLanguage } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

const sectionHeading =
  "text-foreground text-[2.25rem] leading-[1.05] font-medium tracking-tight text-balance sm:text-[3rem]";

export function AboutPage(): ReactNode {
  const { locale, copy: i18n } = useLanguage();
  const copy = aboutCopy[locale];
  const work = projects.filter((project) => project.url).slice(0, 3);

  return (
    <>
      <section className="container-x pt-10 pb-16 sm:pt-14 sm:pb-20">
        <FadeIn className="flex flex-wrap items-end gap-5 sm:gap-7">
          <div className="relative">
            <span
              aria-hidden="true"
              className="bg-brand absolute -right-2 -bottom-2 h-full w-full"
            />
            <Portrait
              alt={i18n.about.photoAlt}
              className="relative aspect-square w-32 sm:w-44"
            />
          </div>
          <div className="text-sm leading-snug">
            <p className="text-foreground text-lg font-medium">{site.name}</p>
            <p className="text-foreground/55">
              {site.role} · {site.city}
            </p>
          </div>
          <p className="border-foreground/10 text-foreground/70 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:ml-4">
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sun" />
            </span>
            {copy.availability}
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="text-foreground mt-10 max-w-[17ch] text-[2.75rem] display sm:text-[4.25rem] lg:text-[5.5rem]">
            {copy.heading}
          </h1>
        </FadeIn>

        <FadeIn
          delay={0.2}
          className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-2"
        >
          <div
            aria-hidden="true"
            className="bg-foreground/10 hidden h-px self-center lg:block"
          />
          <div>
            <p className="text-foreground/70 max-w-[46ch] text-lg leading-relaxed sm:text-xl">
              {copy.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/devis"
                className="focus-ring group bg-foreground text-background inline-flex min-h-12 items-center gap-2 notch px-6 text-sm font-medium transition-opacity hover:opacity-85"
              >
                {copy.ctaQuote}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/projects"
                className="focus-ring border-foreground/15 text-foreground hover:bg-foreground/4 inline-flex min-h-12 items-center notch border px-6 text-sm font-medium transition-colors"
              >
                {copy.ctaWork}
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      <section
        aria-labelledby="principles-heading"
        className="mx-auto w-full max-w-300 px-6 pb-24 sm:px-10 sm:pb-36"
      >
        <Reveal>
          <h2 id="principles-heading" className={sectionHeading}>
            {copy.principlesHeading}
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-x-12 sm:mt-16 md:grid-cols-2">
          {copy.principles.map((principle, index) => (
            <li key={principle.title}>
              <Reveal
                delay={index * 0.06}
                className="border-foreground/12 flex h-full gap-5 border-t py-8 sm:gap-8 sm:py-10"
              >
                <span className="text-foreground/40 pt-2 text-sm tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-foreground text-[1.6rem] display-md sm:text-[1.9rem]">
                    {principle.title}
                  </h3>
                  <p className="text-foreground/65 mt-3 max-w-[44ch] text-base leading-relaxed sm:text-[17px]">
                    {principle.text}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="story-heading"
        className="bg-foreground text-background w-full py-24 sm:py-36"
      >
        <div className="mx-auto grid w-full max-w-300 gap-12 px-6 sm:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <h2
                id="story-heading"
                className="text-[2.25rem] leading-[1.05] font-medium tracking-tight text-balance sm:text-[3rem]"
              >
                {copy.storyHeading}
              </h2>
              <p className="text-background/65 mt-5 max-w-[40ch] text-lg leading-relaxed">
                {copy.storyLead}
              </p>
            </Reveal>
          </div>

          <ul className="grid gap-x-10 sm:grid-cols-2">
            {copy.chapters.map((chapter, index) => (
              <li key={chapter.place}>
                <Reveal
                  delay={0.04 * index}
                  className="border-background/15 border-t py-8 sm:py-10"
                >
                  <div>
                    <p className="text-background/70 flex items-center gap-3 text-sm">
                      <ChapterLogo
                        src={chapter.logo}
                        fill={"logoFill" in chapter && chapter.logoFill}
                        name={chapter.place}
                      />
                      {chapter.place}
                    </p>
                    <h3 className="mt-4 text-2xl display-md sm:text-[1.75rem]">
                      {chapter.title}
                    </h3>
                    <p className="text-background/65 mt-2 max-w-[52ch] leading-relaxed">
                      {chapter.text}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="tools-heading"
        className="mx-auto grid w-full max-w-300 items-center gap-10 px-6 py-24 sm:px-10 sm:py-36 lg:grid-cols-2 lg:gap-16"
      >
        <Reveal>
          <h2 id="tools-heading" className={sectionHeading}>
            {copy.toolsHeading}
          </h2>
          <p className="text-foreground/65 mt-5 max-w-[44ch] text-lg leading-relaxed">
            {copy.toolsText}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Stack />
        </Reveal>
      </section>

      <section
        aria-labelledby="work-heading"
        className="mx-auto w-full max-w-300 px-6 pb-12 sm:px-10"
      >
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="work-heading" className={sectionHeading}>
            {copy.workHeading}
          </h2>
          <Link
            href="/projects"
            className="focus-ring group text-foreground inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium underline underline-offset-4"
          >
            {copy.allWork}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </Reveal>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {work.map((project, index) => (
            <li key={project.slug}>
              <Reveal delay={index * 0.06}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring group block rounded-3xl"
                >
                  <div className="border-foreground/8 relative aspect-[8/5] overflow-hidden rounded-3xl border">
                    <Image
                      src={`/projects/${project.slug}-cover.webp`}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 380px, 92vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4 px-1">
                    <div>
                      <p className="text-foreground text-lg font-medium tracking-tight">
                        {project.title[locale]}
                      </p>
                      <p className="text-foreground/55 text-sm">
                        {project.sector[locale]}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="text-foreground/50 group-hover:text-foreground mt-1 h-5 w-5 transition-[color,transform] duration-300 group-hover:rotate-45"
                      aria-hidden="true"
                    />
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function ChapterLogo({
  src,
  fill,
  name,
}: {
  src: string;
  fill: boolean;
  name: string;
}): ReactNode {
  if (!src) {
    return (
      <span
        aria-hidden="true"
        className="bg-background/10 inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold"
      >
        {name.charAt(0)}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-8 w-8 overflow-hidden rounded-lg bg-white ${fill ? "" : "p-1"}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={32}
        height={32}
        className={`h-full w-full ${fill ? "object-cover" : "object-contain"}`}
      />
    </span>
  );
}
