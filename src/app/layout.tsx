import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd } from "@/lib/jsonld";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ScrollToTop } from "@/components/ScrollToTop";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const SITE_TITLE = "India's Used Marketplace for Cars, Bikes, Furniture & More";
const SITE_DESCRIPTION = "Buy and sell quality pre-owned cars, bikes, furniture, electronics, and everyday essentials.";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` }, description: SITE_DESCRIPTION, keywords: ["used marketplace", "pre-owned cars", "used bikes", "second hand furniture", "used electronics", "buy and sell used items"], authors: [{ name: SITE_NAME }], icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" }, alternates: { canonical: "/" }, openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, type: "website", url: "/", siteName: SITE_NAME, locale: "en_IN" }, twitter: { card: "summary", title: SITE_TITLE, description: SITE_DESCRIPTION } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0d5fd4" };

export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className={`${inter.variable} h-full antialiased`}><body className="min-h-full"><JsonLd data={organizationJsonLd()} /><Suspense fallback={null}><ScrollToTop /></Suspense><Providers>{children}</Providers><Analytics /><SpeedInsights /></body></html>; }
