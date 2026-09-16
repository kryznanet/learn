-- KRYZNA LEARN - EXTEND MATERI UNTUK MENYIMPAN ISI LENGKAP
-- Jalankan sekali di Supabase SQL Editor.

alter table public.materi
  add column if not exists slug text,
  add column if not exists konten text not null default '';

create unique index if not exists materi_slug_unique
  on public.materi(slug)
  where slug is not null;

-- Setelah migrasi ini, dashboard dapat menyimpan isi materi lengkap di kolom konten.
-- Isi konten boleh berupa HTML sederhana (h1-h4, p, ul, ol, li, pre, code, strong, em, blockquote).
