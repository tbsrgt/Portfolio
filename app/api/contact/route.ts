const recipient = "tobiasringot13@gmail.com";
const allowedServices = new Set(["redesign", "showcase", "landing", "maintenance"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  website?: unknown;
  service?: unknown;
  message?: unknown;
  website_check?: unknown;
};

function getField(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length <= maxLength ? trimmed : null;
}

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json({ error: "Invalid content type" }, { status: 415 });
  }

  let body: ContactPayload;
  try {
    const raw = await request.text();
    if (raw.length > 10000) return Response.json({ error: "Payload too large" }, { status: 413 });
    body = JSON.parse(raw) as ContactPayload;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid fields" }, { status: 400 });
  }

  if (body.website_check) return Response.json({ ok: true });

  const name = getField(body.name, 100);
  const email = getField(body.email, 254);
  const company = getField(body.company, 120);
  const website = getField(body.website, 300);
  const service = getField(body.service, 30);
  const message = getField(body.message, 3000);

  if (!name || !email || !emailPattern.test(email) || !company || website === null || !service || !allowedServices.has(service) || !message || message.length < 10) {
    return Response.json({ error: "Invalid fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return Response.json({ error: "Email service not configured" }, { status: 503 });
  }

  const text = [
    `Nom : ${name}`,
    `E-mail : ${email}`,
    `Entreprise : ${company}`,
    `Site actuel : ${website || "Non renseigné"}`,
    `Besoin : ${service}`,
    "",
    message,
  ].join("\n");

  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "tobias-portfolio/1.0",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `Nouvelle demande de site — ${company}`,
        text,
      }),
      cache: "no-store",
    });
    if (!result.ok) return Response.json({ error: "Email delivery failed" }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Email service unavailable" }, { status: 502 });
  }
}
