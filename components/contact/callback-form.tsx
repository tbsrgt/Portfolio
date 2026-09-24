"use client";

import { PhoneCall } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { useLanguage } from "@/lib/i18n";
import { callbackSlots, salesCopy } from "@/lib/sales-copy";

type SubmitState = "idle" | "sending" | "success" | "error";

export function CallbackForm(): ReactNode {
  const { locale } = useLanguage();
  const copy = salesCopy[locale];
  const [status, setStatus] = useState<SubmitState>("idle");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    try {
      const response = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!response.ok) throw new Error("Callback request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "focus-ring border-foreground/15 bg-background text-foreground placeholder:text-foreground/35 min-h-11 w-full rounded-md border px-3.5 py-2.5 text-sm outline-none";

  return (
    <form
      id="rappel"
      onSubmit={handleSubmit}
      className="border-foreground/10 bg-brand-soft/60 mt-8 flex w-full scroll-mt-28 flex-col gap-3 rounded-md border p-5"
    >
      <p className="text-foreground flex items-center gap-2 font-medium">
        <PhoneCall className="text-brand h-4 w-4" aria-hidden="true" />
        {copy.callbackTitle}
      </p>
      <p className="text-foreground/60 -mt-1 text-sm leading-relaxed">
        {copy.callbackText}
      </p>
      <input
        type="text"
        name="website_check"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="sr-only" htmlFor="cb-name">
          {copy.callbackName}
        </label>
        <input
          id="cb-name"
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          placeholder={copy.callbackName}
          className={inputClass}
        />
        <label className="sr-only" htmlFor="cb-phone">
          {copy.callbackPhone}
        </label>
        <input
          id="cb-phone"
          name="phone"
          type="tel"
          required
          maxLength={20}
          pattern="[+0-9][0-9 .()-]{7,19}"
          autoComplete="tel"
          placeholder={copy.callbackPhone}
          className={inputClass}
        />
      </div>
      <label className="sr-only" htmlFor="cb-slot">
        {copy.callbackSlot}
      </label>
      <select
        id="cb-slot"
        name="slot"
        required
        defaultValue=""
        className={inputClass}
      >
        <option value="" disabled>
          {copy.callbackSlot}
        </option>
        {callbackSlots.map((slot, index) => (
          <option key={slot} value={slot}>
            {copy.callbackSlots[index]}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="cb-topic">
        {copy.callbackTopic}
      </label>
      <input
        id="cb-topic"
        name="topic"
        maxLength={300}
        placeholder={copy.callbackTopic}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="focus-ring bg-foreground text-background inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-opacity disabled:opacity-60"
      >
        {status === "sending" ? copy.formSending : copy.callbackSend}
      </button>
      <p role="status" aria-live="polite" className="text-sm">
        {status === "success" ? (
          <span className="text-emerald-700 dark:text-emerald-400">
            {copy.callbackSuccess}
          </span>
        ) : null}
        {status === "error" ? (
          <span className="text-red-700 dark:text-red-400">
            {copy.formError}
          </span>
        ) : null}
      </p>
    </form>
  );
}
