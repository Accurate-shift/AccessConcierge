-- ============================================================================
-- ACCESS Concierge — Database Schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Enum for request status
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'request_status') then
    create type request_status as enum (
      'PENDING',
      'IN_REVIEW',
      'QUOTED',
      'FULFILLED',
      'UNAVAILABLE'
    );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Ticket number generator: ACC-XXXXX (5-digit, zero-padded, sequential)
-- ---------------------------------------------------------------------------
create sequence if not exists requests_ticket_seq;

create or replace function generate_ticket_number()
returns text
language plpgsql
as $$
declare
  next_val bigint;
begin
  next_val := nextval('requests_ticket_seq');
  return 'ACC-' || lpad(next_val::text, 5, '0');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. requests table
-- ---------------------------------------------------------------------------
create table if not exists public.requests (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  ticket_number         text not null unique default generate_ticket_number(),
  description           text not null,
  reference_image_url   text,
  budget                text,
  size                  text,
  category              text,
  condition             text,
  need_by_date          date,
  flexibility           text,
  extra_notes           text,
  client_email          text not null,
  client_phone          text not null,
  status                request_status not null default 'PENDING',
  admin_response_notes  text,
  quoted_price          text,

  constraint requests_client_email_format check (client_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

comment on table public.requests is 'Client sourcing/errand requests submitted through the public ACCESS Concierge form.';

create index if not exists requests_created_at_idx on public.requests (created_at desc);
create index if not exists requests_status_idx on public.requests (status);
create index if not exists requests_ticket_number_idx on public.requests (ticket_number);

-- Keep the ticket_number generator behavior even on manual inserts that omit it.
-- (Already covered by the column default above; no trigger needed.)

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.requests enable row level security;

-- Public clients submit requests through the server-side API route, which
-- uses the SERVICE ROLE key (lib/supabase-admin.ts) and therefore bypasses
-- RLS entirely. No anonymous INSERT/SELECT/UPDATE policy is granted here on
-- purpose — the requests table (which contains client emails and phone
-- numbers) must never be directly readable or writable from the browser.

-- Authenticated admins (users who exist in Supabase Auth) can read and
-- update every row via the dashboard. Admin membership in this project is
-- "any authenticated Supabase Auth user" — admin accounts are provisioned
-- manually (see README), so there is no public self-signup path.
drop policy if exists "Admins can read all requests" on public.requests;
create policy "Admins can read all requests"
  on public.requests
  for select
  to authenticated
  using (true);

drop policy if exists "Admins can update all requests" on public.requests;
create policy "Admins can update all requests"
  on public.requests
  for update
  to authenticated
  using (true)
  with check (true);

-- No delete policy: requests are retained as a permanent record. Deletion,
-- if ever needed, should go through the service role key directly.

-- ---------------------------------------------------------------------------
-- 5. updated_at-style audit trail (optional but recommended)
-- ---------------------------------------------------------------------------
-- Uncomment if you want to track when a row was last modified by an admin.
--
-- alter table public.requests add column if not exists updated_at timestamptz;
--
-- create or replace function set_updated_at()
-- returns trigger language plpgsql as $$
-- begin
--   new.updated_at := now();
--   return new;
-- end;
-- $$;
--
-- drop trigger if exists requests_set_updated_at on public.requests;
-- create trigger requests_set_updated_at
--   before update on public.requests
--   for each row execute function set_updated_at();
