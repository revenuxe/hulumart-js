import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckoutView } from "./checkout-view";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: true } };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ address?: string }> }) {
  const { address: preferredAddressId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth?redirect=%2Fcheckout");
  const { data: addresses } = await supabase.from("addresses").select("id,label,line1,line2,city,state,pincode,phone,is_default").eq("user_id", user.id).order("is_default", { ascending: false });
  return <CheckoutView addresses={addresses ?? []} preferredAddressId={preferredAddressId} />;
}
