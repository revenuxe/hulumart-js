type ProductLocation = { categorySlug: string; subcategorySlug?: string; slug: string };

export function productUrl(product: ProductLocation): string {
  const base = `/categories/${product.categorySlug}`;
  return product.subcategorySlug
    ? `${base}/${product.subcategorySlug}/${product.slug}`
    : `${base}/${product.slug}`;
}
