-- KRYZNA LEARN - FILE STORAGE FOR ORIGINAL WORD/PDF
-- Jalankan SETELAH supabase-schema.sql dan migration materi yang sudah ada.

alter table public.materi
  add column if not exists file_url text,
  add column if not exists file_path text,
  add column if not exists file_name text,
  add column if not exists file_type text;

-- Bucket publik agar file asli dapat dibuka dari halaman materi.
insert into storage.buckets (id, name, public)
values ('materi-files', 'materi-files', true)
on conflict (id) do update set public = true;

-- Admin boleh upload file.
drop policy if exists "Admins can upload materi files" on storage.objects;
create policy "Admins can upload materi files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'materi-files'
  and public.is_admin(auth.uid())
);

-- Admin boleh memperbarui file.
drop policy if exists "Admins can update materi files" on storage.objects;
create policy "Admins can update materi files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'materi-files'
  and public.is_admin(auth.uid())
)
with check (
  bucket_id = 'materi-files'
  and public.is_admin(auth.uid())
);

-- Admin boleh menghapus file.
drop policy if exists "Admins can delete materi files" on storage.objects;
create policy "Admins can delete materi files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'materi-files'
  and public.is_admin(auth.uid())
);

-- File pada bucket publik dapat dibaca oleh browser.
drop policy if exists "Public can read materi files" on storage.objects;
create policy "Public can read materi files"
on storage.objects
for select
to public
using (bucket_id = 'materi-files');
