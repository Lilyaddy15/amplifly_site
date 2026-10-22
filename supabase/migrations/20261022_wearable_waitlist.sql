-- Applied to amplifly-prod (subymyoazfdkroxoaahs) on 2026-10-22 as migration "wearable_waitlist".
-- BioProxal wearable waitlist: a separate list from Amplifly updates (beta_testers).
create table if not exists public.wearable_waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null check (char_length(email) between 3 and 320),
  first_name  text check (char_length(first_name) <= 200),
  nd_profile  text check (char_length(nd_profile) <= 100),
  source      text not null default 'waitlist-form' check (char_length(source) <= 50),
  ip          text,
  user_agent  text,
  referrer    text,
  created_at  timestamptz not null default now()
);

comment on table public.wearable_waitlist is 'People waiting for the BioProxal wearable. Separate from beta_testers (app updates). Filled by the wearable-waitlist Netlify function.';

-- One row per person, case-insensitively.
create unique index if not exists wearable_waitlist_email_unique on public.wearable_waitlist (lower(email));

-- Same access as beta_testers: the public can join, nobody can read the list through the API.
alter table public.wearable_waitlist enable row level security;
drop policy if exists allow_public_insert on public.wearable_waitlist;
create policy allow_public_insert on public.wearable_waitlist for insert to anon, authenticated with check (true);

-- Everyone who ticked "tell me when the wearable ships" before the lists were split.
insert into public.wearable_waitlist (email, first_name, nd_profile, source, ip, user_agent, referrer, created_at)
select distinct on (lower(email)) lower(email), first_name, nd_profile, 'beta_testers backfill', ip, user_agent, referrer, coalesce(created_at, now())
from public.beta_testers
where wearable_interest
order by lower(email), created_at
on conflict do nothing;
