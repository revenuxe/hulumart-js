import { describe, expect, it } from "vitest";
import { productJsonLd } from "./jsonld";
import type { DecorService } from "@/data/types";

const service: DecorService = {
  id: "service-123",
  slug: "pixel-8-pro",
  categorySlug: "smartphones",
  name: "Pixel 8 Pro",
  tagline: "A carefully checked used phone",
  description: "A used phone in excellent condition.",
  images: ["https://example.com/phone.jpg"],
  priceOriginal: 12000,
  priceDiscounted: 10000,
  discountPct: 17,
  rating: 4.8,
  reviewCount: 12,
  included: [],
  notIncluded: [],
  faqs: [],
  tags: [],
  sortOrder: 1,
  updatedAt: "2026-08-08T00:00:00.000Z",
};

describe("productJsonLd", () => {
  it("uses a Google-compatible Product with typed linked entities", () => {
    const jsonLd = productJsonLd(service, "Smartphones");

    expect(jsonLd).toMatchObject({
      "@type": "Product",
      "@id": "https://www.baraabar.com/categories/smartphones/pixel-8-pro#product",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://www.baraabar.com/categories/smartphones/pixel-8-pro",
      },
      offers: {
        "@type": "Offer",
        seller: {
          "@type": "Organization",
          "@id": "https://www.zapiboo.com/#organization",
        },
      },
    });
  });
});
