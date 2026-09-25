import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { Nav } from "@/components/layout/nav";
import { Providers } from "@/components/layout/providers";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { baseMetadata, siteConfig } from "@/lib/metadata";
import { site } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Caveat, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap", axes: ["wdth"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = baseMetadata;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${site.name}, designer & développeur produit`,
  url: siteConfig.url,
  email: site.email,
  image: `${siteConfig.url}/opengraph-image`,
  description: siteConfig.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: "Provence-Alpes-Côte d'Azur",
    addressCountry: "FR",
  },
  areaServed: "Provence",
  priceRange: "À partir de 900 €",
  sameAs: [site.linkedin],
  founder: { "@type": "Person", name: site.name, jobTitle: site.role, sameAs: [site.linkedin] },
};

export const viewport: Viewport = {
  themeColor: "#1e4b3e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${caveat.variable}`}
    >
      <body className="on-desk min-h-screen font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Providers>
          <SkipToContent />
          <Nav />
          <div className="relative z-[1]">{children}</div>
          <Footer />
          <MobileCta />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
