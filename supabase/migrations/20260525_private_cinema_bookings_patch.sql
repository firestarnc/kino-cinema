alter table public.private_bookings
  alter column film_id drop not null,
  alter column film_title drop not null;

drop index if exists private_bookings_paid_unique_slot;
drop index if exists private_bookings_lookup_idx;

create unique index if not exists private_bookings_paid_unique_slot
  on public.private_bookings (booking_date, time_slot)
  where status = 'paid';

create index if not exists private_bookings_lookup_idx
  on public.private_bookings (booking_date, status);
