-- LEGACY BOOTSTRAP — NOT AUTHORITATIVE FOR THE CURRENT DATABASE.
-- Do not rerun against the current Supabase project; current security/RLS/RBAC is managed by supabase/migrations/.
-- This historical script contains older grants/policies and is retained for reference only.
-- KRYZNA LEARN - ROLE BASED ACCESS CONTROL
-- Jalankan SETELAH supabase-schema.sql dan migration materi/storage yang sudah ada.
-- Role yang tersedia:
--   super_admin : kelola user + seluruh materi + seluruh fitur admin
--   admin       : kelola materi/import/edit/hapus, tanpa kelola user
--   penulis     : membuat & mengedit materi/import, tidak menghapus materi
--   viewer      : hanya melihat dashboard/data, tanpa perubahan

alter table public.admin_users
  add column if not exists email text,
  add column if not exists display_name text not null default '',
  add column if not exists role text not null default 'admin',
  add column if not exists active boolean not null default true;

update public.admin_users a
set email = u.email
from auth.users u
where u.id = a.user_id
  and (a.email is null or a.email = '');

-- Untuk migrasi awal: admin pertama yang sudah ada menjadi Super Admin.
update public.admin_users
set role = 'super_admin'
where user_id = (
  select user_id from public.admin_users order by created_at asc limit 1
);

alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users
  add constraint admin_users_role_check
  check (role in ('super_admin','admin','penulis','viewer'));

create or replace function public.get_my_role(uid uuid default auth.uid())
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce((select role from public.admin_users where user_id = uid and active = true), 'none');
$$;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = uid
      and active = true
      and role in ('super_admin','admin','penulis','viewer')
  );
$$;

create or replace function public.can_manage_materi(uid uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = uid
      and active = true
      and role in ('super_admin','admin','penulis')
  );
$$;

create or replace function public.can_delete_materi(uid uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = uid
      and active = true
      and role in ('super_admin','admin')
  );
$$;

create or replace function public.can_manage_users(uid uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = uid
      and active = true
      and role = 'super_admin'
  );
$$;

revoke all on function public.get_my_role(uuid) from public;
revoke all on function public.is_admin(uuid) from public;
revoke all on function public.can_manage_materi(uuid) from public;
revoke all on function public.can_delete_materi(uuid) from public;
revoke all on function public.can_manage_users(uuid) from public;
grant execute on function public.get_my_role(uuid) to authenticated;
grant execute on function public.is_admin(uuid) to anon, authenticated;
grant execute on function public.can_manage_materi(uuid) to authenticated;
grant execute on function public.can_delete_materi(uuid) to authenticated;
grant execute on function public.can_manage_users(uuid) to authenticated;

drop policy if exists "Admin can read own admin row" on public.admin_users;
drop policy if exists "Super admins can read staff" on public.admin_users;
drop policy if exists "Super admins can update staff" on public.admin_users;

create policy "Admin can read own admin row" on public.admin_users
for select to authenticated
using (user_id = auth.uid());

create policy "Super admins can read staff" on public.admin_users
for select to authenticated
using (public.can_manage_users(auth.uid()));

create policy "Super admins can update staff" on public.admin_users
for update to authenticated
using (public.can_manage_users(auth.uid()))
with check (public.can_manage_users(auth.uid()));

-- Materi: viewer hanya baca; penulis boleh tambah/edit; admin & super_admin boleh tambah/edit/hapus.
drop policy if exists "Admins can insert materi" on public.materi;
drop policy if exists "Admins can update materi" on public.materi;
drop policy if exists "Admins can delete materi" on public.materi;

create policy "Content managers can insert materi" on public.materi
for insert to authenticated
with check (public.can_manage_materi(auth.uid()));

create policy "Content managers can update materi" on public.materi
for update to authenticated
using (public.can_manage_materi(auth.uid()))
with check (public.can_manage_materi(auth.uid()));

create policy "Content managers can delete materi" on public.materi
for delete to authenticated
using (public.can_delete_materi(auth.uid()));

