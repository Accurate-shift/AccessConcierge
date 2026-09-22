-- ============================================================================
-- ACCESS Concierge — Storage Bucket Setup
-- Run this in the Supabase SQL editor AFTER schema.sql.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Create the public bucket for client-submitted reference images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'request-images',
  'request-images',
  true, -- public read, so uploaded images can be shown in emails + admin UI
  10485760, -- 10 MB per file
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

-- ---------------------------------------------------------------------------
-- 2. Storage policies
-- ---------------------------------------------------------------------------
-- Uploads happen server-side via the SERVICE ROLE key in
-- /api/requests/submit (see lib/supabase-admin.ts), which bypasses storage
-- RLS just like it does for the requests table. That keeps the bucket free
-- of a public "anon can upload" policy, which would otherwise let anyone
-- upload arbitrary files directly to the project.

-- Anyone (including anonymous visitors) can READ objects in this bucket,
-- since reference images are shown back to clients in confirmation emails
-- and rendered as public URLs in the admin dashboard.
drop policy if exists "Public read access to request images" on storage.objects;
create policy "Public read access to request images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'request-images');

-- Authenticated admins may delete images (e.g. to remove inappropriate
-- uploads) directly from the dashboard's storage browser.
drop policy if exists "Admins can delete request images" on storage.objects;
create policy "Admins can delete request images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'request-images');

-- No INSERT/UPDATE policy is defined for anon or authenticated roles on
-- purpose — all uploads go through the service role key server-side.
