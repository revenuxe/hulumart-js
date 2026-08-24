-- Reusable retail listing content. The selected content is copied into a
-- product when it is saved, so catalog pages stay stable if a library item is
-- later changed or removed.
CREATE TABLE public.product_content_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('included_set', 'faq_set', 'delivery_note', 'care_note')),
  name TEXT NOT NULL,
  included TEXT[] NOT NULL DEFAULT '{}',
  not_included TEXT[] NOT NULL DEFAULT '{}',
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  body TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (kind, name)
);

CREATE INDEX idx_product_content_library_kind ON public.product_content_library (kind, name);
GRANT SELECT ON public.product_content_library TO anon, authenticated;
GRANT ALL ON public.product_content_library TO service_role;
ALTER TABLE public.product_content_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active product content" ON public.product_content_library FOR SELECT USING (is_active = true);
CREATE POLICY "Admins read all product content" ON public.product_content_library FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage product content" ON public.product_content_library FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_product_content_library_updated BEFORE UPDATE ON public.product_content_library FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
