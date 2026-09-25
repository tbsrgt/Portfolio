import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/** One remark written in red pen on the visitor's site. */
export type FindingCode =
  | "slow"
  | "perf"
  | "layoutShift"
  | "noViewport"
  | "smallFonts"
  | "noHttps"
  | "noTitle"
  | "noDescription"
  | "seo"
  | "images"
  | "noPhone"
  | "noContact"
  | "oldYear";

export type Finding = { code: FindingCode; value?: string };

export type Verdict = "redo" | "refresh" | "good";

export type AuditResult = {
  url: string;
  host: string;
  screenshot: string | null;
  scores: { performance: number | null; seo: number | null; accessibility: number | null };
  lcp: number | null;
  findings: Finding[];
  verdict: Verdict;
};

export class AuditError extends Error {
  constructor(public code: "invalid" | "blocked" | "unreachable" | "busy") {
    super(code);
  }
}

/* ---------------- URL safety ---------------- */

function isPrivateAddress(address: string): boolean {
  if (address === "::1" || address.startsWith("fe80:") || address.startsWith("fc") || address.startsWith("fd")) return true;
  const v4 = address.startsWith("::ffff:") ? address.slice(7) : address;
  const parts = v4.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
  const [a = 0, b = 0] = parts;
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}

/** Normalises what the visitor typed and refuses anything that is not a public website. */
export async function normaliseUrl(input: string): Promise<URL> {
  const raw = input.trim();
  if (!raw || raw.length > 300) throw new AuditError("invalid");
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    throw new AuditError("invalid");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new AuditError("invalid");
  if (url.username || url.password || url.port) throw new AuditError("invalid");
  const host = url.hostname.toLowerCase();
  if (!host.includes(".") || host.endsWith(".local") || host.endsWith(".internal") || host === "localhost") throw new AuditError("invalid");
  if (isIP(host)) throw new AuditError("invalid");
  try {
    const addresses = await lookup(host, { all: true });
    if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) throw new AuditError("blocked");
  } catch (error) {
    if (error instanceof AuditError) throw error;
    throw new AuditError("unreachable");
  }
  url.hash = "";
  return url;
}

/* ---------------- HTML checks (contact, phone, year) ---------------- */

async function fetchHtml(url: URL): Promise<string | null> {
  let current = url;
  for (let hop = 0; hop < 4; hop += 1) {
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TobiasRingotAudit/1.0; +https://tobiasringot.vercel.app)", Accept: "text/html" },
      cache: "no-store",
    }).catch(() => null);
    if (!response) return null;
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return null;
      current = await normaliseUrl(new URL(location, current).toString());
      continue;
    }
    if (!response.ok || !(response.headers.get("content-type") ?? "").includes("html")) return null;
    const text = await response.text();
    return text.slice(0, 1_500_000);
  }
  return null;
}

/* ---------------- PageSpeed Insights ---------------- */

type Lighthouse = {
  categories?: Record<string, { score: number | null } | undefined>;
  audits?: Record<string, { score: number | null; numericValue?: number; details?: { data?: string } } | undefined>;
};

async function pageSpeed(url: URL): Promise<Lighthouse | null> {
  const params = new URLSearchParams({ url: url.toString(), strategy: "mobile" });
  for (const category of ["performance", "seo", "accessibility", "best-practices"]) params.append("category", category);
  const key = process.env.PAGESPEED_API_KEY;
  if (key) params.set("key", key);
  const response = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`, {
    signal: AbortSignal.timeout(55000),
    cache: "no-store",
  }).catch(() => null);
  if (!response) return null;
  if (!response.ok) return null;
  const json = (await response.json()) as { lighthouseResult?: Lighthouse };
  return json.lighthouseResult ?? null;
}

/** Mobile screenshot when PageSpeed is unavailable (Microlink free tier). */
async function microlinkScreenshot(url: URL): Promise<string | null> {
  const params = new URLSearchParams({
    url: url.toString(),
    screenshot: "true",
    meta: "false",
    "viewport.width": "390",
    "viewport.height": "844",
    "viewport.isMobile": "true",
    "viewport.deviceScaleFactor": "1",
  });
  const response = await fetch(`https://api.microlink.io/?${params.toString()}`, { signal: AbortSignal.timeout(25000), cache: "no-store" }).catch(() => null);
  if (!response?.ok) return null;
  const json = (await response.json().catch(() => null)) as { data?: { screenshot?: { url?: string } } } | null;
  return json?.data?.screenshot?.url ?? null;
}

