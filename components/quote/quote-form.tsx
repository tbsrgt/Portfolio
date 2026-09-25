"use client";

import { ArrowLeft, ArrowRight, Check, CornerDownLeft } from "@/components/ui/pixel-icon";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";

import { Portrait } from "@/components/about/portrait";
import { useLanguage } from "@/lib/i18n";
import { discountFromCode } from "@/lib/game";
import { estimateQuote, formatPrice, quoteCopy, visibleSteps, type QuoteAnswers, type QuoteStep } from "@/lib/quote";

/** Discount code earned in the desk game, passed as ?code=. */
function readCode(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("code") ?? "";
}
import { site } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;
const LETTERS = "ABCDEFGHIJ";
const EXCLUSIVE = new Set(["none", "nothing"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "success" | "error";

export function QuoteForm(): ReactNode {
  const { locale } = useLanguage();
  const copy = quoteCopy[locale];
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(-1);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<QuoteAnswers>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const honeypot = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const pendingAdvance = useRef(false);

  const steps = visibleSteps(answers);
  const total = steps.length;
  const step = index >= 0 ? steps[Math.min(index, total - 1)] : undefined;
  const isLast = index === total - 1;

  useEffect(() => {
    pendingAdvance.current = false;
  }, [index]);

  function focusStep(container: HTMLElement): void {
    if (index < 0) return;
    const firstInput = container.querySelector<HTMLElement>("input, textarea");
    (firstInput ?? headingRef.current)?.focus({ preventScroll: true });
  }

  const go = useCallback((next: number) => {
    setDirection(next > index ? 1 : -1);
    setError(null);
    setIndex(next);
  }, [index]);

  const validate = useCallback((current: QuoteStep): string | null => {
    if (current.kind === "estimate") return null;
    if (current.kind === "single") return answers[current.id] ? null : copy.pickOne;
    if (current.kind === "multi") return (answers[current.id] as string[] | undefined)?.length ? null : copy.pickOne;
    for (const field of current.fields) {
      const value = String(answers[field.name] ?? "").trim();
      if (field.required && !value) return copy.required;
      if (field.type === "email" && value && !emailPattern.test(value)) return copy.invalidEmail;
    }
    return null;
  }, [answers, copy]);

  const submit = useCallback(async () => {
    setStatus("sending");
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, locale, code: readCode(), website_check: honeypot.current?.value ?? "" }),
      });
      if (!response.ok) throw new Error("Quote delivery failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [answers, locale]);

  const advance = useCallback(() => {
    if (!step) return go(0);
    const problem = validate(step);
    if (problem) return setError(problem);
    if (isLast) return void submit();
    go(index + 1);
  }, [step, validate, isLast, submit, go, index]);

  function choose(current: QuoteStep, value: string): void {
    if (pendingAdvance.current || (current.kind !== "single" && current.kind !== "multi")) return;
    setError(null);
    if (current.kind === "single") {
      setAnswers((prev) => ({ ...prev, [current.id]: value }));
      pendingAdvance.current = true;
      window.setTimeout(() => go(index + 1), reduceMotion ? 0 : 280);
      return;
    }
    setAnswers((prev) => {
      const selected = (prev[current.id] as string[] | undefined) ?? [];
      let next: string[];
      if (selected.includes(value)) next = selected.filter((item) => item !== value);
      else if (EXCLUSIVE.has(value)) next = [value];
      else next = [...selected.filter((item) => !EXCLUSIVE.has(item)), value];
      return { ...prev, [current.id]: next };
    });
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent): void {
      if (status === "sending" || status === "success" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (event.key === "Enter" && !["TEXTAREA", "BUTTON", "A"].includes(target.tagName)) {
        event.preventDefault();
        advance();
        return;
      }
      if (typing || !step || (step.kind !== "single" && step.kind !== "multi")) return;
      const option = event.key.length === 1 ? step.options[LETTERS.indexOf(event.key.toUpperCase())] : undefined;
      if (option) choose(step, option.value);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();
    advance();
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, y: reduceMotion ? 0 : dir * 40 }),
    center: { opacity: 1, y: 0 },
    exit: (dir: number) => ({ opacity: 0, y: reduceMotion ? 0 : dir * -40 }),
  };

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="flex flex-col items-start" role="status">
        <span className="bg-foreground text-background inline-flex h-12 w-12 items-center justify-center rounded-full">
          <Check className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="text-foreground mt-8 text-[2.5rem] display sm:text-[3.25rem]">{copy.successTitle}</h1>
        <p className="text-foreground/65 mt-5 max-w-[46ch] text-lg leading-relaxed">{copy.successText}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="focus-ring bg-foreground text-background inline-flex min-h-12 items-center notch px-6 text-sm font-medium">{copy.backHome}</Link>
          <Link href="/projects" className="focus-ring border-foreground/15 text-foreground hover:bg-foreground/4 inline-flex min-h-12 items-center notch border px-6 text-sm font-medium transition-colors">{copy.seeWork}</Link>
        </div>
      </motion.div>
    );
  }

  const submitLabel = status === "sending" ? copy.sending : !step ? copy.start : isLast ? copy.submit : step.kind === "estimate" ? copy.toContact : copy.next;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col">
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>Ne pas remplir <input ref={honeypot} name="website_check" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="mb-10 flex items-center gap-4 sm:mb-14">
        <div className="bg-foreground/8 relative h-1 flex-1 overflow-hidden rounded-full" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.max(index, 0)} aria-label={copy.title}>
          <motion.div className="bg-foreground absolute inset-y-0 left-0 rounded-full" animate={{ width: `${(Math.max(index, 0) / total) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
        </div>
        <span className="text-foreground/50 min-w-[6ch] text-right text-sm tabular-nums">{`${Math.max(index + 1, 0)} / ${total}`}</span>
      </div>

      <div className="relative min-h-[26rem]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            ref={stepRef}
            onAnimationComplete={(definition) => {
              if (definition === "center" && stepRef.current) focusStep(stepRef.current);
            }}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE }}
          >
            {step ? (
              <StepView step={step} index={index} answers={answers} setAnswers={setAnswers} choose={choose} headingRef={headingRef} stepLabel={copy.step(index + 1, total)} />
            ) : (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-3">
                  <Portrait alt={site.name} className="aspect-square w-12 rounded-full" />
                  <p className="text-foreground/60 text-sm leading-snug">
                    {site.name}
                    <br />
                    {site.role} · {site.city}
                  </p>
                </div>
                <h1 ref={headingRef} tabIndex={-1} className="text-foreground mt-8 max-w-[14ch] text-[2.75rem] display outline-none sm:text-[4rem]">
                  {copy.title}
                </h1>
                <p className="text-foreground/65 mt-6 max-w-[44ch] text-lg leading-relaxed sm:text-xl">{copy.intro}</p>
                <ul className="text-foreground/55 mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {copy.introMeta.map((item) => (
                    <li key={item} className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div aria-live="polite" className="min-h-6">
        {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}
        {status === "error" ? (
          <p role="alert" className="text-foreground text-sm">
            {copy.error}{" "}
            <a className="focus-ring rounded underline underline-offset-4" href={`mailto:${site.email}`}>{copy.directEmail}</a>
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {index >= 0 ? (
          <button type="button" onClick={() => go(index - 1)} className="focus-ring border-foreground/15 text-foreground hover:bg-foreground/4 inline-flex min-h-12 cursor-pointer items-center gap-2 notch border px-5 text-sm font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {copy.back}
          </button>
        ) : null}
        {step?.kind !== "single" ? (
          <button type="submit" disabled={status === "sending"} className="focus-ring bg-foreground text-background group inline-flex min-h-12 cursor-pointer items-center gap-2 notch px-6 text-sm font-medium transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-50">
            {submitLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        ) : null}
        {step?.kind !== "single" ? (
          <span className="text-foreground/45 hidden items-center gap-1.5 text-xs md:inline-flex">
            {copy.pressEnter} <CornerDownLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      {isLast ? <p className="text-foreground/50 mt-5 text-xs">{copy.privacy}</p> : null}
    </form>
  );
}

type StepViewProps = {
  step: QuoteStep;
  index: number;
  answers: QuoteAnswers;
  setAnswers: (update: (prev: QuoteAnswers) => QuoteAnswers) => void;
  choose: (step: QuoteStep, value: string) => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
  stepLabel: string;
};

function StepView({ step, index, answers, setAnswers, choose, headingRef, stepLabel }: StepViewProps): ReactNode {
  const { locale } = useLanguage();
  const inputClass = "focus-ring border-foreground/20 text-foreground placeholder:text-foreground/30 focus:border-foreground w-full border-b bg-transparent py-3 text-xl outline-none transition-colors sm:text-2xl";

  return (
    <div>
      <p className="text-foreground/50 text-sm">
        <span className="sr-only">{stepLabel}. </span>
        <span aria-hidden="true" className="tabular-nums">{String(index + 1).padStart(2, "0")} →</span>
      </p>
      <h1 id="quote-question" ref={headingRef} tabIndex={-1} className="text-foreground mt-3 text-[2rem] display text-balance outline-none sm:text-[2.75rem]">
        {step.question[locale]}
      </h1>
      {step.help ? <p className="text-foreground/55 mt-3 text-base">{step.help[locale]}</p> : null}

      {step.kind === "estimate" ? <EstimateView answers={answers} /> : null}

      {step.kind === "fields" ? (
        <div className="mt-8 flex flex-col gap-7">
          {step.fields.map((field) => {
            const common = {
              id: `quote-${field.name}`,
              name: field.name,
              value: String(answers[field.name] ?? ""),
              maxLength: field.maxLength,
              required: field.required,
              autoComplete: field.autoComplete,
              placeholder: field.placeholder?.[locale],
              onChange: (event: { target: { value: string } }) => setAnswers((prev) => ({ ...prev, [field.name]: event.target.value })),
            };
            return (
              <div key={field.name}>
                <label htmlFor={common.id} className="text-foreground/70 text-sm font-medium">
                  {field.label[locale]}
                  {field.required ? " *" : ""}
                </label>
                {field.type === "textarea" ? (
                  <textarea {...common} rows={3} className={`${inputClass} resize-none text-lg sm:text-xl`} />
                ) : (
                  <input {...common} type={field.type === "url" ? "text" : field.type ?? "text"} inputMode={field.type === "url" ? "url" : undefined} className={inputClass} />
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      {step.kind === "single" || step.kind === "multi" ? (
        <ul role={step.kind === "multi" ? "group" : "radiogroup"} aria-labelledby="quote-question" className="mt-8 grid gap-2.5 sm:grid-cols-2">
          {step.options.map((option, optionIndex) => {
            const value = answers[step.id];
            const selected = Array.isArray(value) ? value.includes(option.value) : value === option.value;
            return (
              <li key={option.value} role="none">
                <button
                  type="button"
                  role={step.kind === "multi" ? "checkbox" : "radio"}
                  aria-checked={selected}
                  onClick={() => choose(step, option.value)}
                  className={`focus-ring group flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-[15px] transition-colors ${
                    selected ? "border-foreground bg-foreground text-background" : "border-foreground/12 bg-background text-foreground hover:border-foreground/40"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${
                      selected ? "border-background/30 bg-background/15" : "border-foreground/15 text-foreground/60"
                    }`}
                  >
                    {selected ? <Check className="h-3.5 w-3.5" /> : LETTERS[optionIndex]}
                  </span>
                  {option.label[locale]}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function EstimateView({ answers }: { answers: QuoteAnswers }): ReactNode {
  const { locale } = useLanguage();
  const copy = quoteCopy[locale];
  const estimate = estimateQuote(answers);

  if (estimate.kind === "custom") {
    return (
      <div className="border-foreground/10 bg-background mt-8 rounded-3xl border p-6 sm:p-8">
        <p className="text-foreground text-[3rem] leading-none font-medium tracking-tight sm:text-[4rem]">{copy.estimateCustom}</p>
        <p className="text-foreground/65 mt-4 max-w-[48ch] leading-relaxed">
          {estimate.reason === "maintenance" ? copy.estimateCustomMaintenance : estimate.reason === "software" ? copy.estimateCustomSoftware : copy.estimateCustomScope}
        </p>
      </div>
    );
  }

  const surcharge = Math.round((estimate.factor - 1) * 100);
  const discount = discountFromCode(readCode());
  const discounted = discount > 0 ? Math.round((estimate.amount * (100 - discount)) / 100) : estimate.amount;

  return (
    <div className="border-foreground/10 bg-background mt-8 rounded-3xl border p-6 sm:p-8">
      <p className="text-foreground/55 text-sm">{copy.estimateFrom}</p>
      {discount > 0 ? (
        <p className="mt-1 flex flex-wrap items-center gap-3">
          <span className="text-foreground/45 text-2xl line-through tabular-nums">{formatPrice(estimate.amount, locale)}</span>
          <span className="stamp text-base">−{discount} % · {readCode().toUpperCase()}</span>
        </p>
      ) : null}
      <p className="text-foreground mt-1 text-[3.5rem] leading-none font-medium tracking-tight tabular-nums sm:text-[4.5rem]">
        {formatPrice(discounted, locale)}
      </p>
      <details className="group mt-6">
        <summary className="focus-ring text-foreground/70 hover:text-foreground cursor-pointer rounded text-sm font-medium">{copy.estimateBreakdown}</summary>
        <ul className="border-foreground/10 mt-3 border-t text-sm">
          {estimate.lines.map((line) => (
            <li key={line.label.fr} className="border-foreground/10 text-foreground/75 flex justify-between gap-4 border-b py-2.5">
              <span>{line.label[locale]}</span>
              <span className="tabular-nums">{formatPrice(line.amount, locale)}</span>
            </li>
          ))}
          {surcharge > 0 ? (
            <li className="border-foreground/10 text-foreground/75 flex justify-between gap-4 border-b py-2.5">
              <span>{copy.estimateDeadline(surcharge)}</span>
              <span className="tabular-nums">×{estimate.factor.toLocaleString(locale)}</span>
            </li>
          ) : null}
        </ul>
      </details>
      <p className="text-foreground/50 mt-5 text-xs leading-relaxed">{copy.estimateNote}</p>
    </div>
  );
}
