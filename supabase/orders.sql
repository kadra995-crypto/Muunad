-- Run this once in the Supabase SQL editor for your project.
-- Creates the orders table that both muunad.com and the mobile app write to
-- (via the service-role key, server-side only) and read from (via the
-- customer's own phone-verified session, enforced by RLS below).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_phone text not null,
  customer_name text not null,
  address text not null,
  items jsonb not null,
  total numeric(10, 2) not null,
  payment_method text not null check (payment_method in ('evc', 'sahal', 'zaad')),
  transaction_id text,
  status text not null default 'paid' check (status in ('paid', 'pending', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists orders_customer_phone_idx on public.orders (customer_phone);

alter table public.orders enable row level security;

-- Customers can only read orders whose phone matches their own verified
-- phone-auth session. Supabase stores phone numbers digit-only (no "+"),
-- so customer_phone must be saved the same way (see lib/phone.ts normalizePhone).
create policy "Customers can view their own orders"
  on public.orders
  for select
  to authenticated
  using (customer_phone = (auth.jwt() ->> 'phone'));

-- No insert/update/delete policies are defined on purpose: only the
-- service-role key (used exclusively by the server-side /api/orders route)
-- can write orders, since the service role bypasses RLS entirely.
