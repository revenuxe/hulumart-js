"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { AlertTriangle, Boxes, Loader2, Minus, Plus, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
const INVENTORY_KEY = ["admin", "inventory"];

async function fetchInventory() {
  const { data, error } = await createClient()
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({ queryKey: INVENTORY_KEY, queryFn: fetchInventory });
  const [query, setQuery] = useState("");
  const [adjusting, setAdjusting] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => [product.name, product.sku, product.brand, product.model].some((value) => value?.toLowerCase().includes(term)));
  }, [products, query]);
  const lowStock = products.filter((product) => product.stock_quantity - product.reserved_quantity <= product.low_stock_threshold).length;
  const available = (product: Product) => product.stock_quantity - product.reserved_quantity;

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Inventory</h2>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} listings · {lowStock} low or out of stock</p>
        </div>
        <Link href="/admin/dashboard/products/new" className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow"><Plus className="h-3.5 w-3.5" /> New used item</Link>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Listings" value={products.length} />
        <Metric label="Available units" value={products.reduce((sum, product) => sum + available(product), 0)} />
        <Metric label="Low / out of stock" value={lowStock} warning />
      </div>

      <div className="mb-4 relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, brand, model or SKU…" className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
      </div>

      {isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /> : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card"><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-3 py-3">Item</th><th className="px-3 py-3">Available</th><th className="px-3 py-3">Reserved</th><th className="px-3 py-3">Stock status</th><th className="px-3 py-3" /></tr></thead><tbody>{filtered.map((product) => { const units = available(product); const isLow = units <= product.low_stock_threshold; return <tr key={product.id} className="border-t border-border hover:bg-muted/40"><td className="px-3 py-3"><Link href={`/admin/dashboard/products/${product.id}`} className="font-semibold hover:text-primary">{product.name}</Link><p className="mt-0.5 text-xs text-muted-foreground">{[product.brand, product.model, product.sku].filter(Boolean).join(" · ") || "No SKU"}</p></td><td className="px-3 py-3 font-bold">{units}</td><td className="px-3 py-3 text-muted-foreground">{product.reserved_quantity}</td><td className="px-3 py-3">{isLow ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800"><AlertTriangle className="h-3 w-3" /> {units === 0 ? "Out of stock" : "Low stock"}</span> : <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">In stock</span>}</td><td className="px-3 py-3 text-right"><button onClick={() => setAdjusting(product)} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">Adjust</button></td></tr>; })}</tbody></table></div></div>
      )}
      {!isLoading && filtered.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No listings match that search.</p>}
      {adjusting && <AdjustmentDialog product={adjusting} onClose={() => setAdjusting(null)} onSaved={async () => { setAdjusting(null); await queryClient.invalidateQueries({ queryKey: INVENTORY_KEY }); await fetch("/api/admin/revalidate-catalog", { method: "POST" }); }} />}
    </section>
  );
}

function Metric({ label, value, warning = false }: { label: string; value: number; warning?: boolean }) { return <div className="rounded-2xl border border-border bg-card p-4 shadow-card"><p className="text-xs font-semibold text-muted-foreground">{label}</p><p className={warning ? "mt-2 font-display text-3xl text-amber-700" : "mt-2 font-display text-3xl"}>{value}</p></div>; }

function AdjustmentDialog({ product, onClose, onSaved }: { product: Product; onClose: () => void; onSaved: () => void }) {
  const [delta, setDelta] = useState<number>(1);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function save() { setError(""); if (!Number.isInteger(delta) || delta === 0) return setError("Enter a non-zero whole-number adjustment."); if (!reason.trim()) return setError("Give a reason for this stock change."); setSaving(true); const { error: rpcError } = await createClient().rpc("record_inventory_adjustment", { _product_id: product.id, _quantity_delta: delta, _reason: reason.trim() }); setSaving(false); if (rpcError) return setError(rpcError.message); onSaved(); }
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><div className="w-full max-w-md rounded-3xl bg-card shadow-elevated"><div className="border-b border-border p-5"><h3 className="font-display text-xl">Adjust inventory</h3><p className="mt-1 text-sm text-muted-foreground">{product.name}</p></div><div className="space-y-4 p-5"><label className="block text-sm font-semibold">Quantity change<div className="mt-1 flex gap-2"><button type="button" onClick={() => setDelta((value) => Math.min(-1, value - 1))} className="grid h-10 w-10 place-items-center rounded-xl border"><Minus className="h-4 w-4" /></button><input type="number" step="1" value={delta} onChange={(event) => setDelta(Number(event.target.value))} className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2" /><button type="button" onClick={() => setDelta((value) => Math.max(1, value + 1))} className="grid h-10 w-10 place-items-center rounded-xl border"><Plus className="h-4 w-4" /></button></div></label><label className="block text-sm font-semibold">Reason<textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={3} placeholder="e.g. Received one more unit" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 font-normal" /></label>{error && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p>}</div><div className="flex justify-end gap-2 border-t border-border p-5"><button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={() => void save()} disabled={saving} className="rounded-full bg-gradient-brand px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60">{saving ? "Saving…" : "Save adjustment"}</button></div></div></div>;
}
