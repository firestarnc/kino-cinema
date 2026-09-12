alter table public.private_bookings
  add column if not exists include_rose_decoration boolean not null default false;
