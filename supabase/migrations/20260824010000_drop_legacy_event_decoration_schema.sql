-- Hulumart is a retail marketplace. Remove the retired event-decoration,
-- booking, vendor, balloon, and add-on schema after the historical migrations
-- have run.

DROP FUNCTION IF EXISTS public.vendor_finalize_payment(UUID, NUMERIC);
DROP FUNCTION IF EXISTS public.vendor_save_quote(UUID, JSONB, NUMERIC);
DROP FUNCTION IF EXISTS public.vendor_submit_quote(UUID, NUMERIC);
DROP FUNCTION IF EXISTS public.vendor_update_booking_status(UUID, public.booking_status, TEXT);
DROP FUNCTION IF EXISTS public.vendor_update_booking_status(UUID, public.booking_status, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.vendor_accept_assignment(UUID);
DROP FUNCTION IF EXISTS public.vendor_decline_assignment(UUID);
DROP FUNCTION IF EXISTS public.cancel_booking(UUID);
DROP FUNCTION IF EXISTS public.log_booking_status() CASCADE;
DROP FUNCTION IF EXISTS public.sync_vendor_payment_summary() CASCADE;
DROP FUNCTION IF EXISTS public.sync_vendor_payment_status_on_bill_change() CASCADE;

DROP TABLE IF EXISTS public.vendor_payments CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
DROP TABLE IF EXISTS public.booking_status_events CASCADE;
DROP TABLE IF EXISTS public.booking_items CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.product_addon_links CASCADE;
DROP TABLE IF EXISTS public.addons CASCADE;
DROP TABLE IF EXISTS public.product_addons CASCADE;
DROP TABLE IF EXISTS public.product_decoration_content_links CASCADE;
DROP TABLE IF EXISTS public.balloon_palette_pair_links CASCADE;
DROP TABLE IF EXISTS public.balloon_pair_groups CASCADE;
DROP TABLE IF EXISTS public.decoration_content_items CASCADE;

ALTER TABLE public.products
  DROP COLUMN IF EXISTS balloon_options,
  DROP COLUMN IF EXISTS balloon_palette_id,
  DROP COLUMN IF EXISTS included_group_id,
  DROP COLUMN IF EXISTS faq_group_id,
  DROP COLUMN IF EXISTS delivery_group_id,
  DROP COLUMN IF EXISTS care_group_id;

DROP TYPE IF EXISTS public.vendor_payment_status CASCADE;
DROP TYPE IF EXISTS public.vendor_status CASCADE;
DROP TYPE IF EXISTS public.booking_status CASCADE;
DROP TYPE IF EXISTS public.decoration_content_kind CASCADE;
