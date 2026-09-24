import type { Metadata } from "next";

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
const deploymentUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
const siteUrl = (configuredUrl || deploymentUrl || "http://localhost:3000").replace(/\/$/, "");

export const siteConfig = {
  name: "Tobias Ringot",
  description: "Sites web, espaces clients, logiciels métiers et ERP / CRM sur mesure pour les entreprises, conçus et développés à Aix-en-Provence.",
  url: siteUrl,
  ogImage: "/opengraph-image",
} as const;

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Refonte de site internet à Aix-en-Provence`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["logiciel sur mesure", "logiciel métier sur mesure", "ERP sur mesure", "CRM sur mesure", "portail client B2B", "refonte site internet Aix-en-Provence", "développeur freelance Aix-en-Provence", "Tobias Ringot"],
  authors: [{ name: "Tobias Ringot" }],
  creator: "Tobias Ringot",
  publisher: "Tobias Ringot",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  manifest: "/site.webmanifest",
};

export function createMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${path}`,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: { title, description, images: [siteConfig.ogImage] },
  };
}