-- RPC daftar staf: mengambil email dari auth.users tanpa mengekspos tabel auth.users ke browser.
create or replace function public.list_staff()
returns table (
  user_id uuid,
  email text,
  display_name text,
  role text,
  active boolean,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.can_manage_users(auth.uid()) then
    raise exception 'Akses ditolak';
  end if;
  return query
  select a.user_id,
         coalesce(u.email, a.email, '')::text,
         a.display_name,
         a.role,
         a.active,
         a.created_at
  from public.admin_users a
  left join auth.users u on u.id = a.user_id
  order by a.created_at desc;
end;
$$;

create or replace function public.add_staff_by_email(
  p_email text,
  p_display_name text default '',
  p_role text default 'penulis'
)
returns json
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_id uuid;
  clean_role text := lower(trim(p_role));
  clean_email text := lower(trim(p_email));
begin
  if not public.can_manage_users(auth.uid()) then
    raise exception 'Akses ditolak';
  end if;
  if clean_role not in ('super_admin','admin','penulis','viewer') then
    raise exception 'Role tidak valid';
  end if;
  select id into target_id from auth.users where lower(email) = clean_email limit 1;
  if target_id is null then
    raise exception 'Akun belum ada di Supabase Authentication. Buat akun terlebih dahulu di Authentication > Users.';
  end if;

  insert into public.admin_users(user_id,email,display_name,role,active)
  values(target_id,clean_email,coalesce(p_display_name,''),clean_role,true)
  on conflict (user_id) do update set
    email = excluded.email,
    display_name = excluded.display_name,
    role = excluded.role,
    active = true;

  return json_build_object('ok',true,'user_id',target_id);
end;
$$;

create or replace function public.update_staff(
  p_user_id uuid,
  p_display_name text,
  p_role text,
  p_active boolean
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_role text := lower(trim(p_role));
  active_super_count integer;
begin
  if not public.can_manage_users(auth.uid()) then
    raise exception 'Akses ditolak';
  end if;
  if clean_role not in ('super_admin','admin','penulis','viewer') then
    raise exception 'Role tidak valid';
  end if;
  if p_user_id = auth.uid() and (clean_role <> 'super_admin' or p_active = false) then
    raise exception 'Super Admin aktif tidak boleh menonaktifkan atau menurunkan role sendiri.';
  end if;

  if clean_role <> 'super_admin' or p_active = false then
    select count(*) into active_super_count
    from public.admin_users
    where role = 'super_admin' and active = true and user_id <> p_user_id;
    if active_super_count = 0 then
      raise exception 'Minimal harus ada satu Super Admin aktif.';
    end if;
  end if;

  update public.admin_users
  set display_name = coalesce(p_display_name,''),
      role = clean_role,
      active = p_active
  where user_id = p_user_id;

  if not found then raise exception 'User staf tidak ditemukan'; end if;
  return json_build_object('ok',true);
end;
$$;

revoke all on function public.list_staff() from public;
revoke all on function public.add_staff_by_email(text,text,text) from public;
revoke all on function public.update_staff(uuid,text,text,boolean) from public;
grant execute on function public.list_staff() to authenticated;
grant execute on function public.add_staff_by_email(text,text,text) to authenticated;
grant execute on function public.update_staff(uuid,text,text,boolean) to authenticated;

grant select, update on public.admin_users to authenticated;

-- Storage mengikuti role materi: penulis boleh upload/update, hanya admin/super_admin boleh delete.
drop policy if exists "Admins can upload materi files" on storage.objects;
create policy "Content managers can upload materi files" on storage.objects
for insert to authenticated
with check (bucket_id = 'materi-files' and public.can_manage_materi(auth.uid()));

drop policy if exists "Admins can update materi files" on storage.objects;
create policy "Content managers can update materi files" on storage.objects
for update to authenticated
using (bucket_id = 'materi-files' and public.can_manage_materi(auth.uid()))
with check (bucket_id = 'materi-files' and public.can_manage_materi(auth.uid()));

drop policy if exists "Admins can delete materi files" on storage.objects;
create policy "Content managers can delete materi files" on storage.objects
for delete to authenticated
using (bucket_id = 'materi-files' and public.can_delete_materi(auth.uid()));
