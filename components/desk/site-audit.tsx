"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { ArrowRight } from "@/components/ui/pixel-icon";
import type { AuditResult, Finding, Verdict } from "@/lib/audit";
import { useLanguage, type Locale } from "@/lib/i18n";

const COPY = {
  fr: {
    label: "Audit gratuit",
    title: "Posez votre site sur mon bureau.",
    lead: "Tapez l'adresse de votre site actuel. Je l'imprime, je sors le stylo rouge, et vous voyez tout de suite ce qui fait fuir vos clients.",
    placeholder: "votre-site.fr",
    submit: "Poser sur le bureau",
    note: "Gratuit, sans inscription. Environ 30 secondes.",
    loading: ["J'imprime votre site…", "Je le teste sur un téléphone…", "Je chronomètre le chargement…", "Je regarde ce que voit Google…", "Je sors le stylo rouge…"],
    verdict: { redo: "À refaire", refresh: "À rafraîchir", good: "Plutôt bien" } satisfies Record<Verdict, string>,
    findingsTitle: "Mes annotations",
    none: "Rien de bloquant : votre site tient la route. Je peux vous aider à le garder en forme.",
    scores: { performance: "Vitesse", seo: "Google", accessibility: "Lisibilité" },
    suggestion: {
      redo: { title: "Ce que je vous proposerais", offer: "Refonte de site", price: "dès 1 800 € HT", text: "Nouveau design, rapide et pensé pour le téléphone, avec vos contenus réorganisés." },
      refresh: { title: "Ce que je vous proposerais", offer: "Remise en forme ciblée", price: "sur devis", text: "On corrige les points ci-contre sans tout refaire : vitesse, mobile, contact et Google." },
      good: { title: "Ce que je vous proposerais", offer: "Hébergement & maintenance", price: "dès 49 €/mois", text: "Mises à jour, sauvegardes et petites évolutions pour que ça dure." },
    } satisfies Record<Verdict, { title: string; offer: string; price: string; text: string }>,
    estimate: "Estimer le prix exact",
    leadTitle: "Recevoir l'audit détaillé",
    leadText: "Je regarde votre site moi-même et je vous envoie mes recommandations par e-mail, gratuitement, sous 48 h.",
    name: "Votre nom",
    email: "Votre e-mail",
    send: "Recevoir l'audit",
    sending: "Envoi…",
    sent: "C'est noté ! Vous recevez mon audit sous 48 h.",
    sendError: "L'envoi n'a pas abouti. Écrivez-moi directement à l'adresse en bas de page.",
    again: "Tester un autre site",
    errors: {
      invalid: "Cette adresse ne ressemble pas à un site web. Essayez par exemple « mon-entreprise.fr ».",
      blocked: "Je ne peux pas analyser cette adresse.",
      unreachable: "Je n'ai pas réussi à ouvrir ce site. Il est peut-être hors ligne ou bloque les robots.",
      busy: "Beaucoup de demandes en ce moment : réessayez dans quelques minutes.",
    } as Record<string, string>,
  },
  en: {
    label: "Free audit",
    title: "Put your website on my desk.",
    lead: "Type your current website address. I print it, grab my red pen, and you see right away what's driving your clients away.",
    placeholder: "your-website.com",
    submit: "Put it on the desk",
    note: "Free, no sign-up. About 30 seconds.",
    loading: ["Printing your website…", "Testing it on a phone…", "Timing how fast it loads…", "Checking what Google sees…", "Grabbing my red pen…"],
    verdict: { redo: "Needs a redo", refresh: "Needs a refresh", good: "Pretty good" } satisfies Record<Verdict, string>,
    findingsTitle: "My notes",
    none: "Nothing blocking: your website holds up. I can help keep it in shape.",
    scores: { performance: "Speed", seo: "Google", accessibility: "Readability" },
    suggestion: {
      redo: { title: "What I would suggest", offer: "Website redesign", price: "from €1,800", text: "A new design, fast and built for phones, with your content reorganised." },
      refresh: { title: "What I would suggest", offer: "Targeted tune-up", price: "on quote", text: "We fix the points listed without redoing everything: speed, mobile, contact and Google." },
      good: { title: "What I would suggest", offer: "Hosting & maintenance", price: "from €49/month", text: "Updates, backups and small improvements so it lasts." },
    } satisfies Record<Verdict, { title: string; offer: string; price: string; text: string }>,
    estimate: "Get an exact price",
    leadTitle: "Get the detailed audit",
    leadText: "I'll look at your website myself and email you my recommendations, free, within 48 hours.",
    name: "Your name",
    email: "Your email",
    send: "Get the audit",
    sending: "Sending…",
    sent: "Got it! You'll get my audit within 48 hours.",
    sendError: "Sending failed. Email me directly at the address at the bottom of the page.",
    again: "Try another website",
    errors: {
      invalid: "That doesn't look like a website address. Try something like “my-company.com”.",
      blocked: "I can't analyse that address.",
      unreachable: "I couldn't open this website. It may be offline or blocking robots.",
      busy: "Lots of requests right now: try again in a few minutes.",
    } as Record<string, string>,
  },
} as const;

