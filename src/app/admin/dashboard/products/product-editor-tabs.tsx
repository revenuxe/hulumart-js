"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Database, Json } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/client";
import { GalleryUploadField } from "@/components/admin/GalleryUploadField";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = { id: string; name: string };
type Subcategory = { id: string; name: string; category_id: string };
type ProductType = { id: string; name: string; subcategory_id: string };
type LibraryItem =
  Database["public"]["Tables"]["product_content_library"]["Row"];
type Faq = { question: string; answer: string };
type Props = {
  product: Product | null;
  categories: Category[];
  subcategories: Subcategory[];
  productTypes: ProductType[];
  library: LibraryItem[];
  defaultCategoryId?: string;
  defaultSubcategoryId?: string;
};
type Tab = "product" | "configuration" | "content" | "media" | "seo";
type ProductDraft = {
  fields: Record<string, string>;
  categoryId: string;
  images: string[];
  included: string;
  notIncluded: string;
  faqs: Faq[];
  deliveryInfo: string;
  careInfo: string;
  specifications: Record<string, string>;
};
const field =
  "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary";
const textarea = `${field} min-h-24 resize-y`;
const list = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const CONFIGURATION_TEMPLATES = {
  Laptop: [
    "Processor",
    "RAM",
    "Storage",
    "Graphics",
    "Display",
    "Operating system",
    "Battery health",
    "Ports",
  ],
  Mobile: [
    "Processor",
    "RAM",
    "Storage",
    "Display",
    "Battery health",
    "Camera",
    "Network / SIM",
    "Operating system",
  ],
  Smartwatch: [
    "Brand / model",
    "Case size",
    "Display",
    "Connectivity",
    "Battery health",
    "Health sensors",
    "Water resistance",
    "Compatibility",
  ],
  Appliance: [
    "Brand / model",
    "Capacity",
    "Energy rating",
    "Power consumption",
    "Dimensions",
    "Colour",
    "Key features",
    "Installation",
  ],
  Furniture: [
    "Material",
    "Dimensions",
    "Colour / finish",
    "Seating / storage",
    "Assembly",
    "Condition notes",
  ],
  Clothing: [
    "Brand",
    "Size",
    "Fit",
    "Material",
    "Colour",
    "Pattern",
    "Care instructions",
    "Condition",
  ],
  Other: [],
} as const;
type ConfigurationTemplate = keyof typeof CONFIGURATION_TEMPLATES;
const templateFor = (value: string): ConfigurationTemplate => {
  const name = value.toLowerCase();
  if (/(laptop|notebook|macbook)/.test(name)) return "Laptop";
  if (/(mobile|phone|iphone|smartphone)/.test(name)) return "Mobile";
  if (/(watch|wearable)/.test(name)) return "Smartwatch";
  if (/(appliance|refrigerator|washing|air conditioner|microwave)/.test(name))
    return "Appliance";
  if (/(furniture|sofa|bed|table|chair|wardrobe)/.test(name))
    return "Furniture";
  if (/(clothing|cloth|apparel|fashion)/.test(name)) return "Clothing";
  return "Other";
};
const parseFaqs = (value: Json): Faq[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is Faq =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as Faq).question === "string" &&
          typeof (item as Faq).answer === "string",
      )
    : [];
