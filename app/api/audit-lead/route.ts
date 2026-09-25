import { emailPattern, getField, readJson, sendMail } from "@/lib/mailer";

/** A visitor who ran the audit asks for the detailed version: that's a lead. */
export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (body instanceof Response) return body;
  if (body.website_check) return Response.json({ ok: true });

  const name = getField(body.name, 100);
  const email = getField(body.email, 254);
  const url = getField(body.url, 300);
  const summary = getField(body.summary, 3000);
  if (!name || !email || !emailPattern.test(email) || !url || summary === null) {
    return Response.json({ error: "Invalid fields" }, { status: 400 });
  }

  const text = [
    "Nouvelle demande d'audit détaillé",
    "",
    `Nom : ${name}`,
    `E-mail : ${email}`,
    `Site analysé : ${url}`,
    "",
    "Ce que l'audit automatique a relevé :",
    summary || "(rien de bloquant)",
  ].join("\n");

  return sendMail({ subject: `Audit de site — ${url}`, text, replyTo: email });
}