function findingText(finding: Finding, locale: Locale): string {
  const v = finding.value ?? "";
  const fr: Record<Finding["code"], string> = {
    slow: `${v} s avant que la page s'affiche sur mobile. Au-delà de 3 s, la moitié des visiteurs repartent.`,
    perf: `Note de vitesse ${v}/100 sur mobile : le site rame.`,
    layoutShift: "La page saute pendant le chargement : on clique à côté.",
    noViewport: "Pas adapté au téléphone : il faut zoomer pour lire.",
    smallFonts: "Textes trop petits sur mobile.",
    noHttps: "Pas de cadenas (HTTPS) : le navigateur affiche « non sécurisé ».",
    noTitle: "Pas de titre de page : Google ne sait pas qui vous êtes.",
    noDescription: "Pas de description pour Google : votre résultat de recherche est vide.",
    seo: `Note Google ${v}/100 : vous êtes mal référencé.`,
    images: "Images trop lourdes : c'est ce qui ralentit le plus.",
    noPhone: "Pas de numéro cliquable : sur mobile, on ne peut pas vous appeler en un geste.",
    noContact: "Pas de formulaire ni d'e-mail visible : comment vous contacter ?",
    oldYear: `Le pied de page affiche © ${v} : le site a l'air abandonné.`,
  };
  const en: Record<Finding["code"], string> = {
    slow: `${v} s before the page shows on mobile. Past 3 s, half of visitors leave.`,
    perf: `Speed score ${v}/100 on mobile: the site is sluggish.`,
    layoutShift: "The page jumps while loading: people click the wrong thing.",
    noViewport: "Not made for phones: people have to zoom to read.",
    smallFonts: "Text too small on mobile.",
    noHttps: "No padlock (HTTPS): the browser shows “not secure”.",
    noTitle: "No page title: Google doesn't know who you are.",
    noDescription: "No description for Google: your search result is empty.",
    seo: `Google score ${v}/100: you're poorly ranked.`,
    images: "Images too heavy: the main thing slowing it down.",
    noPhone: "No tap-to-call number: mobile visitors can't call you in one tap.",
    noContact: "No form or visible email: how do people reach you?",
    oldYear: `The footer says © ${v}: the site looks abandoned.`,
  };
  return (locale === "fr" ? fr : en)[finding.code];
}

function summaryText(result: AuditResult): string {
  return result.findings.map((f) => `- ${findingText(f, "fr")}`).join("\n");
}

type State = { kind: "idle" } | { kind: "loading" } | { kind: "error"; code: string } | { kind: "done"; result: AuditResult };

