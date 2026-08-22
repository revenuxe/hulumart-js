import { unstable_cache } from "next/cache";
import { publicSupabaseClient } from "@/lib/supabase/public";
import { cities } from "./cities";
import type { CatalogCategory, CatalogProduct, CatalogSubcategory, ProductFaq } from "./types";

export type HomepageHeroSlide = {
  id: string;
  desktopImageUrl: string;
  mobileImageUrl: string | null;
  kicker: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  actionUrl: string;
};

type Catalog = { categories: CatalogCategory[]; subcategories: CatalogSubcategory[]; services: CatalogProduct[] };

const getCatalog = unstable_cache(async (): Promise<Catalog> => {
  const supabase = publicSupabaseClient();
  const [{ data: categoryRows, error: categoriesError }, { data: subcategoryRows, error: subcategoriesError }, { data: productRows, error: productsError }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("subcategories").select("*, categories(slug)").order("sort_order"),
    supabase.from("products").select("*, categories(slug), subcategories(slug)").order("sort_order"),
  ]);
  if (categoriesError || subcategoriesError || productsError) throw categoriesError ?? subcategoriesError ?? productsError;

  const categories: CatalogCategory[] = (categoryRows ?? []).map((row) => ({
    id: row.id, slug: row.slug, name: row.name, tagline: row.tagline ?? "",
    accent: row.accent ?? "from-slate-900/80 to-indigo-700/70", heroImage: row.image_url ?? "",
    sortOrder: row.sort_order, updatedAt: row.updated_at,
  }));
  const subcategories: CatalogSubcategory[] = (subcategoryRows ?? []).map((row) => ({
    id: row.id, slug: row.slug, categorySlug: row.categories?.slug ?? "", name: row.name,
    tagline: row.tagline ?? "", image: row.image_url ?? "", sortOrder: row.sort_order, updatedAt: row.updated_at,
  }));
  const services: CatalogProduct[] = (productRows ?? []).map((row) => {
    const priceDiscounted = row.sale_price ?? row.price;
    return {
      id: row.id, slug: row.slug, categorySlug: row.categories?.slug ?? "", subcategorySlug: row.subcategories?.slug ?? undefined,
      name: row.name, tagline: row.tagline ?? "", description: row.description ?? "", brand: row.brand ?? undefined,
      model: row.model ?? undefined, conditionGrade: row.condition_grade, conditionSummary: row.condition_summary ?? undefined,
      approximateAgeMonths: row.approximate_age_months ?? undefined, usageSummary: row.usage_summary ?? undefined,
      warrantyStatus: row.warranty_status, warrantyProvider: row.warranty_provider ?? undefined,
      warrantyExpiresAt: row.warranty_expires_at ?? undefined, warrantyCoverage: row.warranty_coverage ?? undefined,
      warrantyTransferable: row.warranty_transferable, stockQuantity: row.stock_quantity, reservedQuantity: row.reserved_quantity,
      images: row.images ?? [], priceOriginal: row.price, priceDiscounted,
      discountPct: row.sale_price != null && row.price > 0 ? Math.round(((row.price - row.sale_price) / row.price) * 100) : 0,
      rating: row.rating, reviewCount: row.review_count, included: row.included ?? [], notIncluded: row.not_included ?? [],
      faqs: ((row.faqs ?? []) as ProductFaq[]).filter((faq) => typeof faq?.question === "string" && typeof faq?.answer === "string"),
      deliveryInfo: row.delivery_info ?? undefined, careInfo: row.care_info ?? undefined, tags: row.tags ?? [], sortOrder: row.sort_order,
      isFeatured: row.is_featured, isTrending: row.is_trending, metaTitle: row.meta_title ?? undefined,
      metaDescription: row.meta_description ?? undefined, ogImage: row.og_image_url ?? undefined, updatedAt: row.updated_at,
    };
  });
  return { categories, subcategories, services };
}, ["product-catalog"], { revalidate: 60, tags: ["catalog"] });

export async function getCategories() { return (await getCatalog()).categories; }
export async function getCategoryBySlug(slug: string) { return (await getCatalog()).categories.find((item) => item.slug === slug); }
export async function getSubcategoriesByCategory(categorySlug: string) { return (await getCatalog()).subcategories.filter((item) => item.categorySlug === categorySlug); }
export async function getAllSubcategories() { return (await getCatalog()).subcategories; }
export async function getAllServices() { return (await getCatalog()).services; }
export async function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string) { return (await getCatalog()).subcategories.find((item) => item.categorySlug === categorySlug && item.slug === subcategorySlug); }
export async function getServicesByCategory(categorySlug: string) { return (await getCatalog()).services.filter((item) => item.categorySlug === categorySlug); }
export async function getServiceBySlug(categorySlug: string, serviceSlug: string) { return (await getCatalog()).services.find((item) => item.categorySlug === categorySlug && item.slug === serviceSlug); }
export async function getTrendingServices(limit = 8) { return (await getCatalog()).services.filter((item) => item.isTrending).slice(0, limit); }
export async function getFeaturedServices(limit = 8) { return (await getCatalog()).services.filter((item) => item.isFeatured).slice(0, limit); }
export async function getRelatedServices(service: CatalogProduct, limit = 4) {
  const services = (await getCatalog()).services;
  const sameCategory = services.filter((item) => item.categorySlug === service.categorySlug && item.slug !== service.slug);
  return [...sameCategory, ...services.filter((item) => item.categorySlug !== service.categorySlug && item.slug !== service.slug)].slice(0, limit);
}

export { cities };
export type { CatalogCategory, CatalogProduct, CatalogSubcategory } from "./types";
export type { DecorCategory, DecorService, DecorSubcategory } from "./types";

export const getHomepageHeroSlides = unstable_cache(async (): Promise<HomepageHeroSlide[]> => {
  const { data, error } = await publicSupabaseClient().from("homepage_hero_slides").select("*").eq("is_active", true).order("sort_order");
  if (error) throw error;
  return (data ?? []).map((slide) => ({ id: slide.id, desktopImageUrl: slide.desktop_image_url, mobileImageUrl: slide.mobile_image_url, kicker: slide.kicker, title: slide.title, subtitle: slide.subtitle, actionLabel: slide.action_label, actionUrl: slide.action_url }));
}, ["homepage-hero"], { revalidate: 3600, tags: ["homepage-hero"] });
