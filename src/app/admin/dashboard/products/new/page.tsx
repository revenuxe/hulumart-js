"use client";

import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { ProductForm } from "../product-form";

const PRODUCT_FORM_OPTIONS_QUERY_KEY = ["admin", "product-form-options"];
type BalloonPaletteOption = { id: string; name: string; pairs: { id: string; color1: { name: string; hex: string }; color2: { name: string; hex: string } }[] };

async function fetchProductFormOptions() {
  const supabase = createClient();
  const [{ data: cats, error: categoriesError }, { data: subs, error: subcategoriesError }, { data: products, error: productsError }, { data: addons, error: addonsError }, { data: paletteRows, error: palettesError }] = await Promise.all([
    supabase.from("categories").select("id,name").order("name"),
    supabase.from("subcategories").select("id,name,category_id").order("name"),
    supabase.from("products").select("tags"),
    supabase.from("addons").select("id,name,price").order("sort_order"),
    supabase.from("decoration_content_items").select("id,name,content").eq("kind", "balloon_palette").eq("is_active", true).order("name"),
  ]);
  if (categoriesError || subcategoriesError || productsError || addonsError || palettesError) {
    throw categoriesError ?? subcategoriesError ?? productsError ?? addonsError ?? palettesError;
  }
  const tagSet = new Set<string>();
  for (const product of products ?? []) for (const tag of product.tags) tagSet.add(tag);
  return {
    categories: cats ?? [],
    subcategories: subs ?? [],
    allTags: Array.from(tagSet).sort(),
    allAddons: addons ?? [],
    balloonPalettes: ((paletteRows ?? []) as unknown as { id: string; name: string; content: { pairs?: BalloonPaletteOption["pairs"] } }[]).map((palette) => ({ id: palette.id, name: palette.name, pairs: palette.content.pairs ?? [] })),
  };
}

export default function NewProductPage() {
  const searchParams = useSearchParams();
  const defaultCategoryId = searchParams.get("category") ?? undefined;
  const defaultSubcategoryId = searchParams.get("subcategory") ?? undefined;

  const { data: options, isLoading } = useQuery({
    queryKey: PRODUCT_FORM_OPTIONS_QUERY_KEY,
    queryFn: fetchProductFormOptions,
  });

  if (isLoading || !options) return <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />;

  return (
    <ProductForm
      product={null}
      categories={options.categories}
      subcategories={options.subcategories}
      allTags={options.allTags}
      allAddons={options.allAddons}
      balloonPalettes={options.balloonPalettes}
      defaultCategoryId={defaultCategoryId}
      defaultSubcategoryId={defaultSubcategoryId}
    />
  );
}
