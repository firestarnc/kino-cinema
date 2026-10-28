create table if not exists public.campaign_email_sends (
  id uuid primary key default gen_random_uuid(),
  campaign_slug text not null,
  recipient_email text not null,
  recipient_email_normalized text not null,
  recipient_name text,
  booking_reference text,
  status text not null check (status in ('sent', 'failed', 'skipped')),
  error_code text,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists campaign_email_sends_campaign_created_idx
  on public.campaign_email_sends (campaign_slug, created_at desc);

create unique index if not exists campaign_email_sends_unique_sent_recipient
  on public.campaign_email_sends (campaign_slug, recipient_email_normalized)
  where status = 'sent';

alter table public.campaign_email_sends enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'campaign_email_sends'
      and policyname = 'service_role_full_access_campaign_email_sends'
  ) then
    create policy "service_role_full_access_campaign_email_sends"
      on public.campaign_email_sends
      for all
      using (auth.role() = 'service_role')
      with check (auth.role() = 'service_role');
  end if;
end $$;
