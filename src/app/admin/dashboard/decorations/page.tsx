"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Check, CircleHelp, Copy, HeartHandshake, Loader2, Palette, Plus, Trash2, Truck, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/types";

type BalloonColor = { name: string; hex: string };
type BalloonPair = { id: string; color1: BalloonColor; color2: BalloonColor; sortOrder: number };
type BalloonPalette = { id: string; name: string; pairs: BalloonPair[]; created_at: string; updated_at: string };
type Tab = "palettes" | "included" | "faqs" | "delivery" | "care";

const TABS: { key: Tab; label: string; icon: typeof Palette; kind: "balloon_palette" | "included_set" | "faq_set" | "delivery_note" | "care_note" }[] = [
  { key: "palettes", label: "Balloon palettes", icon: Palette, kind: "balloon_palette" },
  { key: "included", label: "What's included", icon: Check, kind: "included_set" },
  { key: "faqs", label: "FAQs", icon: CircleHelp, kind: "faq_set" },
  { key: "delivery", label: "Delivery", icon: Truck, kind: "delivery_note" },
  { key: "care", label: "Care info", icon: HeartHandshake, kind: "care_note" },
];

const EMPTY_PAIR = (): BalloonPair => ({
  id: crypto.randomUUID(), sortOrder: 0,
  color1: { name: "", hex: "#ffffff" }, color2: { name: "", hex: "#000000" },
});

