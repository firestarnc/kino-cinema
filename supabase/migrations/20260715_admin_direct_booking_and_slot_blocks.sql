alter table public.private_bookings
  add column if not exists payment_source text not null default 'online_paystack'
    check (payment_source in ('online_paystack', 'admin_direct')),
  add column if not exists created_by_admin text;

create index if not exists private_bookings_payment_source_idx
  on public.private_bookings (payment_source, created_at desc);

create table if not exists public.manual_slot_blocks (
  id uuid primary key default gen_random_uuid(),
  booking_date date not null,
  time_slot text not null,
  reason text,
  created_by_admin text,
  created_at timestamptz not null default now()
);

create unique index if not exists manual_slot_blocks_unique_slot
  on public.manual_slot_blocks (booking_date, time_slot);

create index if not exists manual_slot_blocks_lookup_idx
  on public.manual_slot_blocks (booking_date, created_at desc);

alter table public.manual_slot_blocks enable row level security;

create policy "service_role_full_access_manual_slot_blocks"
on public.manual_slot_blocks
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
