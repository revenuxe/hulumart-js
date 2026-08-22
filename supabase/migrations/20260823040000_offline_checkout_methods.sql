-- Offline checkout choices while an online payment provider is being integrated.
ALTER TABLE public.orders
  ADD COLUMN payment_method TEXT,
  ADD COLUMN fulfilment_method TEXT,
  ADD CONSTRAINT orders_payment_method_check CHECK (payment_method IN ('cash_on_delivery', 'cash_on_pickup') OR payment_method IS NULL),
  ADD CONSTRAINT orders_fulfilment_method_check CHECK (fulfilment_method IN ('delivery', 'self_pickup') OR fulfilment_method IS NULL);

CREATE OR REPLACE FUNCTION public.place_order_with_offline_payment(
  _order_id UUID,
  _payment_method TEXT,
  _fulfilment_method TEXT
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF _payment_method NOT IN ('cash_on_delivery', 'cash_on_pickup') THEN RAISE EXCEPTION 'Invalid payment method'; END IF;
  IF (_payment_method = 'cash_on_delivery' AND _fulfilment_method <> 'delivery') OR (_payment_method = 'cash_on_pickup' AND _fulfilment_method <> 'self_pickup') THEN
    RAISE EXCEPTION 'Payment method does not match fulfilment method';
  END IF;

  UPDATE public.orders
  SET payment_method = _payment_method, fulfilment_method = _fulfilment_method
  WHERE id = _order_id AND user_id = auth.uid() AND status = 'pending_payment' AND payment_status = 'pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'Order cannot be updated'; END IF;

  INSERT INTO public.payments (order_id, provider, status, amount, currency)
  SELECT id, _payment_method, 'pending', total, currency FROM public.orders
  WHERE id = _order_id
  ON CONFLICT (provider, provider_payment_id) DO NOTHING;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.place_order_with_offline_payment(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_order_with_offline_payment(UUID, TEXT, TEXT) TO authenticated;
