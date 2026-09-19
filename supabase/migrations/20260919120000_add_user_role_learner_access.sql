-- Learner role and automatic assignment for authenticated users
insert into public.roles(name,label)
values ('user','Pengguna')
on conflict (name) do update set label=excluded.label;

insert into public.permissions(code,label) values
  ('learning.read','Akses Belajar Saya'),
  ('exam.take','Mengikuti ujian online'),
  ('exam.history.read','Melihat riwayat ujian')
on conflict(code) do update set label=excluded.label;

insert into public.role_permissions(role_id,permission_id)
select r.id,p.id
from public.roles r
join public.permissions p on p.code in ('learning.read','exam.take','exam.history.read')
where r.name='user'
on conflict do nothing;

create or replace function public.assign_default_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles(user_id,role_id)
  select new.id, r.id
  from public.roles r
  where r.name='user'
  on conflict (user_id,role_id) do nothing;
  return new;
end;
$$;

revoke all on function public.assign_default_user_role() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_assign_default_role on auth.users;
create trigger on_auth_user_created_assign_default_role
after insert on auth.users
for each row
execute function public.assign_default_user_role();

insert into public.user_roles(user_id,role_id)
select u.id,r.id
from auth.users u
cross join public.roles r
where r.name='user'
on conflict (user_id,role_id) do nothing;
