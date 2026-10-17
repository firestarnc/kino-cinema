create extension if not exists pgcrypto;

create table if not exists public.halloween_candidates (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.halloween_votes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.halloween_candidates(id) on delete restrict,
  full_name text not null,
  email text not null,
  email_normalized text not null,
  phone_number text not null,
  verification_token_hash text,
  token_expires_at timestamptz,
  verified_at timestamptz,
  verified_ip_address text,
  verified_user_agent text,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists halloween_votes_verified_email_unique
  on public.halloween_votes (email_normalized)
  where verified_at is not null;

create index if not exists halloween_votes_candidate_id_idx on public.halloween_votes (candidate_id);
create index if not exists halloween_votes_email_normalized_idx on public.halloween_votes (email_normalized);
create index if not exists halloween_votes_verified_at_idx on public.halloween_votes (verified_at desc);
create index if not exists halloween_votes_created_at_idx on public.halloween_votes (created_at desc);

create table if not exists public.halloween_vote_attempts (
  id uuid primary key default gen_random_uuid(),
  email_normalized text,
  ip_address text,
  outcome text not null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists halloween_vote_attempts_ip_created_at_idx
  on public.halloween_vote_attempts (ip_address, created_at desc);

create index if not exists halloween_vote_attempts_email_created_at_idx
  on public.halloween_vote_attempts (email_normalized, created_at desc);

create or replace function public.set_halloween_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists halloween_candidates_set_updated_at on public.halloween_candidates;
create trigger halloween_candidates_set_updated_at
before update on public.halloween_candidates
for each row execute function public.set_halloween_updated_at();

drop trigger if exists halloween_votes_set_updated_at on public.halloween_votes;
create trigger halloween_votes_set_updated_at
before update on public.halloween_votes
for each row execute function public.set_halloween_updated_at();

alter table public.halloween_candidates enable row level security;
alter table public.halloween_votes enable row level security;
alter table public.halloween_vote_attempts enable row level security;

drop policy if exists "service_role_full_access_halloween_candidates" on public.halloween_candidates;
drop policy if exists "service_role_full_access_halloween_votes" on public.halloween_votes;
drop policy if exists "service_role_full_access_halloween_vote_attempts" on public.halloween_vote_attempts;

create policy "service_role_full_access_halloween_candidates"
on public.halloween_candidates
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "service_role_full_access_halloween_votes"
on public.halloween_votes
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "service_role_full_access_halloween_vote_attempts"
on public.halloween_vote_attempts
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

insert into public.halloween_candidates (display_name, slug, sort_order, is_active)
values
  ('Midnight Vogue', 'midnight-vogue', 1, true),
  ('Velvet Monarch', 'velvet-monarch', 2, true),
  ('Nocturne Belle', 'nocturne-belle', 3, true),
  ('Phantom Dapper', 'phantom-dapper', 4, true),
  ('Crimson Countess', 'crimson-countess', 5, true),
  ('Moonlit Baron', 'moonlit-baron', 6, true),
  ('Obsidian Elegance', 'obsidian-elegance', 7, true),
  ('Shadow Aristocrat', 'shadow-aristocrat', 8, true),
  ('Gold Whisper', 'gold-whisper', 9, true),
  ('Velvet Hex', 'velvet-hex', 10, true)
on conflict (slug) do update
set display_name = excluded.display_name,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active,
    updated_at = now();