create table public.sell_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (char_length(phone) between 10 and 20),
  category text not null,
  subcategory text not null,
  item_name text not null check (char_length(item_name) between 2 and 160),
  item_condition text not null,
  description text,
  city text,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'closed')),
  created_at timestamptz not null default now()
);
alter table public.sell_leads enable row level security;
create policy "Anyone can create sell leads" on public.sell_leads for insert to anon, authenticated with check (true);
create policy "Admins can view sell leads" on public.sell_leads for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update sell leads" on public.sell_leads for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
