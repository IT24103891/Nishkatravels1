import {hasLocale, NextIntlClientProvider} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {getCopy} from "@/i18n/server";
import {locales, languageTags, routing} from "@/i18n/routing";
import type {Metadata} from "next";
import {Navbar} from "@/components/Navbar";
import {Entrance} from "@/components/TravelMotion";
import {Footer} from "@/components/Footer";
import {WhatsAppButton} from "@/components/WhatsAppButton";
import {business, siteUrl} from "@/lib/business";
import "../globals.css";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(hasLocale(locales, locale) ? locale : routing.defaultLocale);
  const copy = await getCopy();
  return {
    metadataBase: new URL(siteUrl ?? "http://localhost:3000"),
    title: {default: business.name, template: "%s | " + business.name},
    description: copy("Plan a private Sri Lanka tour with Nishaka, a local driver and guide."),
  };
}

export function generateStaticParams() { return locales.map(locale => ({locale})); }

const fonts = {ja: "Noto Sans JP", zh: "Noto Sans SC", hi: "Noto Sans Devanagari", ta: "Noto Sans Tamil"};

export default async function RootLayout({children, params}: Readonly<{children: React.ReactNode; params: Promise<{locale: string}>}>) {
  const {locale} = await params;
  if (!hasLocale(locales, locale)) notFound();
  setRequestLocale(locale);
  const copy = await getCopy();
  const schema = {
    "@context": "https://schema.org", "@type": "Service", name: business.name,
    serviceType: "Private driver-guided tours and transfers",
    provider: {"@type": "Person", name: "Nishaka", sameAs: business.instagram},
    areaServed: {"@type": "Country", name: business.country}, url: siteUrl,
  };
  return <html lang={languageTags[locale]}><body>
    {locale !== "en" && <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${fonts[locale].replaceAll(" ", "+")}:wght@400;600;700&display=swap`} />}
    <NextIntlClientProvider>
    <noscript><style>{".motion-content { opacity: 1 !important; transform: none !important; }"}</style></noscript>
    <a className="skip" href="#main">{copy("Skip to content")}</a>
    <Navbar />
    <main id="main" tabIndex={-1}>{children}</main>
    <Footer />
    <Entrance className="floating-dock" delay={0.3}><WhatsAppButton floating /></Entrance>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema).replace(/</g, "\\u003c")}} />
  </NextIntlClientProvider></body></html>;
}
