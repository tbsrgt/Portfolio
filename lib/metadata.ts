import type { Metadata } from "next";

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
const deploymentUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
const siteUrl = (configuredUrl || deploymentUrl || "http://localhost:3000").replace(/\/$/, "");

export const siteConfig = {
  name: "Tobias Ringot",
  description: "Refonte de sites internet et création de sites vitrines à Aix-en-Provence, pour les entreprises de Provence. À partir de 1 490 €.",
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
  keywords: ["refonte site internet", "refonte site internet Aix-en-Provence", "création site vitrine", "web designer Aix-en-Provence", "site internet Marseille", "Tobias Ringot"],
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
