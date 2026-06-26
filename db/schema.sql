-- Run this once against your Vercel Postgres database (Vercel dashboard ->
-- Storage -> your database -> Query). Creates the tables that both
-- muunad.com and the mobile app use for order history and phone+OTP login.
-- All access is enforced in the API routes (lib/db.ts callers) — there is no
-- row-level security here, since plain Postgres connections don't have a
-- per-request identity the way Supabase's auth-aware client does.

create table if not exists orders (
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

create index if not exists orders_customer_phone_idx on orders (customer_phone);

-- One-time-password codes for phone login. A row is created when a code is
-- sent and deleted once it's verified (or replaced when a new code is sent
-- for the same phone). expires_at and attempts bound how long a code is
-- valid and how many guesses it can take.
create table if not exists otp_codes (
  phone text primary key,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0
);
