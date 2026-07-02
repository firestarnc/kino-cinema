alter table public.private_bookings
  add column if not exists booking_type text not null default 'blockbuster'
    check (booking_type in ('blockbuster', 'movie-package')),
  add column if not exists content_platform text,
  add column if not exists content_title text,
  add column if not exists additional_guests integer not null default 0
    check (additional_guests >= 0 and additional_guests <= 3);

create index if not exists private_bookings_booking_type_idx
  on public.private_bookings (booking_type, created_at desc);