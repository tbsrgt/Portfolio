import { discountFromCode } from "@/lib/game";
import { emailPattern, getField, readJson, sendMail } from "@/lib/mailer";
import { estimateQuote, formatPrice, visibleSteps, type QuoteAnswers } from "@/lib/quote";

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (body instanceof Response) return body;
  if (body.website_check) return Response.json({ ok: true });

  const answers: QuoteAnswers = {};
  const lines: string[] = [];
  const invalid = () => Response.json({ error: "Invalid fields" }, { status: 400 });

  // The first answer decides which steps apply, so read it before listing them.
  if (typeof body.need === "string") answers.need = body.need;

  for (const step of visibleSteps(answers)) {
    if (step.kind === "estimate") continue;
    if (step.kind === "fields") {
      for (const field of step.fields) {
        const value = getField(body[field.name], field.maxLength);
        if (value === null || (field.required && !value)) return invalid();
        if (field.type === "email" && !emailPattern.test(value)) return invalid();
        answers[field.name] = value;
        lines.push(`${field.label.fr} : ${value || "—"}`);
      }
      continue;
    }

    const raw = body[step.id];
    const values = step.kind === "multi" ? raw : [raw];
    if (!Array.isArray(values) || values.length === 0 || values.length > step.options.length) return invalid();
    const labels = values.map((value) => step.options.find((option) => option.value === value)?.label.fr);
    if (labels.some((label) => !label)) return invalid();
    answers[step.id] = step.kind === "multi" ? (values as string[]) : (values[0] as string);
    lines.push(`${step.question.fr}\n  → ${labels.join("\n  → ")}`);
  }

  const estimate = estimateQuote(answers);
  const code = typeof body.code === "string" ? body.code.trim().toUpperCase().slice(0, 20) : "";
  const discount = discountFromCode(code);
  const shown = estimate.kind === "price" ? Math.round((estimate.amount * (100 - discount)) / 100) : null;
  const estimateLine = shown !== null ? formatPrice(shown, "fr") : "Sur devis";
  const text = ["Nouvelle demande de devis", `Estimation affichée : ${estimateLine}`, discount > 0 ? `Remise tournée : −${discount} % (code ${code})` : "", "", ...lines].join("\n");

  return sendMail({
    subject: `Demande de devis (${estimateLine}) — ${answers.company as string}`,
    text,
    replyTo: answers.email as string,
  });
}
