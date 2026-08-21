import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import type { DecorCategory } from "@/data/types";

export function CategoryStrip({ categories }: { categories: DecorCategory[] }) {
  return (
    <section className="mx-auto w-full max-w-md px-6 pb-14 md:max-w-7xl md:px-8 md:pb-20">
      <div className="relative mb-7 md:mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Choose an occasion</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary md:text-[30px]">Find your celebration</h2>
        </div>
        <Link href="/categories" className="absolute bottom-0 right-0 inline-flex min-h-10 items-center gap-1 rounded-full bg-primary/5 px-3 text-sm font-semibold text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          All categories <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-6 md:gap-5">
        {categories.slice(0, 6).map((category) => (
          <CategoryCard key={category.slug} href={`/categories/${category.slug}`} image={category.heroImage} name={category.name} tagline={category.tagline} />
        ))}
      </div>
    </section>
  );
}
