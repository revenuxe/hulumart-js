-- Per-product merchant-listing data. Nullable fields ensure existing listings
-- are not assigned a shipping or return policy that has not been confirmed.
ALTER TABLE public.products
  ADD COLUMN shipping_price NUMERIC(10,2) CHECK (shipping_price >= 0),
  ADD COLUMN shipping_min_days INTEGER CHECK (shipping_min_days >= 0),
  ADD COLUMN shipping_max_days INTEGER CHECK (shipping_max_days >= 0),
  ADD COLUMN return_policy TEXT CHECK (return_policy IN ('not_permitted', 'finite')),
  ADD COLUMN return_window_days INTEGER CHECK (return_window_days > 0),
  ADD COLUMN return_fees TEXT CHECK (return_fees IN ('free', 'customer_pays')),
  ADD CONSTRAINT products_shipping_delivery_window_check CHECK (
    (shipping_min_days IS NULL AND shipping_max_days IS NULL) OR
    (shipping_min_days IS NOT NULL AND shipping_max_days IS NOT NULL AND shipping_min_days <= shipping_max_days)
  ),
  ADD CONSTRAINT products_return_policy_details_check CHECK (
    (return_policy IS NULL AND return_window_days IS NULL AND return_fees IS NULL) OR
    (return_policy = 'not_permitted' AND return_window_days IS NULL AND return_fees IS NULL) OR
    (return_policy = 'finite' AND return_window_days IS NOT NULL AND return_fees IS NOT NULL)
  );
