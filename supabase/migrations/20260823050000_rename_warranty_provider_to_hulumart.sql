-- Keep existing product warranty labels aligned with the Hulumart brand.
UPDATE public.products
SET warranty_provider = 'Hulumart'
WHERE warranty_provider = 'Zapiboo';
