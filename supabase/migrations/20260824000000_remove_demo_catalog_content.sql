-- Hulumart starts with an admin-curated catalog. This clears only historical
-- starter catalog rows. It never touches customer, order, payment, fulfilment,
-- inventory, address, account, or sell-lead data.

WITH starter_categories(slug) AS (
  VALUES ('smartphones'), ('laptops'), ('tablets'), ('audio'), ('wearables'), ('gaming')
), starter_products AS (
  SELECT p.id
  FROM public.products p
  JOIN public.categories c ON c.id = p.category_id
  JOIN starter_categories sc ON sc.slug = c.slug
)
DELETE FROM public.product_addon_links
WHERE product_id IN (SELECT id FROM starter_products);

DELETE FROM public.products
WHERE category_id IN (
  SELECT id FROM public.categories
  WHERE slug IN ('smartphones', 'laptops', 'tablets', 'audio', 'wearables', 'gaming')
);
DELETE FROM public.subcategories
WHERE category_id IN (
  SELECT id FROM public.categories
  WHERE slug IN ('smartphones', 'laptops', 'tablets', 'audio', 'wearables', 'gaming')
);
DELETE FROM public.categories
WHERE slug IN ('smartphones', 'laptops', 'tablets', 'audio', 'wearables', 'gaming');
DELETE FROM public.homepage_hero_slides
WHERE action_url IN ('/categories/smartphones', '/categories/laptops', '/categories');
