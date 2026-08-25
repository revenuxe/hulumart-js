"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- generated database types predate the checkout schema. */

import { useEffect, useState } from "react";
import { Eye, Loader2, PackageCheck, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type FulfilmentStatus =
  | "unfulfilled"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";
type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  line_total: number;
};
type Fulfilment = {
  status: FulfilmentStatus;
  courier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
};
type Order = {
  id: string;
  order_number: string;
  payment_status: string;
  payment_method: string | null;
  fulfilment_status: FulfilmentStatus;
  total: number;
  currency: string;
  shipping_address: Record<string, unknown>;
  customer_note: string | null;
  created_at: string;
  order_items: OrderItem[];
  fulfilments: Fulfilment[];
};
const STATUSES: FulfilmentStatus[] = [
  "unfulfilled",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];
const ORDER_STATUS: Partial<Record<FulfilmentStatus, string>> = {
  processing: "processing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
  returned: "returned",
};
const readable = (value: string | null | undefined) =>
  value ? value.replaceAll("_", " ") : "—";
const money = (value: number, currency: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]),
    [selected, setSelected] = useState<Order | null>(null),
    [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    const { data } = await (createClient() as any)
      .from("orders")
      .select("*, order_items(*), fulfilments(*)")
      .order("created_at", { ascending: false });
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch completion, not the effect body, updates the UI.
    void load();
  }, []);
  async function save(values: Fulfilment) {
    if (!selected) return;
    const client = createClient() as any;
    const mapped = ORDER_STATUS[values.status];
    const [{ error: fulfilmentError }, { error: orderError }] =
      await Promise.all([
        client
          .from("fulfilments")
          .upsert(
            { order_id: selected.id, ...values },
            { onConflict: "order_id" },
          ),
        client
          .from("orders")
          .update(
            mapped
              ? { fulfilment_status: values.status, status: mapped }
              : { fulfilment_status: values.status },
          )
          .eq("id", selected.id),
      ]);
    if (fulfilmentError || orderError)
      throw new Error(fulfilmentError?.message ?? orderError?.message);
    await load();
  }
  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Operations
        </p>
        <h1 className="mt-1 font-display text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review purchases and keep delivery progress up to date.
        </p>
      </div>
      {loading ? (
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Fulfilment</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <b className="block">{order.order_number}</b>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-IN")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {order.order_items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {readable(order.payment_method)}
                      <span className="block text-xs text-muted-foreground">
                        {readable(order.payment_status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {readable(order.fulfilment_status)}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {money(order.total, order.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(order)}
                        aria-label={`View ${order.order_number}`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-9 text-center text-muted-foreground"
                    >
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {selected && (
        <OrderDialog
          order={selected}
          onClose={() => setSelected(null)}
          onSave={save}
        />
      )}
    </section>
  );
}

function OrderDialog({
  order,
  onClose,
  onSave,
}: {
  order: Order;
  onClose: () => void;
  onSave: (values: Fulfilment) => Promise<void>;
}) {
  const current = order.fulfilments[0];
  const [status, setStatus] = useState<FulfilmentStatus>(
      current?.status ?? order.fulfilment_status,
    ),
    [courier, setCourier] = useState(current?.courier ?? ""),
    [trackingNumber, setTrackingNumber] = useState(
      current?.tracking_number ?? "",
    ),
    [trackingUrl, setTrackingUrl] = useState(current?.tracking_url ?? ""),
    [saving, setSaving] = useState(false),
    [error, setError] = useState("");
  const address = order.shipping_address ?? {};
  const lines = [
    address.label,
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pincode,
  ].filter((v): v is string => typeof v === "string" && Boolean(v));
  async function submit() {
    setSaving(true);
    setError("");
    try {
      await onSave({
        status,
        courier: courier.trim() || null,
        tracking_number: trackingNumber.trim() || null,
        tracking_url: trackingUrl.trim() || null,
      });
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not update this order.",
      );
    }
    setSaving(false);
  }
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-primary/25 p-3 backdrop-blur-sm">
      <div className="mx-auto my-4 w-full max-w-2xl rounded-[2rem] bg-card p-5 shadow-2xl sm:my-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              Order
            </p>
            <h2 className="mt-1 font-display text-2xl text-primary">
              {order.order_number}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-muted/60 p-4">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              Delivery address
            </p>
            <p className="mt-2 text-sm font-semibold">
              {lines.join(", ") || "No address snapshot"}
            </p>
            {typeof address.phone === "string" && (
              <p className="mt-1 text-sm text-muted-foreground">
                {address.phone}
              </p>
            )}
          </div>
          <div className="rounded-2xl bg-muted/60 p-4">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              Payment
            </p>
            <p className="mt-2 text-sm font-semibold capitalize">
              {readable(order.payment_method)} ·{" "}
              {readable(order.payment_status)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {money(order.total, order.currency)}
            </p>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-sm font-bold">Items</p>
          <div className="mt-2 divide-y divide-border rounded-2xl border border-border">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-3 px-4 py-3 text-sm"
              >
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <strong>{money(item.line_total, order.currency)}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Fulfilment status
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as FulfilmentStatus)
              }
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 font-normal capitalize"
            >
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {readable(value)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Courier
            <input
              value={courier}
              onChange={(event) => setCourier(event.target.value)}
              placeholder="Optional"
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
            />
          </label>
          <label className="text-sm font-semibold">
            Tracking number
            <input
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder="Optional"
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
            />
          </label>
          <label className="text-sm font-semibold">
            Tracking link
            <input
              type="url"
              value={trackingUrl}
              onChange={(event) => setTrackingUrl(event.target.value)}
              placeholder="Optional"
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
            />
          </label>
        </div>
        {order.customer_note && (
          <p className="mt-4 rounded-2xl bg-muted p-3 text-sm text-muted-foreground">
            {order.customer_note}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => void submit()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            <PackageCheck className="h-4 w-4" />
            {saving ? "Saving…" : "Save fulfilment"}
          </button>
        </div>
      </div>
    </div>
  );
}