const pct = (score: number | null | undefined): number | null => (typeof score === "number" ? Math.round(score * 100) : null);

/** Looks at a website the way a prospect would, and lists what I would fix. */
export async function runAudit(input: string): Promise<AuditResult> {
  const url = await normaliseUrl(input);
  const started = Date.now();
  const [lighthouse, page] = await Promise.all([
    pageSpeed(url),
    fetchHtml(url).then((html) => ({ html, ms: Date.now() - started })),
  ]);
  const html = page.html;
  if (!lighthouse && !html) throw new AuditError("unreachable");

  const audits = lighthouse?.audits ?? {};
  const failed = (id: string): boolean => audits[id]?.score === 0;
  const lower = html?.toLowerCase() ?? "";
  const scores = {
    performance: pct(lighthouse?.categories?.performance?.score),
    seo: pct(lighthouse?.categories?.seo?.score),
    accessibility: pct(lighthouse?.categories?.accessibility?.score),
  };
  const lcpMs = audits["largest-contentful-paint"]?.numericValue;
  const lcp = typeof lcpMs === "number" ? Math.round(lcpMs / 100) / 10 : null;
  const cls = audits["cumulative-layout-shift"]?.numericValue;

  const findings: Finding[] = [];
  if (lighthouse) {
    if (lcp !== null && lcp > 2.5) findings.push({ code: "slow", value: lcp.toLocaleString("fr-FR") });
    else if (scores.performance !== null && scores.performance < 50) findings.push({ code: "perf", value: String(scores.performance) });
    if (typeof cls === "number" && cls > 0.25) findings.push({ code: "layoutShift" });
    if (failed("viewport")) findings.push({ code: "noViewport" });
    if (failed("font-size")) findings.push({ code: "smallFonts" });
  } else if (html) {
    // Without PageSpeed: rough checks straight from the page source.
    const seconds = Math.round(page.ms / 100) / 10;
    if (seconds > 2.5) findings.push({ code: "slow", value: seconds.toLocaleString("fr-FR") });
    if (!/<meta[^>]+name=["']?viewport/i.test(html)) findings.push({ code: "noViewport" });
  }
  if (url.protocol === "http:" || failed("is-on-https")) findings.push({ code: "noHttps" });
  const hasTitle = lighthouse ? !failed("document-title") : /<title[^>]*>\s*[^<\s][^<]{2,}/i.test(html ?? "");
  const hasDescription = lighthouse ? !failed("meta-description") : /<meta[^>]+name=["']?description["']?[^>]+content=["'][^"']{10,}/i.test(html ?? "");
  if (!hasTitle) findings.push({ code: "noTitle" });
  if (!hasDescription) findings.push({ code: "noDescription" });
  else if (scores.seo !== null && scores.seo < 80) findings.push({ code: "seo", value: String(scores.seo) });
  const imageAudit = audits["modern-image-formats"]?.score ?? audits["uses-optimized-images"]?.score;
  if (typeof imageAudit === "number" && imageAudit < 0.5) findings.push({ code: "images" });

  if (html) {
    if (!lower.includes("tel:")) findings.push({ code: "noPhone" });
    const contactLink = /href=["'][^"']*(contact|devis|rendez-vous|reservation|booking)/i.test(html);
    if (!lower.includes("<form") && !lower.includes("mailto:") && !contactLink) findings.push({ code: "noContact" });
    const years = [...html.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?((?:19|20)\d{2})/gi)].map((m) => Number(m[1]));
    const latest = years.length ? Math.max(...years) : null;
    if (latest !== null && latest <= new Date().getFullYear() - 2) findings.push({ code: "oldYear", value: String(latest) });
  }

  const heavy = findings.filter((f) => ["slow", "perf", "noViewport", "smallFonts", "noHttps"].includes(f.code)).length;
  const verdict: Verdict = heavy >= 2 || findings.length >= 5 ? "redo" : findings.length >= 2 ? "refresh" : "good";
  const screenshot = audits["final-screenshot"]?.details?.data ?? (await microlinkScreenshot(url));

  return {
    url: url.toString(),
    host: url.hostname.replace(/^www\./, ""),
    screenshot,
    scores,
    lcp,
    findings: findings.slice(0, 7),
    verdict,
  };
}
