import { emailPattern, getField, readJson, sendMail } from "@/lib/mailer";
import { callbackSlots } from "@/lib/sales-copy";
import { site } from "@/lib/site";

const phonePattern = /^[+\d][\d\s.()-]{7,19}$/;
const allowedSlots = new Set<string>(callbackSlots);

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (body instanceof Response) return body;
  if (body.website_check) return Response.json({ ok: true });

  const name = getField(body.name, 100);
  const phone = getField(body.phone, 20);
  const slot = getField(body.slot, 20);
  const email = getField(body.email, 254);
  const topic = getField(body.topic, 300);

  if (
    !name ||
    !phone ||
    !phonePattern.test(phone) ||
    !slot ||
    !allowedSlots.has(slot) ||
    email === null ||
    (email && !emailPattern.test(email)) ||
    topic === null
  ) {
    return Response.json({ error: "Invalid fields" }, { status: 400 });
  }

  const text = [
    "Demande de rappel",
    "",
    `Nom : ${name}`,
    `Téléphone : ${phone}`,
    `Moment préféré : ${slot}`,
    `E-mail : ${email || "Non renseigné"}`,
    `Sujet : ${topic || "Non précisé"}`,
  ].join("\n");

  return sendMail({
    subject: `À rappeler — ${name} (${phone})`,
    text,
    replyTo: email || site.email,
  });
}
