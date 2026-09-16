-- KRYZNA LEARN - DATABASE + SECURITY
-- Jalankan seluruh script ini di Supabase SQL Editor.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.materi (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi_singkat text not null default '',
  link_halaman text not null default '',
  kategori text not null default 'Materi',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.materi enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = uid);
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

drop policy if exists "Admin can read own admin row" on public.admin_users;
create policy "Admin can read own admin row" on public.admin_users
for select to authenticated using (user_id = auth.uid());

drop policy if exists "Public can read materi" on public.materi;
create policy "Public can read materi" on public.materi
for select to anon, authenticated using (true);

drop policy if exists "Admins can insert materi" on public.materi;
create policy "Admins can insert materi" on public.materi
for insert to authenticated with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can update materi" on public.materi;
create policy "Admins can update materi" on public.materi
for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can delete materi" on public.materi;
create policy "Admins can delete materi" on public.materi
for delete to authenticated using (public.is_admin(auth.uid()));

grant select on public.materi to anon, authenticated;
grant insert, update, delete on public.materi to authenticated;
grant select on public.admin_users to authenticated;

grant usage on schema public to anon, authenticated;

create or replace function public.set_materi_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists materi_updated_at on public.materi;
create trigger materi_updated_at
before update on public.materi
for each row execute function public.set_materi_updated_at();

-- Setelah membuat akun admin di Authentication > Users,
-- masukkan UUID user tersebut ke tabel admin_users:
-- insert into public.admin_users (user_id) values ('UUID_USER_ADMIN');
