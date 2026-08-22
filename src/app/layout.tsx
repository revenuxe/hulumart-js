import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Providers } from "./providers";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd } from "@/lib/jsonld";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const playfairDisplay = Playfair_Display({ variable: "--font-playfair-display", subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
const SITE_TITLE = "Used Electronics & Quality Pre-Owned Devices";
const SITE_DESCRIPTION = "Shop carefully described, quality-checked pre-owned phones, laptops, tablets and electronics.";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` }, description: SITE_DESCRIPTION, keywords: ["used electronics", "pre-owned phones", "used laptops", "refurbished devices", "second hand electronics"], authors: [{ name: SITE_NAME }], icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" }, alternates: { canonical: "/" }, openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, type: "website", url: "/", siteName: SITE_NAME, locale: "en_IN" }, twitter: { card: "summary", title: SITE_TITLE, description: SITE_DESCRIPTION } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#4a217d" };

export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}><body className="min-h-full"><JsonLd data={organizationJsonLd()} /><Providers>{children}</Providers><Analytics /><SpeedInsights /></body></html>; }
