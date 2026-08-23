import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddressesView, type AddressRow } from "./addresses-view";

export const metadata: Metadata = { title: "Addresses", robots: { index: false, follow: true } };

export default async function AddressesPage({ searchParams }: { searchParams: Promise<{ returnTo?: string; edit?: string }> }) {
  const { returnTo, edit } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?redirect=%2Fprofile%2Faddresses");

  const { data } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return <AddressesView userId={user.id} initialRows={(data ?? []) as AddressRow[]} returnTo={returnTo === "/checkout" ? "/checkout" : undefined} editId={edit} />;
}
