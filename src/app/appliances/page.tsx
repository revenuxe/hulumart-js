import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, UserRound } from "lucide-react";
import logo from "@/assets/hulumart-logo.webp";
import { BottomNav } from "@/components/BottomNav";
import { PincodeCheck } from "@/components/PincodeCheck";
import { Footer } from "@/components/Footer";
import "../category-landing.css";
import "../selling-home.css";

export const metadata: Metadata = {
  title: "Sell Used Home Appliances in Bangalore",
  description:
    "Sell used fridges, washing machines, air conditioners, microwaves, water purifiers and more in Bangalore with Hulumart. Get picked up fast and paid fairly.",
  alternates: { canonical: "/appliances" },
  openGraph: {
    title: "Sell Used Home Appliances in Bangalore | Hulumart",
    description:
      "Give your pre-owned home appliances a second life. Sell fridges, ACs, washing machines and more in Bangalore.",
    url: "/appliances",
  },
};

const subcategories = [
  {
    name: "Refrigerators",
    description: "Single door, double door, side-by-side and mini fridges.",
    image:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Appliances&sub=Refrigerator",
  },
  {
    name: "Washing Machines",
    description: "Front load, top load, semi-automatic and washer-dryers.",
    image:
      "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Appliances&sub=Washing+machine",
  },
  {
    name: "Air Conditioners",
    description: "Split ACs, window ACs, portable and inverter models.",
    image:
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Appliances&sub=Air+conditioner",
  },
  {
    name: "Microwaves & Ovens",
    description: "Convection, grill, solo microwaves and OTGs.",
    image:
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Appliances&sub=Microwave",
  },
  {
    name: "Water Purifiers",
    description: "RO, UV, gravity-based and commercial water purifiers.",
    image:
      "https://images.unsplash.com/photo-1564419320461-6eb1f49b5c37?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Appliances&sub=Water+purifier",
  },
  {
    name: "Kitchen Appliances",
    description: "Mixer grinders, induction cooktops, food processors.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Appliances&sub=Kitchen+appliance",
  },
  {
    name: "Geysers & Heaters",
    description: "Electric, gas, instant and storage water heaters.",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Appliances&sub=Geyser",
  },
  {
    name: "Vacuum Cleaners",
    description: "Robotic, handheld, upright and wet-dry cleaners.",
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Appliances&sub=Vacuum+cleaner",
  },
  {
    name: "Fans & Coolers",
    description: "Ceiling fans, tower fans, air coolers and exhaust fans.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Appliances&sub=Fan",
  },
  {
    name: "Iron & Steamers",
    description: "Steam irons, dry irons, garment steamers and presses.",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Appliances&sub=Iron",
  },
];

export default function AppliancesPage() {
  return (
    <div className="cat-landing selling-home">
      <header className="selling-header">
        <div className="selling-header-inner">
          <Link href="/" aria-label="Hulumart home">
            <Image
              src={logo}
              alt="Hulumart"
              width={256}
              height={72}
              preload
              className="selling-logo"
            />
          </Link>
          <nav aria-label="Main navigation" className="selling-desktop-nav">
            <Link href="/sell">Sell an item</Link>
            <Link href="/store">Store</Link>
            <Link href="/categories">Categories</Link>
          </nav>
          <Link href="/profile" className="selling-account">
            <UserRound size={20} />
            <span>Account</span>
          </Link>
        </div>
      </header>
      <main>
        <section className="cat-hero" aria-labelledby="cat-title">
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=85"
            alt=""
            fill
            preload
            sizes="100vw"
            className="cat-hero-image"
          />
          <div className="cat-hero-shade" />
          <div className="cat-hero-inner">
            <nav className="cat-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <ChevronRight size={13} className="cat-breadcrumb-sep" />
              <span className="cat-breadcrumb-current">Appliances</span>
            </nav>
            <h1 id="cat-title">
              Sell Used Appliances in <span>Bangalore</span>
            </h1>
            <p className="cat-hero-description">
              Upgrade your home and earn from appliances you no longer use. Sell
              fridges, washing machines, ACs and more — Hulumart handles the
              pickup.
            </p>
            <Link
              href="/sell?category=Appliances"
              className="selling-primary"
            >
              Sell appliances now <ArrowRight size={20} />
            </Link>
            <PincodeCheck />

          </div>
        </section>

        <section
          className="cat-subcategories"
          aria-labelledby="cat-subcategories-title"
        >
          <p className="selling-eyebrow">What would you like to sell?</p>
          <h2 id="cat-subcategories-title">Choose your appliance type</h2>
          <p className="selling-section-description">
            Pick a category to list your item in minutes.
          </p>
          <div className="cat-subcat-grid">
            {subcategories.map((sub) => (
              <Link key={sub.name} href={sub.href} className="cat-subcat-card">
                <Image
                  src={sub.image}
                  alt={`Used ${sub.name.toLowerCase()}`}
                  fill
                  sizes="(min-width: 1024px) 380px, 50vw"
                  className="cat-subcat-card-image"
                />
                <div className="cat-subcat-card-shade" />
                <div className="cat-subcat-card-content">
                  <h3>{sub.name}</h3>
                  <p>{sub.description}</p>
                  <span className="cat-subcat-card-action">
                    Sell now <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="cat-sell-prompt">
          <div>
            <p className="selling-eyebrow">Looking to buy instead?</p>
            <h2>Browse pre-owned appliances</h2>
            <p>Explore quality-checked used appliances at great prices.</p>
          </div>
          <Link href="/store" className="selling-primary">
            Explore the store <ArrowRight size={20} />
          </Link>
        </section>

        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}
