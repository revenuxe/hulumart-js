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
  title: "Sell Used Furniture in Bangalore",
  description:
    "Sell used sofas, beds, dining tables, chairs, wardrobes, desks and more in Bangalore with Hulumart. Quick pickup and the best value for your pre-owned furniture.",
  alternates: { canonical: "/furniture" },
  openGraph: {
    title: "Sell Used Furniture in Bangalore | Hulumart",
    description:
      "Give your pre-owned furniture a new home. Sell sofas, beds, tables, wardrobes and more in Bangalore.",
    url: "/furniture",
  },
};

const subcategories = [
  {
    name: "Sofas & Couches",
    description: "L-shaped, recliner, 2-seater, 3-seater and sectional sofas.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Furniture&sub=Sofa",
  },
  {
    name: "Beds & Mattresses",
    description: "King-size, queen-size, bunk beds and mattresses.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Furniture&sub=Bed",
  },
  {
    name: "Dining Tables",
    description: "4-seater, 6-seater, marble top and wooden dining sets.",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Furniture&sub=Dining+table",
  },
  {
    name: "Wardrobes & Storage",
    description: "Wooden, sliding door, walk-in wardrobes and cabinets.",
    image:
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Furniture&sub=Wardrobe",
  },
  {
    name: "Study & Office Desks",
    description: "Computer desks, standing desks, writing tables and chairs.",
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Furniture&sub=Desk",
  },
  {
    name: "Chairs & Recliners",
    description: "Office chairs, bean bags, accent chairs and recliners.",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Furniture&sub=Chair",
  },
  {
    name: "Bookshelves & Racks",
    description: "Wall-mounted, freestanding, corner shelves and display units.",
    image:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Furniture&sub=Bookshelf",
  },
  {
    name: "TV Units & Cabinets",
    description: "Entertainment centres, floating shelves and media stands.",
    image:
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Furniture&sub=TV+unit",
  },
  {
    name: "Centre & Coffee Tables",
    description: "Wooden, glass-top, marble and nesting coffee tables.",
    image:
      "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Furniture&sub=Coffee+table",
  },
  {
    name: "Dressing Tables",
    description: "Mirrors, vanity desks, makeup tables and organisers.",
    image:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80",
    href: "/sell?category=Furniture&sub=Dressing+table",
  },
];

export default function FurniturePage() {
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
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85"
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
              <span className="cat-breadcrumb-current">Furniture</span>
            </nav>
            <h1 id="cat-title">
              Sell Used Furniture in <span>Bangalore</span>
            </h1>
            <p className="cat-hero-description">
              Declutter your space and earn from furniture you no longer need.
              Sell sofas, beds, tables, wardrobes and more — hassle-free with
              Hulumart.
            </p>
            <Link href="/sell?category=Furniture" className="selling-primary">
              Sell furniture now <ArrowRight size={20} />
            </Link>
            <PincodeCheck />

          </div>
        </section>

        <section
          className="cat-subcategories"
          aria-labelledby="cat-subcategories-title"
        >
          <p className="selling-eyebrow">What would you like to sell?</p>
          <h2 id="cat-subcategories-title">Choose your furniture type</h2>
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
            <h2>Browse pre-owned furniture</h2>
            <p>Explore quality-checked used furniture at great prices.</p>
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
