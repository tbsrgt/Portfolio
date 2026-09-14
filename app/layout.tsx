import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { PageBackdrop } from "@/components/layout/page-backdrop";
import { Providers } from "@/components/layout/providers";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { ClickSpark } from "@/components/ui/click-spark";
import { GradualBlur } from "@/components/ui/gradual-blur";
import { baseMetadata, siteConfig } from "@/lib/metadata";
import { site } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

export const metadata: Metadata = baseMetadata;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${site.name}, web designer`,
  url: siteConfig.url,
  email: site.email,
  image: `${siteConfig.url}/opengraph-image`,
  description: siteConfig.description,
  address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: "Provence-Alpes-Côte d'Azur", addressCountry: "FR" },
  areaServed: "Provence",
  priceRange: "À partir de 1 500 €",
  sameAs: [site.linkedin],
  founder: { "@type": "Person", name: site.name, jobTitle: site.role, sameAs: [site.linkedin] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Providers>
          <ClickSpark>
            <div className="site-frame site-frame--top" aria-hidden="true" />
            <div className="site-frame site-frame--left" aria-hidden="true" />
            <div className="site-frame site-frame--right" aria-hidden="true" />
            <svg className="site-corner site-corner--top-left" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z" fill="currentColor"/>
            </svg>
            <svg className="site-corner site-corner--top-right" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z" fill="currentColor"/>
            </svg>
            <SkipToContent />
            <PageBackdrop />
            <Nav />
            {children}
            <Footer />
            <GradualBlur
              target="page"
              position="bottom"
              height="6rem"
              strength={2}
              divCount={5}
              curve="bezier"
              exponential
              opacity={1}
              className="z-40"
            />
          </ClickSpark>
        </Providers>
      </body>
    </html>
  );
}
