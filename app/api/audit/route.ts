import { AuditError, runAudit } from "@/lib/audit";
import { readJson } from "@/lib/mailer";

export const maxDuration = 60;

/** Very small per-instance throttle: a few audits per visitor every 10 minutes. */
const recent = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;

function allow(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (hits.length >= LIMIT) return false;
  hits.push(now);
  recent.set(ip, hits);
  return true;
}

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (body instanceof Response) return body;
  if (typeof body.url !== "string") return Response.json({ error: "invalid" }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allow(ip)) return Response.json({ error: "busy" }, { status: 429 });

  try {
    const result = await runAudit(body.url);
    return Response.json(result);
  } catch (error) {
    const code = error instanceof AuditError ? error.code : "unreachable";
    const status = code === "invalid" || code === "blocked" ? 400 : code === "busy" ? 429 : 502;
    return Response.json({ error: code }, { status });
  }
}
