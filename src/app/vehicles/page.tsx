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
  title: "Sell Used Cars & Bikes in Bangalore",
  description:
    "Sell used cars, bikes, scooters, SUVs and commercial vehicles in Bangalore with Hulumart. Free inspection, fair price and quick sale guaranteed.",
  alternates: { canonical: "/vehicles" },
  openGraph: {
    title: "Sell Used Cars & Bikes in Bangalore | Hulumart",
    description:
      "Give your pre-owned vehicle a new owner. Sell cars, bikes, scooters and SUVs in Bangalore with Hulumart.",
    url: "/vehicles",
  },
};

const subcategories = [
  {
    name: "Cars",
    description: "Hatchbacks, sedans, SUVs, luxury and electric cars.",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Vehicles&sub=Car",
  },
  {
    name: "Bikes",
    description: "Sports bikes, cruisers, commuters and superbikes.",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Vehicles&sub=Bike",
  },
  {
    name: "Scooters",
    description: "Activa, Jupiter, electric scooters and mopeds.",
    image:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Vehicles&sub=Scooter",
  },
  {
    name: "SUVs",
    description: "Compact SUVs, mid-size SUVs and full-size SUVs.",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Vehicles&sub=SUV",
  },
  {
    name: "Electric Vehicles",
    description: "Electric cars, e-bikes, e-scooters and hybrids.",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Vehicles&sub=Electric+vehicle",
  },
  {
    name: "Commercial Vehicles",
    description: "Tempos, mini trucks, vans and pickup trucks.",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Vehicles&sub=Commercial+vehicle",
  },
  {
    name: "Auto Accessories",
    description: "Tyres, alloy wheels, car audio and seat covers.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Vehicles&sub=Auto+accessory",
  },
  {
    name: "Spare Parts",
    description: "Engines, batteries, headlights and body parts.",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Vehicles&sub=Spare+part",
  },
  {
    name: "Bicycles",
    description: "Mountain bikes, road bikes, kids cycles and electric bikes.",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Vehicles&sub=Bicycle",
  },
  {
    name: "Three Wheelers",
    description: "Auto rickshaws, e-rickshaws and cargo three wheelers.",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Vehicles&sub=Three+wheeler",
  },
];

export default function VehiclesPage() {
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
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=85"
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
              <span className="cat-breadcrumb-current">Vehicles</span>
            </nav>
            <h1 id="cat-title">
              Sell Used Vehicles in <span>Bangalore</span>
            </h1>
            <p className="cat-hero-description">
              Sell your car, bike, scooter or SUV at the best price. Hulumart
              offers free inspection, fair valuation and a quick sale — no
              hassle.
            </p>
            <Link href="/sell?category=Vehicles" className="selling-primary">
              Sell your vehicle <ArrowRight size={20} />
            </Link>
            <PincodeCheck />

          </div>
        </section>

        <section
          className="cat-subcategories"
          aria-labelledby="cat-subcategories-title"
        >
          <p className="selling-eyebrow">What would you like to sell?</p>
          <h2 id="cat-subcategories-title">Choose your vehicle type</h2>
          <p className="selling-section-description">
            Pick a category to list your vehicle in minutes.
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
            <h2>Browse pre-owned vehicles</h2>
            <p>Explore quality-checked used cars, bikes and more.</p>
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
