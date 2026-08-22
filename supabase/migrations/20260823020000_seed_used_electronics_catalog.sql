-- Replace mock event-decoration catalogue with an electronics used-items starter set.
-- Existing rows remain in the database as inactive historical content.

UPDATE public.products SET is_active = false;
UPDATE public.subcategories SET is_active = false;
UPDATE public.categories SET is_active = false;

INSERT INTO public.categories (slug, name, tagline, image_url, accent, sort_order, is_active)
VALUES
  ('smartphones', 'Smartphones', 'Pre-owned phones, checked before listing', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=85&w=1200&auto=format&fit=crop', 'from-sky-600/70 to-indigo-700/70', 1, true),
  ('laptops', 'Laptops', 'Work, study and gaming laptops with honest condition notes', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=85&w=1200&auto=format&fit=crop', 'from-slate-700/70 to-blue-800/70', 2, true),
  ('tablets', 'Tablets', 'Versatile tablets for work, study and entertainment', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=85&w=1200&auto=format&fit=crop', 'from-violet-600/70 to-purple-800/70', 3, true),
  ('audio', 'Audio', 'Headphones, earbuds and speakers', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=85&w=1200&auto=format&fit=crop', 'from-rose-600/70 to-orange-700/70', 4, true),
  ('wearables', 'Wearables', 'Smartwatches and fitness trackers', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=85&w=1200&auto=format&fit=crop', 'from-emerald-600/70 to-teal-800/70', 5, true),
  ('gaming', 'Gaming', 'Consoles, controllers and gaming accessories', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=85&w=1200&auto=format&fit=crop', 'from-fuchsia-700/70 to-indigo-900/70', 6, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, tagline = EXCLUDED.tagline, image_url = EXCLUDED.image_url,
  accent = EXCLUDED.accent, sort_order = EXCLUDED.sort_order, is_active = true;

INSERT INTO public.subcategories (category_id, slug, name, tagline, image_url, sort_order, is_active)
SELECT c.id, v.slug, v.name, v.tagline, v.image_url, v.sort_order, true
FROM public.categories c
JOIN (VALUES
  ('smartphones', 'android-phones', 'Android phones', 'Samsung, Google, OnePlus and more', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=85&w=800&auto=format&fit=crop', 1),
  ('smartphones', 'iphones', 'iPhones', 'Pre-owned Apple iPhones', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=85&w=800&auto=format&fit=crop', 2),
  ('laptops', 'windows-laptops', 'Windows laptops', 'Everyday work and study laptops', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=85&w=800&auto=format&fit=crop', 1),
  ('laptops', 'macbooks', 'MacBooks', 'Pre-owned Apple MacBooks', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=85&w=800&auto=format&fit=crop', 2),
  ('tablets', 'ipads', 'iPads', 'Apple iPads for work and entertainment', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=85&w=800&auto=format&fit=crop', 1),
  ('audio', 'headphones-earbuds', 'Headphones & earbuds', 'Personal audio, checked and cleaned', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=85&w=800&auto=format&fit=crop', 1),
  ('wearables', 'smartwatches', 'Smartwatches', 'Connected watches and fitness devices', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=85&w=800&auto=format&fit=crop', 1),
  ('gaming', 'consoles', 'Consoles', 'Gaming consoles ready for their next owner', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=85&w=800&auto=format&fit=crop', 1)
) AS v(category_slug, slug, name, tagline, image_url, sort_order)
  ON c.slug = v.category_slug
ON CONFLICT (category_id, slug) DO UPDATE SET
  name = EXCLUDED.name, tagline = EXCLUDED.tagline, image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order, is_active = true;

INSERT INTO public.products (
  category_id, subcategory_id, slug, name, tagline, description, images,
  price, sale_price, included, not_included, tags, is_trending, is_featured,
  is_active, sort_order, brand, model, sku, condition_grade, condition_summary,
  approximate_age_months, usage_summary, warranty_status, warranty_provider,
  warranty_coverage, warranty_expires_at, warranty_transferable, specifications,
  stock_quantity, low_stock_threshold, fulfilment_methods, faqs, delivery_info
)
SELECT c.id, s.id, v.slug, v.name, v.tagline, v.description, v.images,
  GREATEST(v.price, v.sale_price), LEAST(v.price, v.sale_price), v.included, v.not_included, v.tags, v.is_trending,
  v.is_featured, true, 0, v.brand, v.model, v.sku, v.condition_grade::public.product_condition,
  v.condition_summary, v.age_months, v.usage_summary, v.warranty_status::public.warranty_status,
  v.warranty_provider, v.warranty_coverage, v.warranty_expires_at::date,
  v.warranty_transferable, v.specifications::jsonb, v.stock_quantity, 1,
  ARRAY['shipping']::text[], v.faqs::jsonb, 'Ships after a final condition check. Delivery time is confirmed at checkout.'
FROM (VALUES
  ('smartphones','android-phones','samsung-galaxy-s22-128gb','Samsung Galaxy S22 · 128GB','Excellent condition · 18 months old','A carefully used Galaxy S22 with a bright display, smooth performance and all core functions tested. Minor hairline marks on the frame are shown in photos.',ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=85&w=1200&auto=format&fit=crop']::text[],28999,31999,ARRAY['Phone','USB-C cable','Protective case'],ARRAY['Original box','Charger'],ARRAY['samsung','android','128gb','5g'],true,true,1,'Samsung','Galaxy S22','SGS22-128-001','excellent','Light marks on frame; display, cameras, speakers and charging tested.',18,'Light personal use','seller','Zapiboo','90-day functional warranty','2026-11-23',true,'{"storage":"128GB","ram":"8GB","colour":"Phantom Black","network":"5G"}','[{"question":"Is the battery tested?","answer":"Yes. Charging and normal daily-use performance were checked before listing."}]'),
  ('smartphones','iphones','iphone-13-128gb-midnight','iPhone 13 · 128GB','Excellent condition · 2 years old','Pre-owned iPhone 13 in Midnight. Screen, cameras, Face ID, speakers and charging have been tested. See photos for the small frame marks.',ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=85&w=1200&auto=format&fit=crop']::text[],35999,38999,ARRAY['Phone','USB-C to Lightning cable'],ARRAY['Original box','Power adapter'],ARRAY['apple','iphone','128gb','ios'],true,true,1,'Apple','iPhone 13','IP13-128-001','excellent','Small marks on frame; display and core functions tested.',24,'Careful personal use','seller','Zapiboo','90-day functional warranty','2026-11-23',true,'{"storage":"128GB","colour":"Midnight","network":"5G","security":"Face ID tested"}','[{"question":"Is the phone unlocked?","answer":"Yes. It is ready to use with a compatible SIM."}]'),
  ('laptops','macbooks','macbook-air-m1-8gb-256gb','MacBook Air M1 · 8GB / 256GB','Excellent condition · 2 years old','Reliable Apple Silicon laptop for work, study and everyday creative tasks. Keyboard, display, ports, battery charging and speakers were checked.',ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=85&w=1200&auto=format&fit=crop']::text[],48999,52999,ARRAY['MacBook Air','Compatible charger'],ARRAY['Original box'],ARRAY['apple','macbook','m1','256gb'],true,true,1,'Apple','MacBook Air M1','MBA-M1-001','excellent','Clean display and keyboard; light wear around ports.',24,'Office and study use','seller','Zapiboo','90-day functional warranty','2026-11-23',true,'{"chip":"Apple M1","memory":"8GB","storage":"256GB SSD","display":"13.3 inch"}','[{"question":"Is the charger included?","answer":"Yes, a compatible charger is included."}]'),
  ('laptops','windows-laptops','lenovo-thinkpad-t14-gen-2','Lenovo ThinkPad T14 Gen 2','Good condition · 3 years old','A dependable business laptop with a comfortable keyboard. Cosmetic wear is visible on the lid; ports, keyboard, screen and webcam have been tested.',ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=85&w=1200&auto=format&fit=crop']::text[],29999,33999,ARRAY['Laptop','Compatible charger'],ARRAY['Original packaging'],ARRAY['lenovo','thinkpad','windows','business'],false,true,1,'Lenovo','ThinkPad T14 Gen 2','LNT14-002','good','Cosmetic lid wear; all primary functions tested.',36,'Business use','none',NULL,NULL,NULL,false,'{"processor":"Intel Core i5","memory":"16GB","storage":"512GB SSD","display":"14 inch"}','[{"question":"Does it include Windows?","answer":"It is supplied ready for setup with a licensed operating system."}]'),
  ('tablets','ipads','ipad-9th-gen-64gb-wifi','iPad 9th Gen · 64GB Wi‑Fi','Excellent condition · 20 months old','A clean Wi‑Fi iPad for media, notes and study. Touchscreen, cameras, speakers and charging were checked before listing.',ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=85&w=1200&auto=format&fit=crop']::text[],21999,24999,ARRAY['iPad','USB-C to Lightning cable'],ARRAY['Apple Pencil','Original box'],ARRAY['apple','ipad','64gb','tablet'],false,true,1,'Apple','iPad 9th Gen','IPAD9-001','excellent','Very light use marks; screen and buttons tested.',20,'Home and study use','seller','Zapiboo','90-day functional warranty','2026-11-23',true,'{"storage":"64GB","connectivity":"Wi-Fi","display":"10.2 inch"}','[{"question":"Is an Apple Pencil included?","answer":"No. The listing clearly shows every included accessory."}]'),
  ('audio','headphones-earbuds','sony-wh-1000xm4-headphones','Sony WH‑1000XM4 Headphones','Good condition · 2 years old','Noise-cancelling headphones with tested Bluetooth, controls, microphones and charging. Ear pads show normal cosmetic wear.',ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=85&w=1200&auto=format&fit=crop']::text[],12999,15999,ARRAY['Headphones','USB-C cable','Carry case'],ARRAY['Original box'],ARRAY['sony','headphones','noise-cancelling','bluetooth'],true,false,1,'Sony','WH-1000XM4','SONY-XM4-001','good','Normal ear-pad wear; audio and ANC tested.',24,'Personal use','none',NULL,NULL,NULL,false,'{"connectivity":"Bluetooth","feature":"Active noise cancelling","colour":"Black"}','[{"question":"Are the ear pads original?","answer":"Yes; their condition is described and photographed."}]'),
  ('wearables','smartwatches','apple-watch-series-7-45mm','Apple Watch Series 7 · 45mm','Good condition · 2 years old','GPS Apple Watch with touchscreen, crown, charging and health sensors checked. Includes a compatible charging cable.',ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=85&w=1200&auto=format&fit=crop']::text[],18999,21999,ARRAY['Apple Watch','Compatible charging cable'],ARRAY['Original box','Extra bands'],ARRAY['apple','watch','wearable','gps'],false,false,1,'Apple','Watch Series 7','AW7-001','good','Light wear on case; screen and sensors tested.',24,'Daily wear','none',NULL,NULL,NULL,false,'{"size":"45mm","connectivity":"GPS","colour":"Midnight"}','[{"question":"Is it cellular?","answer":"This listing is for the GPS version."}]'),
  ('gaming','consoles','sony-playstation-5-disc','Sony PlayStation 5 Disc Edition','Excellent condition · 16 months old','PS5 Disc Edition tested with controller, HDMI output, Wi‑Fi and disc drive. A great option for a second setup or first console.',ARRAY['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=85&w=1200&auto=format&fit=crop']::text[],39999,44999,ARRAY['PS5 console','Wireless controller','Power cable','HDMI cable'],ARRAY['Original box','Games'],ARRAY['sony','playstation','ps5','console'],true,true,1,'Sony','PlayStation 5 Disc Edition','PS5-001','excellent','Clean shell; console, controller and disc drive tested.',16,'Home use','seller','Zapiboo','90-day functional warranty','2026-11-23',true,'{"storage":"825GB","edition":"Disc","colour":"White"}','[{"question":"Are games included?","answer":"No. Only the console and listed accessories are included."}]')
) AS v(category_slug, subcategory_slug, slug, name, tagline, description, images, price, sale_price, included, not_included, tags, is_trending, is_featured, stock_quantity, brand, model, sku, condition_grade, condition_summary, age_months, usage_summary, warranty_status, warranty_provider, warranty_coverage, warranty_expires_at, warranty_transferable, specifications, faqs)
JOIN public.categories c ON c.slug = v.category_slug
JOIN public.subcategories s ON s.category_id = c.id AND s.slug = v.subcategory_slug
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id, subcategory_id = EXCLUDED.subcategory_id,
  name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description,
  images = EXCLUDED.images, price = EXCLUDED.price, sale_price = EXCLUDED.sale_price,
  included = EXCLUDED.included, not_included = EXCLUDED.not_included, tags = EXCLUDED.tags,
  is_trending = EXCLUDED.is_trending, is_featured = EXCLUDED.is_featured, is_active = true,
  sort_order = EXCLUDED.sort_order, brand = EXCLUDED.brand, model = EXCLUDED.model,
  sku = EXCLUDED.sku, condition_grade = EXCLUDED.condition_grade,
  condition_summary = EXCLUDED.condition_summary, approximate_age_months = EXCLUDED.approximate_age_months,
  usage_summary = EXCLUDED.usage_summary, warranty_status = EXCLUDED.warranty_status,
  warranty_provider = EXCLUDED.warranty_provider, warranty_coverage = EXCLUDED.warranty_coverage,
  warranty_expires_at = EXCLUDED.warranty_expires_at, warranty_transferable = EXCLUDED.warranty_transferable,
  specifications = EXCLUDED.specifications, stock_quantity = EXCLUDED.stock_quantity,
  low_stock_threshold = EXCLUDED.low_stock_threshold, fulfilment_methods = EXCLUDED.fulfilment_methods,
  faqs = EXCLUDED.faqs, delivery_info = EXCLUDED.delivery_info;