function isHex(value: string) { return /^#[0-9a-f]{6}$/i.test(value); }
function readPairs(content: Json): BalloonPair[] {
  const pairs = content && typeof content === "object" && !Array.isArray(content) && "pairs" in content ? content.pairs : null;
  if (!Array.isArray(pairs)) return [];
  return pairs.filter((pair): pair is BalloonPair => !!pair && typeof pair === "object" && "color1" in pair && "color2" in pair)
    .map((pair, index) => ({ ...pair, sortOrder: index }));
}

async function fetchPalettes(): Promise<BalloonPalette[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("decoration_content_items").select("id,name,content,created_at,updated_at").eq("kind", "balloon_palette").order("name");
  if (error) throw error;
  return ((data ?? []) as unknown as { id: string; name: string; content: Json; created_at: string; updated_at: string }[]).map((row) => ({ ...row, pairs: readPairs(row.content) }));
}

export default function DecorationsPage() {
  const [active, setActive] = useState<Tab>("palettes");
  const [editing, setEditing] = useState<BalloonPalette | null | undefined>(undefined);
  const { data: palettes = [], isLoading: loading, refetch } = useQuery({ queryKey: ["admin", "balloon-palettes"], queryFn: fetchPalettes });
  const loadPalettes = () => { void refetch(); };

  const tab = TABS.find((item) => item.key === active)!;
  return <section>
    <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="font-display text-2xl">Decorations</h2><p className="mt-1 text-sm text-muted-foreground">Reusable content that can be assigned to products.</p></div>
      <button onClick={() => active === "palettes" ? setEditing(null) : undefined} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow"><Plus className="h-3.5 w-3.5" />Create</button>
    </div>
    <div className="rounded-2xl border border-border bg-card"><div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-border p-3">{TABS.map((item) => { const Icon = item.icon; return <button key={item.key} onClick={() => setActive(item.key)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold ${active === item.key ? "bg-gradient-brand text-primary-foreground shadow-glow" : "border border-border bg-background"}`}><Icon className="h-3.5 w-3.5" />{item.label}</button>; })}</div>
      <div className="p-5">{active === "palettes" ? <PaletteList palettes={palettes} loading={loading} onCreate={() => setEditing(null)} onEdit={setEditing} onChanged={loadPalettes} /> : <p className="py-8 text-center text-sm text-muted-foreground">Manage reusable {tab.label.toLowerCase()} from the existing content library.</p>}</div>
    </div>
    {editing !== undefined && <PaletteEditor palette={editing} onClose={() => setEditing(undefined)} onSaved={() => { setEditing(undefined); void loadPalettes(); }} />}
  </section>;
}

function PaletteList({ palettes, loading, onCreate, onEdit, onChanged }: { palettes: BalloonPalette[]; loading: boolean; onCreate: () => void; onEdit: (palette: BalloonPalette) => void; onChanged: () => void }) {
  async function duplicate(palette: BalloonPalette) {
    const supabase = createClient();
    const { error } = await supabase.from("decoration_content_items").insert({ kind: "balloon_palette", name: `${palette.name} copy`, content: { pairs: palette.pairs } });
    if (error) return alert(error.message);
    onChanged();
  }
  async function remove(palette: BalloonPalette) {
    const supabase = createClient();
    const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("balloon_palette_id", palette.id);
    const suffix = count ? `\n\nThis palette is assigned to ${count} product${count === 1 ? "" : "s"}. Deleting it will remove those assignments.` : "";
    if (!confirm(`Delete “${palette.name}”?${suffix}`)) return;
    const { error } = await supabase.from("decoration_content_items").delete().eq("id", palette.id);
    if (error) return alert(error.message);
    onChanged();
  }
  if (loading) return <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />;
  if (!palettes.length) return <div className="py-10 text-center"><Palette className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-semibold">No balloon palettes yet.</p><p className="mt-1 text-sm text-muted-foreground">Create reusable balloon colour combinations that can be assigned to products.</p><button onClick={onCreate} className="mt-4 rounded-full bg-gradient-brand px-4 py-2 text-xs font-bold text-primary-foreground">Create Balloon Palette</button></div>;
  return <div className="space-y-3">{palettes.map((palette) => <div key={palette.id} className="rounded-2xl border border-border bg-background p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{palette.name}</h3><p className="mt-1 text-xs text-muted-foreground">{palette.pairs.length} pair{palette.pairs.length === 1 ? "" : "s"}</p><div className="mt-3 flex flex-wrap gap-2">{palette.pairs.slice(0, 6).map((pair) => <PairPreview key={pair.id} pair={pair} />)}{palette.pairs.length > 6 && <span className="text-xs text-muted-foreground">+ {palette.pairs.length - 6} more</span>}</div></div><div className="flex gap-2"><button onClick={() => onEdit(palette)} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">Edit</button><button onClick={() => duplicate(palette)} aria-label="Duplicate palette" className="grid h-8 w-8 place-items-center rounded-full border border-border"><Copy className="h-3.5 w-3.5" /></button><button onClick={() => remove(palette)} aria-label="Delete palette" className="grid h-8 w-8 place-items-center rounded-full border border-border text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></div></div></div>)}</div>;
}

function PairPreview({ pair }: { pair: BalloonPair }) { return <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"><i className="h-3 w-3 rounded-full border" style={{ backgroundColor: pair.color1.hex }} />{pair.color1.name}<span>+</span><i className="h-3 w-3 rounded-full border" style={{ backgroundColor: pair.color2.hex }} />{pair.color2.name}</span>; }

function PaletteEditor({ palette, onClose, onSaved }: { palette: BalloonPalette | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(palette?.name ?? "");
  const [pairs, setPairs] = useState<BalloonPair[]>(palette?.pairs.length ? palette.pairs : [EMPTY_PAIR()]);
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  function updatePair(index: number, color: "color1" | "color2", field: keyof BalloonColor, value: string) { setPairs((current) => current.map((pair, pairIndex) => pairIndex === index ? { ...pair, [color]: { ...pair[color], [field]: value } } : pair)); }
  function move(index: number, direction: -1 | 1) { const to = index + direction; if (to < 0 || to >= pairs.length) return; setPairs((current) => { const next = [...current]; [next[index], next[to]] = [next[to], next[index]]; return next.map((pair, order) => ({ ...pair, sortOrder: order })); }); }
  function insertPairAfter(index: number) { setPairs((current) => [...current.slice(0, index + 1), { ...EMPTY_PAIR(), sortOrder: index + 1 }, ...current.slice(index + 1)].map((pair, sortOrder) => ({ ...pair, sortOrder }))); }
  async function save() { const cleanName = name.trim(); if (!cleanName) return setError("Palette name is required."); if (!pairs.length) return setError("Add at least one colour pair."); if (pairs.some((pair) => !pair.color1.name.trim() || !pair.color2.name.trim() || !isHex(pair.color1.hex) || !isHex(pair.color2.hex))) return setError("Every pair needs two colour names and valid HEX values."); if (new Set(pairs.map((pair) => `${pair.color1.hex.toLowerCase()}|${pair.color2.hex.toLowerCase()}`)).size !== pairs.length) return setError("Each colour pair must be unique."); setSaving(true); const supabase = createClient(); const content = { pairs: pairs.map((pair, sortOrder) => ({ ...pair, sortOrder })) }; const result = palette ? await supabase.from("decoration_content_items").update({ name: cleanName, content }).eq("id", palette.id) : await supabase.from("decoration_content_items").insert({ kind: "balloon_palette", name: cleanName, content }); setSaving(false); if (result.error) return setError(result.error.code === "23505" ? "A balloon palette with this name already exists." : result.error.message); await fetch("/api/admin/revalidate-catalog", { method: "POST" }); onSaved(); }
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"><div className="mx-auto my-8 max-w-3xl rounded-3xl bg-card shadow-elevated"><div className="flex items-center justify-between border-b border-border p-5"><div><h2 className="font-display text-2xl">{palette ? "Edit balloon palette" : "Create balloon palette"}</h2><p className="mt-1 text-sm text-muted-foreground">Add as many reusable two-colour pairs as you need.</p></div><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-border"><X className="h-4 w-4" /></button></div><div className="space-y-4 p-5"><label className="block text-sm font-semibold">Palette name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Black Orange Luxury" className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-primary" /></label>{pairs.map((pair, index) => <div key={pair.id} className="rounded-2xl border border-border p-4"><div className="mb-3 flex items-center justify-between"><p className="font-semibold">Pair {index + 1}</p><div className="flex gap-1"><button onClick={() => insertPairAfter(index)} title="Add pair after this one" aria-label="Add another pair" className="grid h-8 w-8 place-items-center rounded-full border border-primary/30 text-primary hover:bg-primary/10"><Plus className="h-3.5 w-3.5" /></button><button onClick={() => move(index, -1)} disabled={index === 0} className="grid h-8 w-8 place-items-center rounded-full border disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button><button onClick={() => move(index, 1)} disabled={index === pairs.length - 1} className="grid h-8 w-8 place-items-center rounded-full border disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button><button onClick={() => setPairs((current) => current.filter((_, pairIndex) => pairIndex !== index))} disabled={pairs.length === 1} className="grid h-8 w-8 place-items-center rounded-full border text-destructive disabled:opacity-30"><Trash2 className="h-3.5 w-3.5" /></button></div></div><div className="grid gap-3 sm:grid-cols-2">{(["color1", "color2"] as const).map((color, colorIndex) => <div key={color} className="rounded-xl bg-muted/50 p-3"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Color {colorIndex + 1}</p><div className="flex gap-2"><input type="color" value={pair[color].hex} onChange={(event) => updatePair(index, color, "hex", event.target.value)} className="h-10 w-10 rounded-lg border p-1" /><div className="min-w-0 flex-1 space-y-2"><input value={pair[color].name} onChange={(event) => updatePair(index, color, "name", event.target.value)} placeholder="Color name" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm" /><input value={pair[color].hex} onChange={(event) => updatePair(index, color, "hex", event.target.value)} placeholder="#RRGGBB" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 font-mono text-xs" /></div></div></div>)}</div></div>)}<button onClick={() => setPairs((current) => [...current, { ...EMPTY_PAIR(), sortOrder: current.length }])} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-semibold"><Plus className="h-4 w-4" />Add another pair</button>{error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{error}</p>}</div><div className="flex justify-end gap-2 border-t border-border p-5"><button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{saving ? "Saving" : "Save Palette"}</button></div></div></div>;
}
