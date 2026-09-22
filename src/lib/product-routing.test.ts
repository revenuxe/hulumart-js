import { beforeEach, expect, it, vi } from "vitest";
const { product } = vi.hoisted(() => ({ product: { slug: "lenovo", categorySlug: "electronics", subcategorySlug: "laptop", name: "Lenovo", images: [] } }));
vi.mock("@/data", () => ({
  getCategoryBySlug: vi.fn(async () => ({ name: "Electronics" })),
  getServiceBySlug: vi.fn(async () => product),
  getRelatedServices: vi.fn(async () => []),
  getSubcategoryBySlug: vi.fn(async () => ({ name: "Laptop", slug: "laptop" })),
}));
vi.mock("next/navigation", () => ({
  notFound: () => { throw new Error("404"); },
  permanentRedirect: (url: string) => { throw new Error("308 " + url); },
}));
vi.mock("@/components/JsonLd", () => ({ JsonLd: () => null }));
vi.mock("@/lib/jsonld", () => ({ breadcrumbJsonLd: () => ({}), productJsonLd: () => ({}) }));
vi.mock("@/app/categories/[category]/[service]/service-detail-view", () => ({ ServiceDetailView: () => null }));
import LegacyPage from "@/app/categories/[category]/[service]/page";
import ProductPage, { generateMetadata } from "@/app/categories/[category]/[service]/[product]/page";
beforeEach(() => { product.subcategorySlug = "laptop"; });
it("redirects existing product URLs permanently", async () => {
  await expect(LegacyPage({ params: Promise.resolve({ category: "electronics", service: "lenovo" }) })).rejects.toThrow("308 /categories/electronics/laptop/lenovo");
});
it("renders the nested product URL with matching canonical metadata", async () => {
  const params = Promise.resolve({ category: "electronics", service: "laptop", product: "lenovo" });
  await expect(ProductPage({ params })).resolves.toBeTruthy();
  expect((await generateMetadata({ params })).alternates?.canonical).toBe("/categories/electronics/laptop/lenovo");
});
it("rejects a product under the wrong subcategory", async () => {
  const params = Promise.resolve({ category: "electronics", service: "phones", product: "lenovo" });
  await expect(ProductPage({ params })).rejects.toThrow("404");
  expect(await generateMetadata({ params })).toEqual({});
});
it("keeps products without a subcategory accessible", async () => {
  product.subcategorySlug = "";
  await expect(LegacyPage({ params: Promise.resolve({ category: "electronics", service: "lenovo" }) })).resolves.toBeTruthy();
});
