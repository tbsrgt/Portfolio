import { emailPattern, getField, readJson, sendMail } from "@/lib/mailer";

const allowedServices = new Set(["redesign", "showcase", "landing", "maintenance"]);

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (body instanceof Response) return body;
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

  const text = [
    `Nom : ${name}`,
    `E-mail : ${email}`,
    `Entreprise : ${company}`,
    `Site actuel : ${website || "Non renseigné"}`,
    `Besoin : ${service}`,
    "",
    message,
  ].join("\n");

  return sendMail({ subject: `Nouvelle demande de site — ${company}`, text, replyTo: email });
}