const parseSpecifications = (value: Json): Record<string, string> =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? Object.fromEntries(
        Object.entries(value)
          .filter((entry): entry is [string, string | number | boolean] =>
            ["string", "number", "boolean"].includes(typeof entry[1]),
          )
          .map(([key, item]) => [key, String(item)]),
      )
    : {};
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Panel({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={active ? "space-y-4" : "hidden"}>{children}</section>
  );
}
function ContentSelector({
  kind,
  label,
  items,
  onApply,
}: {
  kind: string;
  label: string;
  items: LibraryItem[];
  onApply: (id: string, kind: string) => void;
}) {
  return (
    <Field label={`Apply saved ${label}`}>
      <select
        defaultValue=""
        onChange={(event) => onApply(event.target.value, kind)}
        className={field}
      >
        <option value="">Choose a saved {label.toLowerCase()}…</option>
        {items
          .filter((item) => item.kind === kind && item.is_active)
          .map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
      </select>
    </Field>
  );
}
function ConfigurationFields({
  values,
  onChange,
  suggestedTemplate,
}: {
  values: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  suggestedTemplate: ConfigurationTemplate;
}) {
  const [template, setTemplate] =
    useState<ConfigurationTemplate>(suggestedTemplate);
  const entries = Object.entries(values);
  const setEntry = (index: number, part: 0 | 1, value: string) => {
    const next = entries
      .map((entry, i) =>
        i === index
          ? part === 0
            ? [value, entry[1]]
            : [entry[0], value]
          : entry,
      )
      .filter(([key]) => key.trim());
    onChange(Object.fromEntries(next));
  };
  return (
    <div className="space-y-4 rounded-3xl border border-border bg-card p-5">
      <div>
        <h3 className="font-display text-xl">Configuration</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add the hardware or product details buyers need to compare.
        </p>
      </div>
      <div className="grid gap-3">
        {entries.map(([key, value], index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
            <input
              value={key}
              onChange={(event) => setEntry(index, 0, event.target.value)}
              placeholder="e.g. RAM"
              className={field}
            />
            <input
              value={value}
              onChange={(event) => setEntry(index, 1, event.target.value)}
              placeholder="e.g. 16 GB"
              className={field}
            />
            <button
              type="button"
              onClick={() =>
                onChange(
                  Object.fromEntries(entries.filter((_, i) => i !== index)),
                )
              }
              className="rounded-full border border-destructive px-3 text-sm font-bold text-destructive"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div>
        <p className="text-sm font-semibold">Start with a product type</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            Object.keys(CONFIGURATION_TEMPLATES) as ConfigurationTemplate[]
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTemplate(item)}
              className={`rounded-full border px-3 py-2 text-xs font-bold ${template === item ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
            >
              {item}
            </button>
          ))}
        </div>
        {template !== "Other" && (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...Object.fromEntries(
                  CONFIGURATION_TEMPLATES[template].map((key) => [
                    key,
                    values[key] ?? "",
                  ]),
                ),
                ...values,
              })
            }
            className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
          >
            Add {template} fields
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange({ ...values, "": "" })}
        className="w-fit rounded-full border border-border px-4 py-2 text-sm font-bold"
      >
        + Add custom detail
      </button>
    </div>
  );
}

export function ProductEditorTabs({
  product,
  categories,
  subcategories,
  productTypes,
  library,
  defaultCategoryId,
  defaultSubcategoryId,
}: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const draftKey = `hulumart-product-draft-${product?.id ?? "new"}`;
  const [tab, setTab] = useState<Tab>("product");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(product?.slug));
  const [categoryId, setCategoryId] = useState(
    product?.category_id ?? defaultCategoryId ?? "",
  );
  const [subcategoryId, setSubcategoryId] = useState(
    product?.subcategory_id ?? defaultSubcategoryId ?? "",
  );
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [included, setIncluded] = useState(
    (product?.included ?? []).join("\n"),
  );
  const [notIncluded, setNotIncluded] = useState(
    (product?.not_included ?? []).join("\n"),
  );
  const [specifications, setSpecifications] = useState<Record<string, string>>(
    () => parseSpecifications(product?.specifications ?? {}),
  );
  const [faqs, setFaqs] = useState<Faq[]>(parseFaqs(product?.faqs ?? []));
  const [deliveryInfo, setDeliveryInfo] = useState(
    product?.delivery_info ?? "",
  );
  const [careInfo, setCareInfo] = useState(product?.care_info ?? "");
  const selectedSubcategoryName =
    subcategories.find((item) => item.id === subcategoryId)?.name ?? "";
  const saveDraft = (form: HTMLFormElement) => {
    const fields = Object.fromEntries(
      Array.from(new FormData(form).entries())
        .filter(([, value]) => typeof value === "string")
        .map(([key, value]) => [key, String(value)]),
    );
    localStorage.setItem(
      draftKey,
      JSON.stringify({
        fields,
        categoryId,
        images,
        included,
        notIncluded,
        faqs,
        deliveryInfo,
        careInfo,
        specifications,
      } satisfies ProductDraft),
    );
  };
  /* eslint-disable react-hooks/set-state-in-effect -- restoring persisted form state after mount */
  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (!saved) return;
    try {
      const draft = JSON.parse(saved) as ProductDraft;
      setName(draft.fields?.name ?? "");
      setSlug(draft.fields?.slug ?? "");
      setSlugEdited(Boolean(draft.fields?.slug));
      setCategoryId(draft.categoryId || categoryId);
      setImages(draft.images ?? []);
      setIncluded(draft.included ?? "");
      setNotIncluded(draft.notIncluded ?? "");
      setFaqs(draft.faqs ?? []);
      setDeliveryInfo(draft.deliveryInfo ?? "");
      setCareInfo(draft.careInfo ?? "");
      setSpecifications(draft.specifications ?? {});
      requestAnimationFrame(() => {
        const form = formRef.current;
        if (!form) return;
        Object.entries(draft.fields ?? {}).forEach(([fieldName, value]) => {
          const element = form.elements.namedItem(fieldName);
          if (
            element instanceof HTMLInputElement &&
            element.type === "checkbox"
          )
            element.checked = value === "on";
          else if (
            element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement ||
            element instanceof HTMLSelectElement
          )
            element.value = value;
        });
      });
      setMessage("Your unsaved draft was restored.");
    } catch {
      localStorage.removeItem(draftKey);
    }
    // Restore once per listing; the initial prop values are intentionally the fallback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);
  /* eslint-enable react-hooks/set-state-in-effect */
  function applyLibrary(id: string, kind: string) {
    const item = library.find((entry) => entry.id === id);
    if (!item) return;
    if (kind === "included_set") {
      setIncluded(item.included.join("\n"));
      setNotIncluded(item.not_included.join("\n"));
    }
    if (kind === "faq_set") setFaqs(parseFaqs(item.faqs));
    if (kind === "delivery_note") setDeliveryInfo(item.body ?? "");
    if (kind === "care_note") setCareInfo(item.body ?? "");
  }
  function updateFaq(index: number, key: keyof Faq, value: string) {
    setFaqs((items) =>
      items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  }
  async function submit(form: FormData) {
    if (formRef.current) saveDraft(formRef.current);
    if (uploading)
      return setMessage("Wait for image uploads to finish before saving.");
    if (!images.length)
      return setMessage("Add at least one product image before saving.");
    setSaving(true);
    setMessage("");
    const productName = name.trim();
    const productSlug = slug.trim() || slugify(productName);
    const payload = {
      name: productName,
      slug: productSlug,
      category_id: categoryId,
      subcategory_id: subcategoryId || null,
      product_type_id: String(form.get("product_type_id") ?? "") || null,
      brand: String(form.get("brand") ?? "").trim() || null,
      model: String(form.get("model") ?? "").trim() || null,
      sku: String(form.get("sku") ?? "").trim() || null,
      condition_grade: String(
        form.get("condition_grade") ?? "good",
      ) as Product["condition_grade"],
      stock_quantity: Math.max(0, Number(form.get("stock_quantity") || 0)),
      price: Math.max(0, Number(form.get("price") || 0)),
      sale_price: Number(form.get("sale_price") || 0) || null,
      approximate_age_months:
        Number(form.get("approximate_age_months") || 0) || null,
      tagline: String(form.get("tagline") ?? "").trim() || null,
      description: String(form.get("description") ?? "").trim() || null,
      condition_summary:
        String(form.get("condition_summary") ?? "").trim() || null,
      usage_summary: String(form.get("usage_summary") ?? "").trim() || null,
      included: list(included),
      not_included: list(notIncluded),
      faqs: faqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
      delivery_info: deliveryInfo.trim() || null,
      care_info: careInfo.trim() || null,
      warranty_status: String(
        form.get("warranty_status") ?? "none",
      ) as Product["warranty_status"],
      warranty_provider:
        String(form.get("warranty_provider") ?? "").trim() || null,
      warranty_coverage:
        String(form.get("warranty_coverage") ?? "").trim() || null,
      images,
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      meta_title: String(form.get("meta_title") ?? "").trim() || null,
      meta_description:
        String(form.get("meta_description") ?? "").trim() || null,
      og_image_url: String(form.get("og_image_url") ?? "").trim() || null,
      is_active: form.get("is_active") === "on",
      is_featured: form.get("is_featured") === "on",
      is_trending: form.get("is_trending") === "on",
    };
    Object.assign(payload, {
      specifications: Object.fromEntries(
        Object.entries(specifications)
          .map(([key, value]) => [key.trim(), value.trim()])
          .filter(([key, value]) => key && value),
      ),
    });
    if (!productName || !categoryId || !payload.price) {
      setSaving(false);
      setTab("product");
      return setMessage("Name, category, and a price are required.");
    }
    if (payload.sale_price != null && payload.sale_price >= payload.price) {
      setSaving(false);
      setTab("product");
      return setMessage(
        "Sale price must be lower than the list price. Swap the two amounts if they were entered in reverse.",
      );
    }
    const supabase = createClient();
    const result = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert({ ...payload, sort_order: 0 });
    setSaving(false);
    if (result.error) return setMessage(result.error.message);
    localStorage.removeItem(draftKey);
    router.push("/admin/dashboard/products");
    router.refresh();
  }
  return (
    <form
      ref={formRef}
      action={submit}
      onInput={(event) => saveDraft(event.currentTarget)}
      onChange={(event) => saveDraft(event.currentTarget)}
      className="mx-auto max-w-4xl space-y-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">
            {product ? "Edit product" : "New product"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Organise the listing in focused tabs. Content library selections
            copy into this product.
          </p>
        </div>
        <div className="flex max-w-full overflow-x-auto rounded-full bg-muted p-1">
          {(
            ["product", "configuration", "content", "media", "seo"] as Tab[]
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${tab === item ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <Panel active={tab === "product"}>
        <div className="grid gap-4 rounded-3xl border border-border bg-card p-5 md:grid-cols-2">
          <Field label="Product name *">
            <input
              required
              name="name"
              value={name}
              onChange={(event) => {
                const value = event.target.value;
                setName(value);
                if (!slugEdited) setSlug(slugify(value));
              }}
              className={field}
            />
          </Field>
          <Field label="URL slug">
            <input
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugEdited(true);
              }}
              placeholder="Auto-filled from product name"
              className={field}
            />
          </Field>
          <Field label="Category *">
            <select
              required
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={field}
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Subcategory">
            <select
              name="subcategory_id"
              value={subcategoryId}
              onChange={(event) => setSubcategoryId(event.target.value)}
              className={field}
            >
              <option value="">None</option>
              {subcategories
                .filter((item) => item.category_id === categoryId)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Product type">
            <select
              name="product_type_id"
              defaultValue={product?.product_type_id ?? ""}
              className={field}
            >
              <option value="">None</option>
              {productTypes
                .filter((item) => item.subcategory_id === subcategoryId)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Brand">
            <input
              name="brand"
              defaultValue={product?.brand ?? ""}
              className={field}
            />
          </Field>
          <Field label="Model">
            <input
              name="model"
              defaultValue={product?.model ?? ""}
              className={field}
            />
          </Field>
          <Field label="SKU">
            <input
              name="sku"
              defaultValue={product?.sku ?? ""}
              className={field}
            />
          </Field>
          <Field label="Condition">
            <select
              name="condition_grade"
              defaultValue={product?.condition_grade ?? "good"}
              className={field}
            >
              {["like_new", "excellent", "good", "fair"].map((item) => (
                <option key={item} value={item}>
                  {item.replace("_", " ")}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Stock quantity">
            <input
              type="number"
              min="0"
              name="stock_quantity"
              defaultValue={product?.stock_quantity ?? 1}
              className={field}
            />
          </Field>
          <Field label="List price (₹) *">
            <input
              required
              type="number"
              min="1"
              name="price"
              defaultValue={product?.price ?? ""}
              className={field}
            />
          </Field>
          <Field label="Sale price (₹)">
            <input
              type="number"
              min="0"
              name="sale_price"
              defaultValue={product?.sale_price ?? ""}
              className={field}
            />
          </Field>
          <Field label="Approx. age (months)">
            <input
              type="number"
              min="0"
              name="approximate_age_months"
              defaultValue={product?.approximate_age_months ?? ""}
              className={field}
            />
          </Field>
        </div>
      </Panel>
      <Panel active={tab === "configuration"}>
        <ConfigurationFields
          values={specifications}
          onChange={setSpecifications}
          suggestedTemplate={templateFor(selectedSubcategoryName)}
        />
      </Panel>
      <Panel active={tab === "content"}>
        <div className="space-y-4 rounded-3xl border border-border bg-card p-5">
          <Field label="Short description">
            <input
              name="tagline"
              defaultValue={product?.tagline ?? ""}
              className={field}
            />
          </Field>
          <Field label="Full description">
            <textarea
              name="description"
              rows={5}
              defaultValue={product?.description ?? ""}
              className={textarea}
            />
          </Field>
          <Field label="Condition notes">
            <textarea
              name="condition_summary"
              rows={3}
              defaultValue={product?.condition_summary ?? ""}
              className={textarea}
            />
          </Field>
          <Field label="Usage summary">
            <input
              name="usage_summary"
              defaultValue={product?.usage_summary ?? ""}
              className={field}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <ContentSelector
                kind="included_set"
                label="what’s included set"
                items={library}
                onApply={applyLibrary}
              />
              <Field label="What’s included (one per line)">
                <textarea
                  value={included}
                  onChange={(event) => setIncluded(event.target.value)}
                  rows={5}
                  className={textarea}
                />
              </Field>
            </div>
            <Field label="Not included (one per line)">
              <textarea
                value={notIncluded}
                onChange={(event) => setNotIncluded(event.target.value)}
                rows={5}
                className={textarea}
              />
            </Field>
          </div>
          <div>
            <ContentSelector
              kind="faq_set"
              label="FAQ set"
              items={library}
              onApply={applyLibrary}
            />
            <div className="mt-2 space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="grid gap-2 rounded-xl border border-border p-3"
                >
                  <input
                    value={faq.question}
                    onChange={(event) =>
                      updateFaq(index, "question", event.target.value)
                    }
                    placeholder="Question"
                    className={field}
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(event) =>
                      updateFaq(index, "answer", event.target.value)
                    }
                    placeholder="Answer"
                    className={textarea}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFaqs((items) =>
                        items.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="text-left text-xs font-bold text-destructive"
                  >
                    Remove FAQ
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setFaqs((items) => [...items, { question: "", answer: "" }])
              }
              className="mt-3 rounded-full border border-border px-4 py-2 text-xs font-bold"
            >
              Add FAQ
            </button>
          </div>
        </div>
        <div className="grid gap-4 rounded-3xl border border-border bg-card p-5 md:grid-cols-2">
          <div>
            <ContentSelector
              kind="delivery_note"
              label="delivery note"
              items={library}
              onApply={applyLibrary}
            />
            <Field label="Delivery details">
              <textarea
                value={deliveryInfo}
                onChange={(event) => setDeliveryInfo(event.target.value)}
                rows={4}
                className={textarea}
              />
            </Field>
          </div>
          <div>
            <ContentSelector
              kind="care_note"
              label="care note"
              items={library}
              onApply={applyLibrary}
            />
            <Field label="Care details">
              <textarea
                value={careInfo}
                onChange={(event) => setCareInfo(event.target.value)}
                rows={4}
                className={textarea}
              />
            </Field>
          </div>
          <Field label="Warranty">
            <select
              name="warranty_status"
              defaultValue={product?.warranty_status ?? "none"}
              className={field}
            >
              {["none", "seller", "manufacturer", "extended"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Warranty provider">
            <input
              name="warranty_provider"
              defaultValue={product?.warranty_provider ?? ""}
              className={field}
            />
          </Field>
          <Field label="Warranty coverage">
            <input
              name="warranty_coverage"
              defaultValue={product?.warranty_coverage ?? ""}
              className={field}
            />
          </Field>
        </div>
      </Panel>
      <Panel active={tab === "media"}>
        <div className="rounded-3xl border border-border bg-card p-5">
          <GalleryUploadField
            value={images}
            onChange={setImages}
            pathPrefix={`products/${product?.id ?? "new"}`}
            onUploadingChange={setUploading}
          />
        </div>
      </Panel>
      <Panel active={tab === "seo"}>
        <div className="space-y-4 rounded-3xl border border-border bg-card p-5">
          <h3 className="font-display text-xl">Search & social sharing</h3>
          <p className="text-sm text-muted-foreground">
            Leave these empty to use the product name, description, and first
            image.
          </p>
          <Field label="Meta title">
            <input
              name="meta_title"
              maxLength={70}
              defaultValue={product?.meta_title ?? ""}
              className={field}
            />
          </Field>
          <Field label="Meta description">
            <textarea
              name="meta_description"
              maxLength={160}
              rows={3}
              defaultValue={product?.meta_description ?? ""}
              className={textarea}
            />
          </Field>
          <Field label="Open Graph image URL">
            <input
              type="url"
              name="og_image_url"
              defaultValue={product?.og_image_url ?? ""}
              className={field}
            />
          </Field>
          <Field label="Search tags">
            <input
              name="tags"
              defaultValue={(product?.tags ?? []).join(", ")}
              className={field}
            />
          </Field>
        </div>
      </Panel>
      <section className="flex flex-wrap gap-5 rounded-3xl border border-border bg-card p-5 text-sm font-semibold">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product?.is_active ?? true}
          />{" "}
          Visible to customers
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={product?.is_featured ?? false}
          />{" "}
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_trending"
            defaultChecked={product?.is_trending ?? false}
          />{" "}
          Trending
        </label>
      </section>
      {message && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          {message}
        </p>
      )}
      <button
        disabled={saving || uploading}
        className="rounded-full bg-gradient-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50"
      >
        {saving ? "Saving…" : uploading ? "Uploading images…" : "Save product"}
      </button>
    </form>
  );
}
