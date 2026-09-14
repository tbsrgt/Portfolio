"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";
import { salesCopy } from "@/lib/sales-copy";

type SubmitState = "idle" | "sending" | "success" | "error";

export function ContactForm(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];
  const [status, setStatus] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (!response.ok) throw new Error("Email delivery failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputClass = "focus-ring border-foreground/15 bg-background text-foreground placeholder:text-foreground/35 mt-2 min-h-11 w-full rounded-xl border px-4 py-3 text-sm outline-none";
  const labelClass = "text-foreground text-sm font-medium";

  return (
    <form onSubmit={handleSubmit} onChange={() => { if (status !== "idle" && status !== "sending") setStatus("idle"); }} className="border-foreground/8 bg-background flex flex-col gap-5 rounded-[1.25rem] border p-5 sm:p-7">
      <h3 className="text-foreground text-xl font-medium tracking-tight">{copy.formHeading}</h3>
      <p className="text-foreground/60 -mt-2 text-sm leading-relaxed">{copy.formDescription}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className={labelClass}>
          {copy.formName} *
          <input className={inputClass} name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label className={labelClass}>
          {copy.formEmail} *
          <input className={inputClass} name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className={labelClass}>
          {copy.formCompany} *
          <input className={inputClass} name="company" autoComplete="organization" required maxLength={120} />
        </label>
        <label className={labelClass}>
          {copy.formWebsite}
          <input className={inputClass} name="website" inputMode="url" maxLength={300} placeholder="https://" />
        </label>
      </div>

      <label className={labelClass}>
        {copy.formService} *
        <select className={inputClass} name="service" required defaultValue="">
          <option value="" disabled>{copy.formServicePlaceholder}</option>
          {copy.services.map((service, index) => (
            <option key={service.title} value={["redesign", "showcase", "landing", "maintenance"][index]}>{service.title}</option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        {copy.formMessage} *
        <textarea className={`${inputClass} min-h-32 resize-y`} name="message" required minLength={10} maxLength={3000} />
      </label>

      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>Ne pas remplir <input name="website_check" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <p className="text-foreground/50 text-xs leading-relaxed">{copy.formPrivacy}</p>
      <button type="submit" disabled={status === "sending"} className="focus-ring bg-foreground text-background min-h-12 cursor-pointer rounded-xl px-5 py-3 text-sm font-medium transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-50">
        {status === "sending" ? copy.formSending : copy.formSend}
      </button>

      {status === "success" ? <p role="status" className="text-foreground text-sm">{copy.formSuccess}</p> : null}
      {status === "error" ? (
        <div role="alert" className="text-foreground text-sm">
          <p>{copy.formError}</p>
          <a className="focus-ring mt-2 inline-block rounded underline underline-offset-4" href="mailto:tobiasringot13@gmail.com">{copy.directEmail}</a>
        </div>
      ) : null}
    </form>
  );
}
