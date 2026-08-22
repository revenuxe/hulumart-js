-- Used-items storefront foundation. Existing event bookings and decoration data
-- intentionally remain available as historic records but are not reused.

CREATE TYPE public.product_condition AS ENUM ('like_new', 'excellent', 'good', 'fair');
CREATE TYPE public.warranty_status AS ENUM ('none', 'seller', 'manufacturer', 'extended');
CREATE TYPE public.inventory_movement_kind AS ENUM (
  'receipt', 'adjustment', 'reservation', 'release', 'sale', 'return', 'damage'
);

ALTER TABLE public.products
  ADD COLUMN brand TEXT,
  ADD COLUMN model TEXT,
  ADD COLUMN sku TEXT UNIQUE,
  ADD COLUMN condition_grade public.product_condition NOT NULL DEFAULT 'good',
  ADD COLUMN condition_summary TEXT,
  ADD COLUMN condition_details JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN approximate_age_months INT,
  ADD COLUMN usage_summary TEXT,
  ADD COLUMN warranty_status public.warranty_status NOT NULL DEFAULT 'none',
  ADD COLUMN warranty_provider TEXT,
  ADD COLUMN warranty_coverage TEXT,
  ADD COLUMN warranty_expires_at DATE,
  ADD COLUMN warranty_transferable BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN stock_quantity INT NOT NULL DEFAULT 1,
  ADD COLUMN reserved_quantity INT NOT NULL DEFAULT 0,
  ADD COLUMN low_stock_threshold INT NOT NULL DEFAULT 1,
  ADD COLUMN fulfilment_methods TEXT[] NOT NULL DEFAULT ARRAY['shipping']::TEXT[];

ALTER TABLE public.products
  ADD CONSTRAINT products_stock_quantity_nonnegative CHECK (stock_quantity >= 0),
  ADD CONSTRAINT products_reserved_quantity_nonnegative CHECK (reserved_quantity >= 0),
  ADD CONSTRAINT products_reserved_within_stock CHECK (reserved_quantity <= stock_quantity),
  ADD CONSTRAINT products_low_stock_threshold_nonnegative CHECK (low_stock_threshold >= 0),
  ADD CONSTRAINT products_age_nonnegative CHECK (approximate_age_months IS NULL OR approximate_age_months >= 0),
  ADD CONSTRAINT products_warranty_expiry_requires_warranty CHECK (
    warranty_expires_at IS NULL OR warranty_status <> 'none'
  );

CREATE INDEX idx_products_available_stock
  ON public.products (stock_quantity, reserved_quantity)
  WHERE is_active = true;
CREATE INDEX idx_products_condition_grade ON public.products (condition_grade);
CREATE INDEX idx_products_brand ON public.products (brand) WHERE brand IS NOT NULL;

CREATE TABLE public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  kind public.inventory_movement_kind NOT NULL,
  quantity_delta INT NOT NULL CHECK (quantity_delta <> 0),
  reason TEXT,
  reference_type TEXT,
  reference_id UUID,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_inventory_movements_product_created
  ON public.inventory_movements (product_id, created_at DESC);
GRANT SELECT, INSERT ON public.inventory_movements TO authenticated;
GRANT ALL ON public.inventory_movements TO service_role;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read inventory movements" ON public.inventory_movements
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins create inventory movements" ON public.inventory_movements
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.record_inventory_adjustment(
  _product_id UUID,
  _quantity_delta INT,
  _reason TEXT DEFAULT NULL
)
RETURNS public.inventory_movements
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  movement public.inventory_movements;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;
  IF _quantity_delta = 0 THEN
    RAISE EXCEPTION 'Inventory adjustment must not be zero';
  END IF;

  UPDATE public.products
  SET stock_quantity = stock_quantity + _quantity_delta
  WHERE id = _product_id
    AND stock_quantity + _quantity_delta >= reserved_quantity
  RETURNING id INTO _product_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient available stock or product not found';
  END IF;

  INSERT INTO public.inventory_movements (
    product_id, kind, quantity_delta, reason, created_by
  ) VALUES (
    _product_id, 'adjustment', _quantity_delta, _reason, auth.uid()
  ) RETURNING * INTO movement;
  RETURN movement;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.record_inventory_adjustment(UUID, INT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_inventory_adjustment(UUID, INT, TEXT) TO authenticated;

