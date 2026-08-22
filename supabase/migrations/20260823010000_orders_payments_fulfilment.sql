-- Retail order foundation. Payment capture is intentionally not implemented here:
-- external providers must transition payment state only from verified webhooks.

CREATE TYPE public.order_status AS ENUM (
  'pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'
);
CREATE TYPE public.payment_status AS ENUM (
  'pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded'
);
CREATE TYPE public.fulfilment_status AS ENUM (
  'unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  order_number TEXT NOT NULL UNIQUE DEFAULT ('ZI' || upper(substr(md5(gen_random_uuid()::text), 1, 8))),
  status public.order_status NOT NULL DEFAULT 'pending_payment',
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  fulfilment_status public.fulfilment_status NOT NULL DEFAULT 'unfulfilled',
  currency TEXT NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  shipping_address JSONB NOT NULL,
  customer_note TEXT,
  reservation_expires_at TIMESTAMPTZ,
  idempotency_key UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX idx_orders_user_created ON public.orders (user_id, created_at DESC);
CREATE INDEX idx_orders_operations ON public.orders (status, payment_status, fulfilment_status, created_at DESC);
GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  image_url TEXT,
  sku TEXT,
  condition_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  warranty_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(10,2) NOT NULL CHECK (line_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_order_items_order ON public.order_items (order_id);
GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read own order items" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins manage order items" ON public.order_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  provider TEXT NOT NULL,
  provider_payment_id TEXT,
  provider_order_id TEXT,
  status public.payment_status NOT NULL DEFAULT 'pending',
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  failure_code TEXT,
  failure_message TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_payment_id)
);
CREATE INDEX idx_payments_order ON public.payments (order_id);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read own payments" ON public.payments FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fulfilments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE RESTRICT,
  status public.fulfilment_status NOT NULL DEFAULT 'unfulfilled',
  courier TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  packed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.fulfilments TO authenticated;
GRANT ALL ON public.fulfilments TO service_role;
ALTER TABLE public.fulfilments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read own fulfilment" ON public.fulfilments FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins manage fulfilments" ON public.fulfilments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_fulfilments_updated BEFORE UPDATE ON public.fulfilments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.create_order_reservation(
  _items JSONB,
  _address_id UUID,
  _idempotency_key UUID,
  _customer_note TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  item JSONB;
  product public.products;
  order_id UUID;
  qty INT;
  subtotal_amount NUMERIC(10,2) := 0;
  address_snapshot JSONB;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF jsonb_typeof(_items) <> 'array' OR jsonb_array_length(_items) = 0 THEN
    RAISE EXCEPTION 'Cart must contain at least one item';
  END IF;

  SELECT jsonb_build_object('label', label, 'line1', line1, 'line2', line2, 'city', city, 'state', state, 'pincode', pincode, 'phone', phone)
  INTO address_snapshot FROM public.addresses WHERE id = _address_id AND user_id = auth.uid();
  IF address_snapshot IS NULL THEN RAISE EXCEPTION 'A valid delivery address is required'; END IF;

  SELECT id INTO order_id FROM public.orders WHERE user_id = auth.uid() AND idempotency_key = _idempotency_key;
  IF order_id IS NOT NULL THEN RETURN order_id; END IF;

  FOR item IN SELECT value FROM jsonb_array_elements(_items)
  LOOP
    qty := (item->>'quantity')::INT;
    IF qty IS NULL OR qty <= 0 THEN RAISE EXCEPTION 'Invalid item quantity'; END IF;
    SELECT * INTO product FROM public.products WHERE id = (item->>'product_id')::UUID AND is_active = true FOR UPDATE;
    IF NOT FOUND OR product.stock_quantity - product.reserved_quantity < qty THEN
      RAISE EXCEPTION 'Item is no longer available';
    END IF;
    subtotal_amount := subtotal_amount + COALESCE(product.sale_price, product.price) * qty;
  END LOOP;

  INSERT INTO public.orders (user_id, subtotal, total, shipping_address, reservation_expires_at, idempotency_key, customer_note)
  VALUES (auth.uid(), subtotal_amount, subtotal_amount, address_snapshot, now() + interval '20 minutes', _idempotency_key, _customer_note)
  RETURNING id INTO order_id;

  FOR item IN SELECT value FROM jsonb_array_elements(_items)
  LOOP
    qty := (item->>'quantity')::INT;
    SELECT * INTO product FROM public.products WHERE id = (item->>'product_id')::UUID FOR UPDATE;
    UPDATE public.products SET reserved_quantity = reserved_quantity + qty WHERE id = product.id;
    INSERT INTO public.order_items (order_id, product_id, product_name, product_slug, image_url, sku, condition_snapshot, warranty_snapshot, unit_price, quantity, line_total)
    VALUES (order_id, product.id, product.name, product.slug, product.images[1], product.sku,
      jsonb_build_object('grade', product.condition_grade, 'summary', product.condition_summary, 'age_months', product.approximate_age_months),
      jsonb_build_object('status', product.warranty_status, 'provider', product.warranty_provider, 'coverage', product.warranty_coverage, 'expires_at', product.warranty_expires_at),
      COALESCE(product.sale_price, product.price), qty, COALESCE(product.sale_price, product.price) * qty);
    INSERT INTO public.inventory_movements (product_id, kind, quantity_delta, reason, reference_type, reference_id, created_by)
    VALUES (product.id, 'reservation', -qty, 'Checkout reservation', 'order', order_id, auth.uid());
  END LOOP;
  RETURN order_id;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.create_order_reservation(JSONB, UUID, UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_order_reservation(JSONB, UUID, UUID, TEXT) TO authenticated;

