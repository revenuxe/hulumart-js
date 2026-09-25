import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, UserRound } from "lucide-react";
import logo from "@/assets/hulumart-logo.webp";
import { BottomNav } from "@/components/BottomNav";
import { PincodeCheck } from "@/components/PincodeCheck";
import { Footer } from "@/components/Footer";
import "./selling-home.css";

export const metadata: Metadata = {
  title: "Sell Used Items in Bangalore",
  description:
    "Sell used furniture, electronics, home appliances, cars and bikes in Bangalore with Hulumart. Share your item details and connect with our team.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sell Used Items in Bangalore | Hulumart",
    description:
      "Give your pre-owned items a new home. Sell electronics, furniture, appliances and vehicles in Bangalore.",
    url: "/",
  },
};
const categories = [
  {
    name: "Electronics",
    description: "Mobiles, laptops, desktops and smartwatches.",
    image: "https://res.cloudinary.com/dcrauhr1x/image/upload/v1790362876/electronics_dfbvje.webp",
    href: "/electronics",
  },
  {
    name: "Furniture",
    description: "Sofas, beds, tables, chairs and wardrobes.",
    image: "https://res.cloudinary.com/dcrauhr1x/image/upload/v1790362876/furniture_tuzgxs.webp",
    href: "/furniture",
  },
  {
    name: "Appliances",
    description: "Fridges, washing machines and air conditioners.",
    image: "https://res.cloudinary.com/dcrauhr1x/image/upload/v1790362876/appliances_k8wzxh.webp",
    href: "/appliances",
  },
  {
    name: "Vehicles",
    description: "Used cars, bikes, scooters, SUVs and more.",
    image: "https://res.cloudinary.com/dcrauhr1x/image/upload/v1790362876/vehicles_mkdc57.webp",
    href: "/vehicles",
  },
];
export default function Home() {
  return (
    <div className="selling-home">
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
        <section className="selling-hero" aria-labelledby="selling-title">
          <Image
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1000&q=85"
            alt=""
            fill
            preload
            sizes="100vw"
            className="selling-hero-image"
          />
          <div className="selling-hero-shade" />
          <div className="selling-hero-inner">
            <h1 id="selling-title">
              Sell Used Items in <span>Bangalore</span>
            </h1>
            <p className="selling-hero-description">
              Give your pre-loved items a new home. Sell used furniture,
              electronics, appliances, cars and bikes in Bangalore. Share your
              item details and get started with Hulumart.
            </p>
            <Link href="/sell" className="selling-primary">
              Sell an item <ArrowRight size={20} />
            </Link>
            <PincodeCheck />
          </div>
        </section>
        <section
          className="selling-categories"
          aria-labelledby="selling-categories-title"
        >
          <p className="selling-eyebrow">What would you like to sell?</p>
          <h2 id="selling-categories-title">Start with what you have</h2>
          <p className="selling-section-description">
            Choose a category to get started.
          </p>
          <div className="selling-card-grid">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="selling-card"
              >
                <Image
                  src={category.image}
                  alt={`Used ${category.name.toLowerCase()}`}
                  fill
                  sizes="(min-width: 1024px) 280px, 50vw"
                  className="selling-card-image"
                />
                <div className="selling-card-shade" />
                <div className="selling-card-content">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="selling-card-action">
                    Sell now <ArrowRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="selling-store-prompt">
          <div>
            <p className="selling-eyebrow">Find your next favourite</p>
            <h2>Looking to buy pre-loved?</h2>
            <p>Explore the latest used items in our store.</p>
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
