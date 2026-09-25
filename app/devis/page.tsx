import { QuoteForm } from "@/components/quote/quote-form";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Demande de devis",
  description: "Décrivez votre projet de site ou de logiciel en 3 minutes et recevez un devis personnalisé de Tobias Ringot, designer & développeur produit à Aix-en-Provence.",
  path: "/devis",
});

export default function QuotePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-190 px-4 pt-24 pb-24 sm:px-10 sm:pt-28 sm:pb-32"><div className="sheet on-paper rotate-[0.4deg] p-5 sm:p-10">
        <QuoteForm />
      </div></section>
    </main>
  );
}
