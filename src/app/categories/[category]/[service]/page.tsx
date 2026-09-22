import { productUrl } from "@/lib/product-url";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/jsonld";
import { getCategoryBySlug, getServiceBySlug, getRelatedServices, getSubcategoryBySlug } from "@/data";
import { ServiceDetailView } from "./service-detail-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; service: string; subcategory?: string }>;
}): Promise<Metadata> {
  const { category: categorySlug, service: serviceSlug, subcategory: requestedSubcategory } = await params;
  const service = await getServiceBySlug(categorySlug, serviceSlug);
  if (!service || (requestedSubcategory !== undefined && requestedSubcategory !== service.subcategorySlug)) return {};
  const title = service.metaTitle || service.name;
  const description = service.metaDescription || service.tagline;
  const image = service.ogImage || service.images[0];
  const path = productUrl(service);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ category: string; service: string; subcategory?: string }>;
}) {
  const { category: categorySlug, service: serviceSlug, subcategory: requestedSubcategory } = await params;
  const [category, service] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getServiceBySlug(categorySlug, serviceSlug),
  ]);
  if (!category || !service) notFound();
  if (requestedSubcategory !== undefined && requestedSubcategory !== service.subcategorySlug) notFound();
  if (requestedSubcategory === undefined && service.subcategorySlug) permanentRedirect(productUrl(service));
  const [related, subcategory] = await Promise.all([
    getRelatedServices(service, 4),
    service.subcategorySlug ? getSubcategoryBySlug(categorySlug, service.subcategorySlug) : null,
  ]);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: category.name, path: `/categories/${categorySlug}` },
    ...(subcategory
      ? [{ name: subcategory.name, path: `/categories/${categorySlug}/sub/${subcategory.slug}` }]
      : []),
    { name: service.name, path: productUrl(service) },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={productJsonLd(service, category.name)} />
      <ServiceDetailView service={service} category={category} related={related} />
    </>
  );
}
