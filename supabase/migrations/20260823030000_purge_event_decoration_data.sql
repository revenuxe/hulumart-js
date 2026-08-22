-- Permanently remove historical event-decoration data. The retail catalogue,
-- inventory and commerce-order tables are intentionally retained.

DELETE FROM public.vendor_payments;
DELETE FROM public.booking_status_events;
DELETE FROM public.booking_items;
DELETE FROM public.bookings;
DELETE FROM public.product_addon_links;
DELETE FROM public.addons;
DELETE FROM public.product_decoration_content_links;
DELETE FROM public.balloon_palette_pair_links;
DELETE FROM public.balloon_pair_groups;

UPDATE public.products SET
  balloon_palette_id = NULL,
  included_group_id = NULL,
  faq_group_id = NULL,
  delivery_group_id = NULL,
  care_group_id = NULL,
  balloon_options = '[]'::jsonb;
DELETE FROM public.decoration_content_items;
DELETE FROM public.vendors;

DELETE FROM public.user_roles WHERE role = 'vendor';

DELETE FROM public.products
WHERE category_id IN (SELECT id FROM public.categories WHERE is_active = false);
DELETE FROM public.subcategories WHERE is_active = false;
DELETE FROM public.categories WHERE is_active = false;

DELETE FROM public.homepage_hero_slides;
INSERT INTO public.homepage_hero_slides (
  desktop_image_url, kicker, title, subtitle, action_label, action_url, sort_order
) VALUES
  ('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=85&w=1400&auto=format&fit=crop', 'Tested pre-owned tech', 'Your next device, for less.', 'Clear condition notes, real photos and stock you can trust.', 'Shop smartphones', '/categories/smartphones', 1),
  ('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=85&w=1400&auto=format&fit=crop', 'Work. Study. Create.', 'Quality laptops, ready for a new owner.', 'Each listing shows age, condition, contents and warranty details.', 'Shop laptops', '/categories/laptops', 2),
  ('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=85&w=1400&auto=format&fit=crop', 'Straightforward used tech', 'Know exactly what you are buying.', 'Compare condition, included accessories and available stock before checkout.', 'Browse all electronics', '/categories', 3);
