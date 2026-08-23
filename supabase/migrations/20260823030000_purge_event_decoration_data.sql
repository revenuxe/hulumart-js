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

-- No starter homepage content: slides are managed in the Hulumart admin.
