-- Jalankan sekali di Supabase SQL Editor.
create table if not exists public.materi (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi_singkat text not null,
  link_halaman text not null,
  kategori text not null default 'Materi',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.materi enable row level security;

-- Publik boleh membaca materi.
drop policy if exists "Public can read materi" on public.materi;
create policy "Public can read materi" on public.materi for select using (true);

-- Hanya user yang login boleh mengelola materi.
drop policy if exists "Authenticated can insert materi" on public.materi;
create policy "Authenticated can insert materi" on public.materi for insert to authenticated with check (true);
drop policy if exists "Authenticated can update materi" on public.materi;
create policy "Authenticated can update materi" on public.materi for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated can delete materi" on public.materi;
create policy "Authenticated can delete materi" on public.materi for delete to authenticated using (true);
