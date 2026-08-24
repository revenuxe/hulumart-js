"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ProductEditorTabs } from "../product-editor-tabs";
import type { Database } from "@/lib/supabase/types";
type Product = Database["public"]["Tables"]["products"]["Row"];
export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [subcategories, setSubcategories] = useState<
    { id: string; name: string; category_id: string }[]
  >([]);
  const [productTypes, setProductTypes] = useState<
    { id: string; name: string; subcategory_id: string }[]
  >([]);
  const [library, setLibrary] = useState<
    Database["public"]["Tables"]["product_content_library"]["Row"][]
  >([]);
  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("products").select("*").eq("id", id).single(),
      supabase.from("categories").select("id,name").order("name"),
      supabase
        .from("subcategories")
        .select("id,name,category_id")
        .order("name"),
      supabase
        .from("product_types")
        .select("id,name,subcategory_id")
        .order("name"),
      supabase.from("product_content_library").select("*").order("name"),
    ]).then(
      ([
        productResult,
        categoriesResult,
        subcategoriesResult,
        productTypesResult,
        libraryResult,
      ]) => {
        setProduct(productResult.data ?? null);
        setCategories(categoriesResult.data ?? []);
        setSubcategories(subcategoriesResult.data ?? []);
        setProductTypes(productTypesResult.data ?? []);
        setLibrary(libraryResult.data ?? []);
      },
    );
  }, [id]);
  if (product === undefined)
    return <Loader2 className="mx-auto h-5 w-5 animate-spin" />;
  if (!product)
    return <p className="text-sm text-muted-foreground">Product not found.</p>;
  return (
    <ProductEditorTabs
      product={product}
      categories={categories}
      subcategories={subcategories}
      productTypes={productTypes}
      library={library}
    />
  );
}
