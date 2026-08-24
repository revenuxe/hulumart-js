"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Row = Database["public"]["Tables"]["product_types"]["Row"];
type Parent = { id: string; name: string; categories: { name: string } | null };
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ProductTypesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [parentId, setParentId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    const supabase = createClient();
    const [{ data: types }, { data: subs }] = await Promise.all([
      supabase
        .from("product_types")
        .select("*")
        .order("sort_order")
        .order("name"),
      supabase
        .from("subcategories")
        .select("id,name,categories(name)")
        .order("name"),
    ]);
    setRows(types ?? []);
    setParents((subs as unknown as Parent[]) ?? []);
    setLoading(false);
  }
  /* eslint-disable react-hooks/set-state-in-effect -- initial catalog fetch */
  useEffect(() => {
    void load();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  async function create(event: React.FormEvent) {
    event.preventDefault();
    if (!parentId || !name.trim())
      return setError("Choose a subcategory and enter a product type.");
    setSaving(true);
    setError("");
    const { error: saveError } = await createClient()
      .from("product_types")
      .insert({
        subcategory_id: parentId,
        name: name.trim(),
        slug: slugify(name),
      });
    setSaving(false);
    if (saveError) return setError(saveError.message);
    setName("");
    await load();
  }
  async function remove(row: Row) {
    if (
      !confirm(
        "Delete " +
          row.name +
          "? Products will keep their listing but lose this type.",
      )
    )
      return;
    const { error: removeError } = await createClient()
      .from("product_types")
      .delete()
      .eq("id", row.id);
    if (removeError) return setError(removeError.message);
    await load();
  }
  const parentName = (id: string) => {
    const parent = parents.find((item) => item.id === id);
    return parent
      ? (parent.categories?.name ?? "Category") + " → " + parent.name
      : "Unknown subcategory";
  };
  return (
    <section>
      <div className="mb-5">
        <h2 className="font-display text-2xl">Product types</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Third-level SEO groups: Electronics → Accessories → Keyboards.
        </p>
      </div>
      <form
        onSubmit={create}
        className="grid gap-3 rounded-3xl border border-border bg-card p-5 md:grid-cols-[1fr_1fr_auto]"
      >
        <select
          required
          value={parentId}
          onChange={(event) => setParentId(event.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
        >
          <option value="">Choose subcategory</option>
          {parents.map((item) => (
            <option key={item.id} value={item.id}>
              {(item.categories?.name ?? "Category") + " → " + item.name}
            </option>
          ))}
        </select>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Keyboards"
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
        />
        <button
          disabled={saving}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {saving ? "Creating…" : "Create type"}
        </button>
        {error && (
          <p className="text-sm font-semibold text-destructive md:col-span-3">
            {error}
          </p>
        )}
      </form>
      {loading ? (
        <Loader2 className="mx-auto mt-8 h-5 w-5 animate-spin" />
      ) : rows.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No product types yet.
        </p>
      ) : (
        <div className="mt-5 space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{row.name}</p>
                <p className="text-xs text-muted-foreground">
                  {parentName(row.subcategory_id)} · /{row.slug}
                </p>
              </div>
              <button
                onClick={() => void remove(row)}
                className="rounded-full border border-border p-2 text-destructive"
                aria-label={"Delete " + row.name}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
