alter table public.private_bookings
  add column if not exists confirmation_email_sent_at timestamptz;

create index if not exists private_bookings_confirmation_email_idx
  on public.private_bookings (confirmation_email_sent_at)
  where status = 'paid';
