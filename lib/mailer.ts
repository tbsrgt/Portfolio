import { site } from "@/lib/site";

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getField(value: unknown, maxLength: number): string | null {
  if (value === undefined) return "";
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length <= maxLength ? trimmed : null;
}

export async function readJson(request: Request): Promise<Record<string, unknown> | Response> {
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return Response.json({ error: "Invalid content type" }, { status: 415 });
  }
  try {
    const raw = await request.text();
    if (raw.length > 12000) return Response.json({ error: "Payload too large" }, { status: 413 });
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ error: "Invalid fields" }, { status: 400 });
    }
    return body as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

/** Sends a plain-text email to the site owner through Resend. */
export async function sendMail({ subject, text, replyTo }: { subject: string; text: string; replyTo: string }): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return Response.json({ error: "Email service not configured" }, { status: 503 });
  }

  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "tobias-portfolio/1.0",
      },
      body: JSON.stringify({ from, to: [site.email], reply_to: replyTo, subject, text }),
      cache: "no-store",
    });
    if (!result.ok) return Response.json({ error: "Email delivery failed" }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Email service unavailable" }, { status: 502 });
  }
}
