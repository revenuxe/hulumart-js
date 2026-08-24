"use client";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { ProductEditorTabs } from "../product-editor-tabs";
async function options() { const supabase = createClient(); const [{ data: categories }, { data: subcategories }, { data: library }] = await Promise.all([supabase.from("categories").select("id,name").order("name"), supabase.from("subcategories").select("id,name,category_id").order("name"), supabase.from("product_content_library").select("*").order("name")]); return { categories: categories ?? [], subcategories: subcategories ?? [], library: library ?? [] }; }
export default function NewProductPage() { const searchParams = useSearchParams(); const { data, isLoading } = useQuery({ queryKey: ["product-options"], queryFn: options }); if (isLoading || !data) return <Loader2 className="mx-auto h-5 w-5 animate-spin" />; return <ProductEditorTabs product={null} categories={data.categories} subcategories={data.subcategories} library={data.library} defaultCategoryId={searchParams.get("category") ?? undefined} defaultSubcategoryId={searchParams.get("subcategory") ?? undefined} />; }
