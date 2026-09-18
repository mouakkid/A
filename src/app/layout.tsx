import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site, SITE_URL, IS_PRODUCTION_SITE } from "@/config/site";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CompareBar } from "@/components/compare/compare-bar";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import { getCurrentUser } from "@/lib/auth/session";
import { ThemeScript } from "@/components/layout/theme-script";

// Sous-ensembles latin (préchargés) ; Latin étendu (ē, œ…) chargé à la demande via unicode-range.
const inter = localFont({
  src: "../fonts/Inter-fr.woff2",
  variable: "--font-inter",
  display: "optional",
  weight: "100 900",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2190-2199, U+2212, U+2215, U+2264-2265, U+FEFF, U+FFFD" }],
});
const interExt = localFont({
  src: "../fonts/Inter-fr-ext.woff2",
  variable: "--font-inter-ext",
  display: "swap",
  weight: "100 900",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-017F, U+0218-021B, U+1E9E" }],
});
const archivo = localFont({
  src: "../fonts/Archivo-fr.woff2",
  variable: "--font-archivo",
  display: "swap",
  weight: "100 900",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2190-2199, U+2212, U+2215, U+2264-2265, U+FEFF, U+FFFD" }],
});
const archivoExt = localFont({
  src: "../fonts/Archivo-fr-ext.woff2",
  variable: "--font-archivo-ext",
  display: "swap",
  weight: "100 900",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-017F, U+0218-021B, U+1E9E" }],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  robots: IS_PRODUCTION_SITE
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "fr_MA",
    url: SITE_URL,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
    apple: "/apple-icon.png",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang={site.language} dir={site.direction} className={`${inter.variable} ${interExt.variable} ${archivo.variable} ${archivoExt.variable} h-full antialiased`}>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
        >
          Aller au contenu
        </a>
        <SiteHeader user={user ? { username: user.username, role: user.role } : null} />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CompareBar />
        <RevealObserver />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </body>
    </html>
  );
}
