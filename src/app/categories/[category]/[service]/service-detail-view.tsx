"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Cpu,
  PackageCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";
import { useCart } from "@/lib/cart-store";
import { createClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DecorCategory, DecorService } from "@/data/types";

const conditionLabels = {
  like_new: "Like new",
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
};

function ageLabel(months?: number) {
  if (!months) return "Not specified";
  if (months < 12) return `About ${months} month${months === 1 ? "" : "s"} old`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return `About ${years} year${years === 1 ? "" : "s"}${remainingMonths ? ` ${remainingMonths} mo` : ""} old`;
}

export function ServiceDetailView({
  service,
  category,
  related,
}: {
  service: DecorService;
  category: DecorCategory;
  related: DecorService[];
}) {
  const router = useRouter();
  const [signInOpen, setSignInOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const { addItem } = useCart();
  const productImages = service.images.length > 0 ? service.images : ["/placeholder.svg"];
  const selectedImage = productImages[selectedImageIndex] ?? productImages[0];
  const availableStock = Math.max(
    0,
    (service.stockQuantity ?? 1) - (service.reservedQuantity ?? 0),
  );
  const soldOut = availableStock === 0;
  const warranty =
    service.warrantyStatus && service.warrantyStatus !== "none"
      ? `${service.warrantyProvider ? `${service.warrantyProvider} · ` : ""}${service.warrantyCoverage ?? "Warranty available"}`
      : "No warranty included";
  const addToCart = () => {
    if (soldOut) return toast.error("This item is sold out");
    addItem({
      id: service.id,
      productId: service.id,
      categorySlug: service.categorySlug,
      categoryName: category.name,
      serviceSlug: service.slug,
      serviceName: service.name,
      image: service.images[0] ?? "/placeholder.svg",
      unitPrice: service.priceDiscounted,
      originalPrice: service.priceOriginal,
    });
    toast.success(`${service.name} added to cart`);
  };
  const buyNow = async () => {
    if (soldOut) return;
    addToCart();

    const {
      data: { user },
      error,
    } = await createClient().auth.getUser();
    if (error || !user) {
      setSignInOpen(true);
      return;
    }

    router.push("/checkout");
  };

  return (
    <div className="min-h-dvh bg-background pb-24">
      <TopBar />
      <main className="mx-auto w-full max-w-6xl px-5 py-6 md:px-8 md:py-10">
        <div className="grid gap-4 md:gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,.92fr)] lg:gap-12">
          <div className="relative overflow-hidden rounded-[2rem] bg-muted shadow-card">
            <button
              type="button"
              onClick={() => setImageViewerOpen(true)}
              aria-label={`View larger image of ${service.name}`}
              className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden sm:aspect-[5/4]"
            >
              <Image
                src={selectedImage}
                alt={`${service.name} view ${selectedImageIndex + 1}`}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </button>

            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous product image"
                  onClick={() =>
                    setSelectedImageIndex((current) =>
                      current === 0 ? productImages.length - 1 : current - 1,
                    )
                  }
                  className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-primary shadow-sm backdrop-blur transition hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="absolute right-3 top-3 flex max-h-[calc(100%-1.5rem)] flex-col gap-2 overflow-y-auto rounded-[1.35rem] bg-background/85 p-1.5 shadow-sm backdrop-blur">
                  {productImages.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      aria-label={`Show product image ${index + 1}`}
                      aria-pressed={selectedImageIndex === index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-14 sm:w-14 ${
                        selectedImageIndex === index
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <section className="self-start rounded-3xl border border-border bg-card p-5 shadow-card md:p-7 lg:sticky lg:top-28">
            <p className="text-xs font-semibold text-muted-foreground">
              {category.name}
              {service.brand ? ` · ${service.brand}` : ""}
            </p>
            <h1 className="mt-2 font-display text-2xl leading-tight text-primary md:text-4xl">
              {service.name}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {service.tagline}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.conditionGrade && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {conditionLabels[service.conditionGrade]}
                </span>
              )}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${soldOut ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-700"}`}
              >
                {soldOut ? "Sold out" : `${availableStock} available`}
              </span>
            </div>
            <div className="mt-5 flex items-baseline gap-3 border-y border-border py-4">
              <span className="text-2xl font-black text-primary">
                ₹{service.priceDiscounted.toLocaleString("en-IN")}
              </span>
              {service.priceOriginal > service.priceDiscounted && (
                <span className="text-base text-muted-foreground line-through">
                  ₹{service.priceOriginal.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={addToCart}
                disabled={soldOut}
                className="flex items-center justify-center gap-1.5 rounded-full border border-primary px-2 py-3 text-sm font-bold text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-5"
              >
                <ShoppingBag className="h-4 w-4 shrink-0" />
                Add to cart
              </button>
              <button
                onClick={buyNow}
                disabled={soldOut}
                className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-brand px-2 py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-5"
              >
                <CreditCard className="h-4 w-4 shrink-0" />
                Buy now
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">
              Choose cash on delivery or self pickup at checkout. Secure online
              payments are coming soon.
            </p>
          </section>
        </div>
        {Object.keys(service.specifications ?? {}).length > 0 && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-5 md:p-7">
            <h2 className="flex items-center gap-2 font-display text-xl text-primary">
              <Cpu className="h-4 w-4 text-accent" />
              Configuration
            </h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(service.specifications ?? {}).map(
                ([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 rounded-xl bg-muted/50 px-4 py-3 text-sm"
                  >
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-semibold text-primary">
                      {value}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </section>
        )}
        <section className="mt-8 grid gap-6">
          <aside className="rounded-3xl border border-border bg-card p-5 md:p-7">
            <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
              Before you buy
            </p>
            <h2 className="mt-2 font-display text-xl text-primary">
              Product details
            </h2>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Condition</dt>
                <dd className="text-right font-semibold text-primary">
                  {service.conditionGrade
                    ? conditionLabels[service.conditionGrade]
                    : "Not specified"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Approx. age</dt>
                <dd className="text-right font-semibold text-primary">
                  {ageLabel(service.approximateAgeMonths)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Warranty</dt>
                <dd className="max-w-[65%] text-right font-semibold text-primary">
                  {warranty}
                </dd>
              </div>
              {service.warrantyExpiresAt && (
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Warranty ends</dt>
                  <dd className="text-right font-semibold text-primary">
                    {new Date(service.warrantyExpiresAt).toLocaleDateString(
                      "en-IN",
                      { month: "short", year: "numeric" },
                    )}
                  </dd>
                </div>
              )}
              {service.warrantyStatus && service.warrantyStatus !== "none" && (
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Transferable</dt>
                  <dd className="text-right font-semibold text-primary">
                    {service.warrantyTransferable ? "Yes" : "No"}
                  </dd>
                </div>
              )}
            </dl>
            {(service.conditionSummary || service.usageSummary) && (
              <div className="mt-4 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
                {service.conditionSummary && (
                  <p>
                    <strong className="text-primary">Condition notes: </strong>
                    {service.conditionSummary}
                  </p>
                )}
                {service.usageSummary && (
                  <p className={service.conditionSummary ? "mt-3" : ""}>
                    <strong className="text-primary">Usage: </strong>
                    {service.usageSummary}
                  </p>
                )}
              </div>
            )}
          </aside>
          <article className="rounded-3xl border border-border bg-card p-5 md:p-7">
            <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
              Overview
            </p>
            <h2 className="mt-2 font-display text-xl text-primary">
              About this item
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {service.description}
            </p>
          </article>
        </section>
        {service.included.length > 0 && (
          <section className="mt-6 rounded-3xl border border-border bg-card p-5 md:p-7">
            <h2 className="flex items-center gap-2 font-display text-xl text-primary">
              <PackageCheck className="h-4 w-4 text-accent" />
              What’s included
            </h2>
            <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              {service.included.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}
        {service.notIncluded.length > 0 && (
          <section className="mt-6 rounded-3xl border border-border bg-card p-5 md:p-7">
            <h2 className="flex items-center gap-2 font-display text-xl text-primary">
              <X className="h-4 w-4 text-destructive" />
              Not included
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please arrange these separately if you need them.
            </p>
            <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              {service.notIncluded.map((item) => (
                <li key={item} className="flex gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}
        {service.faqs.length > 0 && (
          <section className="mt-6 rounded-3xl border border-border bg-card p-5 md:p-7">
            <h2 className="flex items-center gap-2 font-display text-xl text-primary">
              <CircleHelp className="h-4 w-4 text-accent" />
              Frequently asked questions
            </h2>
            <div className="mt-4 divide-y divide-border">
              {service.faqs.map((faq) => (
                <details key={faq.question} className="group py-4 first:pt-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-primary">
                    <span>{faq.question}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pr-8 pt-3 text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}
        <section className="mt-6 rounded-3xl border border-border bg-card p-5 md:p-7">
          <h2 className="flex items-center gap-2 font-display text-xl text-primary">
            <Truck className="h-4 w-4 text-accent" />
            Delivery & pickup
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            {service.deliveryInfo ??
              "Choose delivery or self pickup during checkout. We’ll confirm the details after you place your order."}
          </p>
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
            <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p>
              Delivery timing and pickup instructions are confirmed after
              checkout, so you know exactly what to expect before payment or
              collection.
            </p>
          </div>
        </section>
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl text-primary">
              You may also like
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {related.map((item) => (
                <ServiceCard key={item.id} service={item} compact />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
        <DialogContent className="max-w-[calc(100%-1rem)] gap-0 overflow-hidden rounded-[2rem] border-0 bg-background p-0 sm:max-w-5xl" aria-describedby={undefined}>
          <DialogTitle className="sr-only">{service.name} image viewer</DialogTitle>
          <div className="relative flex min-h-[22rem] items-center justify-center bg-muted/70 p-4 sm:min-h-[34rem] sm:p-8">
            <Image
              src={selectedImage}
              alt={`${service.name} view ${selectedImageIndex + 1}`}
              fill
              sizes="(min-width: 640px) 64rem, 100vw"
              className="object-contain"
            />
            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous product image"
                  onClick={() =>
                    setSelectedImageIndex((current) =>
                      current === 0 ? productImages.length - 1 : current - 1,
                    )
                  }
                  className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-primary shadow-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next product image"
                  onClick={() =>
                    setSelectedImageIndex((current) =>
                      current === productImages.length - 1 ? 0 : current + 1,
                    )
                  }
                  className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-primary shadow-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 flex max-w-[calc(100%-2rem)] -translate-x-1/2 gap-1.5 overflow-x-auto rounded-2xl bg-background/85 p-1.5 shadow-sm backdrop-blur">
                  {productImages.map((image, index) => (
                    <button
                      type="button"
                      key={`viewer-${image}-${index}`}
                      aria-label={`Show product image ${index + 1}`}
                      aria-pressed={selectedImageIndex === index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 ${
                        selectedImageIndex === index ? "border-primary" : "border-transparent opacity-70"
                      }`}
                    >
                      <Image src={image} alt="" fill sizes="44px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-primary">
              Sign in to continue
            </DialogTitle>
            <DialogDescription>
              Sign in to reserve your item, save your delivery details, and
              complete checkout.
            </DialogDescription>
          </DialogHeader>
          <GoogleSignInButton
            redirectTo="/checkout"
            label="Continue with Google"
          />
          <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          <Link
            href="/auth?redirect=%2Fcheckout"
            className="flex w-full justify-center rounded-full border border-primary px-5 py-3 text-sm font-bold text-primary"
          >
            Sign in with email
          </Link>
        </DialogContent>
      </Dialog>
    </div>
  );
}
