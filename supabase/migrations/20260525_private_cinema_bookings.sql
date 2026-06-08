create extension if not exists "pgcrypto";

create table if not exists public.private_bookings (
  id uuid primary key default gen_random_uuid(),
  film_id text,
  film_title text,
  package_id text not null,
  package_name text not null,
  package_price_ngn integer not null check (package_price_ngn > 0),
  booking_date date not null,
  time_slot text not null,
  full_name text not null,
  email text not null,
  phone_number text not null,
  notes text,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'paid', 'failed', 'cancelled')),
  paystack_reference text not null unique,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists private_bookings_paid_unique_slot
  on public.private_bookings (booking_date, time_slot)
  where status = 'paid';

create index if not exists private_bookings_lookup_idx
  on public.private_bookings (booking_date, status);

create or replace function public.set_private_bookings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists private_bookings_set_updated_at on public.private_bookings;
create trigger private_bookings_set_updated_at
before update on public.private_bookings
for each row execute function public.set_private_bookings_updated_at();

alter table public.private_bookings enable row level security;

create policy "service_role_full_access_private_bookings"
on public.private_bookings
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
