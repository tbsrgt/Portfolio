import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Mentions légales",
  description: "Mentions légales et politique de confidentialité du site de Tobias Ringot, designer & développeur produit à Aix-en-Provence.",
  path: "/mentions-legales",
});

export default function LegalPage(): ReactNode {
  const email = (
    <a href={`mailto:${site.email}`} className="focus-ring text-foreground rounded underline underline-offset-4">
      {site.email}
    </a>
  );

  return (
    <main id="main-content" className="mx-auto w-full max-w-176 flex-1 px-4 pt-24 pb-20 sm:px-10 sm:pt-32"><div className="sheet on-paper p-6 sm:p-10">
      <h1 className="text-foreground text-[2.5rem] display md:text-[3rem]">
        Mentions légales
      </h1>

      <div className="text-foreground/70 mt-12 space-y-10 leading-relaxed [&_h2]:text-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-tight [&_p+p]:mt-3">
        <section>
          <h2>Éditeur du site</h2>
          <p>
            {site.name}, designer & développeur produit
            <br />
            Aix-en-Provence (13), France
            <br />
            Contact : {email}
          </p>
        </section>

        <section>
          <h2>Hébergement</h2>
          <p>
            Vercel Inc.
            <br />
            440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis
          </p>
        </section>

        <section>
          <h2>Propriété intellectuelle</h2>
          <p>
            Les textes, visuels et le code de ce site appartiennent à {site.name}, sauf mention contraire. Les sites présentés
            dans les réalisations restent la propriété de leurs titulaires respectifs.
          </p>
        </section>

        <section>
          <h2>Réalisations</h2>
          <p>
            Certains projets présentés dans les réalisations sont des créations conçues à titre de démonstration. Les noms,
            coordonnées et contenus de ces projets sont fictifs.
          </p>
        </section>

        <section>
          <h2>Données personnelles</h2>
          <p>
            Les informations envoyées avec le formulaire de contact (nom, e-mail, entreprise, site actuel, besoin et message)
            servent uniquement à répondre à votre demande. Elles me sont transmises par e-mail via le service Resend et ne sont
            ni revendues ni utilisées à des fins publicitaires.
          </p>
          <p>
            Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en écrivant à {email}. Vous
            pouvez aussi adresser une réclamation à la CNIL.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            Ce site n&apos;utilise ni cookie publicitaire ni outil de mesure d&apos;audience. Vos préférences de langue et de
            thème sont enregistrées uniquement dans votre navigateur.
          </p>
        </section>
      </div>
    </div></main>
  );
}
