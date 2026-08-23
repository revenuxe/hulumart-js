import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { CONTACT, CONTACT_ADDRESS_FULL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Hulumart collects and handles personal data.", alternates: { canonical: "/privacy" } };
const updated = "August 23, 2026";
const sections = [
  ["1. Scope", `This Privacy Policy explains how ${SITE_NAME} collects, uses, shares, retains, and protects personal data when you use our marketplace for pre-owned and refurbished items.`],
  ["2. Data we collect", "We collect account and contact information such as your name, email, phone number, and address; order, delivery, pickup, support, and refund information; and technical data such as device, browser, IP-derived approximate location, and site usage. Payment details are handled by payment providers; we do not intentionally store full card or bank credentials."],
  ["3. Why we use data", "We use data to create and secure accounts, process and fulfil orders, coordinate delivery or pickup, communicate about orders and support, prevent fraud and misuse, improve our marketplace, comply with law, and establish, exercise, or defend legal claims. We process data only where we have a lawful basis, including your consent, performance of a contract, legal obligations, or legitimate interests."],
  ["4. Sharing", "We share data only where necessary with payment providers, delivery and logistics partners, cloud and technical service providers, professional advisers, and authorities where required by law or necessary to protect rights, safety, or prevent fraud. We do not sell personal data."],
  ["5. Used-item listing information", "Information you provide in support requests, condition queries, delivery notes, or dispute reports may be used to verify item condition, investigate claims, and improve marketplace safety. Please do not send unnecessary sensitive personal information, payment credentials, government identity numbers, or passwords through chat or email."],
  ["6. Cookies and analytics", "We use essential cookies and similar technologies to maintain sessions, protect the service, remember preferences, and understand website performance. You can manage cookies in your browser, though disabling essential cookies can prevent sign-in or checkout."],
  ["7. Retention and security", "We retain data only as long as reasonably needed for the purposes described here, including accounting, tax, fraud prevention, dispute resolution, and legal obligations. We use reasonable technical and organisational safeguards, but no online service can guarantee absolute security."],
  ["8. Your choices and rights", "Subject to applicable law, you may ask to access, correct, update, delete, or obtain a copy of your personal data, withdraw consent where processing relies on consent, or raise a complaint. Some information may need to be retained where required by law or to resolve a dispute."],
  ["9. Children", "The service is not intended for children. If you believe a child has provided personal data without appropriate authorisation, contact us and we will take appropriate steps."],
  ["10. Changes and contact", `We may update this Policy from time to time. The date above shows the latest version. For privacy requests or grievances, email ${CONTACT.email}, call ${CONTACT.phone}, or write to ${CONTACT_ADDRESS_FULL}.`],
] as const;

export default function PrivacyPage() { return <div className="min-h-dvh bg-background pb-24"><TopBar /><main className="mx-auto w-full max-w-3xl px-5 pb-16 pt-2 md:px-8"><Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link><h1 className="mt-6 font-display text-4xl leading-tight md:text-5xl">Privacy Policy</h1><p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p><div className="mt-8 space-y-8">{sections.map(([heading, body]) => <section key={heading}><h2 className="font-display text-xl md:text-2xl">{heading}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{body}</p></section>)}</div></main><BottomNav /></div>; }
