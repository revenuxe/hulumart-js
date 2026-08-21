import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { DecorService } from "@/data/types";

export function ServiceCard({ service, size = "sm" }: { service: DecorService; badge?: "trending" | "featured"; size?: "sm" | "md" }) {
  return (
    <Link href={`/categories/${service.categorySlug}/${service.slug}`} className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all active:scale-[0.98] md:hover:-translate-y-1 md:hover:shadow-elevated">
      <div className={`relative overflow-hidden ${size === "md" ? "aspect-[4/3]" : "aspect-square"}`}>
        <Image src={service.images[0]} alt={service.name} fill loading="lazy" sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary shadow-sm backdrop-blur">Setup</span>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-9 text-[15px] font-bold leading-tight text-primary">{service.name}</h3>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-0.5 rounded-full bg-[#12ad4b] px-1.5 py-0.5 font-bold text-white">
            <Star className="h-3 w-3 fill-current" />
            {service.rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            {service.reviewCount.toLocaleString("en-IN")} {service.reviewCount === 1 ? "review" : "reviews"}
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5 border-t border-border pt-3"><span className="text-base font-bold text-primary">₹{service.priceDiscounted.toLocaleString("en-IN")}</span>{service.priceOriginal > service.priceDiscounted && <span className="text-[11px] text-muted-foreground line-through">₹{service.priceOriginal.toLocaleString("en-IN")}</span>}</div>
        <span className="mt-3 flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground transition-colors group-hover:bg-brand-purple">Book now</span>
      </div>
    </Link>
  );
}