/** "Put your website on my desk": a free, instant audit that turns into a lead. */
export function SiteAudit(): ReactNode {
  const { locale } = useLanguage();
  const t = COPY[locale];
  const [state, setState] = useState<State>({ kind: "idle" });
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.kind !== "loading") return;
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, t.loading.length - 1)), 5500);
    return () => window.clearInterval(id);
  }, [state.kind, t.loading.length]);

  useEffect(() => {
    if (state.kind === "done") resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state.kind]);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!input.trim()) return;
    setStep(0);
    setState({ kind: "loading" });
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input }),
        signal: AbortSignal.timeout(75000),
      });
      const json = (await response.json()) as AuditResult | { error: string };
      if (!response.ok || "error" in json) setState({ kind: "error", code: "error" in json ? json.error : "unreachable" });
      else setState({ kind: "done", result: json });
    } catch {
      setState({ kind: "error", code: "unreachable" });
    }
  }

  return (
    <section id="audit" aria-labelledby="audit-heading" className="container-x scroll-mt-20 py-12 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-14">
        <FadeIn>
          <span className="dymo dymo-red">{t.label}</span>
          <h2 id="audit-heading" className="display mt-5 text-5xl sm:text-7xl">
            {t.title}
          </h2>
          <p className="text-paper/75 mt-5 max-w-[46ch] text-lg leading-relaxed">{t.lead}</p>
        </FadeIn>
        <FadeIn>
          <form onSubmit={submit} className="sheet on-paper p-4 sm:p-6">
            <label htmlFor="audit-url" className="typed text-ink/60">
              {locale === "fr" ? "Adresse de votre site" : "Your website address"}
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="audit-url"
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                disabled={state.kind === "loading"}
                className="focus-ring border-ink/20 bg-paper min-h-12 flex-1 border-2 px-4 font-mono text-base outline-none"
                required
              />
              <button type="submit" disabled={state.kind === "loading"} className="btn btn-stamp shrink-0 disabled:opacity-60">
                {t.submit}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <p className="text-ink/55 mt-3 text-sm">{t.note}</p>
            <AnimatePresence mode="wait">
              {state.kind === "loading" ? (
                <motion.p key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="hand pen mt-3 text-2xl" role="status">
                  {t.loading[step]}
                </motion.p>
              ) : state.kind === "error" ? (
                <motion.p key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-stamp mt-3 text-sm font-medium" role="alert">
                  {t.errors[state.code] ?? t.errors.unreachable}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </form>
        </FadeIn>
      </div>

      <AnimatePresence>
        {state.kind === "done" ? (
          <motion.div ref={resultRef} key={state.result.url} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 160, damping: 22 }} className="mt-10 scroll-mt-24 sm:mt-14">
            <AuditSheet result={state.result} locale={locale} onReset={() => setState({ kind: "idle" })} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function AuditSheet({ result, locale, onReset }: { result: AuditResult; locale: Locale; onReset: () => void }): ReactNode {
  const t = COPY[locale];
  const suggestion = t.suggestion[result.verdict];
  const scores = [
    { label: t.scores.performance, value: result.scores.performance },
    { label: t.scores.seo, value: result.scores.seo },
    { label: t.scores.accessibility, value: result.scores.accessibility },
  ].filter((s) => s.value !== null);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
      {/* The printed page */}
      <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[340px]">
        <div className="sheet on-paper -rotate-2 p-3">
          <p className="typed text-ink/50 mb-2 truncate text-[10px]">{result.host}</p>
          {result.screenshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.screenshot} alt={locale === "fr" ? `Capture mobile de ${result.host}` : `Mobile screenshot of ${result.host}`} className="w-full border border-black/10" />
          ) : (
            <div className="bg-paper-2 text-ink/50 flex aspect-[9/16] items-center justify-center p-6 text-center text-sm">{result.host}</div>
          )}
        </div>
        <motion.span
          initial={{ scale: 2.6, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: -12 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 420, damping: 14 }}
          className="stamp absolute top-1/3 left-1/2 -translate-x-1/2 bg-[rgb(255_255_255/0.6)] text-2xl whitespace-nowrap sm:text-3xl"
          style={result.verdict === "good" ? { color: "#1b8a4a", borderColor: "#1b8a4a" } : {}}
        >
          {t.verdict[result.verdict]}
        </motion.span>
      </div>

      {/* Red-pen notes + offer + lead form */}
      <div className="sheet sheet-lined on-paper p-6 sm:p-9">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="display-md text-3xl">{t.findingsTitle}</h3>
          {scores.length ? (
            <p className="typed text-ink/60 flex flex-wrap gap-x-4 gap-y-1">
              {scores.map((s) => (
                <span key={s.label}>
                  {s.label} <strong className={(s.value ?? 0) < 50 ? "text-stamp" : (s.value ?? 0) < 90 ? "text-ink" : "text-[#1b8a4a]"}>{s.value}/100</strong>
                </span>
              ))}
            </p>
          ) : null}
        </div>
        {result.findings.length ? (
          <ol className="mt-4 flex flex-col">
            {result.findings.map((finding, index) => (
              <motion.li key={finding.code} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + index * 0.18 }} className="hand text-stamp flex gap-3 text-[1.45rem] leading-8">
                <span className="border-stamp mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 font-sans text-xs font-bold">{index + 1}</span>
                {findingText(finding, locale)}
              </motion.li>
            ))}
          </ol>
        ) : (
          <p className="hand pen mt-4 text-[1.45rem] leading-8">{t.none}</p>
        )}

        <div className="mt-6 border-t-2 border-dashed border-black/20 pt-5">
          <p className="typed text-ink/55">{suggestion.title}</p>
          <div className="mt-2 flex items-baseline">
            <span className="font-display text-xl font-bold">{suggestion.offer}</span>
            <span className="leader" />
            <span className="font-mono text-sm">{suggestion.price}</span>
          </div>
          <p className="text-ink/65 mt-1 text-sm">{suggestion.text}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/devis" className="btn btn-ink h-11 text-sm">
              {t.estimate}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button type="button" onClick={onReset} className="btn btn-outline h-11 text-sm">
              {t.again}
            </button>
          </div>
        </div>

        <LeadForm result={result} locale={locale} />
      </div>
    </div>
  );
}

