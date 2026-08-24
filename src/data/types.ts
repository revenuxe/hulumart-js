export type CatalogCategory = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  accent: string;
  heroImage: string;
  sortOrder: number;
  updatedAt: string;
};

export type CatalogSubcategory = {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  tagline: string;
  image: string;
  sortOrder: number;
  updatedAt: string;
};

export type ProductFaq = { question: string; answer: string };

export type CatalogProduct = {
  id: string;
  slug: string;
  categorySlug: string;
  subcategorySlug?: string;
  productTypeId?: string;
  name: string;
  tagline: string;
  description: string;
  brand?: string;
  model?: string;
  conditionGrade?: "like_new" | "excellent" | "good" | "fair";
  conditionSummary?: string;
  approximateAgeMonths?: number;
  usageSummary?: string;
  warrantyStatus?: "none" | "seller" | "manufacturer" | "extended";
  warrantyProvider?: string;
  warrantyExpiresAt?: string;
  warrantyCoverage?: string;
  warrantyTransferable?: boolean;
  stockQuantity?: number;
  reservedQuantity?: number;
  images: string[];
  priceOriginal: number;
  priceDiscounted: number;
  discountPct: number;
  rating: number;
  reviewCount: number;
  specifications?: Record<string, string>;
  included: string[];
  notIncluded: string[];
  faqs: ProductFaq[];
  deliveryInfo?: string;
  careInfo?: string;
  tags: string[];
  sortOrder: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  updatedAt: string;
};

// Compatibility aliases keep public routes concise while all domain language
// remains catalog/product based rather than tied to the prior vertical.
export type DecorCategory = CatalogCategory;
export type DecorSubcategory = CatalogSubcategory;
export type DecorService = CatalogProduct;

export type ServiceCity = { slug: string; name: string };
