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
  title: "Sell Used Electronics in Bangalore",
  description:
    "Sell used laptops, mobiles, desktops, smartwatches, tablets, gaming consoles and more in Bangalore with Hulumart. Get the best value for your pre-owned electronics.",
  alternates: { canonical: "/electronics" },
  openGraph: {
    title: "Sell Used Electronics in Bangalore | Hulumart",
    description:
      "Give your pre-owned electronics a new home. Sell laptops, mobiles, smartwatches and more in Bangalore.",
    url: "/electronics",
  },
};

const subcategories = [
  {
    name: "Laptops",
    description: "MacBooks, Windows laptops, Chromebooks and ultrabooks.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Electronics&sub=Laptop",
  },
  {
    name: "Mobile Phones",
    description: "iPhones, Samsung Galaxy, OnePlus, Pixel and more.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Electronics&sub=Mobile",
  },
  {
    name: "Tablets",
    description: "iPads, Samsung Tab, Lenovo and drawing tablets.",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Electronics&sub=Tablet",
  },
  {
    name: "Desktops & PCs",
    description: "Complete desktops, monitors, keyboards and mice.",
    image:
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Electronics&sub=Desktop",
  },
  {
    name: "Smartwatches",
    description: "Apple Watch, Galaxy Watch, Fitbit and fitness bands.",
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Electronics&sub=Smartwatch",
  },
  {
    name: "Gaming Consoles",
    description: "PlayStation, Xbox, Nintendo Switch and accessories.",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Electronics&sub=Gaming+Console",
  },
  {
    name: "Cameras",
    description: "DSLRs, mirrorless cameras, lenses and drones.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Electronics&sub=Camera",
  },
  {
    name: "Audio & Speakers",
    description: "Headphones, Bluetooth speakers, soundbars and earbuds.",
    image:
      "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Electronics&sub=Audio",
  },
  {
    name: "TVs & Monitors",
    description: "Smart TVs, LED monitors, projectors and screens.",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Electronics&sub=TV",
  },
  {
    name: "Printers & Scanners",
    description: "Inkjet, laser, all-in-one printers and scanners.",
    image:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Electronics&sub=Printer",
  },
];

export default function ElectronicsPage() {
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
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1400&q=85"
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
              <span className="cat-breadcrumb-current">Electronics</span>
            </nav>
            <h1 id="cat-title">
              Sell Used Electronics in <span>Bangalore</span>
            </h1>
            <p className="cat-hero-description">
              Turn your pre-owned gadgets into cash. Sell used laptops, mobiles,
              smartwatches, gaming consoles and more — Hulumart makes it simple.
            </p>
            <Link href="/sell?category=Electronics" className="selling-primary">
              Sell electronics now <ArrowRight size={20} />
            </Link>
            <PincodeCheck />

          </div>
        </section>

        <section
          className="cat-subcategories"
          aria-labelledby="cat-subcategories-title"
        >
          <p className="selling-eyebrow">What would you like to sell?</p>
          <h2 id="cat-subcategories-title">Choose your electronics</h2>
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
            <h2>Browse pre-owned electronics</h2>
            <p>Explore quality-checked used gadgets at great prices.</p>
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
