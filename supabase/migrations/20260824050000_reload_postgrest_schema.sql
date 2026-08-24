-- Refresh the PostgREST schema cache after adding products.product_type_id.
NOTIFY pgrst, 'reload schema';