function LeadForm({ result, locale }: { result: AuditResult; locale: Locale }): ReactNode {
  const t = COPY[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const honeypot = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch("/api/audit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), email: data.get("email"), url: result.url, summary: summaryText(result), website_check: honeypot.current?.value ?? "" }),
      });
      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") return <p className="stamp mt-6 text-base" style={{ transform: "rotate(-2deg)" }}>{t.sent}</p>;

  return (
    <form onSubmit={submit} className="bg-postit/60 mt-6 p-4 sm:p-5">
      <p className="font-display text-lg font-bold">{t.leadTitle}</p>
      <p className="text-ink/70 mt-1 text-sm">{t.leadText}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input name="name" required maxLength={100} placeholder={t.name} aria-label={t.name} className="focus-ring border-ink/20 bg-paper min-h-11 flex-1 border-2 px-3 text-sm outline-none" />
        <input name="email" type="email" required maxLength={254} placeholder={t.email} aria-label={t.email} className="focus-ring border-ink/20 bg-paper min-h-11 flex-1 border-2 px-3 text-sm outline-none" />
        <input ref={honeypot} name="website_check" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={status === "sending"} className="btn btn-stamp h-11 shrink-0 text-sm disabled:opacity-60">
          {status === "sending" ? t.sending : t.send}
        </button>
      </div>
      {status === "error" ? <p className="text-stamp mt-2 text-sm" role="alert">{t.sendError}</p> : null}
    </form>
  );
}
