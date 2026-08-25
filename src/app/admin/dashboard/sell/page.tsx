"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- generated database types predate sell_leads. */
import { useEffect, useState } from "react";
import { Eye, Loader2, MessageCircle, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
type Lead = {
  id: string;
  name: string;
  phone: string;
  category: string;
  subcategory: string;
  item_name: string;
  item_condition: string;
  description: string | null;
  city: string | null;
  area_or_pincode: string | null;
  status: "new" | "contacted" | "quoted" | "closed";
  created_at: string;
};
export default function SellLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]),
    [selected, setSelected] = useState<Lead | null>(null),
    [savingStatus, setSavingStatus] = useState(false);
  async function load() {
    const { data } = await (createClient() as any)
      .from("sell_leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads(data ?? []);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch completion, not the effect body, updates the UI.
    void load();
  }, []);
  async function updateStatus(status: Lead["status"]) {
    if (!selected) return;
    setSavingStatus(true);
    const { error } = await (createClient() as any)
      .from("sell_leads")
      .update({ status })
      .eq("id", selected.id);
    setSavingStatus(false);
    if (error) return;
    const updated = { ...selected, status };
    setSelected(updated);
    setLeads((rows) => rows.map((lead) => (lead.id === updated.id ? updated : lead)));
  }
  async function remove() {
    if (!selected || !confirm("Delete this sell lead?")) return;
    await (createClient() as any)
      .from("sell_leads")
      .delete()
      .eq("id", selected.id);
    setLeads((x) => x.filter((l) => l.id !== selected.id));
    setSelected(null);
  }
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-widest text-accent">
        Sell Now
      </p>
      <h1 className="mt-2 font-display text-3xl">Leads</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Seller & item</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <b className="block">{l.name}</b>
                    <span className="text-muted-foreground">
                      {l.item_name} · {l.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {l.city || "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">{l.status}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(l)}
                      aria-label="View lead"
                      className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!leads.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No sell leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end bg-primary/25 p-3 backdrop-blur-sm sm:items-center sm:justify-center">
          <article className="w-full max-w-md rounded-[2rem] bg-card p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">
                  Sell lead
                </p>
                <h2 className="mt-1 font-display text-2xl text-primary">
                  {selected.item_name}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Seller</dt>
                <dd className="font-semibold">{selected.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-semibold">{selected.phone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-semibold">
                  {selected.category} · {selected.subcategory}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Condition</dt>
                <dd className="font-semibold">{selected.item_condition}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">City</dt>
                <dd className="font-semibold">{selected.city || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Area / Pincode</dt>
                <dd className="font-semibold">
                  {selected.area_or_pincode || "—"}
                </dd>
              </div>
            </dl>
            <label className="mt-5 block text-sm font-semibold">
              Lead status
              <select
                value={selected.status}
                onChange={(event) => void updateStatus(event.target.value as Lead["status"])}
                disabled={savingStatus}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 font-normal capitalize disabled:opacity-60"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            {savingStatus && <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving status…</div>}
            {selected.description && (
              <p className="mt-5 rounded-2xl bg-muted p-3 text-sm text-muted-foreground">
                {selected.description}
              </p>
            )}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href={`https://wa.me/91${selected.phone.replace(/^91/, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-bold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <button
                onClick={remove}
                className="flex items-center justify-center gap-2 rounded-full border border-destructive py-3 text-sm font-bold text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
