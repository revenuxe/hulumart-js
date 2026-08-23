import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { CategoryStrip } from "@/components/CategoryStrip";
import { FeaturedCollections } from "@/components/FeaturedCollections";
import { SubcategoryGrid } from "@/components/SubcategoryGrid";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import {
  getCategories,
  getTrendingServices,
  getFeaturedServices,
  getServicesByCategory,
  getCategoryBySlug,
  getHomepageHeroSlides,
} from "@/data";

// Below-the-fold and non-critical for first paint — split into its own
// chunk instead of the initial homepage bundle.

export default async function Home() {
  const [categories, trendingServices, featuredServices, smartphonesCategory, heroSlides] = await Promise.all([
    getCategories(),
    getTrendingServices(8),
    getFeaturedServices(8),
    getCategoryBySlug("smartphones"),
    getHomepageHeroSlides(),
  ]);
  const smartphoneServices = smartphonesCategory ? await getServicesByCategory("smartphones") : [];

  return (
    <div className="min-h-dvh bg-background pb-24 md:pb-0">
      <TopBar />
      <main>
        <Hero slides={heroSlides} />
        <FeaturedCollections
          services={trendingServices}
          eyebrow="Trending now"
          title="Trending"
          titleAccent="items"
          viewAllHref="/trending"
          cardBadge="trending"
        />
        <CategoryStrip categories={categories} />
        <FeaturedCollections
          services={featuredServices}
          eyebrow="Hand-picked"
          title="Featured"
          titleAccent="items"
          viewAllHref="/featured"
          cardBadge="featured"
        />
        {smartphonesCategory && (
          <SubcategoryGrid
            category={smartphonesCategory}
            services={smartphoneServices}
            eyebrow="Phones, clearly described"
          />
        )}
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}
