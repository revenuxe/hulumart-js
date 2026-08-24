-- Third catalog level for SEO-aware product groupings:
-- Category → Subcategory → Product type (e.g. Electronics → Accessories → Keyboards).
CREATE TABLE public.product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (subcategory_id, slug)
);
CREATE INDEX idx_product_types_subcategory ON public.product_types (subcategory_id, sort_order);
GRANT SELECT ON public.product_types TO anon, authenticated;
GRANT ALL ON public.product_types TO service_role;
ALTER TABLE public.product_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product types" ON public.product_types FOR SELECT USING (is_active = true);
CREATE POLICY "Admins read all product types" ON public.product_types FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage product types" ON public.product_types FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_product_types_updated BEFORE UPDATE ON public.product_types FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.products
  ADD COLUMN product_type_id UUID REFERENCES public.product_types(id) ON DELETE SET NULL;
CREATE INDEX idx_products_product_type ON public.products (product_type_id) WHERE product_type_id IS NOT NULL;
