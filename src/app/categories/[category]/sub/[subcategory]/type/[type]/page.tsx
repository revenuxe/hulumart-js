import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { ServiceCard } from "@/components/ServiceCard";
import {
  getCategoryBySlug,
  getProductTypesBySubcategory,
  getServicesByCategory,
  getSubcategoryBySlug,
} from "@/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string; type: string }>;
}): Promise<Metadata> {
  const value = await params;
  const sub = await getSubcategoryBySlug(value.category, value.subcategory);
  if (!sub) return {};
  const item = (await getProductTypesBySubcategory(sub.id)).find(
    (entry) => entry.slug === value.type,
  );
  if (!item) return {};
  return {
    title: item.meta_title || "Used " + item.name + " in Bengaluru | Hulumart",
    description:
      item.meta_description ||
      item.tagline ||
      "Shop quality pre-owned " + item.name.toLowerCase() + " on Hulumart.",
    alternates: {
      canonical:
        "/categories/" +
        value.category +
        "/sub/" +
        value.subcategory +
        "/type/" +
        value.type,
    },
  };
}
export default async function ProductTypePage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string; type: string }>;
}) {
  const value = await params;
  const [category, subcategory] = await Promise.all([
    getCategoryBySlug(value.category),
    getSubcategoryBySlug(value.category, value.subcategory),
  ]);
  if (!category || !subcategory) notFound();
  const productType = (await getProductTypesBySubcategory(subcategory.id)).find(
    (item) => item.slug === value.type,
  );
  if (!productType) notFound();
  const products = (await getServicesByCategory(value.category)).filter(
    (item) => item.productTypeId === productType.id,
  );
  return (
    <div className="min-h-dvh bg-background pb-24">
      <TopBar />
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <p className="text-sm font-semibold text-muted-foreground">
          {category.name} → {subcategory.name}
        </p>
        <h1 className="mt-2 font-display text-4xl text-primary">
          {productType.name}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {productType.tagline ||
            "Pre-owned " +
              productType.name.toLowerCase() +
              " checked for quality."}
        </p>
        {products.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {products.map((item) => (
              <ServiceCard key={item.id} service={item} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Products for this type will appear here soon.
          </p>
        )}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
