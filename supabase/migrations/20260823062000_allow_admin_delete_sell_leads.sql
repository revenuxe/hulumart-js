create policy "Admins can delete sell leads" on public.sell_leads for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
